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
import Explore from './components/Explore';
import SearchUser from './components/SearchUser';
import Project from './components/Project';
import User from './components/User';
import ProjectCreator from './components/ProjectCreator';

import RouteFilter from './components/RouteFilter';

import wallpaper from './wallpaper-cooperating.jpg';

import { loginUser, logoutUser, getMyInfo, openSignin, openSignup, closeSignin, closeSignup, test } from './actions'
import api from './utils/api';
import errors from './utils/errors';
import {mapStateToProps} from './utils/misc';

import store from './store';

const page_reload_in = 5000

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
  '@media (max-width: 900px)': {
    form: {
      width: "100vw",
      marginTop: "0px"
    }
  }
};



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
            <Route exact path='/mypage' component={MyPage} />} />
            <RouteFilter exact path='/explore' component={Explore} />
            <RouteFilter exact path='/search' component={SearchUser} />
            <Route exact path='/projects/:id' component={Project} />
            <Route exact path='/users/:id' component={User} />
            <Route exact path='/create' component={ProjectCreator} />
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
    this.setState((prev, state) => {
      return {
        tokenExpired: false
      }
    })
    if (api.getToken()) {
      getMyInfo()(this.props.dispatch).catch(e => {
        if (errors.TokenExpired.is(e)) {
          this.setState({ tokenExpired: true })
          api.destroyToken()
          window.setTimeout(this.resetPath, page_reload_in);
        } else if (errors.NoToken.is(e)) {

        }
      })
    }
  }
  resetPath = () => {
    this.props.history.push("/")
    window.location.reload()
  }
  closeSignin = () => {
    this.props.dispatch(closeSignin())
  }
  closeSignup = () => {
    this.props.dispatch(closeSignup())
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
    //api.testSession().then(response => console.log(response));
    //getMyInfo()(this.props.dispatch)
    console.log(store.getState())
    console.log(this.state)
  }
  handleClickDelete(e) {
    //this.props.dispatch(fetchSecretQuote());
    api.deleteUser().then(response => console.log(response));
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

    api.createUser(config).then(response => console.log(response));
  }
  handleClickSend(e) {
    var method = this.refs.method.value.trim()
    var path = this.refs.path.value.trim()
    var body = this.refs.body.value.trim()
    var auth = this.refs.auth.value.trim() == "1"
    var config = body != "" && api.withParams({}, JSON.parse(body)) || {}
    api[method](path, auth, config).then(result => {
      console.log(result)
    })
  }
  handleClickSearch(e) {
    api.searchProjects({a: 213, b: 2122}).then(response => console.log(response));
  }
  handleClickCreateProject(e) {
    const name = this.refs.projname.value.trim()
    const desc = this.refs.projdesc.value.trim()
    const config = {
      name, desc
    }

    api.createProject(config).then(response => console.log(response));
  }
  handleClickGetProjects(e) {
    console.log(this.props)
    api.getProjectsByUser(this.props.userdata.id).then(response => console.log(response));
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
        {
          this.state.tokenExpired &&
          <div className={classes.overlay}>
            <div style={{fontSize: "15vw", color: "#000000"}}>
              セッションが切れました
            </div>
            <div style={{fontSize: "1vw", color: "#000000"}}>
              {page_reload_in / 1000}秒後にページを更新します
            </div>
          </div>
        }
        { this.props.signinModal && <Signin close={this.closeSignin} /> }
        { this.props.signupModal && <Signup close={this.closeSignup} /> }

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
        <button onClick={(event) => this.handleClickSearch(event)}>
          search
        </button>
        method: <input ref="method" />
        path: <input ref="path" />
        body: <textarea ref="body"/>
        auth: <textarea ref="auth"/>
        <button onClick={(event) => this.handleClickSend(event)}>
          send
        </button>
        <div>
          name: <input ref="projname" />
          desc: <input ref="projdesc" />
          <button onClick={(event) => this.handleClickCreateProject(event)}>
            create proj
          </button>
          <button onClick={(event) => this.handleClickGetProjects(event)}>
            get proj
          </button>
        </div>
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



export default withRouter(connect(mapStateToProps)(withStyles(styles)(App)))