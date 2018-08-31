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

import Loading from './Loading';
import spinnerImage from '../spinner.jpg';

import store from '../store';

const styles = {
    main: {
        paddingRight: "20px",
        paddingLeft: "20px",
    },
    avatar: {
        width: 200,
        height: 200,
        borderRadius: "100%"
    }
};

class MyPage extends React.Component {
    state = {
        spinner: true
    };
    componentDidMount() {
        window.scrollTo(0, 0)
    }
    toggle = () => {
        this.setState(function (prevState, props) {
            return {spinner: !prevState.spinner}
        })
        console.log(store.getState())
    }
    render() {
        const {classes} = this.props;
        return (
          <div className={classes.main}>
            <div>
              Mypage
              <img className={classes.avatar} src={spinnerImage} />
              <button onClick={this.toggle}>btn</button>
              <Loading enable={this.state.spinner}>
               hey
              </Loading>
            </div>
          </div>
        );
    }
}
MyPage.propTypes = {
    classes: PropTypes.object.isRequired,
};
  
export default withStyles(styles)(MyPage);