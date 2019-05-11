import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import { withRouter } from 'react-router-dom'
import Avatar from '@material-ui/core/Avatar'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions'
import Typography from '@material-ui/core/Typography'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import Divider from '@material-ui/core/Divider'
import Button from '@material-ui/core/Button'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

import WorkspaceDialog from '../subcomponents/WorkspaceDialog'
import InvitationDialog from '../subcomponents/InvitationDialog'

import axios from 'axios'
import store from '../../store';


const styles = theme => ({
  workspaceContainer: {
    flexGrow: 1,
    margin: theme.spacing.unit * 3,
  },
  expansionSummary: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
  },
  title: {
    marginLeft: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'baseline',
  },
  workDescription: {
    marginLeft: theme.spacing.unit,
    marginBottom: theme.spacing.unit * 2,
  },
  heading: {
    marginLeft: theme.spacing.unit * 2
  },
  userDetail: {
    marginRight: theme.spacing.unit * 3
  },
  details: {
    paddingLeft: theme.spacing.unit * 3,
    paddingRight: theme.spacing.unit * 3,
    alignItems: 'center',
  },
  addPeople: {
    marginTop: theme.spacing.unit,
  },
  button: {
    marginLeft: theme.spacing.unit,
  }
})

class WMemberManager extends React.Component {
  state = {
    invitationOpen: false,
    anchorEl: null,
    deleteAnchorEl: null,
    editOpen: false,
    deleteOpen: false,
  }

  isAdmin = () => {
    const { wmember } = this.props
    const you = store.getUser()
    for (let item of wmember) {
      if (item.uemail === you.uemail) {
        return true
      }
    }
    return false
  }

  handleMenuClick = event => {
    this.setState({
      anchorEl: event.currentTarget
    })
  }

  handleMenuClose = () => {
    this.setState({
      anchorEl: null
    })
  }

  handleInvitationDialogOpen = () => {
    this.setState({
      invitationOpen: true
    })
  }

  handleInvitationDialogClose = () => {
    this.setState({
      invitationOpen: false
    })
  }

  handleEditToggle = () => {
    const editOpen = this.state.editOpen
    this.setState({
      editOpen: !editOpen
    })
  }

  handleDeleteOpen = event => {
    this.setState({
      deleteAnchorEl: event.currentTarget
    })
  }

  handleDeleteClose = () => {
    this.setState({
      deleteAnchorEl: null
    })
  }

  handleDelete = async () => {
    const token = store.getToken()
    const wid = this.props.currentWorkspace.wid
    try {
      await axios.delete(`/workspace/${wid}`, {
        headers: {'Authorization': `bearer ${token}`}
      })
      this.props.history.push('/')
    } catch(error) {
      console.error(error)
    }
  }

  handleChangeUser = (uemail, newType) => async () => {
    const wid = this.props.currentWorkspace.wid
    const token = store.getToken()


    this.props.updateMember(wid, token)
  }

  handleRemoveUser = uemail => async () => {
    const wid = this.props.currentWorkspace.wid
    const token = store.getToken()
    try {
      await axios.delete(`/wmember/${wid}/${uemail}`, {
        headers: {'Authorization': `bearer ${token}`}
      })
      this.props.updateMember(wid, token)
    } catch(error) {
      console.error(error)
    }
  }

  render() {
    const { classes, wmember, currentWorkspace } = this.props
    return (
      <div className={classes.workspaceContainer}>
        <div className={classes.title}>
          <Typography
            variant="h6"
          >
            Workspace Description
          </Typography>
          { this.isAdmin() &&
            <React.Fragment>
              <Button
                color="primary"
                onClick={this.handleEditToggle}
                className={classes.button}
              >
                Edit
              </Button>
              <WorkspaceDialog
                op="update"
                open={this.state.editOpen}
                currentWorkspace={currentWorkspace}
                handleClose={this.handleEditToggle}
              />
              <Button
                onClick={this.handleDeleteOpen}
              >
                Delete
              </Button>
              <Menu
                anchorEl={this.state.deleteAnchorEl}
                open={Boolean(this.state.deleteAnchorEl)}
                onClose={this.handleDeleteClose}
              >
                <MenuItem onClick={this.handleDeleteClose}>Cancel</MenuItem>
                <MenuItem onClick={this.handleDelete}>Confiem</MenuItem>
              </Menu>
            </React.Fragment>
          }
        </div>
        <Typography
          variant="body1"
          className={classes.workDescription}
        >
          {currentWorkspace.wdesc}
        </Typography>
        <Typography
          variant="h6"
          className={classes.title}
        >
          Workspace Members
        </Typography>
        { wmember && wmember.map(item => {
          const you = store.getUserName() === item.nickname ? ' (You)' : ''
          return (
            <ExpansionPanel
              key={item.uemail}
            >
              <ExpansionPanelSummary
                expandIcon={<ExpandMoreIcon />}
              >
                <div className={classes.expansionSummary}>
                  <Avatar>
                    {item.nickname[0]}
                  </Avatar>
                  <Typography
                    variant="h6"
                    color="primary"
                    className={classes.heading}
                  >
                    {`${item.nickname}${you}`}
                  </Typography>
                </div>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails className={classes.details}>
                <div
                  className={classes.userDetail}
                >
                  <Typography variant="subtitle2">
                    Email:
                  </Typography>
                  <Typography variant="body2">
                    {item.uemail}
                  </Typography>
                </div>
                <div
                  className={classes.userDetail}
                >
                  <Typography variant="subtitle2">
                    Full Name:
                  </Typography>
                  <Typography variant="body2">
                    {item.uname}
                  </Typography>
                </div>
                <div
                  className={classes.userDetail}
                >
                  <Typography variant="subtitle2">
                    User Type:
                  </Typography>
                  <Typography variant="body2">
                    {item.wmtype}
                  </Typography>
                </div>
              </ExpansionPanelDetails>
              {
                this.isAdmin() &&
                <div>
                  <Divider />
                  <ExpansionPanelActions>
                    <Button
                      size="small"
                      onClick={this.handleMenuClick}
                    >
                      Change Type
                    </Button>
                    <Button
                      size="small"
                      onClick={this.handleRemoveUser(item.uemail)}
                    >
                      Remove
                    </Button>
                  </ExpansionPanelActions>
                </div>
              }
              <Menu
                anchorEl={this.state.anchorEl}
                open={Boolean(this.state.anchorEl)}
                onClose={this.handleMenuClose}
              >
                <MenuItem onClick={this.handleChangeUser(item.uemail, 'admin')}>Admin</MenuItem>
                <MenuItem onClick={this.handleChangeUser(item.uemail, 'user')}>User</MenuItem>
              </Menu>
            </ExpansionPanel>
          )
        })}
        {!wmember &&
          <Typography
            variant="subtitle2"
          >
            You have no member in this work space yet.
          </Typography>
        } {
          this.isAdmin() &&
          <React.Fragment>
            <Button
              className={classes.addPeople}
              color="primary"
              onClick={this.handleInvitationDialogOpen}
            >
              Add More People...
            </Button>
            <InvitationDialog
              open={this.state.invitationOpen}
              currentWorkspace={currentWorkspace}
              handleClose={this.handleInvitationDialogClose}
            />
          </React.Fragment>
        }
      </div>
    )
  }
}

WMemberManager.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withRouter(withStyles(styles)(WMemberManager))
