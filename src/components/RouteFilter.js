import React from 'react';
import { Route } from "react-router-dom";

class RouteFilter extends React.Component {
  state = {
    callback: undefined
  };
  componentDidMount() {
  }
  setCallback = (func) => {
    this.setState({
      callback: func
    })
  }
  onRouteChange = (props) => {
    if (this.state.callback) {
      this.state.callback()
    }
    window.scrollTo(0, 0)

    if (props.location.pathname == "/explore") {
    }
  }
  onRender = (Component) => {
    return (props) => {
      if (this.onRouteChange(props) == -1){
        return
      }
      if (Component) {
        return <Component setOnRouteChange={this.setCallback} {...props} />
      } else {
        return this.props.render(props)
      }
    }
  }
  render() {
      const {component, ...otherProps} = this.props
      return (
        <Route {...otherProps} render={this.onRender(component)} />
      );
  }
}
export default RouteFilter;