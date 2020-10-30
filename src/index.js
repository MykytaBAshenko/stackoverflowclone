import ReactDOM from 'react-dom';
import React, { useEffect, useState } from 'react';
import * as serviceWorker from './serviceWorker';
import './App.css';
import Axios from 'axios'
import { Provider, useSelector, useDispatch } from 'react-redux';
import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import promiseMiddleware from 'redux-promise';
import thunk from 'redux-thunk';
import Cookie from 'js-cookie';
import { BrowserRouter, Route, Switch, Link } from "react-router-dom"
// Id 18924
// Client Secret jc3oSbdguMBJ7MwimeH8kA((
// key 6)zESuXpc55o6lZ3o4psDQ((
Axios.defaults.baseURL = "https://api.stackexchange.com"
// 14464780
// VhJOwhDs5V3zDbixqZwT7A))
function timeConverter(UNIX_timestamp) {
  var a = new Date(UNIX_timestamp * 1000);
  var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec;
  return time;
}



function Question_about(props) {
  return (
    <div className="QuestionAbout" dangerouslySetInnerHTML={{ __html: props.question.body }}>

    </div>
  )

}

function Questions(props) {
  const [Questions, setQuestions] = useState([])
  const [SortBy, setSortBy] = useState("activity")
  const [Page, setPage] = useState(1)
  const [SortOrder, setSortOrder] = useState("desc")
  const [isShown, setIsShown] = useState(-1)

  const [HasMore, setHasMore] = useState(false)
  let id_for_scroll = "l" + (Questions.length - 1);
  const tagForSearch = props.match.params.tag

  useEffect(() => {

    Axios.get(`/2.2/questions?page=${1}&pagesize=50&order=${SortOrder}&sort=${SortBy}&filter=!9_bDDx5Ia&site=stackoverflow${tagForSearch ? `&tagged=${tagForSearch}` : ""}`).then((data) => {
      setHasMore(data.data.has_more);
      setQuestions([...data.data.items]);
      setPage(1)
      id_for_scroll = "l" + (Questions.length - 1);
    })
  }, [SortOrder, SortBy, window.location.href])
  const setMoreQuestions = () => {
    Axios.get(`/2.2/questions?page=${Page + 1}&pagesize=50&order=${SortOrder}&filter=!9_bDDx5Ia&sort=${SortBy}&site=stackoverflow`).then((data) => {
      setHasMore(data.data.has_more);
      setQuestions([...Questions, ...data.data.items]);
      setPage(Page + 1);
      id_for_scroll = "l" + (Questions.length - 1);
    })
  }
  return (<div className="questionsComponent">
    <div className="questionsControl">
      <div className="questionsControlOrder">
        <button onClick={() => SortOrder === "desc" ? setSortOrder("asc") : setSortOrder("desc")} className="questionsControlOrderBtn">
          {SortOrder === "desc" ? <i className="fas fa-angle-double-down"></i> : <i className="fas fa-angle-double-up"></i>}
        </button>
      </div>
      <div className="questionsControlSortBy">
        <button className={(SortBy === "activity" ? "active" : "")} onClick={() => setSortBy("activity")}>
          activity
      </button>
        <button className={(SortBy === "votes" ? "active" : "")} onClick={() => setSortBy("votes")}>
          votes
      </button>
        <button className={(SortBy === "creation" ? "active" : "")} onClick={() => setSortBy("creation")}>
          creation
      </button>
      </div>
    </div>
    <div className="questionsQuestions">


      {Questions.map(
        (Question, Index) => <div onMouseEnter={() => setIsShown(Question.question_id)} onMouseLeave={() => setIsShown(-1)} id={"l" + Index} className={"QuestionRow " + (("l" + Index) == id_for_scroll ? "" : "under-line")} key={Index}>

          <div className="QuestionRowActivity">
            <div className={"QuestionRowActivityVotes "}>
              <div>
                <div className="number">{Question.score}</div>
                <div className="Word">Votes</div>
              </div>
            </div>
            <div className={"QuestionRowActivityAnswers " + ((Question.is_answered) ? "answered" : "")}>
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
            <Link to={"/questions/" + Question.question_id} className="QuestionRowBodyTitle" dangerouslySetInnerHTML={{ __html: Question.title }}>

            </Link>
            <ul className="QuestionRowBodyTags">
              {Question.tags.map((tag, tagIndex) => <li key={Index + tagIndex + Math.random()}>
                <Link to={"/questions/tagged/" + tag + "/"} >{tag}</Link>
              </li>)

              }
            </ul>
            <div className="QuestionRowBodyMetaInfo">
              <div className="QuestionRowBodyMetaDate">
                {timeConverter(Question.creation_date)}
              </div>
              <Link to={"/users/" + (Question.owner.user_id)} className="QuestionRowBodyMetaLink" dangerouslySetInnerHTML={{ __html: Question.owner.display_name }}>

              </Link>
              <div className="QuestionRowBodyMetaReputationOfUser">
                {Question.owner.reputation}
              </div>
            </div>
          </div>
          {
            Question.question_id === isShown &&
            <Question_about question={Question} />
          }
        </div>
      )}
    </div>
    {HasMore ?
      <a href={"#" + id_for_scroll} onClick={() => setMoreQuestions()} className="LoadMoreBtn">
        Load More
  </a> : ""
    }
  </div>)
}


