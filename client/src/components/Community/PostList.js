import axios from "axios";
import React, { useEffect, useState } from "react";
import Post from "./Post";
import "./PostList.css";

function PostList() {
  const [PostList, setPostList] = useState([]);
  const [category, setCategory] = useState("etc");
  const [input, setInput] = useState("");

  const onCategoryHandler = async (e) => {
    e.preventDefault();
    let category = e.target.value;

    const request = await axios //해당 카테고리
      .post("/api/post/category", { category: category })
      .then((res) => res.data.postList);
    const notice = await axios //카테고리와 무관하게 공지사항 가져옴
      .post("/api/post/category", { category: "notice" })
      .then((res) => res.data.postList);
    const tempArray = [];
    const concatArray = tempArray.concat(notice, request);

    await setPostList(concatArray);
  };

  useEffect(() => {
    async function fetchData() {
      // You can await here
      const request = await axios
        .get("/api/post/postlist")
        .then((res) => res.data.postList);
      const notice = await axios //카테고리와 무관하게 공지사항 가져옴
        .post("/api/post/category", { category: "notice" })
        .then((res) => res.data.postList);
      const tempArray = [];
      const concatArray = tempArray.concat(notice, request);

      await setPostList(concatArray);
    }
    fetchData();
  }, []);

  const onSearchHandler = async (e) => {
    e.preventDefault();

    //공지사항 + 검색 해당 게시글
    const notice = await axios //카테고리와 무관하게 공지사항 가져옴
      .post("/api/post/category", { category: "notice" })
      .then((res) => res.data.postList);
    const request = await axios
      .post("/api/post/search", { input })
      .then((res) => res.data.searchList);
    const tempArray = [];
    const concatArray = tempArray.concat(notice, request);
    setPostList(concatArray);
  };

  return (
    <div className="postPage">
      <div className="listTitle">POSTLIST</div>
      <div className = "AD">
        <select className="btn btn-primary" onChange={onCategoryHandler}>
          <option value="all">All</option>
          <option value="work out">Work out</option>
          <option value="jogging">Jogging</option>
          <option value="study">Study</option>
          <option value="etc">Etc</option>
        </select>
        <span>
          <input
            type="text"
            onChange={(e) => {
              setInput(e.target.value);
            }}
            placeholder="제목으로 검색"
          />
          <button className="btn btn-primary" onClick={onSearchHandler}>Search</button>
        </span>
      </div>
      <div className="postList">
        {PostList &&
          PostList.map((post, index) => (
            <Post
              key={index}
              id={post.index}
              title={post.title}
              textArea={post.textArea}
              name={post.name}
              category={post.category}
              date={post.date}
              modiDate={post.modiDate}
            ></Post>
          ))}
      </div>
    </div>
  );
}
export default PostList;
