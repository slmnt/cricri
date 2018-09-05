import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

const styles = {
  main: {
    paddingRight: "20px",
    paddingLeft: "20px",
  },
  title: {
    textAlign: "center"
  }
};


class Privacy extends React.Component {
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
                <div className={classes.title}><h1>プライバシーポリシー</h1></div>
 
              </div>
            </div>
        );
    }
}
Privacy.propTypes = {
    classes: PropTypes.object.isRequired,
};
  
export default withStyles(styles)(Privacy);