function QuestionBody(props) {
  const isPrime =(element, index, array) => {
    if(element.answer_id === props?.Question?.accepted_answer_id)
      return true
    return false
  }
  
  // useEffect(() => {
  //   console.log(QuestionId)
  //   if(QuestionId) 
   
  // }, [QuestionId,window.location.href])
  return (
    <div className="QuestionCompnentBody">
      <div className="QuestionComponentBodyTitle" dangerouslySetInnerHTML={{ __html: props.Question.title }}></div>
      <div className="QuestionComponentBodyMeta">
        <div className="QuestionMetaElement">
          <span>
            Created
          </span>
          <span>
            {timeConverter(props.Question.creation_date)}
          </span>
        </div>
        {props?.Question?.last_edit_date &&
          <div className="QuestionMetaElement">
            <span>
              Edited
          </span>
            <span>
              {timeConverter(props?.Question?.last_edit_date)}
            </span>
          </div>
        }
        <div className="QuestionMetaElement">
          <span>
            Viewed:
          </span>
          <span>
            {props?.Question?.view_count}
          </span>
        </div>
      </div>
      <div className="QuestionComponentBodyExact">
        <div className="QuestionCompnentVoteControl">
          <button onClick={() => props.upVote()}>
            up
          </button>
          <div>
            {props?.Question?.score}
          </div>
          <button onClick={() => props.downVote()}>
            down
          </button>
        </div>
        <div className="QuestionCompnentBody">
          <div className="QuestionCompnentBodyExact" dangerouslySetInnerHTML={{ __html: props?.Question?.body }}/>
          <ul>
            {
              props?.Question?.tags?.map((tag,index) => 
                <li key={index+Math.random()} dangerouslySetInnerHTML={{ __html:tag}}></li>
              )
            }
          </ul>
          <div>
          {props?.Question?.is_answered && <div>Answered <span>
            {timeConverter(props?.Question?.answers?.find(isPrime)?.last_edit_date)}
            </span></div>}
            <div>
              <img src={props?.Question?.owner?.profile_image}/>
              <div>
              <Link to={"/users/" + props?.Question?.owner?.user_id} dangerouslySetInnerHTML={{ __html:props?.Question?.owner?.display_name}}>
              </Link>
              <div>
              {props?.Question?.owner?.reputation}
              </div>
              </div>
            </div>
          </div>
        </div>
        <div className="comments">
    {props.Comments.map((question, index) => <div key={index+ Math.random()}>
      111
    </div>)}
  </div>
      </div>
    </div>
  )
}

function Answers(props) {
  return(<div>
    answers
  </div>)
}

