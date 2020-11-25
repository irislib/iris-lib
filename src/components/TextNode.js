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
    if (prevProps.pub !== this.props.pub || prevProps.path !== this.props.path) {
      this.componentDidMount();
    }
  }

  componentDidMount() {
    util.injectCss();
    this.path = this.props.path || 'profile/name';
    this.props.pub && this.getText(this.props.pub);
    Key.getDefault().then(key => {
      key && this.setState({myPub: key.pub});
      if (!this.props.pub) {
        this.getText(key.pub);
      }
    });
  }

  getText(pub) {
    console.log(this.path);
    const base = util.getPublicState().user(pub);
    const path = this.path.split('/');
    const query = path.reduce((sum, current) => sum.get(current), base);
    console.log('query', query);

    query.on((value,a,b,e) => {
      console.log('got', a, value);
      this.eventListeners[this.path] = e;
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
    const text = e.target.value || e.target.innerText;
    util.getPublicState().user().get(this.path).put(text);
  }

  renderInput() {
    console.log('renderInput');
    return html`
      <input
        type="text"
        value=${this.state.value}
        placeholder=${this.props.placeholder || this.path}
        onInput=${e => this.onInput(e)}
        disabled=${this.props.pub !== this.state.myPub || String(this.props.editable) === 'false'} />
    `;
  }

  renderTag() {
    console.log('renderTag');
    if (this.props.pub === this.state.myPub && String(this.props.editable) !== 'false') {
      return html`
        <span ref=${this.ref} contenteditable placeholder=${this.props.placeholder || this.path} onInput=${e => this.onInput(e)}>
          ${this.state.value}
        </span>
      `;
    }
    return html`${this.state.value}`;
  }

  render() {
    return (this.props.tag === 'input' ? this.renderInput() : this.renderTag());
  }
}

register(TextNode, 'iris-text', ['path', 'pub', 'placeholder', 'editable', 'tag']);

export default TextNode;
