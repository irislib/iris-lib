import Identicon from 'identicon.js';
import Attribute from './attribute';
import util from './util';

/**
* An Iris identity profile. Usually you don't create them yourself, but get them
* from Index methods such as get() and search().
*/
class Identity {
  /**
  * @param {Object} gun node where the Identity data lives
  */
  constructor(gun: Object, linkTo, index) {
    this.gun = gun;
    this.linkTo = linkTo;
    this.index = index;
  }

  static create(gun, data, index) {
    if (!data.linkTo && !data.attrs) {
      throw new Error(`You must specify either data.linkTo or data.attrs`);
    }
    if (data.linkTo && !data.attrs) {
      const linkTo = new Attribute(data.linkTo);
      data.attrs = {};
      if (!Object.prototype.hasOwnProperty.call(data.attrs, linkTo.uri())) {
        data.attrs[linkTo.uri()] = linkTo;
      }
    } else {
      data.linkTo = Identity.getLinkTo(data.attrs);
    }
    gun.put(data);
    return new Identity(gun, data.linkTo, index);
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
      const keyExists = Object.keys(mostVerifiedAttributes).indexOf(a.type) > - 1;
      a.verifications = isNaN(a.verifications) ? 1 : a.verifications;
      a.unverifications = isNaN(a.unverifications) ? 0 : a.unverifications;
      if (a.verifications * 2 > a.unverifications * 3 && (!keyExists || a.verifications - a.unverifications > mostVerifiedAttributes[a.type].verificationScore)) {
        mostVerifiedAttributes[a.type] = {
          attribute: a,
          verificationScore: a.verifications - a.unverifications
        };
        if (a.verified) {
          mostVerifiedAttributes[a.type].verified = true;
        }
      }
    });
    return mostVerifiedAttributes;
  }

  static async getAttrs(identity) {
    const attrs = await util.loadGunDepth(identity.get(`attrs`), 2);
    if (attrs['_'] !== undefined) {
      delete attrs['_'];
    }
    return attrs;
  }

  /**
  * Get sent Messages
  * @param {Object} options
  */
  sent(options) {
    this.index._getSentMsgs(this, options);
  }

  /**
  * Get received Messages
  * @param {Object} options
  */
  received(options) {
    this.index._getReceivedMsgs(this, options);
  }

  /**
  * @param {string} attribute attribute type
  * @returns {string} most verified value of the param type
  */
  async verified(attribute: String) {
    const attrs = await Identity.getAttrs(this.gun).then();
    const mva = Identity.getMostVerifiedAttributes(attrs);
    return Object.prototype.hasOwnProperty.call(mva, attribute) ? mva[attribute].attribute.value : undefined;
  }

  /**
  * @param {Object} ipfs (optional) an IPFS instance that is used to fetch images
  * @returns {HTMLElement} profile card html element describing the identity
  */
  profileCard(ipfs: Object) {
    const card = document.createElement(`div`);
    card.className = `iris-card`;

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
      const attrs = await Identity.getAttrs(this.gun);
      const linkTo = await this.gun.get(`linkTo`).then();
      const link = `https://iris.to/#/identities/${linkTo.type}/${linkTo.value}`;
      const mva = Identity.getMostVerifiedAttributes(attrs);
      linkEl.innerHTML = `<a href="${link}">${(mva.type && mva.type.attribute.value) || (mva.nickname && mva.nickname.attribute.value) || `${linkTo.type}:${linkTo.value}`}</a><br>`;
      linkEl.innerHTML += `<small>Received: <span class="iris-pos">+${data.receivedPositive || 0}</span> / <span class="iris-neg">-${data.receivedNegative || 0}</span></small><br>`;
      links.innerHTML = ``;
      Object.keys(attrs).forEach(k => {
        const a = attrs[k];
        if (a.link) {
          links.innerHTML += `${a.type}: <a href="${a.link}">${a.value}</a> `;
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
  * Appends an identity search widget to the given HTMLElement
  * @param {HTMLElement} parentElement element where the search widget is added and event listener attached
  * @param {Index} index index root to use for search
  */
  static appendSearchWidget(parentElement, index) {
    const form = document.createElement(`form`);

    const input = document.createElement(`input`);
    input.type = `text`;
    input.placeholder = `Search`;
    input.id = `irisSearchInput`;
    form.innerHTML += `<div id="irisSearchResults"></div>`;

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

    return form;
  }

  static _ordinal(n) {
    const s = [`th`, `st`, `nd`, `rd`];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  }

  /**
  * @param {number} width of the identicon
  * @param {number} border identicon border (aura) width
  * @param {boolean} showDistance whether to show web of trust distance ordinal
  * @param {Object} ipfs (optional) an IPFS instance that is used to fetch images
  * @returns {HTMLElement} identicon element that can be appended to DOM
  */
  identicon(width, border = 4, showDistance = true, ipfs) {
    util.injectCss(); // some other way that is not called on each identicon generation?
    const identicon = document.createElement(`div`);
    identicon.className = `iris-identicon`;
    identicon.style.width = `${width}px`;
    identicon.style.height = `${width}px`;

    const pie = document.createElement(`div`);
    pie.className = `iris-pie`;
    pie.style.width = `${width}px`;

    const img = document.createElement(`img`);
    img.alt = ``;
    img.width = width;
    img.height = width;
    img.style.borderWidth = `${border}px`;

    let distance;
    if (showDistance) {
      distance = document.createElement(`span`);
      distance.className = `iris-distance`;
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
        distance.textContent = typeof data.trustDistance === `number` ? Identity._ordinal(data.trustDistance) : `✕`;
      }
    }

    function setIdenticonImg(data) {
      const hash = util.getHash(`${encodeURIComponent(data.type)}:${encodeURIComponent(data.value)}`, `hex`);
      const identiconImg = new Identicon(hash, {width, format: `svg`});
      img.src = img.src || `data:image/svg+xml;base64,${identiconImg.toString()}`;
    }

    if (this.linkTo) {
      setIdenticonImg(this.linkTo);
    } else {
      this.gun.get(`linkTo`).on(setIdenticonImg);
    }

    this.gun.on(setPie);

    if (ipfs) {
      Identity.getAttrs(this.gun).then(attrs => {
        const mva = Identity.getMostVerifiedAttributes(attrs);
        if (mva.profilePhoto) {
          const go = () => {
            ipfs.cat(mva.profilePhoto.attribute.value).then(file => {
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
