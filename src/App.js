import React from 'react';
import './App.css';
import axios from 'axios'
import { BrowserRouter, Route, Switch, Link } from "react-router-dom"
function start () {
  return <h1>hi from start</h1>
}
function App() {
  return (
    <div className="App">
      <header >
        <Link to="/">StackOverfowClone</Link>
      </header>
      <Switch>
        <Route exact path="/" component={start} />
      </Switch>
    </div>
  );
}

export default App;
