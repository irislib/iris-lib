import Identicon from 'identicon.js';
import Attribute from './attribute';
import util from './util';

/**
* An Identifi identity profile. Usually you don't create them yourself, but get them
* from Index methods such as search().
*/
class Identity {
  /**
  * @param {Object} gun node where the Identity data lives
  * @param {Object} tempData temporary data to present before data from gun is received
  * @param {Boolean} save whether to save identity data to the given gun node
  */
  constructor(gun: Object, tempData, save) {
    this.gun = gun;
    if (save) {
      if (tempData.linkTo && !tempData.attrs) {
        const linkTo = new Attribute(tempData.linkTo);
        tempData.attrs = tempData.attrs || {};
        if (!tempData.attrs.hasOwnProperty(linkTo.uri())) {
          tempData.attrs[linkTo.uri()] = linkTo;
        }
      } else {
        tempData.linkTo = Identity.getLinkTo(tempData.attrs);
        console.log(`tempData.linkTo`, tempData.linkTo);
      }
      this.gun.put(tempData);
    } else {
      this.tempData = tempData;
      this.gun.on(data => {
        if (data) {
          //this.gun.off();
          this.tempData = null;
        }
      });
    }
  }

  static getLinkTo(attrs) {
    const mva = Identity.getMostVerifiedAttributes(attrs);
    const keys = Object.keys(mva);
    let linkTo;
    for (let i = 0;i < keys.length;i ++) {
      if (keys[i] === `keyID`) {
        linkTo = mva[keys[i]].attribute;
        break;
      } else if (Attribute.isUniqueType(keys[i])) {
        linkTo = mva[keys[i]].attribute;
      }
    }
    return linkTo;
  }

  static getMostVerifiedAttributes(attrs) {
    const mostVerifiedAttributes = {};
    Object.keys(attrs).forEach(k => {
      const a = attrs[k];
      const keyExists = Object.keys(mostVerifiedAttributes).indexOf(a.name) > - 1;
      a.conf = isNaN(a.conf) ? 1 : a.conf;
      a.ref = isNaN(a.ref) ? 0 : a.ref;
      if (a.conf * 2 > a.ref * 3 && (!keyExists || a.conf - a.ref > mostVerifiedAttributes[a.name].verificationScore)) {
        mostVerifiedAttributes[a.name] = {
          attribute: a,
          verificationScore: a.conf - a.ref
        };
        if (a.verified) {
          mostVerifiedAttributes[a.name].verified = true;
        }
      }
    });
    return mostVerifiedAttributes;
  }

  /**
  * @param {string} attribute attribute type
  * @returns {string} most verified value of the param type
  */
  async verified(attribute: String) {
    const attrs = await this.gun.get(`attrs`).then();
    const mva = Identity.getMostVerifiedAttributes(attrs);
    return mva.hasOwnProperty(attribute) ? mva[attribute].attribute.val : undefined;
  }

