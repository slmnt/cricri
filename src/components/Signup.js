import React from 'react';
import { BrowserRouter as Router, Route, Link, Switch, NavLink, Redirect } from "react-router-dom";
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import classnames from 'classnames';

const styles = {
    main: {
        paddingRight: "20px",
        paddingLeft: "20px",
    }
};

class Signup extends React.Component {
    state = {
    };
    componentDidMount() {
        window.scrollTo(0, 0)
    }
    render() {
        const {classes} = this.props;
        return (
          <div className={classes.main}>
            <div>
              Signup
            </div>
          </div>
        );
    }
}
Signup.propTypes = {
    classes: PropTypes.object.isRequired,
};
  
export default withStyles(styles)(Signup);