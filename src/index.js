import ReactDOM from 'react-dom';
import React,{useEffect, useState} from 'react';
import './index.css';
import * as serviceWorker from './serviceWorker';
import './App.css';
import Axios from 'axios'
import { Provider, useSelector, useDispatch } from 'react-redux';
import { createStore, applyMiddleware, combineReducers  } from 'redux';
import promiseMiddleware from 'redux-promise';
import ReduxThunk from 'redux-thunk';
import { BrowserRouter, Route, Switch, Link } from "react-router-dom"
// Id 18924
// Client Secret jc3oSbdguMBJ7MwimeH8kA((
// key 6)zESuXpc55o6lZ3o4psDQ((
  Axios.defaults.baseURL = "https://api.stackexchange.com"


function Navbar() {
  const [InputSeach, setInputSeach] = useState("")
  const searchOnSite = (e) => {
    e.preventDefault();
    console.log(InputSeach)
  }
  return (
  <header >
    
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
    <Link to="/" className="navbar-brand" >StackOverfowClone</Link>
    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarColor01" aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>

    <div className="collapse navbar-collapse" id="navbarColor01">
      <ul className="navbar-nav navbar-nav-ul ">
        <li className="nav-item active">
          <a className="nav-link" href="#">Home</a>
        </li>
      
        <li className="nav-item">
          <a className="nav-link" href="#">Users</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#">Tags</a>
        </li>
      </ul>
      <form className="form-inline form-search-from-navbar" onSubmit={(e) => searchOnSite(e)}>
        <input value={InputSeach} onChange={(e) => setInputSeach(e.target.value)} className="navbar-header-input form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search"/>
        <button className="btn btn-warning  my-2 my-sm-0" type="submit">Search</button>
      </form>
      <div>
        { 0 ?
      <Link className="login" to="/">Login</Link>
      : 
      <Link className="navbar-avatar" to="/">
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcT3xHmzcFHcJOB5TFKxk4RNHFwc8nF0HQZwhw&usqp=CAU" />
      </Link>

        }
      </div>
    </div>
  </nav>
  </header>
  
  )

}
class Start extends React.Component {
  constructor() {
    super();
    
    this.state ={
    }
  }
  componentDidMount() {
  
  console.log(Axios.get("/2.2/answers?order=desc&sort=activity&site=stackoverflow"));
  }
  render() {
  return (<h1>hi from start</h1>)
}}

class App extends React.Component{
  constructor() {
    super();
    
    this.state ={
    }
  }
  componentDidMount() {
    window.SE.init({
      clientId: 18924, 
      key: '6)zESuXpc55o6lZ3o4psDQ((', 
      channelUrl: 'http://0aac1efb2a6f.ngrok.io/',
      complete: function(data) { 
          console.log(data)
      }
  })
  }
  render() {
  return (
    
    <div className="App">
      <Navbar/>
      <Switch>
        <Route exact path="/" component={Start} />
      </Switch>
    </div>
  );
  }
}

function redux (state = {}, action) {

  switch (action.type) {
      
      default:
          return state;
  }
}


const rootReducer = combineReducers({
  redux
});
const createStoreWithMiddleware = applyMiddleware(promiseMiddleware, ReduxThunk)(createStore);

ReactDOM.render(
  <Provider
      store={createStoreWithMiddleware(
          rootReducer,
          window.__REDUX_DEVTOOLS_EXTENSION__ &&
          window.__REDUX_DEVTOOLS_EXTENSION__()
      )}
  >
  <React.StrictMode>
    <BrowserRouter>
      <Switch>
        <Route  path="/" component={App} />
      </Switch>
      </BrowserRouter>
  </React.StrictMode>
  </Provider>,
  document.getElementById('root')
);

serviceWorker.unregister();
