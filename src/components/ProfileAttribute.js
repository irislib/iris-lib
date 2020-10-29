import register from 'preact-custom-element';
import { Component } from 'preact';
import { html } from 'htm/preact';
import util from '../util';

const DEFAULT_WIDTH = 80;

class ProfileAttribute extends Component {
  constructor() {
    super();
    this.eventListeners = {};
    this.state = {value: ''};
  }

  componentDidUpdate(prevProps) {
    if (prevProps.pub !== this.props.pub || prevProps.attr !== this.props.attr) {
      this.componentDidMount();
    }
  }

  componentDidMount() {
    const attr = this.props.attr || 'name';
    util.getPublicState().user(this.props.pub).get('profile').get(attr).on((value,a,b,e) => {
      this.eventListeners[attr] = e;
      this.setState({value})
    });
  }

  componentWillUnmount() {
    Object.values(this.eventListeners).forEach(e => e.off());
    this.eventListeners = {};
  }

  render() {
    return html`${this.state.value}`;
  }
}

register(ProfileAttribute, 'iris-profile-attribute', ['attr', 'pub']);

export default ProfileAttribute;
