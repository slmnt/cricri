import React from 'react';
import { withRouter } from "react-router-dom";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';

const styles = {
    root: {
      flexGrow: 1,
    },
    card: {
    },
    innerCard: {
      margin : "5%",
    },
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
        marginLeft: "auto",
        marginRight: "auto",
        width: "80%",
    },
};

class Form extends React.Component {
    state = {
    };
    onClickSignin = () => {
        
    }
    onClickSignup = () => {
        this.props.history.push('/signup');
    }
    render() {
        const {classes} = this.props;
        return (
            <Card className={classes.card}>
                <div className={classes.innerCard}>
                    <form noValidate autoComplete="off">
                    <Grid container spacing={24} direction="row" justify="center">
                        <Grid item xs={12}>
                            <Typography variant="headline" component="h2" style={{textAlign: "center"}}>
                                あどぃあどいあｗじお
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <div className={classes.container}>
                            <TextField
                                id="username"
                                label="ユーザ名"
                                className={classes.textField}
                                //value={this.state.name}
                                //onChange={this.handleChange('name')}
                                margin="normal"
                            />
                            <TextField
                                type="password"
                                id="password"
                                label="パスワード"
                                className={classes.textField}
                                //value={this.state.name}
                                //onChange={this.handleChange('name')}
                                margin="normal"
                            />
                            </div>
                        </Grid>
                        <Grid item>
                            <Button onClick={this.onClickSignin} variant="contained" color="secondary">
                                ログイン
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button onClick={this.onClickSignup} variant="outlined" color="primary">
                                会員登録
                            </Button>
                        </Grid>
                    </Grid>
                    </form>
                </div>
            </Card>
        );
    }
}
Form.propTypes = {
    classes: PropTypes.object.isRequired,
};
  
export default withRouter(withStyles(styles)(Form));