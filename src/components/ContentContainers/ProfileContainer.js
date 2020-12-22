import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import Text from '../Text.js';
import ProfilePicture from '../ProfilePicture.js';
import FeedType from '../FeedType.js';
import TeamfightTactics from "../../images/games/Teamfight Tactics.jpg";
import CommonChat from "../../images/games/Common Chat.png";

function ProfileContainer(props) {

    const [user, setUser] = useState({ profile: [], games: [], followCounts: {} });
    const [userId, setUserId] = useState();

    const [followBtnState, setFollowBtnState] = useState({
        text: "Follow"
    })
    const [followBtnStyle, setFollowBtnStyle] = useState({ visibility: "visible" });
    const [allGames, setAllGames] = useState([
        {
            title: "Common Chat",
            image: CommonChat
        },
        {
            title: "Teamfight Tactics",
            image: TeamfightTactics
        }
    ]);

    function followHandler() {
        if (followBtnState.text === "Follow") {
            props.followUser(props.currentUserId, userId);
            setFollowBtnState({ ...followBtnState, text: "Following" });
        } else {
            props.unFollowUser(props.currentUserId, userId);
            setFollowBtnState({ ...followBtnState, text: "Follow" });
        }
    }

    useEffect(() => {
        let url = window.location.href;
        url = url.split('/');
        setUserId(url[url.length - 1]);
    }, []);

    useEffect(() => {
        props.getUser(userId, setUser);
    }, [userId]);

    useEffect(() => {
        if (props.currentUserId) {
            if (props.currentUserId === userId) {
                setFollowBtnStyle({ visibility: "hidden" });
            }
        }
    }, [userId]);

    useEffect(() => {
        if (props.currentUserInfo.following) {
            let temp = Object.values(props.currentUserInfo.following);
            if (temp.includes(userId)) {
                setFollowBtnState({ ...followBtnState, text: "Following" });
            }
        }
    }, [])

    const checkId = () => {
        if(userId !== undefined){
            return (
                <FeedType {...props} filter={userId} sort={"author"}/>
            )
        }
    }

    const checkAboutMe = () => {
        if(user.about_me !== ""){
            return (<Text text={"About Me: " + user.about_me} />)
        }
    }

    return (
        <div className="ProfileContainer">
            <div className="row">
                <div className="col-lg-4">
                    <ProfilePicture currentUserInfo={user} width="150px" height="150px"/>
                </div>
                <div className="col-lg-6">
                    <Text text={user.username} />
                    {checkAboutMe()}
                    <Text text={"Following: " + user.followCounts.following} />
                    <Text text={"Followers: " + user.followCounts.follower} />
                </div>
                <div className="col-lg-2">
                    <button onClick={() => followHandler()} type="button" className="btn btn-primary" style={followBtnStyle}>
                        {followBtnState.text}
                    </button>
                </div>
            </div>
            <hr style={{backgroundColor:'#BF9AFC', width: '90%'}}/>
            <div className="d-flex flex-row justify-content-center">
                <div className="flex-wrap d-flex flex-row justify-content-center" style={{width:"70%"}}>
                    {user.games.map(index => {
                        return <img 
                        src={allGames[index].image} 
                        key={"game-image2" + index} 
                        alt={allGames[index].title}
                        className="rounded"
                        style = {
                            {
                            width: '22%', 
                            height: 'auto', 
                            margin: '3%'
                        }}
                        ></img>
                    })}
                </div>
            </div>
            <hr style={{backgroundColor:'#BF9AFC', width: '90%'}}/>
            {checkId()}
        </div>
    );
}

export default ProfileContainer;
