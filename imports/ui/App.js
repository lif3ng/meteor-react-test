import React, { Component } from 'react';
import ReactDom from 'react-dom'
import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data';
 
import { Tasks } from '../api/tasks.js';

import Task from './Task.js'
import AccountsUIWrapper from './AccountsUIWrapper'

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            hideCompleted: false
        }
    }
    handleSubmit(event) {
        event.preventDefault();

        const text = ReactDom.findDOMNode(this.refs.textInput).value.trim();

        // Tasks.insert({
        //     text,
        //     createdAt: new Date(),
        //     owner: Meteor.userId(),
        //     username: Meteor.user().username,
        // })
        Meteor.call('tasks.insert', text);

        ReactDom.findDOMNode(this.refs.textInput).value = ''
    }
    renderTask(){
        let filteredTasks = this.props.tasks;
        if(this.state.hideCompleted){
            filteredTasks = filteredTasks.filter(task => !task.checked)
        }
        // return filteredTasks.map((task)=>(
        //     <Task key={task._id} task={task} />
        // ))
        return filteredTasks.map((task) => {
          const currentUserId = this.props.currentUser && this.props.currentUser._id;
          const showPrivateButton = task.owner === currentUserId;

          return (
            <Task
              key={task._id}
              task={task}
              showPrivateButton={showPrivateButton}
            />
          )
        })
    }
    toggleHideCompleted(){
        this.setState({
            hideCompleted:!this.state.hideCompleted
        })
    }
    render() {
        return(
        <div className="container">
            <header>
                <h1>Todo List ({this.props.incompleteCount})</h1>

                <label className="hide-completed">
                    <input
                    type="checkbox"
                    readOnly
                    checked={this.state.hideCompleted}
                    onClick={this.toggleHideCompleted.bind(this)}
                    />
                    Hide Completed Tasks
                </label>

                <AccountsUIWrapper />
                {
                    this.props.currentUser ?
                    <form className="new-task" onSubmit={this.handleSubmit.bind(this)}>
                        <input
                        type="text"
                        ref="textInput"
                        placeholder="Type to add new Tasks"
                        />
                    </form>
                    :''
                }
                

            </header>
            <ul>
                {this.renderTask()}
            </ul>
        </div>
        );
    }
}

export default withTracker(() => {
    Meteor.subscribe('tasks');

    return {
        tasks: Tasks.find({}, { sort: { createdAt: -1 } }).fetch(),
        incompleteCount: Tasks.find({ checked: { $ne: true }}).count(),
        currentUser: Meteor.user(),
    }
})(App)