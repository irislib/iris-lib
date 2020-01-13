var gun = Gun({
  peers: [location.origin + '/gun', 'https://gun-us.herokuapp.com/gun'],
  localStorage: false
});
var chat = gun.get('converse/' + location.hash.slice(1));
var chats = {};
var activeChat;
var onlineTimeout;
var key;
var emojiRegex =  /[\u{1f300}-\u{1f5ff}\u{1f900}-\u{1f9ff}\u{1f600}-\u{1f64f}\u{1f680}-\u{1f6ff}\u{2600}-\u{26ff}\u{2700}-\u{27bf}\u{1f1e6}-\u{1f1ff}\u{1f191}-\u{1f251}\u{1f004}\u{1f0cf}\u{1f170}-\u{1f171}\u{1f17e}-\u{1f17f}\u{1f18e}\u{3030}\u{2b50}\u{2b55}\u{2934}-\u{2935}\u{2b05}-\u{2b07}\u{2b1b}-\u{2b1c}\u{3297}\u{3299}\u{303d}\u{00a9}\u{00ae}\u{2122}\u{23f3}\u{24c2}\u{23e9}-\u{23ef}\u{25b6}\u{23f8}-\u{23fa}]/ug;

var localStorageKey = localStorage.getItem('chatKeyPair');
if (localStorageKey) {
  login(JSON.parse(localStorageKey));
} else {
  Gun.SEA.pair().then(k => login(k));
}

function login(k) {
  key = k;
  localStorage.setItem('chatKeyPair', JSON.stringify(k));
  irisLib.Chat.initUser(gun, key);
  myIdenticon = $(new irisLib.Attribute({type:'keyID', value: key.pub}).identicon({width:40, showType: false}));
  $(".chat-item:not(.new)").remove();
  $(".user-info").empty();
  $(".user-info").append(myIdenticon);
  myIdenticon.click(showSettings);
  setOurOnlineStatus();
  irisLib.Chat.getChats(gun, key, addChat);
  var chatWith = getUrlParameter('chatWith');
  if (chatWith) {
    addChat(chatWith);
    showChat(chatWith);
    window.history.pushState({}, "Iris Chat", "/"+window.location.href.substring(window.location.href.lastIndexOf('/') + 1).split("?")[0]); // remove param
  } else {
    showNewChat();
  }
  gun.user().get('profile').get('name').on(name => {
    if (name && typeof name === 'string') {
      var el = $('#settings-name');
      if (!el.is(':focus')) {
        $('#settings-name').val(name);
      }
    }
  });
}

function updatePeerList() {
  $('#peers').empty();
  var o = gun['_'].opt.peers;
  console.log(o);
  Object.keys(o).forEach(k => {
    var text = ' ' + o[k].url;
    var el = $('<div></div>');
    if (o[k].wire && o[k].wire.hied) {
      text = '+' + text;
    } else {
      text = '-' + text;
    }
    el.text(text);
    $('#peers').append(el);
  });
}
updatePeerList();
setInterval(updatePeerList, 5000);

var emojiButton = $('#emoji-picker');
var picker = new EmojiButton({position: 'top-start'});

picker.on('emoji', emoji => {
  $('#new-msg').val($('#new-msg').val() + emoji);
  $('#new-msg').focus();
});

emojiButton.click(event => {
  event.preventDefault();
  picker.pickerVisible ? picker.hidePicker() : picker.showPicker(emojiButton);
});

$('#paste-chat-link').on('keyup paste', event => {
  var val = $(event.target).val();
  if (val.length < 30 || val.indexOf('chatWith') === -1) {
    return;
  }
  var s = val.split('?');
  if (s.length !== 2) { return; }
  $(event.target).val('');
  var pub = getUrlParameter('chatWith', s[1]);
  addChat(pub);
  showChat(pub);
});

$('.chat-item.new').click(showNewChat);

$('#settings-name').on('keyup paste', event => {
  var name = $(event.target).val().trim();
  gun.user().get('profile').get('name').put(name);
});

function setOurOnlineStatus() {
  irisLib.Chat.setOnline(gun, true);
  document.addEventListener("mousemove", () => {
    irisLib.Chat.setOnline(gun, true);
    clearTimeout(onlineTimeout);
    onlineTimeout = setTimeout(() => irisLib.Chat.setOnline(gun, false), 60000); // TODO: setOnline false not working?
  });
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === 'visible') {
      irisLib.Chat.setOnline(gun, true);
    } else {
      irisLib.Chat.setOnline(gun, false);
    }
  });
}

