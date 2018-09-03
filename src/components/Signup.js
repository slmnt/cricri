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
    },
    overlay: {
        position: "fixed",
        display: "block",
        width: "100%",
        height: "100%",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(255,255,255,0.8)",
        zIndex: 2,
    },
};

class Signup extends React.Component {
    state = {
    };
    componentDidMount() {
        window.scrollTo(0, 0)
    }
    onClick = () => {
        this.props.close()
    }
    render() {
        const {classes} = this.props;
        return (
          <div className={classes.overlay} onClick={this.onClick}>
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