import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "./PostDetail.css";
import Comment from "./Comment";

function Detail() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state;
  const [isMyPost, setIsMyPost] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loginUser, setLoginUser] = useState(false);
  const [myName, setMyName] = useState("");
  console.log(state);

  useEffect(() => {
    async function fetchData() {
     await axios.get("/api/users/auth").then((res) => {
        //여기까지 오면 로그인 상태라는게 확인된 것
        setMyName(res.data.name);
        if (res.data.name == state.name) {
          console.log(
            `res.data.name = ${res.data.name} state.name = ${state.name}`
          );
          setIsMyPost(true);
        } else if (res.data.isAdmin) {
          setIsAdmin(true);
        }
        if(res.data.name){
          loginUser(true);
        }
       
      });
    }
    fetchData();
  },[]);

  const onDeleteHandler = async (e) => {
    e.preventDefault();
    let check = window.confirm("게시글을 삭제하시겠습니까?");
    if (check) {
      await axios.post("/api/post/delete", { id: state.id }).then((res) => {
        if (res.data.postDeleteSuccess) {
          alert("게시글이 삭제되었습니다.");
          navigate("/");
        } else {
          alert("게시글 삭제에 실패했습니다. 관리자에게 문의하세요.");
        }
      });
    } else {
      alert("게시글 삭제가 취소되었습니다.");
    }
  };

  return (
    <div className="postDetail">
      <div className="postInfo">
        <h1>{state.title}</h1>
        <div>Category: {state.category}</div>
        <div>Name: {state.name}</div>
        <div>Content: {state.textArea}</div>
        <div>최초로 작성한 날짜: {state.date}</div>
        {state.date !== state.modiDate && (
          <div>마지막 수정한 날짜: {state.modiDate}</div>
        )}
      </div>                                                                              
      {loginUser &&
        <Link to="/chatpage" state={{ host: state.name, guest: myName }}>
          채팅하기
        </Link>
      }
      <div className="commentTitle">Comment</div>
      <Comment id={state.id} />
      {isMyPost && (
        <div>
          <button>
            <Link
              to="/post/modify"
              state={{
                id: state.id,
                name: state.name,
                title: state.title,
                textArea: state.textArea,
                date: state.date,
                modiDate: state.modiDate,
              }}
            >
              MODIFY
            </Link>
          </button>
          <button onClick={onDeleteHandler}>DELETE</button>
        </div>
      )}
      {isAdmin && (
        <div>
          <button onClick={onDeleteHandler}>DELETE</button>
        </div>
      )}
    </div>
  );
}

export default Detail;
