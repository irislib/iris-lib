class Identity {
  constructor(data) {
    this.data = data;
    this.info = {};
    if (data.attrs.length) {
      const c = data.attrs[0];
      this.receivedPositive = c.pos;
      this.receivedNegative = c.neg;
      this.receivedNeutral = c.neut;
      this.trustDistance = c.dist;
    }
    this.data.attrs.forEach(a => {
      switch (a.name) {
      case `email`:
        a.iconStyle = `glyphicon glyphicon-envelope`;
        a.btnStyle = `btn-success`;
        a.link = `mailto:${a.val}`;
        a.quickContact = true;
        this.info.email = this.info.email || a.val;
        break;
      case `bitcoin_address`:
      case `bitcoin`:
        a.iconStyle = `fa fa-bitcoin`;
        a.btnStyle = `btn-primary`;
        a.link = `https://blockchain.info/address/${a.val}`;
        a.quickContact = true;
        break;
      case `gpg_fingerprint`:
      case `gpg_keyid`:
        a.iconStyle = `fa fa-key`;
        a.btnStyle = `btn-default`;
        a.link = `https://pgp.mit.edu/pks/lookup?op=get&search=0x${a.val}`;
        break;
      case `account`:
        a.iconStyle = `fa fa-at`;
        break;
      case `nickname`:
        this.info.nickname = this.info.nickname || a.val;
        a.iconStyle = `glyphicon glyphicon-font`;
        break;
      case `name`:
        this.info.name = this.info.name || a.val;
        a.iconStyle = `glyphicon glyphicon-font`;
        break;
      case `tel`:
      case `phone`:
        a.iconStyle = `glyphicon glyphicon-earphone`;
        a.btnStyle = `btn-success`;
        a.link = `tel:${a.val}`;
        a.quickContact = true;
        break;
      case `keyID`:
        a.iconStyle = `fa fa-key`;
        break;
      case `coverPhoto`:
        if (a.val.match(/^\/ipfs\/[1-9A-Za-z]{40,60}$/)) {
          this.coverPhoto = this.coverPhoto || {
            'background-image': `url(${(this.ipfsStorage && this.ipfsStorage.apiRoot || ``)}${a.val})`
          };
        }
        break;
      case `profilePhoto`:
        if (a.val.match(/^\/ipfs\/[1-9A-Za-z]{40,60}$/)) {
          this.profilePhoto = `${this.profilePhoto || (this.ipfsStorage && this.ipfsStorage.apiRoot || ``)}${a.val}`;
        }
        break;
      case `url`:
        a.link = a.val;
        if (a.val.indexOf(`facebook.com/`) > - 1) {
          a.iconStyle = `fa fa-facebook`;
          a.btnStyle = `btn-facebook`;
          a.link = a.val;
          a.linkName = a.val.split(`facebook.com/`)[1];
          a.quickContact = true;
        } else if (a.val.indexOf(`twitter.com/`) > - 1) {
          a.iconStyle = `fa fa-twitter`;
          a.btnStyle = `btn-twitter`;
          a.link = a.val;
          a.linkName = a.val.split(`twitter.com/`)[1];
          a.quickContact = true;
        } else if (a.val.indexOf(`plus.google.com/`) > - 1) {
          a.iconStyle = `fa fa-google-plus`;
          a.btnStyle = `btn-google-plus`;
          a.link = a.val;
          a.linkName = a.val.split(`plus.google.com/`)[1];
          a.quickContact = true;
        } else if (a.val.indexOf(`linkedin.com/`) > - 1) {
          a.iconStyle = `fa fa-linkedin`;
          a.btnStyle = `btn-linkedin`;
          a.link = a.val;
          a.linkName = a.val.split(`linkedin.com/`)[1];
          a.quickContact = true;
        } else if (a.val.indexOf(`github.com/`) > - 1) {
          a.iconStyle = `fa fa-github`;
          a.btnStyle = `btn-github`;
          a.link = a.val;
          a.linkName = a.val.split(`github.com/`)[1];
          a.quickContact = true;
        } else {
          a.iconStyle = `glyphicon glyphicon-link`;
          a.btnStyle = `btn-default`;
        }
      }
    });
  }

  getSentMsgsIndex() {

  }

  getReceivedMsgsIndex() {

  }

  verified(attribute) {
    let v;
    let best = 0;
    this.data.attrs.forEach(a => {
      if (a.name === attribute && a.conf * 2 > a.ref * 3 && a.conf - a.ref > best) {
        v = a.val;
        best = a.conf - a.ref;
      }
    });
    return v;
  }

  profileCard() {
    const template = ```
    <tr ng-repeat="result in ids.list" id="result{{$index}}" ng-hide="!result.linkTo" ui-sref="identities.show({ type: result.linkTo.type, value: result.linkTo.value })" class="search-result-row" ng-class="{active: result.active}">
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
    ```;
    return template;
  }

  avatar() {
    const avatar = document.createElement(`div`);
    avatar.className = `identifi.avatar`;
    const pie = document.createElement(`div`);
    const img = document.createElement(`img`);
    avatar.appendChild(pie);
    avatar.appendChild(img);
    function update(element) {
      let bgColor, bgImage, boxShadow, transform;
      this.negativeScore |= 0;
      this.positiveScore |= 0;
      boxShadow = `0px 0px 0px 0px #82FF84`;
      if (this.positiveScore > this.negativeScore * 20) {
        boxShadow = `0px 0px ${this.border * this.positiveScore / 50}px 0px #82FF84`;
      } else if (this.positiveScore < this.negativeScore * 3) {
        boxShadow = `0px 0px ${this.border * this.negativeScore / 10}px 0px #BF0400`;
      }
      bgColor = `rgba(0,0,0,0.2)`;
      bgImage = `none`;
      transform = ``;
      if (this.positiveScore + this.negativeScore > 0) {
        if (this.positiveScore > this.negativeScore) {
          transform = `rotate(${((- this.positiveScore / (this.positiveScore + this.negativeScore) * 360 - 180) / 2)}deg)`;
          bgColor = `#A94442`;
          bgImage = `linear-gradient(${this.positiveScore / (this.positiveScore + this.negativeScore) * 360}deg, transparent 50%, #3C763D 50%), linear-gradient(0deg, #3C763D 50%, transparent 50%)`;
        } else {
          transform = `rotate(${((- this.negativeScore / (this.positiveScore + this.negativeScore) * 360 - 180) / 2) + 180}deg)`;
          bgColor = `#3C763D`;
          bgImage = `linear-gradient(${this.negativeScore / (this.positiveScore + this.negativeScore) * 360}deg, transparent 50%, #A94442 50%), linear-gradient(0deg, #A94442 50%, transparent 50%)`;
        }
      }
      element.children().css({
        width: `${this.width}px`,
        height: `${this.width}px`
      });
      element.children().find(`div`).css({
        'background-color': bgColor,
        'background-image': bgImage,
        width: `${this.width}px`,
        'box-shadow': boxShadow,
        opacity: (this.positiveScore + this.negativeScore) / 10 * 0.5 + 0.35,
        transform: transform
      });
      return element.find(`img`).css({
        'border-width': `${this.border}px`
      });
    }

    const template = ```
      <div class="identicon">
        <div class="pie">
        </div>
        <img alt=""
          width="{{width}}"
          src="https://www.gravatar.com/avatar/{{id.gravatar}}?d=retro&amp;s={{width*2}}" />
      </div>
    ```;
    update(avatar);
    return template;
  }
}

export default Identity;
