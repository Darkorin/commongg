import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import Text from '../Text.js';
import ProfilePicture from '../ProfilePicture.js';
import UsersModal from '../UsersModal.js';
import FeedType from '../FeedType.js';
import plus from "../../images/icons/followingplus-1.png";
import check from "../../images/icons/followingcheck-1.png";
import optionsIcon from '../../images/icons/options.png';

function ProfileContainer(props) {
    const [user, setUser] = useState({ profile: [], games: [], followCounts: {} });
    const [verified, setVerified] = useState(false);
    const [followBtnState, setFollowBtnState] = useState({
        text: "Follow", img: plus
    })
    const [followBtnStyle, setFollowBtnStyle] = useState({
        visibility: "visible",
        backgroundColor: "transparent",
        width: "2.5rem",
        height: "2.5rem",
        borderRadius: "50%",
        position: "relative",
        top: "-1.6vh",
        left: "-1vw"
    });

    function followHandler() {
        if (followBtnState.text === "Follow") {
            props.followUser(props.currentUserId, props.pageId);
            setFollowBtnState({ ...followBtnState, text: "Following", img: check });
        } else {
            props.unFollowUser(props.currentUserId, props.pageId);
            setFollowBtnState({ ...followBtnState, text: "Follow", img: plus });
        }
    }

    //check if the current user is self
    useEffect(() => {
        props.getUser(props.pageId, setUser);
        if (props.currentUserId) {
            if (props.currentUserId === props.pageId) {
                setFollowBtnStyle({ visibility: "hidden" });
            } else {
                setFollowBtnState({ text: "Follow", img: plus })
                setFollowBtnStyle({
                    visibility: "visible",
                    backgroundColor: "transparent",
                    width: "2.5rem",
                    height: "2.5rem",
                    borderRadius: "50%",
                    position: "relative",
                    top: "-1.6vh",
                    left: "-1vw"
                });
            }
        }
    }, [props.pageId]);

    //update the following icon when switching pages
    useEffect(() => {
        //check if user is using follow properly
        if(user.verified) setVerified(true);
        if (props.currentUserId === props.pageId) {
            //already set to invisible since it's self
            return;
        }
        if (user.followers) {
            let temp = Object.values(user.followers);
            //check if current user
            if (temp.includes(props.currentUserId)) {
                setFollowBtnState({ ...followBtnState, text: "Following", img: check });
            } else {
                setFollowBtnState({ ...followBtnState, text: "Follow", img: plus });
            }
        }
    }, [user])

    const checkId = () => {
        if (props.pageId !== undefined) {
            return (
                <FeedType {...props} filter={props.pageId} sort={"author"} />
            )
        }
    }

    const checkAboutMe = () => {
        if (user.about_me !== "") {
            return (<Text style={{ overflowWrap: 'break-word', paddingLeft: "5px", paddingRight: "5px", whiteSpace: "pre-wrap" }} text={user.about_me} />)
        }
    }

    const followStyle = {
        color: "#BF9AFC",
        fontSize: "1.6rem",
        marginRight: "1rem"
    };

    const numberStyle = {
        fontSize: "1.6rem"
    };

    function checkOptions() {
        let modLvl;
        if (!props.currentUserInfo.moderationLevel) {
            modLvl = 0;
        } else {
            modLvl = props.currentUserInfo.moderationLevel;
        }
        return (
            <div>
                <div id="dropdownMenuButton" className="btn" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style={{ background: "transparent" }}>
                    <img src={optionsIcon} alt={"options"} style={{ backgroundColor: "transparent" }} />
                </div>
                <div className="dropdown-menu-right dropdown-menu" aria-labelledby="dropdownMenuButton">
                    {modLvl > 1 ? <p className="dropdown-item mb-0" onClick={() => props.verifyUser(props.pageId, !verified)} style={{ cursor: "pointer" }}>Verify User/Revoke Verification</p> : null}
                    <p className="dropdown-item mb-0" onClick={() => props.report("users", props.pageId)} style={{ cursor: "pointer" }}>Report User</p>
                    {modLvl > 0 ? <p className="dropdown-item mb-0" onClick={() => props.clearReports("users", props.pageId)} style={{ cursor: "pointer" }}>Clear Reports (Current: {user.reports ? user.reports : 0})</p> : null}
                    {modLvl > 1 ? <p className="dropdown-item mb-0" onClick={() => props.setModerationLevel(props.pageId, 0)} style={{ cursor: "pointer" }}>Set Moderation Level: User</p> : null}
                    {modLvl > 1 ? <p className="dropdown-item mb-0" onClick={() => props.setModerationLevel(props.pageId, 1)} style={{ cursor: "pointer" }}>Set Moderation Level: Mod</p> : null}
                    {modLvl > 2 ? <p className="dropdown-item mb-0" onClick={() => props.setModerationLevel(props.pageId, 2)} style={{ cursor: "pointer" }}>Set Moderation Level: Admin</p> : null}
                    {modLvl > 0 ? <p className="dropdown-item mb-0" onClick={() => props.resetPfp(props.pageId)} style={{ cursor: "pointer" }}>Reset Profile Picture</p> : null}
                </div>
            </div>
        )
    }

    return (
        <div>
            <div className="ProfileContainer container" style={{
                borderStyle: "solid",
                borderRadius: "5px",
                borderColor: "#BF9AFC",
                borderWidth: "2px",
            }}>
                <br />
                <div className="row p-0">
                    <div className="col-1"></div>
                    <ProfilePicture currentUserInfo={user} width="115px" height="115px" onclick="enlargeImg" style={{ boxShadow: "1px 1px 1px 1px #171421" }}
                        setProfilePictureImage={props.setProfilePictureImage} />
                    <div className="col-8">
                        <h2 style={{ marginTop: "5%" }}>
                            {user.username + " "}
                            {verified ?
                            <img src={check} alt={user.username + "verified"}
                                style={{
                                    width: "1.8rem",
                                    height: "1.8rem",
                                }} />
                            : null}
                        </h2>
                        <div className="d-flex flex-wrap">

                            <UsersModal {...props} user={user} type="followers"></UsersModal>
                            <UsersModal {...props} user={user} type="following"></UsersModal>

                            <span>
                                <button onClick={() => followHandler()} type="button" className="btn btn-primary" style={followBtnStyle}>
                                    <img src={followBtnState.img} style={{
                                        width: "2.5rem",
                                        height: "2.5rem",
                                    }} />
                                </button>
                            </span>
                        </div>
                        <div className="ml-auto pr-3 dropdown">
                            {checkOptions()}
                        </div>
                    </div>
                </div>
                <div className="container text-wrap row" style={{ margin: "auto" }}>
                    <div className="col-12">
                        <br />{checkAboutMe()}
                    </div></div>
                <hr style={{ backgroundColor: '#5F5177', width: '90%' }} />
                <div className="flex-wrap d-flex flex-row justify-content-center">
                    <div className="row justify-content-center" style={{ width: "70%", paddingBottom: '20px' }}>
                        {user.games.map(index => {
                            if (props.currentUserInfo.games.includes(index)) {
                                return (
                                    <div key={index} className="col-4">
                                        <Link to={"/games/" + (props.allGames[index].title.split(" ")).join('').toLowerCase()}>
                                            <img
                                                src={props.allGames[index].image}
                                                key={"game-image2" + index}
                                                alt={props.allGames[index].title}
                                                className="rounded"
                                                style={{
                                                    width: '8rem',
                                                    height: 'auto',
                                                    margin: '3%',
                                                    padding: '.3rem',
                                                    marginBottom: "10%",
                                                    marginTop: "4%"
                                                }}
                                            />
                                        </Link>
                                    </div>
                                )
                            } else {
                                return (
                                    <div key={index} className="col-4">
                                        <img
                                            src={props.allGames[index].image}
                                            key={"game-image2" + index}
                                            alt={props.allGames[index].title}
                                            className="rounded"
                                            style={{
                                                width: '8rem',
                                                height: 'auto',
                                                margin: '3%',
                                                padding: '.3rem',
                                                marginBottom: "10%",
                                                marginTop: "4%"
                                            }}
                                        />
                                    </div>
                                )
                            }
                        })}
                    </div>
                </div>
            </div>
            <br />
            { checkId()}
        </div>
    );
}

export default ProfileContainer;
