import register from 'preact-custom-element';
import { Component, createRef } from 'preact';
import { html } from 'htm/preact';
import util from '../util';
import Key from '../key';

const DEFAULT_WIDTH = 80;

class ProfileAttribute extends Component {
  constructor() {
    super();
    this.ref = createRef();
    this.eventListeners = {};
    this.state = {value: ''};
  }

  componentDidUpdate(prevProps) {
    if (prevProps.pub !== this.props.pub || prevProps.attr !== this.props.attr) {
      this.componentDidMount();
    }
  }

  componentDidMount() {
    util.injectCss();
    this.attr = this.props.attr || 'name';
    this.props.pub && this.getAttr(this.props.pub);
    Key.getDefault().then(key => {
      key && this.setState({myPub: key.pub});
      if (!this.props.pub) {
        this.getAttr(key.pub);
      }
    });
  }

  getAttr(pub) {
    util.getPublicState().user(pub).get('profile').get(this.attr).on((value,a,b,e) => {
      this.eventListeners[this.attr] = e;
      if (!(this.ref.current && this.ref.current === document.activeElement)) {
        this.setState({value});
      }
    });
  }

  componentWillUnmount() {
    Object.values(this.eventListeners).forEach(e => e.off());
    this.eventListeners = {};
  }

  onInput(e) {
    util.getPublicState().user().get('profile').get(this.attr).put(e.target.innerText);
  }

  render() {
    if (this.props.pub === this.state.pub && String(this.props.editable) !== 'false') {
      return html`
      <span ref=${this.ref} contenteditable placeholder=${this.props.placeholder || this.attr} onInput=${e => this.onInput(e)}>
        ${this.state.value}
      </span>`;
    }
    return html`${this.state.value}`;
  }
}

register(ProfileAttribute, 'iris-profile-attribute', ['attr', 'pub', 'placeholder', 'editable']);

export default ProfileAttribute;