function resetView() {
  $('.chat-item').toggleClass('active', false);
  $('.main-view').hide();
  $('#not-seen-by-them').hide();
  $(".message-form").hide();
  $("header").empty();
}

function showSettings() {
  resetView();
  $('header').text('Settings');
  $('#settings').show();
}

function showNewChat() {
  resetView();
  $('.chat-item.new').toggleClass('active', true);
  $('#new-chat').show();
  $("header").text('Start new chat');
}

$('.copy-chat-link').click(event => {
  copyToClipboard('https://chat.iris.to/?chatWith=' + key.pub);
  var t = $(event.target);
  var originalText = t.text();
  var originalWidth = t.width();
  t.width(originalWidth);
  t.text('Copied');
  setTimeout(() => {
    t.text(originalText);
    t.css('width', '');
  }, 2000);
});

$('#copy-private-key').click(event => {
  copyToClipboard(JSON.stringify(key));
  var t = $(event.target);
  var originalText = t.text();
  var originalWidth = t.width();
  t.width(originalWidth);
  t.text('Copied');
  setTimeout(() => {
    t.text(originalText);
    t.css('width', '');
  }, 2000);
});

$('#download-private-key').click(downloadKey);

$('.show-logout-confirmation').click(showLogoutConfirmation);
function showLogoutConfirmation() {
  resetView();
  $('header').text('Log out?');
  $('#logout-confirmation').show();
}

$('.show-switch-account').click(showSwitchAccount);
function showSwitchAccount() {
  resetView();
  $('header').text('Switch account');
  $('#switch-account').show();
}

$('#switch-account input').on('keyup paste', (event) => {
  var val = $(event.target).val();
  if (!val.length) { return; }
  try {
    var key = JSON.parse(val);
    login(key);
    $(event.target).val('');
  } catch (e) {
    console.error('Login with key', val, 'failed:', e);
  }
});

$('.logout-button').click(() => {
  Gun.SEA.pair().then(key => login(key));
});

$('.open-settings-button').click(showSettings);

function showChat(pub) {
  if (!pub || !Object.prototype.hasOwnProperty.call(chats, pub)) {
    return;
  }
  activeChat = pub;
  resetView();
  $('.chat-item[data-pub="' + pub +'"]').toggleClass('active', true);
  $("#message-list").empty();
  $("#message-list").show();
  $(".message-form").show();
  $(".message-form form").off('submit');
  $(".message-form form").on('submit', event => {
    event.preventDefault();
    var text = $('#new-msg').val();
    if (!text.length) { return; }
    chats[pub].send(text);
    $('#new-msg').val('');
  });
  var nameEl = $('<span class="name"></span>');
  if (chats[pub].name) {
    nameEl.text(chats[pub].name);
    nameEl.show();
  }
  $("header").append(chats[pub].identicon.clone());
  $("header").append(nameEl);
  $("header").append($('<small class="last-seen"></small>'));
  var msgs = Object.values(chats[pub].messages);
  msgs.forEach(addMessage);
  sortMessagesByTime();
  lastSeenTimeChanged(pub);
  $('#message-list').scrollTop($('#message-list')[0].scrollHeight - $('#message-list')[0].clientHeight);
  chats[pub].setMyMsgsLastSeenTime();
  function setTheirOnlineStatus() {
    var online = chats[pub].online;
    if (activeChat === pub) {
      if (online.isOnline) {
        $('header .last-seen').text('online');
      } else if (online.lastActive) {
        $('header .last-seen').text('last seen ' + formatDate(new Date(online.lastActive * 1000)));
      }
    }
  }
  if (!chats[pub].online) {
    chats[pub].online = {};
    irisLib.Chat.getOnline(gun, pub, (online) => {
      chats[pub].online = online;
      setTheirOnlineStatus();
    });
  }
  setTheirOnlineStatus();
}

function sortChatsByLatest() {
  var sorted = $(".chat-item").sort((a, b) => $(b).data('latestTime') - $(a).data('latestTime'));
  $(".chat-list").append(sorted);
}

function sortMessagesByTime() {
  var sorted = $(".msg").sort((a, b) => $(a).data('time') - $(b).data('time'));
  $("#message-list").append(sorted);
}

