import React from 'react';
import { BrowserRouter as Router, Route, Link, Switch, NavLink, Redirect } from "react-router-dom";
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';

import spinnerImage from '../spinner.jpg';

const styles = {
    main: {
      paddingRight: "20px",
      paddingLeft: "20px",
    },
    spinner: {
      animation: "spin infinite 1.5s linear",
      width: "100px",
      height: "100px"
    },
    "@keyframes spin": {
      from: { transform: "rotate(0deg)" },
      to: { transform: "rotate(360deg)" }
    }
};

class Spinner extends React.Component {
  state = {
  };
  render() {
      const {classes} = this.props;
      return (
        <img className={classes.spinner} src={spinnerImage}/>
      );
  }
}
Spinner.propTypes = {
  classes: PropTypes.object.isRequired,
};

Spinner = withStyles(styles)(Spinner);

class Loading extends React.Component {
    state = {
    };
    render() {
        const {classes} = this.props;
        return (
          <React.Fragment>
            {
              //this.props.enable && <Spinner />
            }
            {!this.props.enable && this.props.children}
          </React.Fragment>
        );
    }
}

export default Loading;