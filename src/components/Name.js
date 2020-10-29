import register from 'preact-custom-element';
import { Component } from 'preact';
import { html } from 'htm/preact';
import util from '../util';

const DEFAULT_WIDTH = 80;

class Name extends Component {
  constructor() {
    super();
    this.eventListeners = {};
    this.state = {name: ''};
  }

  componentDidUpdate(prevProps) {
    if (prevProps.pub !== this.props.pub) {
      this.componentDidMount();
    }
  }

  componentDidMount() {
    util.getPublicState().user(this.props.pub).get('profile').get('name').on((name,a,b,e) => {
      this.eventListeners['name'] = e;
      this.setState({name})
    });
  }

  componentWillUnmount() {
    Object.values(this.eventListeners).forEach(e => e.off());
    this.eventListeners = {};
  }

  render() {
    return html`${this.state.name}`;
  }
}
register(Name, 'iris-name', ['pub']);

export default Name;
