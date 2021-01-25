import register from 'preact-custom-element';
import { Component, createRef } from 'preact';
import { html } from 'htm/preact';
import util from '../util';
import Key from '../key';

const DEFAULT_WIDTH = 80;

class TextNode extends Component {
  constructor() {
    super();
    this.ref = createRef();
    this.eventListeners = {};
    this.state = {value: ''};
  }

  componentDidUpdate(prevProps) {
    console.log('componentDidUpdate', prevProps.user, this.props.user);
    if (prevProps.user !== this.props.user || prevProps.path !== this.props.path) {
      this.eventListenersOff();
      this.componentDidMount();
    }
  }

  componentDidMount() {
    util.injectCss();
    this.path = this.props.path || 'profile/name';
    this.props.user && this.getValue(this.props.user);
    const ps = util.getPublicState();
    const myPub = ps._.user && ps._.user.is.pub;
    const setMyPub = myPub => {
      this.setState({myPub});
      !this.props.user && this.getValue(myPub);
    }
    if (myPub) {
      setMyPub(myPub);
    } else {
      Key.getDefault().then(key => {
        setMyPub(key.pub);
      });
    }
  }

  getNode(user) {
    const base = util.getPublicState().user(user);
    const path = this.path.split('/');
    return path.reduce((sum, current) => sum.get(current), base);
  }

  getValue(user) {
    this.getNode(user).on((value,a,b,e) => {
      this.eventListeners[this.path] = e;
      if (!(this.ref.current && this.ref.current === document.activeElement)) {
        this.setState({value});
      }
    });
  }

  eventListenersOff() {
    Object.values(this.eventListeners).forEach(e => e.off());
    this.eventListeners = {};
  }

  componentWillUnmount() {
    this.eventListenersOff();
  }

  onInput(e) {
    const text = e.target.value || e.target.innerText;
    this.getNode().put(text);
  }

  isEditable() {
    return (!this.props.user || this.props.user === this.state.myPub) && String(this.props.editable) !== 'false';
  }

  renderInput() {
    return html`
      <input
        type="text"
        value=${this.state.value}
        placeholder=${this.props.placeholder || this.path}
        onInput=${e => this.onInput(e)}
        disabled=${!this.isEditable()} />
    `;
  }

  renderTag() {
    const placeholder = this.props.placeholder || this.props.path;
    const tag = this.props.tag || 'span';
    return html`
      <${tag} ref=${this.ref} contenteditable=${this.isEditable()} placeholder=${placeholder} onInput=${e => this.onInput(e)}>
        ${this.state.value}
      </${tag}>
    `;
  }

  render() {
    return (this.props.tag === 'input' ? this.renderInput() : this.renderTag());
  }
}

!util.isNode && register(TextNode, 'iris-text', ['path', 'user', 'placeholder', 'editable', 'tag']);

export default TextNode;
