import React, { Component } from 'react'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import CssBaseline from '@material-ui/core/CssBaseline'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import withStyles from '@material-ui/core/styles/withStyles'
import { withRouter } from 'react-router-dom'

import store from '../store'
import axios from 'axios'

const styles = theme => ({
  main: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing.unit,
  },
  submit: {
    marginTop: theme.spacing.unit * 2,
    backgroundColor: theme.palette.primary['A100']
  }
})

class SignIn extends Component {
  state = {
    uemail: '',
    password: '',
    remember: true
  }

  componentDidMount () {
    // check if the user has already signed in
  }

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value })
  }

  handleSubmit = async (e) => {
    e.preventDefault()
    try {
      let res = await axios.post('/auth/token', {
        uemail: this.state.uemail,
        password: this.state.password
      })
      store.setToken(res.data.token)
      res = await axios.get(`/users/${this.state.uemail}`, {
        headers: {'Authorization': `bearer ${res.data.token}`}
      })
      store.setUser(res.data.users[0])
      this.props.history.push('/')
    } catch (err) {
      console.error(err)
      console.error('login failed')
    }
  }

  render() {
    const { classes } = this.props
    return (
      <main className={classes.main}>
        <CssBaseline />
        <Paper className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Snickr
          </Typography>
          <form
            className={classes.form}
            onSubmit={this.handleSubmit}
          >
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="uemail">Email Address</InputLabel>
              <Input
                id="uemail"
                name="uemail"
                value={this.state.uemail}
                onChange={this.handleChange}
                autoComplete="email"
                autoFocus
              />
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="password">Password</InputLabel>
              <Input
                id="password"
                name="password"
                type="password"
                value={this.state.password}
                onChange={this.handleChange}
                autoComplete="current-password"
              />
            </FormControl>
            <FormControlLabel
              control={
                <Checkbox
                  checked={this.state.remember}
                  onChange={this.onChange}
                  value="remember"
                  color="primary"
                />
              }
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Sign in
            </Button>
            <Button
              fullWidth
              variant="contained"
              className={classes.submit}
            >
              Sign up
            </Button>
          </form>
        </Paper>
      </main>
    )
  }
}

export default withRouter(withStyles(styles)(SignIn))
