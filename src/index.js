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
  // 14464780
// VhJOwhDs5V3zDbixqZwT7A))
function timeConverter(UNIX_timestamp){
  var a = new Date(UNIX_timestamp * 1000);
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
  return time;
}
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
          <Link className="nav-link" to="/">Questions</Link>
        </li>
      
        <li className="nav-item">
          <Link className="nav-link" to="/users">Users</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/tags">Tags</Link>
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
function Questions(props) {
  const [Questions, setQuestions] = useState([])
  const [SortBy, setSortBy] = useState("activity")
  const [Page, setPage] = useState(1)
  const [SortOrder, setSortOrder] = useState("desc")
  const [HasMore, setHasMore] = useState(false)
  let id_for_scroll = "l"+(Questions.length-1);
  const tagForSearch =  props.match.params.tag

  useEffect(() => {
    
     Axios.get(`/2.2/questions?page=${1}&pagesize=50&order=${SortOrder}&sort=${SortBy}&site=stackoverflow${tagForSearch ? `&tagged=${tagForSearch}` : ""}`).then((data) => {
      setHasMore(data.data.has_more);
      setQuestions([...data.data.items]);
      setPage(1)
      id_for_scroll = "l"+(Questions.length-1);
    })
}, [SortOrder, SortBy])
  const setMoreQuestions = () => {
    Axios.get(`/2.2/questions?page=${Page+1}&pagesize=50&order=${SortOrder}&sort=${SortBy}&site=stackoverflow`).then((data) => {
      setHasMore(data.data.has_more);
      setQuestions([...Questions,...data.data.items]);
      setPage(Page+1);
      id_for_scroll = "l"+(Questions.length-1);
      console.log(id_for_scroll)
    })
  }
  const getQuestions = (variables) => {
    Axios.get(`/2.2/questions?page=${variables.Page}&pagesize=50&order=${variables.SortOrder}&sort=${variables.SortBy}&site=stackoverflow${tagForSearch ? `&tagged=${tagForSearch}` : ""}`)

  }
    
   console.log(id_for_scroll)
return (<div className="questionsComponent">
  <div className="questionsControl">
    <div className="questionsControlOrder">
      <button onClick={() => SortOrder === "desc" ? setSortOrder("asc") : setSortOrder("desc")} className="questionsControlOrderBtn">
        {SortOrder === "desc" ? <i className="fas fa-angle-double-down"></i> : <i className="fas fa-angle-double-up"></i> }
      </button>
    </div> 
    <div className="questionsControlSortBy">
      <button className={(SortBy === "activity"?"active":"")} onClick={() => setSortBy("activity")}>
        activity
      </button>
      <button className={(SortBy === "votes"?"active":"")} onClick={() => setSortBy("votes")}>
        votes
      </button>
      <button className={(SortBy === "creation"?"active":"")} onClick={() => setSortBy("creation")}>
        creation
      </button>
    </div>
  </div>
  <div className="questionsQuestions">
  { console.log(Questions) }

    {Questions.map(
      (Question, Index) => <div id={"l"+Index} className={"QuestionRow "+ (("l"+Index) == id_for_scroll ? "": "under-line")} key={Index}>
          
          <div className="QuestionRowActivity">
            <div className={"QuestionRowActivityVotes "}>
              <div>
                <div className="number">{Question.score}</div>
                <div className="Word">Votes</div>
              </div>
            </div>
            <div className={"QuestionRowActivityAnswers "+((Question.is_answered)?"answered":"")}>
              <div>
                <div className="number">{Question.answer_count}</div>
                <div className="Word">Answers</div>
              </div>
            </div>
            <div className="QuestionRowActivityViews">
              <div>
                <div className="number">{Question.view_count}</div>
                <div className="Word">Views</div>
              </div>
            </div>
          </div>
          <div className="QuestionRowBody">
            <Link to={"/question/"+ Question.question_id} className="QuestionRowBodyTitle" dangerouslySetInnerHTML={{__html:Question.title}}>
              
            </Link>
            <ul className="QuestionRowBodyTags">
              {Question.tags.map((tag, tagIndex) => <li key={Index+tagIndex+Math.random()}>
              <Link to={"/questions/tagged/"+tag+"/"} >{tag}</Link>
              </li>)

              }
            </ul>
            <div className="QuestionRowBodyMetaInfo">
              <div className="QuestionRowBodyMetaDate">
                {timeConverter(Question.creation_date)} 
              </div>
              <Link to={"/users/"+(Question.owner.user_id)} className="QuestionRowBodyMetaLink" dangerouslySetInnerHTML={{__html:Question.owner.display_name}}>

              </Link>
              <div className="QuestionRowBodyMetaReputationOfUser">
                {Question.owner.reputation} 
              </div>
            </div>
        </div>
        </div>
    )}
  </div>
  {HasMore ?
  <a href={"#"+id_for_scroll} onClick={() => setMoreQuestions()} className="LoadMoreBtn">
    Load More
  </a> : ""
}
</div>)
}