function addMessage(msg) {
  var textEl = $('<div class="text"></div>').text(msg.text);
  var msgContent = $(
    '<div class="msg-content"><div class="time"><span class="seen">✔</span> ' + formatDate(msg.time) + '</div></div>'
  );
  msgContent.prepend(textEl);
  if (msg.text.length === 2 && msg.text.match(emojiRegex)) {
    textEl.toggleClass('emoji-only', true);
  }
  msgEl = $('<div class="msg"></div>').append(msgContent);
  msgEl.data('time', msg.time);
  msgEl.toggleClass('our', msg.selfAuthored ? true : false);
  msgEl.toggleClass('their', msg.selfAuthored ? false : true);
  $("#message-list").append(msgEl); // TODO: jquery insertAfter element with smaller timestamp
  $('#message-list').scrollTop($('#message-list')[0].scrollHeight - $('#message-list')[0].clientHeight);
}

function addChat(pub) {
  if (!pub || Object.prototype.hasOwnProperty.call(chats, pub)) {
    return;
  }
  var el = $('<div class="chat-item"><span class="name"></span> <small class="latest"></small></div>');
  el.attr('data-pub', pub);
  chats[pub] = new irisLib.Chat({gun, key, participants: pub, onMessage: (msg, info) => {
    msg.selfAuthored = info.selfAuthored;
    chats[pub].messages[msg.time] = msg;
    msg.time = new Date(msg.time);
    if (!info.selfAuthored && msg.time > chats[pub].theirLastSeenTime) {
      chats[pub].theirLastSeenTime = msg.time;
      lastSeenTimeChanged(pub);
    }
    if (!chats[pub].latest || msg.time > chats[pub].latest.time) {
      chats[pub].latest = msg;
      var text = msg.text.length > 30 ? msg.text.slice(0,30) + '...' : msg.text;
      el.find('.latest').text(text);
      el.data('latestTime', msg.time);
      sortChatsByLatest();
    }
    if (activeChat === pub) {
      addMessage(msg);
      sortMessagesByTime(); // this is slow if message history is loaded while chat active
      if (chats[pub].latest.time === msg.time) {
        chats[pub].setMyMsgsLastSeenTime();
      }
    }
  }});
  chats[pub].messages = chats[pub].messages || [];
  chats[pub].identicon = $(new irisLib.Attribute({type: 'keyID', value: pub}).identicon({width:40, showType: false}));
  gun.user(pub).get('profile').get('name').on(name => {
    if (name && typeof name === 'string') {
      chats[pub].name = name;
      el.find('.name').text(name);
      if (pub === activeChat) {
        $('header .name').text(name);
      }
    }
  });
  el.prepend(chats[pub].identicon);
  el.click(() => showChat(pub));
  $(".chat-list").append(el);
  chats[pub].getTheirMsgsLastSeenTime(time => {
    chats[pub].theirLastSeenTime = new Date(time);
    lastSeenTimeChanged(pub);
  });
}

function lastSeenTimeChanged(pub) {
  if (pub === activeChat) {
    if (chats[pub].theirLastSeenTime) {
      $('#not-seen-by-them').hide();
      $('.msg.our').each(function() {
        var el = $(this);
        if (el.data('time') <= chats[pub].theirLastSeenTime) {
          el.find('.seen').show();
        }
      });
      // set seen msgs
    } else {
      $('#not-seen-by-them').show();
    }
  }
}

/* Helpers */

function formatDate(date) {
  return date.toLocaleString(undefined, {dateStyle:"short", timeStyle:"short"});
}

function copyToClipboard(text) {
    if (window.clipboardData && window.clipboardData.setData) {
        // Internet Explorer-specific code path to prevent textarea being shown while dialog is visible.
        return clipboardData.setData("Text", text);
    }
    else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
        var textarea = document.createElement("textarea");
        textarea.textContent = text;
        textarea.style.position = "fixed";  // Prevent scrolling to bottom of page in Microsoft Edge.
        document.body.appendChild(textarea);
        textarea.select();
        try {
            return document.execCommand("copy");  // Security exception may be thrown by some browsers.
        }
        catch (ex) {
            console.warn("Copy to clipboard failed.", ex);
            return false;
        }
        finally {
            document.body.removeChild(textarea);
        }
    }
}

function getUrlParameter(sParam, sParams) {
    var sPageURL = sParams || window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
};

function download(filename, data, type, charset, href) {
  var hiddenElement;
  if (charset == null) {
    charset = 'utf-8';
  }
  hiddenElement = document.createElement('a');
  hiddenElement.href = href || ("data:" + type + ";charset=" + charset + "," + (encodeURI(data)));
  hiddenElement.target = '_blank';
  hiddenElement.download = filename;
  return hiddenElement.click();
};

function downloadKey() {
  return download('iris_private_key.txt', JSON.stringify(key), 'text/csv', 'utf-8');
};
