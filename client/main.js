import React from 'react'
import {render} from 'react-dom'
import {Meteor} from 'meteor/meteor'

import './main.html';
import APP from '../imports/ui/App'

Meteor.startup(()=>{
  render(<APP />, document.getElementById('render-target'))
})