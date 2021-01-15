import React, { useRef, useState, useEffect } from 'react';
import addcommentIcon from '../../images/icons/addcomment.png';
import { Modal } from "react-bootstrap";

function CreateCommentModal(props) {
    const [show, setShow] = useState(false);
    const commentTextRef = useRef();
    const [commentText, setCommentText] = useState({ current: { value: "" } });
    const [displayCommentTextLengthValidationMessage, setDisplayCommentTextLengthValidationMessage] = useState(false);

    useEffect(() => {
        //if parent want the modal to show directly do it
        if (props.show === true) {
            setShow(true);
        };
    }, [props.show])

    const handleClose = () => setShow(false);

    let buttonStyle = {
        backgroundColor: "transparent",
        position: "relative",
        left: "-.74rem"
    }
    const modalContentStyle = {
        color: "#BF9AFC",
        backgroundColor: "#202020",
        borderBottom: ""
    }
    const modalHeaderStyle = {
        borderBottom: "0 none",
        textAlign: "center"
    }
    const textAreaStyle = {
        resize: "none",
        color: "#BF9AFC",
        backgroundColor: "#202020",
        borderTop: "0",
        borderLeft: "0",
        borderRight: "0",
        whiteSpace: "pre-wrap"
    }
    const commentButtonStyle = {
        height: 48,
        marginLeft: "auto",
        backgroundColor: "transparent",
        color: "#BF9AFC",
        border: "solid",
        borderRadius: "10px",
        borderColor: "#BF9AFC",
        borderWidth: "2px",
    }

    function clearFields() {
        commentTextRef.current.value = "";
        setShow(false);
        setDisplayCommentTextLengthValidationMessage(false);
    }

    function handleCommentClick() {
        let commentTextCurrentValue = commentText.current.value;

        if ((commentTextCurrentValue !== undefined) && (commentTextCurrentValue !== null) && (commentTextCurrentValue.length > 1000)) {
            setDisplayCommentTextLengthValidationMessage(true);
            return;
        }
        createComment();
    }

    function createComment() {
        props.createComment({
            author: props.currentUserId,
            commentText: commentText.current.value,
            postId: props.postId,
            timestamp: props.firebaseTimeStamp()
        }, props.post.author);
        props.updateRefresh();
        clearFields();
    }

    return (
        <div className="CreateCommentModal">
            <button type="button" style={{ background: "transparent" }} id="createCommentButton" className="btn btn-primary" data-target="#createCommentModal" onClick={() => { setShow(true) }}>
                <img src={addcommentIcon}
                    style={{
                        ...buttonStyle,
                        width: "1.813rem",
                        height: "1.625rem"
                    }} />
            </button>
            <Modal show={show} onHide={handleClose} onEntered={() => commentTextRef.current.focus()}>
                <div className="modal-content" style={modalContentStyle}>
                    {displayCommentTextLengthValidationMessage ?
                        <p style={{ color: "#F34D4D" }}>
                            The length of your comment cannot exceed 1000 characters
                        </p> : null}
                    <div className="modal-header" style={modalHeaderStyle}>
                        <h5 className="modal-title" id="createCommentModalLabel">create a comment</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => clearFields()}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <textarea
                        className="form-control"
                        onChange={() => setCommentText(commentTextRef)}
                        ref={commentTextRef}
                        placeholder="type your comment here..."
                        rows="5"
                        style={textAreaStyle}
                        maxLength="1000"
                    />
                    <div style={{ display: "flex" }}>
                        <button type="button" className="btn btn-primary" onClick={() => handleCommentClick()} data-dismiss="modal" style={commentButtonStyle}>Comment</button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default CreateCommentModal;