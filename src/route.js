import { Route } from 'react-router-dom';
class Async extends React.Component {
  constructor({ dataPath }) {
    super();
    if (window.components[dataPath]) this.state = { ...window.components[dataPath] };
    else this.state = {};
  }

  componentDidMount() {
    this.mounted = true;
    if (!this.state.component) this.load(this.props);
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  componentWillReceiveProps(props) {
    if (this.props !== props) this.load(props);
  }

  async load({ dataPath, loader, ...props }) {
    let { component } = await loader({ dataPath });
    if (!component) return;

    this.setState({
      component: component.default
    });
  }

  render() {
    let { component } = this.state;

    if (!component) return null;
    return React.createElement(component, { ...this.props });
  }
}

export default loader =>
  props => (
    <Route
      {...props}
      render={routeProps => <Async loader={loader} dataPath={props.dataPath} {...routeProps} />}
    />
  );
