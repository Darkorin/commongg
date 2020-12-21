import React, { useState, useEffect } from "react";
import Text from '../Text.js';
import IconButton from '../IconButton.js';
import ProfilePicture from '../ProfilePicture.js';
import { Link } from "react-router-dom";

function Post(props) {

  const [author, setAuthor] = useState({ profile: "" });

  useEffect(() => {
    props.getUser(props.post.author, setAuthor)
  }, [props.post]);

  function convertNum(val) {
    let editedVal = val;
    if (editedVal > 1000000) {
      editedVal = Math.round(val / 100000) / 10;
      return (editedVal + "M");
    }
    if (editedVal > 1000) {
      editedVal = Math.round(val / 100) / 10;
      return (editedVal + "K");
    } else {
      return editedVal;
    }
  }

  const checkType = () => {

    if (props.post.type === "text") {
      return
    } else if (props.post.type === "image") {
      return (
      <img 
        src={props.post.link}
        alt="posted image" 
        style={{
          width: "100%"
        }}
        />
      )
    } 
    // Code to turn on video later!
    // else if (props.post.type === "video") {
    //   return (
    //     <video controls name="posted video"
    //       style={{
    //         width: "100%"
    //       }}>
    //       <source
    //         src={props.post.link}
    //       />
    //     </video>
    //   )
    // }
  }

  return (
    <div className="Post">
      <div className="container">
        <br />
        <div className="row">
          <div className="col-1">
            <ProfilePicture currentUserInfo={author} width="40px" height="40px" />
          </div>
          <div className="col-11">
            <Text text={author.username} />
            <Text text={new Date(props.post.timestamp).toLocaleTimeString("en-US") + " - " + new Date(props.post.timestamp).toLocaleDateString("en-US")} />
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <Text text={props.post.title} />
            <Text text={props.post.text} />
            {checkType()}
          </div>
        </div>
        <div className="row">
          <div className="col-2">
            <IconButton class="fa fa-smile-o" text={convertNum(props.post.likes)} />
          </div>
          <div className="col-2">
            <IconButton class="fa fa-frown-o" text={convertNum(props.post.dislikes)} />
          </div>
          <div className="col-4">

          </div>
          <div className="col-2">
            <Link to={"/post/" + props.postId} style={{ color: "#BF9AFC" }}>
              <IconButton class="fa fa-comment-o" text={convertNum(props.post.numComments)} />
            </Link>
          </div>
          <div className="col-2">
            <IconButton class="fa fa-share-alt" text="" />
          </div>
        </div>
      </div>
      <br />
    </div >
  );
}

export default Post;
