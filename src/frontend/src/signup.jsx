import React from "react";
import {Paper, withStyles, Grid, TextField, Button} from "@material-ui/core";
import {Face, Fingerprint} from "@material-ui/icons";
import axios from "axios";
import url from "./config";

const styles = (theme) => ({
  margin: {
    margin: theme.spacing.unit * 2,
  },
  padding: {
    padding: theme.spacing.unit,
  },
});

//const url = "http://localhost:5000";

class SignUpTab extends React.Component {
  constructor() {
    super();
    this.state = {
      username: "",
      password: "",
      repeatPassword: "",
      errorPass: false,
    };
  }

  userChange = (e) => {
    const user = e.target.value;
    this.setState({
      username: user,
    });
  };
  passwordChange = (e) => {
    const pass = e.target.value;
    this.setState({
      password: pass,
    });
  };

  repeatPasswordChange = (e) => {
    const pass = e.target.value;
    this.setState({
      repeatPassword: pass,
    });
  };

  submit = (e) => {
    e.preventDefault();
    if (this.state.password !== this.state.repeatPassword) {
      console.log("erro");
      this.setState({
        errorPass: true,
      });
      return;
    }
    const auth = {username: this.state.username, password: this.state.password};
    axios
      .post(`${url}/api/v1/auth/signup`, auth, {
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      })
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          alert("you can login now");
        }
      });
  };
  render() {
    const {classes} = this.props;

    const divStyle = {
      color: "red",
    };
    const errorPass = this.state.errorPass;
    return (
      <Paper className="{classes.padding } login">
        <form onSubmit={this.submit}>
          <div className={classes.margin}>
            <Grid container spacing={8} alignItems="flex-end">
              <Grid item>
                <Face />
              </Grid>
              <Grid item md={true} sm={true} xs={true}>
                <TextField
                  id="username"
                  label="Username"
                  type="text"
                  onChange={this.userChange}
                  fullWidth
                  autoFocus
                  required
                />
              </Grid>
            </Grid>
            <Grid container spacing={8} alignItems="flex-end">
              <Grid item>
                <Fingerprint />
              </Grid>
              <Grid item md={true} sm={true} xs={true}>
                <TextField
                  id="username"
                  label="Password"
                  type="password"
                  onChange={this.passwordChange}
                  fullWidth
                  required
                />
              </Grid>
            </Grid>
            <Grid container spacing={8} alignItems="flex-end">
              <Grid item>
                <Fingerprint />
              </Grid>
              <Grid item md={true} sm={true} xs={true}>
                <TextField
                  id="username"
                  label="Repeat password"
                  type="password"
                  onChange={this.repeatPasswordChange}
                  fullWidth
                  required
                />
              </Grid>
            </Grid>
            {errorPass ? (
              <span style={divStyle}>Verify that passwords match</span>
            ) : (
              <></>
            )}
            <Grid container justify="center" style={{marginTop: "10px"}}>
              <Button
                variant="outlined"
                type="submit"
                color="primary"
                style={{textTransform: "none"}}
              >
                Sign up
              </Button>
            </Grid>
          </div>
        </form>
      </Paper>
    );
  }
}

export default withStyles(styles)(SignUpTab);