  /**
  * @param {Object} ipfs (optional) an IPFS instance that is used to fetch images
  * @returns {HTMLElement} profile card html element describing the identity
  */
  profileCard(ipfs: Object) {
    const card = document.createElement(`div`);
    card.className = `identifi-card`;

    const identicon = this.identicon(60, null, null, ipfs);
    identicon.style.order = 1;
    identicon.style.flexShrink = 0;
    identicon.style.marginRight = `15px`;

    const details = document.createElement(`div`);
    details.style.padding = `5px`;
    details.style.order = 2;
    details.style.flexGrow = 1;

    const linkEl = document.createElement(`span`);
    const links = document.createElement(`small`);
    card.appendChild(identicon);
    card.appendChild(details);
    details.appendChild(linkEl);
    details.appendChild(links);

    this.gun.on(async data => {
      if (!data) {
        return;
      }
      const attrs = await new Promise(resolve => { this.gun.get(`attrs`).load(r => resolve(r)); });
      const linkTo = await this.gun.get(`linkTo`).then();
      const link = `https://identi.fi/#/identities/${linkTo.name}/${linkTo.val}`;
      const mva = Identity.getMostVerifiedAttributes(attrs);
      linkEl.innerHTML = `<a href="${link}">${(mva.name && mva.name.attribute.val) || (mva.nickname && mva.nickname.attribute.val) || `${linkTo.name}:${linkTo.val}`}</a><br>`;
      linkEl.innerHTML += `<small>Received: <span class="identifi-pos">+${data.receivedPositive || 0}</span> / <span class="identifi-neg">-${data.receivedNegative || 0}</span></small><br>`;
      links.innerHTML = ``;
      Object.keys(attrs).forEach(k => {
        const a = attrs[k];
        if (a.link) {
          links.innerHTML += `${a.name}: <a href="${a.link}">${a.val}</a> `;
        }
      });
    });

    /*
    const template = ```
    <tr ng-repeat="result in ids.list" id="result{$index}" ng-hide="!result.linkTo" ui-sref="identities.show({ type: result.linkTo.type, value: result.linkTo.value })" class="search-result-row" ng-class="{active: result.active}">
      <td class="gravatar-col"><identicon id="result" border="3" width="46" positive-score="result.pos" negative-score="result.neg"></identicon></td>
      <td>
        <span ng-if="result.distance == 0" class="label label-default pull-right">viewpoint</span>
        <span ng-if="result.distance > 0" ng-bind="result.distance | ordinal" class="label label-default pull-right"></span>
        <a ng-bind-html="result.name|highlight:query.term" ui-sref="identities.show({ type: result.linkTo.type, value: result.linkTo.value })"></a>
        <small ng-if="!result.name" class="list-group-item-text">
          <span ng-bind-html="result[0][0]|highlight:query.term"></span>
        </small><br>
        <small>
          <span ng-if="result.nickname && result.name != result.nickname" ng-bind-html="result.nickname|highlight:query.term" class="mar-right10"></span>
          <span ng-if="result.email" class="mar-right10">
            <span class="glyphicon glyphicon-envelope"></span> <span ng-bind-html="result.email|highlight:query.term"></span>
          </span>
          <span ng-if="result.facebook" class="mar-right10">
            <span class="fa fa-facebook"></span> <span ng-bind-html="result.facebook|highlight:query.term"></span>
          </span>
          <span ng-if="result.twitter" class="mar-right10">
            <span class="fa fa-twitter"></span> <span ng-bind-html="result.twitter|highlight:query.term"></span>
          </span>
          <span ng-if="result.googlePlus" class="mar-right10">
            <span class="fa fa-google-plus"></span> <span ng-bind-html="result.googlePlus|highlight:query.term"></span>
          </span>
          <span ng-if="result.bitcoin" class="mar-right10">
            <span class="fa fa-bitcoin"></span> <span ng-bind-html="result.bitcoin|highlight:query.term"></span>
          </span>
        </small>
      </td>
    </tr>
    ```;*/
    return card;
  }

  /**
  * Appends a search widget to the given HTMLElement
  * @param {HTMLElement} parentElement element where the search widget is added and event listener attached
  * @param {Index} index index root to use for search
  */
  static appendSearchWidget(parentElement, index) {
    const form = document.createElement(`form`);

    const input = document.createElement(`input`);
    input.type = `text`;
    input.placeholder = `Search`;
    input.id = `identifiSearchInput`;
    form.innerHTML += `<div id="identifiSearchResults"></div>`;

    const searchResults = document.createElement(`div`);

    parentElement.appendChild(form);
    form.appendChild(input);
    form.appendChild(searchResults);
    input.addEventListener(`keyup`, async () => {
      const r = await index.search(input.value);
      searchResults.innerHTML = ``;
      r.sort((a, b) => {return a.trustDistance - b.trustDistance;});
      r.forEach(i => {
        searchResults.appendChild(i.profileCard());
      });
    });
  }

  static _ordinal(n) {
    const s = [`th`, `st`, `nd`, `rd`];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  }

  static _injectCss() {
    const elementId = `identifiStyle`;
    if (document.getElementById(elementId)) {
      return;
    }
    const sheet = document.createElement(`style`);
    sheet.id = elementId;
    sheet.innerHTML = `
      .identifi-identicon * {
        box-sizing: border-box;
      }

      .identifi-identicon {
        vertical-align: middle;
        margin: auto;
        border-radius: 50%;
        text-align: center;
        display: inline-block;
        position: relative;
        margin: auto;
        max-width: 100%;
      }

      .identifi-distance {
        z-index: 2;
        position: absolute;
        left:0%;
        top:2px;
        width: 100%;
        text-align: right;
        color: #fff;
        text-shadow: 0 0 1px #000;
        font-size: 75%;
        line-height: 75%;
        font-weight: bold;
      }

      .identifi-pie {
        border-radius: 50%;
        position: absolute;
        top: 0;
        left: 0;
        box-shadow: 0px 0px 0px 0px #82FF84;
        padding-bottom: 100%;
        max-width: 100%;
        -webkit-transition: all 0.2s ease-in-out;
        -moz-transition: all 0.2s ease-in-out;
        transition: all 0.2s ease-in-out;
      }

      .identifi-card {
        padding: 10px;
        background-color: #f7f7f7;
        color: #777;
        border: 1px solid #ddd;
        display: flex;
        flex-direction: row;
        overflow: hidden;
      }

      .identifi-card a {
        -webkit-transition: color 150ms;
        transition: color 150ms;
        text-decoration: none;
        color: #337ab7;
      }

      .identifi-card a:hover, .identifi-card a:active {
        text-decoration: underline;
        color: #23527c;
      }

      .identifi-pos {
        color: #3c763d;
      }

      .identifi-neg {
        color: #a94442;
      }

      .identifi-identicon img {
        position: absolute;
        top: 0;
        left: 0;
        max-width: 100%;
        border-radius: 50%;
        border-color: transparent;
        border-style: solid;
      }`;
    document.body.appendChild(sheet);
  }

