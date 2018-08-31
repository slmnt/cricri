import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

const styles = {

};


class NotFound extends React.Component {
    state = {
    };
    componentDidMount() {
        window.scrollTo(0, 0)
    }
    render() {
        const {classes} = this.props;
        return (
            <div>
              <div><h1 style={{fontSize: "100px"}}>404</h1></div>
            </div>
        );
    }
}
NotFound.propTypes = {
    classes: PropTypes.object.isRequired,
};
  
export default withStyles(styles)(NotFound);