import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Switch, NavLink, Redirect } from "react-router-dom";
import { connect } from 'react-redux'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';

// import './App.css';

import Test from '../components/Test';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Form from '../components/Form';
import UserLink from './UserLink';

import wallpaper from '../wallpaper-cooperating.jpg';

import api from '../utils/api';

import { setParams, getSearchParams, getRelativePath } from '../utils/misc';


const styles = {
  nav: {
    width: "100%"
  },
  wp: {
    minHeight: "100vh",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundImage: "url(" + wallpaper + ")",
  },
  topContainer: {
    height: "100vh",
    paddingRight: "20px",
    paddingLeft: "20px",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center"
  },
  topItem: {
    width: "40vw"
  },
  form: {
    width: "400px",
    maxWidth: "100%",
    marginTop: "200px"
  },
  flex: {
    paddingRight: "60px",
    paddingLeft: "60px",
    display: "flex",
    flexFlow: "column wrap",
    alignContent: "center"
  },
  hugeText: {
    marginTop: 200,
    marginBottom: 100,
    fontSize: "100px",
    color: "#FFFFFF"
  },
  searchBox: {
    width: "100%",
    height: "30px",
    fontSize: "25px",
    borderRadius: "3px",
    border: "1px solid #cccccc",
    outline: "0px",
    padding: "10px",
    "&:focus": {
      outline: "1px solid #4da7fe !important"
    }
  },
  center: {
    display: "flex",
    flexFlow: "column nowrap",
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
    textAlign: "center",
    fontSize: "25px",
  },
  title: {
    textAlign: "center",
    fontSize: "25px",
  },
  '@media (max-width: 900px)': {
    form: {
      width: "100vw",
      marginTop: "0px"
    }
  }
};


class Welcome extends Component {
  state = {
    randomUsers: [],
    randomProjects: []
  };
  componentDidMount() {
    window.scrollTo(0, 0)
    this.getRandomUsers()
    this.getRandomProjects()
  }
  getRandomUsers = () => {
    var params = {
      q: "",
      p: 1,
      l: 5
    }
    api.searchUsers(params).then(r => {
      this.setState({
        randomUsers: r.items
      })
    })
  }
  getRandomProjects = () => {
    var params = {
      q: "",
      p: 1,
      l: 5
    }
    api.searchProjects(params).then(r => {
      this.setState({
        randomProjects: r.items
      })
    })
  }
  onKeyPress = (e) => {
    if (e.key == 'Enter') {
      this.search(this.refs.search_box.value.trim())
    }
  }
  search = (text) => {
    var path = getRelativePath(setParams({pathname: "/explore", search: ""}, {q: text, p: 1}))
    this.props.history.push(path)
  }
  render() {
    const {classes} = this.props;
    return (
      <React.Fragment>
        <Navbar />
        <div className={classes.nav}>

        </div>
        <div className={classes.wp}>
          <div className={classes.topContainer}>
            <div className={classes.topItem}>
                <div className={classes.center} style={{fontSize: "60px", color: "#FFFFFF"}}>
                  見つけよう
                </div>
                <div className={classes.center}>
                  <input onKeyPress={this.onKeyPress} className={classes.searchBox} ref="search_box" placeholder="プロジェクトを検索"></input>
                </div>
            </div>
          </div>
        </div>
        <div className={classes.flex} style={{height: "1000px", backgroundColor: "#cccccc"}}>
          <div className={classes.center}>
            ユーザ
          </div>
          <div>
            {this.state.randomUsers.map(v => <UserLink userdata={v} />)}
          </div>
          <div className={classes.center}>
            プロジェクト
          </div>
          <div>
            {
              //this.state.randomProjects.map(v => <UserLink userdata={v} />)
            }
          </div>
        </div>
        <div className={classes.flex} style={{height: "1000px", backgroundColor: "#982384"}}>
          <div className={classes.hugeText}>始めよう</div>
          <div>適当な画像</div>
        </div>
        <div className={classes.flex} style={{height: "1000px", backgroundColor: "#33333"}}>
          <div className={classes.hugeText}>始めよう</div>
          <div>適当な画像</div>
        </div>
      </React.Fragment>
    );
  }
}
Welcome.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Welcome);