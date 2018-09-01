import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Switch, NavLink, Redirect, withRouter } from "react-router-dom";
import { connect } from 'react-redux'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';

// import './App.css';

import Test from './components/Test';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Form from './components/Form';
import Welcome from './components/Welcome';
import Privacy from './components/Privacy';
import Tos from './components/Tos';
import NotFound from './components/NotFound';
import Signup from './components/Signup';
import Signin from './components/Signin';
import MyPage from './components/MyPage';

import wallpaper from './wallpaper-cooperating.jpg';

import { loginUser, logoutUser, getMyInfo, test } from './actions'
import api from './utils/api';
import errors from './utils/errors';

import store from './store';

const styles = {
  wp: {
    minHeight: "100vh",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundImage: "url(" + wallpaper + ")",
  },
  topContainer: {
    height: "100%",
    paddingRight: "20px",
    paddingLeft: "20px",
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around"
  },
  topItem: {
    height: "100%"
  },
  form: {
    width: "400px",
    maxWidth: "100%",
    marginTop: "200px"
  },
  '@media (max-width: 900px)': {
    form: {
      width: "100vw",
      marginTop: "0px"
    }
  }
};


class Explore extends Component {
  state = {};
  render() {
    return (
      <div>
        <div>hey wassup</div>
      </div>
    );
  }
}
class Other extends Component {
  state = {};
  render() {
    return (
      <React.Fragment>
        <Navbar />
        <main>
          <Switch>
            <Route exact path='/privacy' component={Privacy} />
            <Route exact path='/tos' component={Tos} />
            <Route exact path='/signup' component={Signup} />
            <Route exact path='/signin' component={Signin} />
            <Route exact path='/mypage' component={MyPage} />
            <Route component={Explore} />
            <Route component={NotFound} />
          </Switch>
        </main>
      </React.Fragment>
    );
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isToggleOn: true,
      z: 0,
    };

    this.onClick = this.onClick.bind(this);
  }
  componentDidMount() {
    // this.props.dispatch(test())
    getMyInfo()(this.props.dispatch)
  }
  onClick(e) {
    this.setState(prevState => ({
      isToggleOn: !prevState.isToggleOn,
      z: prevState.z + 1
    }));
  }
  handleClick(e) {
    const username = this.refs.username
    const password = this.refs.password
    const creds = { username: username.value.trim(), password: password.value.trim() }
    //this.props.onLoginClick(creds)
    loginUser(creds)(this.props.dispatch)
    console.log(creds)
  }
  handleClickLogout(e) {
    //this.props.dispatch(fetchSecretQuote());
    logoutUser()(this.props.dispatch)
  }
  handleClickTest(e) {
    //this.props.dispatch(fetchSecretQuote());
    //api.testSession().then(response => console.log(response.body));
    getMyInfo()(this.props.dispatch)
    console.log(store.getState())
  }
  handleClickDelete(e) {
    //this.props.dispatch(fetchSecretQuote());
    api.deleteUser().then(response => console.log(response.body));
  }
  handleClickCreate(e) {
    const username = this.refs.username
    const password = this.refs.password
    const email = this.refs.email
    const config = {
      username: username.value.trim(),
      password: password.value.trim(),
      email: email.value.trim()
    }

    api.createUser(config).then(response => console.log(response.body));
  }
  handleClickMail(e) {
    // メール送信
  }
  render() {
    const {classes} = this.props;
    return (
      <div className="App">
        <Switch>
          <Route exact path='/' component={Welcome} />
          <Route component={Other} />
        </Switch>
        <Footer />
        <input type='text' ref='username' />
        <input type='password' ref='password' />
        <input type='text' ref='email' />
        <button onClick={(event) => this.handleClickCreate(event)}>
          Create user
        </button>
        <button onClick={(event) => this.handleClick(event)}>
          Login
        </button>
        <button onClick={(event) => this.handleClickLogout(event)}>
          Logout
        </button>
        <button onClick={(event) => this.handleClickDelete(event)}>
          Delete
        </button>
        <button onClick={(event) => this.handleClickTest(event)}>
          Test
        </button>
        <button onClick={(event) => this.handleClickMail(event)}>
          Mail
        </button>
      </div>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  quote: PropTypes.string,
  isAuthenticated: PropTypes.bool.isRequired,
  errorMessage: PropTypes.string,
  //isSecretQuote: PropTypes.bool.isRequired
};


function mapStateToProps(state) {

  const { auth } = state
  const { isAuthenticated, errorMessage } = auth

  return {
    isAuthenticated,
    errorMessage
  }
}


export default withRouter(connect(mapStateToProps)(withStyles(styles)(App)))