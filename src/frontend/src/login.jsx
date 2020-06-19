import React from 'react';
import { Paper, withStyles, Grid, TextField, Button, FormControlLabel, Checkbox } from '@material-ui/core';
import { Face, Fingerprint } from '@material-ui/icons';
import axios from 'axios';
import Cookies from 'universal-cookie';



const styles = theme => ({
    margin: {
        margin: theme.spacing.unit * 2,
    },
    padding: {
        padding: theme.spacing.unit
    }
});

class LoginTab extends React.Component {
    constructor() {
    super()
    this.state = {
      username: '',
      password: '',
    }
  }

    userChange=(e)=>{
        const user = e.target.value
        this.setState({
          username: user,
        })

    }
    passwordChange=(e)=>{

        const pass = e.target.value
        this.setState({
          password: pass,
        })
    }
    submit=(e)=>{
        e.preventDefault()
        
        const auth ={username:this.state.username, password: this.state.password};
        axios.post(`http://localhost:5000/api/v1/auth/login`, auth,{headers: {
            "Access-Control-Allow-Origin": "*"
          }
        })
          .then(res => {
            console.log(res);
            if(res.status == 200){
                let token = res.data.token;
                const cookies = new Cookies();
                cookies.set('authToken', token)
                this.props.logged(true)
            }
           
          })
    }

    render() {
        const { classes } = this.props;
        return (
            <Paper className="{classes.padding } login">
                <form onSubmit={this.submit}>
                <div className={classes.margin}>
                    <Grid container spacing={8} alignItems="flex-end">
                        <Grid item>
                            <Face />
                        </Grid>
                        <Grid item md={true} sm={true} xs={true}>
                            <TextField id="username" label="Username" type="text" fullWidth autoFocus required onChange={this.userChange}/>
                        </Grid>
                    </Grid>
                    <Grid container spacing={8} alignItems="flex-end">
                        <Grid item>
                            <Fingerprint />
                        </Grid>
                        <Grid item md={true} sm={true} xs={true}>
                            <TextField id="username" label="Password" type="password" fullWidth required onChange={this.passwordChange}/>
                        </Grid>
                    </Grid>
                    <Grid container alignItems="center" justify="space-between">
                        <Grid item>
                            <FormControlLabel control={
                                <Checkbox
                                    color="primary"
                                />
                            } label="Remember me" />
                        </Grid>
                        <Grid item>
                            <Button disableFocusRipple disableRipple style={{ textTransform: "none" }} variant="text" color="primary">Forgot password ?</Button>
                        </Grid>
                    </Grid>
                    <Grid container justify="center" style={{ marginTop: '10px' }}>
                        <Button variant="outlined" type="submit" color="primary" style={{ textTransform: "none" }}>Login</Button>
                    </Grid>
                </div>
                </form>
            </Paper>
        );
    }
}

export default withStyles(styles)(LoginTab);