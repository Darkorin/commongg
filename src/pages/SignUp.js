/** @jsxImportSource @emotion/react */
import { jsx } from "@emotion/react";
import React, { useState } from "react";
import SignUpButton from "../components/SignUp/SignUpButton.js";
import TermsOfService from "./TermsOfService.js"
import Input from '../components/Input.js';
import { Link } from "react-router-dom";
import { Modal, Form } from "react-bootstrap";
import InputHelpers from "../helpers/InputHelpers.js";

// Images
import background from "../images/signup-background.png";
import logo from "../images/icons/logo1light.png";
import FeedImage from "../images/signup-static-feed.png";

import Text from "../components/Text.js";

import { css } from "@emotion/react";

import Landing from "../newComponents/Landing.js";
import SignUpModal from "../newComponents/Modals/SignUpModal.js";
import LoginModal from "../newComponents/Modals/LoginModal.js";
import Sidebar from "../newComponents/Sidebar.js";

function SignUp(props) {
  const initialCurrentValue = { current: { value: "" } };
  const [email, setEmail] = useState(initialCurrentValue);
  const [password, setPassword] = useState(initialCurrentValue);
  const [confirmPassword, setConfirmPassword] = useState(initialCurrentValue);
  const [databaseError, setDatabaseError] = useState({
    ErrorCode: "",
    ErrorMessage: ""
  });
  const [showTosModal, setShowTosModal] = useState(false);
  const [failedPassword, setFailedPassword] = useState(false);
  const [failedEmail, setFailedEmail] = useState(0); // 0=valid, 1=in use, 2=doesn't have @/.
  const [missing, setMissing] = useState(false);
  const [tosCheckbox, setTosCheckbox] = useState(false);
  const [agreeToTos, setAgreeToTos] = useState(null);
  const [displayNonMatchingPasswordFieldsValidation, setDisplayNonMatchingPasswordFieldsValidation] = useState(false);
  const [displayDatabaseErrorMessage, setDisplayDatabaseErrorMessage] = useState(false);

  const [newUser, setNewUser] = useState(true);

  function swapModal() {
    setNewUser(false);
  }

  function resetValidationVariables() {
    setShowTosModal(false);
    setFailedPassword(false);
    setFailedEmail(0);
    setMissing(false);
    setTosCheckbox(null);
    setDisplayNonMatchingPasswordFieldsValidation(false);
    setDisplayDatabaseErrorMessage(false);
  }

  const signUp = async () => {
    resetValidationVariables();

    if (email.current.value === "" || password.current.value === "") {
      setMissing(true);
      return;
    }
    if ((email !== undefined && email.current.value !== "") && (password !== undefined && password.current.value !== "")) {
      setMissing(false);
      //email already in use
      setFailedEmail(0);

      if (!(email.current.value.includes('@')) || !(email.current.value.includes('.'))) {
        setFailedEmail(2);
      } else {
        props.existsEmail(email.current.value).then((existsUser) => {
          if (existsUser === true) {
            setFailedEmail(1);
          }
        })
      }

      let inputHelper = new InputHelpers();
      let isPasswordTooWeak = inputHelper.verifyPasswordStrength(password.current.value);

      if (isPasswordTooWeak === true) {
        setFailedPassword(true);
        failedSignUp();
        return;
      }
      if (tosCheckbox === false) {
        setAgreeToTos(false);
        failedSignUp();
        return;
      } else {
        setAgreeToTos(true);
      }
      if (password.current.value !== confirmPassword.current.value) {
        setDisplayNonMatchingPasswordFieldsValidation(true);
        failedSignUp();
        return;
      }
      //sign up user
      await props.signUpUser(email.current.value, password.current.value, setDatabaseError);

      if (databaseError.ErrorCode !== 0) {
        setDisplayDatabaseErrorMessage(true);
        failedSignUp();
        return;
      }
    }
    else {
      if (failedEmail === 0 && !failedPassword && agreeToTos && !missing) {
        props.signUpUser(email.current.value, password.current.value);
      }
    }
    failedSignUp();
  }

  const failedSignUp = () => {
    if (missing === true) {
      return (
        <p style={{ color: "#F34D4D" }}>missing email or password</p>
      );
    } else if (failedEmail === 1) {
      return (
        <p style={{ color: "#F34D4D" }}>email already in use</p>
      );
    } else if (failedEmail === 2) {
      return (
        <p style={{ color: "#F34D4D" }}>not a valid email format</p>
      );
    } else if (failedPassword === true) {
      return (
        <p style={{ color: "#F34D4D" }}>passwords must have at least 6 characters, 1 uppercase letter, 1 lowercase letter, 1 number, 1 special character</p>
      );
    }
    else if (agreeToTos === false) {
      return (
        <p style={{ color: "#F34D4D" }}>must agree with the Terms of Service before signing up</p>
      );
    }
    else if (displayNonMatchingPasswordFieldsValidation === true) {
      return (
        <p style={{ color: "#F34D4D" }}>Password field and confirm password field do not match. Ensure they match and try again.</p>
      );
    }
    else if (displayDatabaseErrorMessage === true) {
      return (
        <p style={{ color: "#F34D4D" }}>{databaseError.ErrorMessage}</p>
      );
    } else {
      return (<div></div>);
    }
  }

  function handleChecked(e) {
    setTosCheckbox(e.target.checked);
    setShowTosModal(false);
  }

  function showTosModalTrue() {
    setShowTosModal(true);
  }

  const containerCSS = css`
    background-image: url(${background});
    background-position: center center;
    background-repeat: no-repeat;
    -webkit-background-size: cover;
    -moz-background-size: cover;
    -o-background-size: cover;
    background-size: cover;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
  `;

  const inputStyle = {
    backgroundColor: "transparent #2A2A2D",
    color: "#BF9AFC",
    border: "solid",
    borderColor: "#BF9AFC",
    borderWidth: "1px",
    borderRadius: "2px",
    backgroundColor: "#2A2A2D",
    padding: "0.3rem",
    margin: "3%",
    width: "80%",
    height: "77%",
    marginLeft: "10%",
    overflow: "hidden"
  }
  const modalBodyStyle = {
    color: "#BF9AFC",
    backgroundColor: "#202020",
    width: "45rem",
    height: "45rem",
    border: "none",
    maxHeight: "calc(100vh - 210px)",
    overflowY: "auto"
  };
  const modalStyle = {
    width: "80rem",
    height: "50rem",
    display: "flex",
    margin: "auto",
    border: "none"
  }

  async function checkPasswordStrength(value) {
    await setPassword(value);
    console.log(value);
    let inputHelper = new InputHelpers();
    let isPasswordTooWeak = inputHelper.verifyPasswordStrength(password.current.value);

    console.log(isPasswordTooWeak);

    if (isPasswordTooWeak) {
      setFailedPassword(true);
    } else {
      setFailedPassword(false);
    }
  }
  
  function signUpForApp(e) {
    if (e.key === "Enter") {
      signUp();
    }
  }

  return (
    <div css={containerCSS}>
      <Landing />
      { newUser
        ?
        <SignUpModal handler={swapModal} />
        :
        <LoginModal handler={swapModal} />
      }
    </div>

          /* <div className="col-xl-1 col-md-0">

          </div>
          <div className="col-6 d-none d-md-block" style={{marginTop: "50px"}}>
            <div className="row">
              <div className="col-2" style={{marginRight: "50px"}}>

              </div>
              <div className="col-2" style={{ marginRight: "-30px" }}>
                <img css={logoCSS} src={logo} />
              </div>
              <div className="col-auto" style={{ marginLeft: "0px" }}>
                <p style={{
                  fontSize: "25px",
                  position: "relative",
                  color: "#BF9AFC",
                  marginBottom: "0px"
                }}> The best social network for</p>
                <span style={{
                  fontSize: "25px",
                  position: "relative",
                  color: "#FFFFFF",
                }}>Teamfight Tactics</span>
                <span style={{
                  fontSize: "25px",
                  position: "relative",
                  color: "#BF9AFC",
                  marginBottom: "0px"
                }}> gamers</span>
              </div>
            </div>
            <div className="row">
              <img src={FeedImage} alt="Common.gg Feed" className="mx-auto" style={{ width: '65%', boxShadow: "-1px 7px 25px 1px #060508" }}></img>
            </div>
          </div>
          <div className="col">
            <div className="SignUp">
              <Modal show={showTosModal} style={modalStyle} >
                <Modal.Body style={modalBodyStyle}>
                  <div className="row">
                    <button type="button" style={{ marginLeft: "42rem", color: "#BF9AFC" }} className="close" aria-label="Close">
                      <span id="createPostX" aria-hidden="true" onClick={() => { setShowTosModal(false) }}>&times;</span>
                    </button>
                    <TermsOfService />
                    <hr style={{ backgroundColor: '#BF9AFC', width: '90%', left: "5px" }} />
                  </div>
                </Modal.Body>
              </Modal>
              <div className="mx-auto card signUpCard">

                <div style={{ margin: "20px 20px 0px 20px" }}>
                  <div className="row mx-auto">
                    <div className="col-12 mx-auto" style={{ textAlign: "center", }}>
                      <img css={logoCSS} src={logo} />
                      <div style={{ pointerEvents: "none" }}></div>
                    </div>
                    <br />
                    <div className="form-group col-12">
                      <p style={{
                        fontSize: "22px",
                        position: "relative",
                        color: "#FFFFFF",
                        textAlign: "center",
                      }}> Sign Up Now</p>
                      <div className="row mx-auto">
                        <Input type="email"
                          bootstrap="border-0"
                          placeholder="email"
                          track={setEmail}
                          style={inputStyle} />
                      </div>
                    </div>
                  </div>
                  <div className="form-group col-12">
                    <div className="row mx-auto">
                      <div style={inputStyle} onKeyDown={(e) => signUpForApp(e)}>
                        <Input type="password"
                          bootstrap="border-0"
                          placeholder="password"
                          track={checkPasswordStrength}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="form-group col-12">
                    <div className="row mx-auto">
                      <div style={inputStyle} onKeyDown={(e) => signUpForApp(e)}>
                        <Input type="password"
                          bootstrap="border-0"
                          placeholder="confirm password"
                          track={setConfirmPassword}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="d-flex justify-content-center text-center">
                    <Form.Group controlId="tosCheckBox">
                      <Form.Check onChange={(e) => handleChecked(e)} type="checkbox" label="I accept the " style={{color: "#BF9AFC"}}/>
                      <a href="#" onClick={showTosModalTrue} style={{ textDecoration: "underline", color: "#BF9AFC"}}>
                        Terms Of Service
              </a>
                    </Form.Group>

                  </div>
                  <div className="d-flex justify-content-center text-center">
                    {failedSignUp()}
                  </div>
                  <div className="form-group col-12" style={{ textAlign: "center", }}>
                    <SignUpButton click={signUp} />
                </div>
                </div>
                <br />
              </div>
              
            </div>
            <div className="row">
              <div className="col text-center" style={{marginTop: "45px"}}>
                <Link to="/login">
                    <p className="col" style={{
                      position: "relative",
                      padding: '.3rem',
                      top: "-11rem",
                      color: "#FFFFFF",
                      textDecoration: "underline",
                    }}>
                      Login
                </p>
                  </Link>
                </div>
              </div>
          </div>
          
        </div>
      </div> */
  )
};

export default SignUp;