import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Text from '../components/Text.js';
import Post from '../components/Post/Post.js';

function Profile(props) {

  const [user, setUser] = useState({ profile: [], games: [], followCounts: {} });
  const [userId, setUserId] = useState(0);

  const [followBtnState, setFollowBtnState] = useState({ 
    onClick: () => props.followUser(props.currentUser, userId),
    text: "Follow"    
  })
  const [followBtnStyle, setFollowBtnStyle] = useState({ visibility: "visible" });

  useEffect(() => {
    let url = window.location.href;
    url = url.split('/');
    setUserId(url[url.length - 1]);
  }, []);

  useEffect(() => {
    props.getUser(userId, setUser);
  }, [userId]);

  useEffect(() => {
    console.log(user);
  }, [user]);

  useEffect(() => { //TODO - hide follow button if checked
    if (props.currentUser) {
      if (props.currentUser === userId) {
        setFollowBtnStyle({ visibility: "hidden" });
      }
    }
  }, []);

  const isFollowing = () => { //TODO - change button text to follow/following
    
  }

  let userPosts = [
    {
      type: "text",
      user: "carrot",
      time: "3h ago",
      title: "THIS GAME IS TOO FUN",
      text: "please help me\nI AM ADDICTED TO GENSHIN. It's taking over my life XD\n\nwatch me struggle ON STREAM and also help me learn how to get better.",
      likes: 125765,
      dislikes: 1109,
      numComments: 1098
    },
    {
      type: "video",
      user: "carrot",
      time: "3h ago",
      title: "epic gamer moment",
      link: "https://www.youtube.com/embed/8YBiBlsXFp8",
      text: "i am the greatest league of legends player in the whole entire world #LFT",
      likes: 3200,
      dislikes: 350,
      numComments: 1400
    },
    {
      type: "image",
      user: "carrot",
      time: "4h ago",
      title: "im beautiful",
      link: "https://i.imgflip.com/skv3y.jpg",
      text: "dms are open",
      likes: 3200,
      dislikes: 350,
      numComments: 1400
    }
  ]

  return (
    <div className="Profile">

      <div className="container">
        <div className="row">
          <div className="col-lg-2">
            <Text text="profile" />
            <Text text="home" />
            <Text text="following" />
            <Text text="trending" />
            {user.games.map(game => {
              return <Text text={game} key={game} />
            })}
            <Link to="/">
              <p onClick={() => props.signOut()}>Logout</p>
            </Link>
          </div>
          <div className="col-lg-7">
            <div className="row">
              <div className="col-lg-4">
                <img src={user.profile.profile_picture} alt="Avatar" width="150px" />
              </div>
              <div className="col-lg-6">
                <Text text={user.profile.username} />
                <Text text={"About Me: " + user.profile.bio} />
                <Text text={"Following: " + user.followCounts.following} />
                <Text text={"Followers: " + user.followCounts.follower} />
              </div>
              <div className="col-lg-2">
                <button onClick={followBtnState.onClick} type="button" className="btn btn-primary" style={followBtnStyle}>
                  {followBtnState.text}
                </button>
              </div>
            </div>
            <div className="row">
              <Text text="Games: (figure out how to replace the numbers with games)" />
              <div className="container testimonial-group">
                <div className="row text-center">
                  {user.games.map(game => {
                    return <div className="col-2" key={game}>{game}</div>
                  })}
                </div>
              </div>
            </div>
            {userPosts.map(post => {
              return <Post post={post} key={Math.random()}/>
            })}
          </div>
          <div className="col-lg-3">
            column 3
        </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
