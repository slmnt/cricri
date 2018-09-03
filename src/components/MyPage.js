import React from 'react';
import { BrowserRouter as Router, Route, Link, Switch, NavLink, Redirect } from "react-router-dom";
import { connect } from 'react-redux'
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

import {mapStateToProps} from '../utils/misc';
import {test} from '../actions';

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
        username: "",
        email: "",
        avatar: "",
        spinner: true,
    };
    componentDidMount() {
        console.log("MyPage", this.props)
        window.scrollTo(0, 0)
    }
    toggle = () => {
        this.setState(function (prevState, props) {
            return {spinner: !prevState.spinner}
        })
    }
    test = () => {
        console.log(this.props.userdata)
    }
    render() {
        const {classes} = this.props;
        return (
          <div className={classes.main}>
            <div>
              Mypage

              <Loading enable={this.props.userdata == undefined}>
                {
                this.props.userdata &&
                <div>
                    username: {this.props.userdata.username}
                    <br />
                    email: {this.props.userdata.email}
                </div>
                }
              </Loading>
              <img className={classes.avatar} src={spinnerImage} />
              <button onClick={this.test}>aaa</button>
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

export default connect(mapStateToProps)(withStyles(styles)(MyPage));