function Question(props) {
  const [Comments, setComments] =useState([])
  const [Question, setQuestion] = useState([])
  const questionId = props.match.params.questionId
  const userSignin = useSelector(state => state.userSignin);
  const userInfo = userSignin;
  const [userAccount, setuserAccount] = useState([])
  const dispatch = useDispatch();

  const do_login = () => {
    window.SE.authenticate({
      success: function (data) {
        dispatch({ type: "USER_SIGNIN_SUCCESS", payload: data.accessToken });
        Cookie.set('userToken', JSON.stringify(data.accessToken));
      },
      error: function (data) {
        alert('An error occurred:\n' + data.errorName + '\n' + data.errorMessage);
      },
      networkUsers: true
    })
  }

  const upVote = () => {
    if (!userInfo) {
      do_login()
      return;
    }
    Axios.post(`/2.2/questions/${questionId}/upvote`, {
      body: {
        key: app_key,
        access_token: userInfo.userInfo,
        site: "stackoverflow"
      }
    }).then(resp => resp.text()).then(console.log);
  }
  const downVote = () => {
    if (!userInfo) {
      do_login()
      return;
    }
    Axios.post(`/2.2/questions/${questionId}/downvote`, {
      body: {
        key: app_key,
        access_token: userInfo.userInfo,
        site: "stackoverflow"
      }
    }).then(resp => resp.text()).then(console.log);
  }
  useEffect(() => {
    Axios.get(`/2.2/questions/${questionId}?order=desc&sort=activity&site=stackoverflow&filter=!gHxZH78yCuIaWIg7.*4vdWlEJvCPGislsl.`).then((data) => {
      setQuestion(data.data.items[0])
      console.log(data.data.items[0])
    })
    Axios.get(`/2.2/questions/${questionId}/comments?order=desc&sort=creation&site=stackoverflow`).then((data) => {
      console.log(...data.data.items)
      
      setComments([...data.data.items]);
    })
  }, [window.location.href])
  return (<div className="QuestionComponent">
    <QuestionBody Comments={Comments} downVote={downVote} upVote={upVote} Question={Question} />
    <Answers Question={Question}/>
  </div>)
}

