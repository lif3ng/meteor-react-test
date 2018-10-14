import React, { Component } from 'react';
import ReactDom from 'react-dom'
import { withTracker } from 'meteor/react-meteor-data';
 
import { Tasks } from '../api/tasks.js';
 

import Task from './Task.js'

class App extends Component {
    handleSubmit(event) {
        event.preventDefault();

        const text = ReactDom.findDOMNode(this.refs.textInput).value.trim();
        console.log({text})

        Tasks.insert({
            text,
            createdAt: new Date(),
        })

        ReactDom.findDOMNode(this.refs.textInput).value = ''
    }
    renderTask(){
        return this.props.tasks.map((task)=>(
            <Task key={task._id} task={task} />
        ))
    }
    render() {
        return(
        <div className="container">
            <header>
                <h1>Todo List</h1>

                <form className="new-task" onSubmit={this.handleSubmit.bind(this)}>
                    <input
                     type="text"
                     ref="textInput"
                     placeholder="Type to add new Tasks"
                    />
                </form>

            </header>
            <ul>
                {this.renderTask()}
            </ul>
        </div>
        );
    }
}

export default withTracker(() => {
    return {
        tasks: Tasks.find({}, { sort: { createdAt: -1 } }).fetch()
    }
})(App)