function Question(props) {
  return(<div>
    gg
  </div>)
}

function decodecsharp(str){
  return str.replace(/#/g,"%23")
}

function Tag({tag,id}) {
  const [Wiki, setWiki] = useState(" ");
  useEffect(() => {
    Axios.get(decodecsharp(`/2.2/tags/${tag.name}/wikis?site=stackoverflow`)).then((data) => {
     setWiki(data.data.items[0].excerpt)
   })
}, [])


  return(<div id={id} className="TagComponent">
    <Link to={"/questions/tagged/"+tag.name+"/"}>{tag.name}</Link>
    <div className="TagComponentWiki"  dangerouslySetInnerHTML={{__html:Wiki}}></div>
    <div className="TagComponentQuestions">Questions: {tag.count}</div>
  </div>)
}

function Tags(props) {
  const [Tags, setTags] = useState([])
  const [SortBy, setSortBy] = useState("popular")
  const [Page, setPage] = useState(1)
  const [SortOrder, setSortOrder] = useState("desc")
  const [HasMore, setHasMore] = useState(false)
  let id_for_scroll = "l"+(Tags.length-1);
  const tagForSearch = props.match.params.tag

  useEffect(() => {
    
     Axios.get(`/2.2/tags?page=${Page}&pagesize=50&order=${SortOrder}&sort=${SortBy}&site=stackoverflow`).then((data) => {
      setHasMore(data.data.has_more);
      setTags([...data.data.items]);
      setPage(1)
      id_for_scroll = "l"+(Tags.length-1);
      console.log(Tags)
    })
}, [SortOrder, SortBy])
  const setMoreQuestions = () => {
    Axios.get(`/2.2/tags?page=${Page+1}&pagesize=50&order=${SortOrder}&sort=${SortBy}&site=stackoverflow`).then((data) => {
      setHasMore(data.data.has_more);
      setTags([...Tags,...data.data.items]);
      setPage(Page+1);
      id_for_scroll = "l"+(Tags.length-1);
    }) 
  }
    
return (<div className="questionsComponent">
          <div className="questionsControl">

    <div className="questionsControlOrder">
      <button onClick={() => SortOrder === "desc" ? setSortOrder("asc") : setSortOrder("desc")} className="questionsControlOrderBtn">
        {SortOrder === "desc" ? <i className="fas fa-angle-double-down"></i> : <i className="fas fa-angle-double-up"></i> }
      </button>
    </div> 
    <div className="questionsControlSortBy">
      <button className={(SortBy === "popular"?"active":"")} onClick={() => setSortBy("popular")}>
        popular
      </button>
      <button className={(SortBy === "activity"?"active":"")} onClick={() => setSortBy("activity")}>
        activity
      </button>
      <button className={(SortBy === "name"?"active":"")} onClick={() => setSortBy("name")}>
        creation
      </button>
    </div>
    </div>

  {console.log(Tags)}
  <div className="TagsMap">
  {
    Tags.map((tag, index) => <Tag id={"l"+index} tag={tag} key={index}></Tag>)
  }
  </div>
  {HasMore ?
  <a href={"#"+id_for_scroll} onClick={() => setMoreQuestions()} className="LoadMoreBtn">
    Load More
  </a> : ""
}
</div>);
}

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
      channelUrl: 'http://a1895d4930b9.ngrok.io',
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
        <Route exact path="/" component={Questions} />
        <Route exact path="/questions" component={Questions} />
        <Route exact path="/questions/tagged/:tag" component={Questions} />
        <Route exact path="/question/:questionId" component={Question} />
        <Route exact path="/tags" component={Tags} />


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
