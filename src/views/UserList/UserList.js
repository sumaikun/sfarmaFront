import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';

import { UsersToolbar, UsersTable } from './components';

import { connect } from 'react-redux';

import { getUsers , getUser } from 'actions/users';

const useStyles = theme => ({
  root: {
    padding: theme.spacing(3)
  },
  content: {
    marginTop: theme.spacing(2)
  }
});



class UserList extends Component{
  
  
  constructor(props){
    super(props)
    console.log("userlist props",props)
    this.state = {
      users:[]
    }
    this.createButton = this.createButton.bind(this)
    this.editButton = this.editButton.bind(this)
    this.deleteButton = this.deleteButton.bind(this)
    this.filteredUsers = this.filteredUsers.bind(this)
    this.addSelectedUser = this.addSelectedUser.bind(this)   
  }

  componentDidMount(){
    
    this.props.getUsers((success,error)=>{
      this.setState({
        ...this.state,
        users:this.props.usersState.users,
        selectedUser:null,
      })
    })
    
    
  
  }

  addSelectedUser(id){

    let user = this.state.users.filter( user =>  user._id === id )[0]
    
    this.setState({
      ...this.state,
      selectedUser:user,
    })

  }

  createButton(){
    console.log("create Button",this);
    this.props.getUser(null)
    this.props.history.push('/users/form')
  }

  editButton(){
    console.log("edit Button");
    let self = this
    this.props.getUser(this.state.selectedUser._id,(success, error)=>{
      if(success)
      {
        self.props.history.push('/users/form')
      }
    })
  }

  deleteButton(){
    console.log("delete Button");
  }

  filteredUsers(data){
    //console.log("data",data)
    //return this.props.usersState.users
    
    if(data.length == 0)
    {
      this.setState({
        ...this.state,
        users:this.props.usersState.users
      })
    }else
    {
      data = data.toLowerCase()

      const filteredArray = this.props.usersState.users.filter( user => 
        user.name.toLowerCase().includes(data) ||
        user.email.toLowerCase().includes(data) || 
        user.lastName.includes(data) || 
        user.date.includes(data) 
        )

      this.setState({
          ...this.state,
          users:filteredArray
      })

    }

  }

  shouldComponentUpdate(nextProps, nextState) {
    //console.log("should update");
    return nextProps === this.props
  }

  render(){    
    const { classes } = this.props;

 


    return (
      <div className={classes.root}>
        <UsersToolbar
          selectedUser={this.state.selectedUser}  
          createButton={this.createButton} 
          editButton={this.editButton}
          deleteButton={this.deleteButton}
          filteredUsers={this.filteredUsers} />
        <div className={classes.content}>
          <UsersTable  addSelectedUser={this.addSelectedUser} users={this.state.users} />
        </div>
      </div>
    );  
  }
} 


const mapStateToProps = state => {
 
  return {
    usersState: state.users,  
  };
}

UserList.propTypes = {
  classes: PropTypes.object.isRequired,
};

const componentDefinition =  withStyles(useStyles)(UserList);

export default  connect(mapStateToProps, { getUsers , getUser } )(componentDefinition);

//export default componentDefinition