  /**
  * @param {number} width of the identicon
  * @param {number} border identicon border (aura) width
  * @param {boolean} showDistance whether to show web of trust distance ordinal
  * @param {Object} ipfs (optional) an IPFS instance that is used to fetch images
  * @returns {HTMLElement} identicon element that can be appended to DOM
  */
  identicon(width, border = 4, showDistance = true, ipfs) {
    Identity._injectCss(); // some other way that is not called on each identicon generation?
    const identicon = document.createElement(`div`);
    identicon.className = `identifi-identicon`;
    identicon.style.width = `${width}px`;
    identicon.style.height = `${width}px`;

    const pie = document.createElement(`div`);
    pie.className = `identifi-pie`;
    pie.style.width = `${width}px`;

    const img = document.createElement(`img`);
    img.alt = ``;
    img.width = width;
    img.height = width;
    img.style.borderWidth = `${border}px`;

    let distance;
    if (showDistance) {
      distance = document.createElement(`span`);
      distance.className = `identifi-distance`;
      distance.style.fontSize = width > 50 ? `${width / 4}px` : `10px`;
      identicon.appendChild(distance);
    }
    identicon.appendChild(pie);
    identicon.appendChild(img);

    function setPie(data) {
      if (!data) {
        return;
      }
      // Define colors etc
      let bgColor = `rgba(0,0,0,0.2)`;
      let bgImage = `none`;
      let transform = ``;
      let boxShadow = `0px 0px 0px 0px #82FF84`;
      if (data.receivedPositive > data.receivedNegative * 20) {
        boxShadow = `0px 0px ${border * data.receivedPositive / 50}px 0px #82FF84`;
      } else if (data.receivedPositive < data.receivedNegative * 3) {
        boxShadow = `0px 0px ${border * data.receivedNegative / 10}px 0px #BF0400`;
      }
      if (data.receivedPositive + data.receivedNegative > 0) {
        if (data.receivedPositive > data.receivedNegative) {
          transform = `rotate(${((- data.receivedPositive / (data.receivedPositive + data.receivedNegative) * 360 - 180) / 2)}deg)`;
          bgColor = `#A94442`;
          bgImage = `linear-gradient(${data.receivedPositive / (data.receivedPositive + data.receivedNegative) * 360}deg, transparent 50%, #3C763D 50%), linear-gradient(0deg, #3C763D 50%, transparent 50%)`;
        } else {
          transform = `rotate(${((- data.receivedNegative / (data.receivedPositive + data.receivedNegative) * 360 - 180) / 2) + 180}deg)`;
          bgColor = `#3C763D`;
          bgImage = `linear-gradient(${data.receivedNegative / (data.receivedPositive + data.receivedNegative) * 360}deg, transparent 50%, #A94442 50%), linear-gradient(0deg, #A94442 50%, transparent 50%)`;
        }
      }

      pie.style.backgroundColor = bgColor;
      pie.style.backgroundImage = bgImage;
      pie.style.boxShadow = boxShadow;
      pie.style.transform = transform;
      pie.style.opacity = (data.receivedPositive + data.receivedNegative) / 10 * 0.5 + 0.35;

      if (showDistance) {
        distance.textContent = data.trustDistance < 1000 ? Identity._ordinal(data.trustDistance) : `✕`;
      }
    }

    function setIdenticonImg(data) {
      const hash = util.getHash(`${encodeURIComponent(data.name)}:${encodeURIComponent(data.val)}`, `hex`);
      const identiconImg = new Identicon(hash, {width, format: `svg`});
      img.src = img.src || `data:image/svg+xml;base64,${identiconImg.toString()}`;
    }

    if (this.tempData) {
      setPie(this.tempData);
      if (this.tempData.linkTo) {
        setIdenticonImg(this.tempData.linkTo);
      }
    }

    this.gun.on(setPie);
    this.gun.get(`linkTo`).on(setIdenticonImg);

    if (ipfs) {
      this.gun.get(`attrs`).open(attrs => {
        const mva = Identity.getMostVerifiedAttributes(attrs);
        if (mva.profilePhoto) {
          const go = () => {
            ipfs.files.cat(mva.profilePhoto.attribute.val).then(file => {
              const f = ipfs.types.Buffer.from(file).toString(`base64`);
              img.src = `data:image;base64,${f}`;
            });
          };
          ipfs.isOnline() ? go() : ipfs.on(`ready`, go);
        }
      });
    }

    return identicon;
  }
}

export default Identity;
