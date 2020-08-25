import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import Main from './Main'
import '../assets/styles/App.css'

export default () => {

  return (
    <div className="app">
      <Router>
        <Main />
      </Router>
    </div>
  )
}