function decodecsharp(str) {
  return str.replace(/#/g, "%23")
}

function Tag({ tag, id }) {
  const [Wiki, setWiki] = useState(" ");
  useEffect(() => {
    Axios.get(decodecsharp(`/2.2/tags/${tag.name}/wikis?site=stackoverflow`)).then((data) => {
      setWiki(data.data.items[0].excerpt)
    })
  }, [tag])


  return (<div id={id} className="TagComponent">
    <Link to={"/questions/tagged/" + tag.name + "/"}>{tag.name}</Link>
    <div className="TagComponentWiki" dangerouslySetInnerHTML={{ __html: Wiki }}></div>
    <div className="TagComponentQuestions">Questions: {tag.count}</div>
  </div>)
}

function Tags(props) {
  const [Tags, setTags] = useState([])
  const [SortBy, setSortBy] = useState("popular")
  const [Page, setPage] = useState(1)
  const [SortOrder, setSortOrder] = useState("desc")
  const [HasMore, setHasMore] = useState(false)
  const [TagSearch, setTagSearch] = useState("")

  let id_for_scroll = "l" + (Tags.length - 1);
  const tagForSearch = props.match.params.tag

  useEffect(() => {

    Axios.get(`/2.2/tags?page=${Page}&pagesize=2&order=${SortOrder}&sort=${SortBy}&site=stackoverflow${TagSearch ? `&inname=${TagSearch}` : ""}`).then((data) => {
      setHasMore(data.data.has_more);
      setTags([...data.data.items]);
      setPage(1)
      id_for_scroll = "l" + (Tags.length - 1);
    })
  }, [SortOrder, SortBy, TagSearch])
  const setMoreQuestions = () => {
    Axios.get(`/2.2/tags?page=${Page + 1}&pagesize=2&order=${SortOrder}&sort=${SortBy}&site=stackoverflow`).then((data) => {
      setHasMore(data.data.has_more);
      setTags([...Tags, ...data.data.items]);
      setPage(Page + 1);
      id_for_scroll = "l" + (Tags.length - 1);
    })
  }

  return (<div className="questionsComponent">
    <div className="questionsControl">
      <input value={TagSearch} onChange={(e) => setTagSearch(e.target.value)}></input>
      <div className="questionsControlOrder">
        <button onClick={() => SortOrder === "desc" ? setSortOrder("asc") : setSortOrder("desc")} className="questionsControlOrderBtn">
          {SortOrder === "desc" ? <i className="fas fa-angle-double-down"></i> : <i className="fas fa-angle-double-up"></i>}
        </button>
      </div>
      <div className="questionsControlSortBy">
        <button className={(SortBy === "popular " ? " active" : "")} onClick={() => setSortBy("popular")}>
          popular
      </button>
        <button className={(SortBy === "activity " ? " active" : "")} onClick={() => setSortBy("activity")}>
          activity
      </button>
        <button className={(SortBy === "name " ? " active" : "")} onClick={() => setSortBy("name")}>
          creation
      </button>
      </div>
    </div>

    <div className="TagsMap">
      {
        Tags.map((tag, index) => <Tag id={"l" + index} tag={tag} key={index}></Tag>)
      }
    </div>
    {HasMore ?
      <a href={"#" + id_for_scroll} onClick={() => setMoreQuestions()} className="btn btn-primary LoadMoreBtn">
        Load More
  </a> : ""
    }
  </div>);
}
const app_key = '6)zESuXpc55o6lZ3o4psDQ(('

function PostComponent(props) {
  const thisGavno = props?.Post;
  const [Post, setPost] = useState([])
  useEffect(() => {
    console.log(thisGavno)
    if ((thisGavno?.post_type === "answer" && props.type === "posts") || props.type === "answers") {
      Axios.get(`/2.2/answers/${(thisGavno?.answer_id ? thisGavno?.answer_id : thisGavno?.post_id)}?order=desc&sort=activity&site=stackoverflow&filter=!--1nZx.Tkxh*`).then((data) => {
        setPost(data?.data?.items[0])
      })
    } else
      if ((thisGavno?.post_type === "question" && props.type === "posts") || props.type === "questions") {
        Axios.get(`/2.2/questions/${thisGavno?.question_id ? thisGavno?.question_id : thisGavno?.post_id}?order=desc&sort=activity&site=stackoverflow&filter=!--1nZwQ5Qg.w`).then((data) => {
          setPost(data?.data?.items[0])
        })
      }
      else
        if (props.type === "favorites") {
          Axios.get(`/2.2/questions/${thisGavno?.question_id}?order=desc&sort=activity&site=stackoverflow&filter=!--1nZwQ5Qg.w`).then((data) => {
            setPost(data?.data?.items[0])
          })
        }


  }, [thisGavno])
  return (<div className="PostFromUserPage">
    <div className="PostFromUserPageType">{(thisGavno?.post_type) ? thisGavno?.post_type[0] : props.type[0]}</div>
    <div className={"PostFromUserPageScore " + ((Post?.is_accepted) ? "accepted" : "")}>{thisGavno?.score}</div>
    <Link className="PostFromUserPageLink" to={"/questions/" + Post?.question_id + ((thisGavno?.post_type === "answer" || props.type === "answers") ? "#answer-" + (Post?.answer_id) : "")}>{Post?.title}</Link>
    <div className="PostFromUserDate">{timeConverter(thisGavno?.creation_date)}</div>
  </div>)
}


function UserPagePostsComponent(props) {
  const [Posts, setPosts] = useState([])
  const [Page, setPage] = useState(1);
  const [PostsType, setPostsType] = useState("posts");
  const [PostsSort, setPostsSort] = useState("votes");
  const [HasMore, setHasMore] = useState(false);
  const user_id = props.User.user_id
  useEffect(() => {
    user_id &&
      Axios.get(`/2.2/users/${user_id}/${PostsType}?page=${1}&pagesize=1&order=desc&sort=${PostsSort}&site=stackoverflow&filter=!3zl2.9E7NQMVtI(Xo`).then((data) => {
        setHasMore(data.data.has_more);
        setPosts([...data.data.items]);
        setPage(1)
      })
  }, [PostsType, PostsSort, user_id, window.location.href])


  const setPagePost = (page) => {
    Axios.get(`/2.2/users/${user_id}/${PostsType}?page=${page}&pagesize=1&order=desc&sort=${PostsSort}&site=stackoverflow&filter=!3zl2.9E7NQMVtI(Xo`).then((data) => {
      setPage(page);
      setPosts([...data.data.items]);
      setHasMore(data.data.has_more);
    })
  }

  return (
    ((Posts.length && PostsType === "posts") || PostsType !== "posts") &&
    <div className="PostsComponent">
      <div className="PostsFilters">
        <div className="PostsFiltersType">
          <button onClick={() => setPostsType("posts")}>
            Q&A
          </button >
          <button onClick={() => setPostsType("questions")}>
            Questions
          </button>
          <button onClick={() => setPostsType("answers")}>
            Answers
          </button>
          <button onClick={() => setPostsType("favorites")}>
            favorites
          </button>

        </div>
        <div className="PostsFiltersSort">
          <button onClick={() => setPostsSort("votes")}>
            Votes
          </button>
          <button onClick={() => setPostsSort("creation")}>
            Newest
          </button>

        </div>
      </div>
      <div className="UserPostsExact">
        {Posts.map((Post, index) => <PostComponent Post={Post} type={PostsType} key={index} />)}
      </div>
      {((Page === 1 && HasMore && Posts.length) || (Page > 1)) &&
        <div className="UserPostsPageControl">
          {Page > 1 &&
            <button onClick={() => setPagePost(Page - 1)}>
              -1
        </button>
          }
          <div className="PostsList">
            {Page}
          </div>
          {HasMore &&
            <button onClick={() => setPagePost(Page + 1)}>
              1
        </button>
          }
        </div>
      }
    </div>
  )
}

function TimeLineComponent(props) {
  const [TimeLine, setTimeLine] = useState([]);
  const [Page, setPage] = useState(1)
  const [HasMore, setHasMore] = useState(false)
  const user_id = props.User.user_id
  useEffect(() => {
    user_id &&
      Axios.get(`/2.2/users/${user_id}/timeline?pagesize=40&page=${Page}&site=stackoverflow`).then(data => {
        setTimeLine(data.data.items)
        setHasMore(data.data.has_more);
        console.log(data.data.items)
      })
  }, [Page, user_id, window.location.href])
  return (
    TimeLine.length ?
      <div className="userPageTimeline">
        <div >
          TimeLine
        </div>
        <div className="userPageTimelineExact">
          {TimeLine.map((time, index) => <div key={index + Math.random()} className="TimeLineComponent">
            <div>{timeConverter(time.creation_date)}</div>
            <div>{time.timeline_type}</div>
            <Link to={"/questions/" + time.post_id}>{time.detail || time.title}</Link>
          </div>)}
        </div>
        <div className="UserPageCommentsControl">{
          Page > 1 &&
          <button onClick={() => setPage(Page - 1)}> -1</button>
        }
          <div>{Page}</div>{HasMore &&
            <button onClick={() => setPage(Page + 1)}>  1</button>
          }
        </div>
      </div> : <></>
  )
}

function UserPageComments(props) {
  const [Comments, setComments] = useState([])
  const [Page, setPage] = useState(1)
  const [HasMore, setHasMore] = useState(false)

  const user_id = props.User.user_id
  useEffect(() => {
    user_id &&
      Axios.get(`/2.2/users/${user_id}/comments?order=desc&pagesize=4&page=${Page}&sort=creation&site=stackoverflow&filter=!--1nZxT0.tIV`).then(data => {
        setComments(data.data.items)
        setHasMore(data.data.has_more);
      })
  }, [Page, user_id, window.location.href])
  return (
    Comments.length ?
      <div className="UserPageCommentsMap">
        <div>
          Comments
      </div>
        <div className="UserPageCommentsMapExact">
          {Comments.map((comment, index) => <div className="UserPageComment" key={index * Math.random()}>
            <Link to={`/questions/` + comment.post_id + "#comment-" + comment.comment_id} dangerouslySetInnerHTML={{ __html: comment.body }}></Link>
            <div>{timeConverter(comment.creation_date)}</div>
          </div>)}
        </div>
        <div className="UserPageCommentsControl">{
          Page > 1 &&
          <button onClick={() => setPage(Page - 1)}> -1</button>
        }
          <div>{Page}</div>{HasMore &&
            <button onClick={() => setPage(Page + 1)}>  1</button>
          }
        </div>
      </div> : <></>
  )
}

function User(props) {
  const [User, setUser] = useState([]);
  const idForSearch = props.match.params.id
  const [Tags, setTags] = useState([]);
  const [PostType, setPostType] = useState("posts");
  const [Privileges, setPrivileges] = useState([])
  const [Associated, setAssociated] = useState([])

  useEffect(() => {

    Axios.get(`/2.2/users/${idForSearch}/privileges?site=stackoverflow`).then(data => {
      setPrivileges(data.data.items)
    })
    Axios.get(`/2.2/users/${idForSearch}/associated`).then(data => {
      setAssociated(data.data.items)
    })
    Axios.get(`/2.2/users/${idForSearch}?order=desc&sort=reputation&site=stackoverflow&filter=!b6Aub2or8vkePb`).then((data) => {
      setUser(data.data.items[0])

    })
    Axios.get(`/2.2/users/${idForSearch}/tags?order=desc&sort=popular&site=stackoverflow`).then((data) => {
      setTags(data.data.items)
    })
  }, [window.location.href])
  return (<div className="userPage">
    <div className="userPageShell">
      <div className="userPageHeader">
        <div className="userPageImage">
          <img src={User.profile_image}></img>
          <div>Reputation: {User.reputation}</div>
          <div className="Badges">
            <div className="gold"> {User?.badge_counts?.gold}</div>
            <div className="silver"> {User?.badge_counts?.silver}</div>
            <div className="bronze"> {User?.badge_counts?.bronze}</div>
          </div>
        </div>
        <div className="userPageAbout">
          <h1 className="userPageName" dangerouslySetInnerHTML={{ __html: User.display_name }}></h1>
          <div className="userPageLastTime" dangerouslySetInnerHTML={{ __html: `Last time active ${timeConverter(User.last_access_date)}` }}></div>
          <div className="userPageLocation" dangerouslySetInnerHTML={{ __html: `<i class="fa fa-location"></i> ${User.location}` }}></div>
          <div className="userPageAbout" dangerouslySetInnerHTML={{ __html: User.about_me }}>
          </div>
        </div>
      </div>
      <ul className="Tags">
        {Tags.map((tag, index) => <li key={index + "" + tag.count}>
          <span className="userPageTagName">{tag.name}</span>
          <span className="userPageTagCount">{tag.count}</span>
        </li>)}
      </ul>
      <div className="userPagePosts">
        <UserPagePostsComponent User={User} />
      </div>
      <div className="userPageComments">
        <UserPageComments User={User} />
      </div>
      <div className="userPagePrivileges">
        <div>
          Privileges
        </div>
        <div className="userPagePrivilegesExact">
          {Privileges.map((map, index) => <div className="Privilege" key={index * Math.random()}>
            {map.short_description}
          </div>)}
        </div>
      </div>
      {Associated.length &&
        <div className="userPageAssociated">
          <div className="">
            Associated accounts
          </div>
          <div className="UsersMap">
            {Associated.map((accc, index) => <UserAssociated acc={accc} key={index} />)}
          </div>
        </div>
      }

      <TimeLineComponent User={User} />

    </div>

  </div>)
}

function UserAssociated(props) {
  const acc = props.acc
  const [user, setUser] = useState({})
  useEffect(() => {
    Axios.get(`/2.2/users/${acc.user_id}?order=desc&sort=reputation&site=stackoverflow&filter=!b6Aub2or8vkePb`).then((data) => {
      setUser(data.data.items[0])
      console.log(data.data, acc)
    }
    )
  }, [window.location.href])
  return (user && <div className={"UserCell "}>


    <div className={"UserCellShell "}>
      <div className="FirstInfo">
        <Link to={"/users/" + user?.user_id}>
          <img src={user?.profile_image} alt={user?.display_name} />
        </Link>
        <div className="FirstInfoAbout">
          <Link to={"/users/" + user?.user_id} dangerouslySetInnerHTML={{ __html: user?.display_name }}></Link>
          <div className="locationUserCell" dangerouslySetInnerHTML={{ __html: `<i class="fa fa-location"></i> ${user?.location}` }}></div>
          <div className="reputationUserCell">Reputation: {user?.reputation}</div>

        </div>
      </div>
    </div>

  </div> || null)
}


class App extends React.Component {
  constructor() {
    super();

    this.state = {
    }
  }
  componentDidMount() {
    window.SE.init({
      clientId: 18924,
      key: '6)zESuXpc55o6lZ3o4psDQ((',
      channelUrl: 'http://c574f875d0fa.ngrok.io',
      complete: function (data) {
        // console.log(data)
      }
    })
  } 
  render() {
    return (
      <div className="App">
        <Navbar />
        <Switch> 
          <Route exact path="/" component={Questions} />
          <Route exact path="/questions" component={Questions} />
          <Route exact path="/questions/tagged/:tag" component={Questions} />
          <Route exact path="/questions/:questionId" component={Question} />
          <Route exact path="/tags" component={Tags} />
          <Route exact path="/users" component={Users} />
          <Route exact path="/users/:id" component={User} />



        </Switch>
      </div>
    );
  }
}

function UserCell(props) {
  let user = props.user
  const [favoritTags, setFavoriteTags] = useState([]);
  const [IsShown, setIsShown] = useState(false)
  useEffect(() => {
    Axios.get(decodecsharp(`/2.2/users/${user.user_id}/tags?order=desc&sort=popular&site=stackoverflow`)).then((data) => {
      setFavoriteTags(data.data.items)
    })
  }, [])

  return (
    <div className={"UserCell " + (IsShown ? "MoreGrey" : "")} onMouseEnter={() => setIsShown(true)} onMouseLeave={() => setIsShown(false)}>
      <div className={"UserCellShell "}>
        <div className="FirstInfo">
          <Link to={"/users/" + user.user_id}>
            <img src={user.profile_image} alt={user.display_name} />
          </Link>
          <div className="FirstInfoAbout">
            <Link to={"/users/" + user.user_id} dangerouslySetInnerHTML={{ __html: user.display_name }}></Link>
            <div className="locationUserCell" dangerouslySetInnerHTML={{ __html: `<i class="fa fa-location"></i> ${user.location}` }}></div>
            <div className="reputationUserCell">Reputation: {user.reputation}</div>
            <ul className="ulUserCell">
              {favoritTags.map((tag, index) => index < 5 && <li key={user.user_id * index + Math.random() + 12345}>{tag.name}</li>)}
            </ul>
          </div>
        </div>
        {
          IsShown && <div className=" absolutePosition">
            <div className="Badges">
              <div className="gold"> {user.badge_counts.gold}</div>
              <div className="silver"> {user.badge_counts.silver}</div>
              <div className="bronze"> {user.badge_counts.bronze}</div>

            </div>
            <div className={"AboutUserCell"} dangerouslySetInnerHTML={{ __html: user.about_me }} >

            </div>
          </div>
        }
      </div>
    </div>
  )

}

function Users(props) {
  const [Users, setUsers] = useState([])
  const [SortBy, setSortBy] = useState("reputation")
  const [Page, setPage] = useState(1)
  const [SortOrder, setSortOrder] = useState("desc")
  const [HasMore, setHasMore] = useState(false)
  let id_for_scroll = "l" + (Users.length - 1);

  useEffect(() => {

    Axios.get(`/2.2/users?page=${Page}&pagesize=3&order=${SortOrder}&sort=${SortBy}&site=stackoverflow&filter=!b6Aub2or8vkePb`).then((data) => {
      setHasMore(data.data.has_more);
      setUsers([...data.data.items]);
      setPage(1)
      id_for_scroll = "l" + (Users.length - 1);
    })
  }, [SortOrder, SortBy])
  const setMoreQuestions = () => {
    Axios.get(`/2.2/users?page=${Page + 1}&pagesize=3&order=${SortOrder}&sort=${SortBy}&site=stackoverflow&filter=!b6Aub2or8vkePb`).then((data) => {
      setHasMore(data.data.has_more);
      setUsers([...Users, ...data.data.items]);
      setPage(Page + 1);
      id_for_scroll = "l" + (Users.length - 1);
    })
  }


  return (
    <div className="UsersComponent">
      <div className="questionsControl">
        <div className="questionsControlOrder">
          <button onClick={() => SortOrder === "desc" ? setSortOrder("asc") : setSortOrder("desc")} className="questionsControlOrderBtn">
            {SortOrder === "desc" ? <i className="fas fa-angle-double-down"></i> : <i className="fas fa-angle-double-up"></i>}
          </button>
        </div>
        <div className="questionsControlSortBy">
          <button className={(SortBy === "reputation" ? "active" : "")} onClick={() => setSortBy("reputation")}>
            popular
          </button>
          <button className={(SortBy === "creation" ? "active" : "")} onClick={() => setSortBy("creation")}>
            creation
          </button>
          <button className={(SortBy === "name" ? "active" : "")} onClick={() => setSortBy("name")}>
            name
          </button>
        </div>
      </div>
      <div className="UsersMap">
        {
          Users.map((user, index) =>

            <UserCell user={user} key={index} />
          )

        }
      </div>
      {HasMore ?
        <a href={"#" + id_for_scroll} onClick={() => setMoreQuestions()} className="LoadMoreBtn">
          Load More
  </a> : ""
      }
    </div>
  )
}

const reducer = combineReducers({
  userSignin: userSigninReducer,
})
function userSigninReducer(state = {}, action) {
  switch (action.type) {

    case "USER_SIGNIN_SUCCESS":
      return { userInfo: action.payload };
    case "USER_EXIT":
      return { userInfo: false };
    default: return state;
  }
}








function Navbar(props) {
  const [InputSeach, setInputSeach] = useState("")
  const userSignin = useSelector(state => state.userSignin);
  const userInfo = userSignin;
  const [userAccount, setuserAccount] = useState([])
  const dispatch = useDispatch();

  const searchOnSite = (e) => {
    e.preventDefault();
  }

  useEffect(() => {
    if (userInfo.userInfo)
      Axios.get("/2.2/me?order=desc&sort=reputation&site=stackoverflow&filter=!--1nZv)deGu1&key=" + app_key + "&access_token=" + userInfo.userInfo)
        .then(function (response) {
          setuserAccount(response.data.items[0])
        })
  }, [userInfo])

  const do_login = () => {
    window.SE.authenticate({
      success: function (data) {
        dispatch({ type: "USER_SIGNIN_SUCCESS", payload: data.accessToken });
        Cookie.set('userToken', JSON.stringify(data.accessToken));
      },
      error: function (data) {
        alert('An error occurred:\n' + data.errorName + '\n' + data.errorMessage);
      },
      scope: ['read_inbox,no_expiry'],
      networkUsers: true
    })
  }
  const do_logout = () => {
    dispatch({ type: "USER_EXIT" })
    Cookie.remove('userToken');
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
            <li className={"nav-item " + (window.location.pathname == "/" ? " active" : "")}>
              <Link className="nav-link" to="/">Questions</Link>
            </li>

            <li className={"nav-item " + (window.location.pathname == "/users" ? " active" : "")}>
              <Link className="nav-link" to="/users">Users</Link>
            </li>
            <li className={"nav-item " + (window.location.pathname == "/tags" ? " active" : "")}>
              <Link className="nav-link" to="/tags">Tags</Link>
            </li>
          </ul>
          <form className="form-inline form-search-from-navbar" onSubmit={(e) => searchOnSite(e)}>
            <input value={InputSeach} onChange={(e) => setInputSeach(e.target.value)} className="navbar-header-input form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" />
            <button className="btn btn-warning  my-2 my-sm-0" type="submit">Search</button>
          </form>
          <div>
            {userInfo.userInfo && userAccount !== [] ?
              <div className="userAccountControl">
                <Link className="navbar-avatar" to={"/users/" + userAccount.user_id}>
                  <img src={userAccount.profile_image} />
                </Link>
                <button onClick={() => do_logout()} className="btn btn-danger">Log out</button>

              </div>
              :
              <button onClick={() => do_login()} className="login btn btn-primary" to="/">Login</button>


            }
          </div>
        </div>
      </nav>
    </header>

  )

}

const userInfo = Cookie.getJSON("userToken") || null;
const initialState = { userSignin: { userInfo } };

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

ReactDOM.render(
  <Provider
    store={createStore(reducer, initialState, composeEnhancer(applyMiddleware(thunk)))}
  >
    <React.StrictMode>
      <BrowserRouter>
        <Switch>
          <Route path="/" component={App} />
        </Switch>
      </BrowserRouter>
    </React.StrictMode>
  </Provider>,
  document.getElementById('root')
);

serviceWorker.unregister();
