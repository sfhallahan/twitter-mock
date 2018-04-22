import React from "react";
import PropTypes from "prop-types";
import {
  mainContainer,
  container,
  content,
  repliesContainer,
  replyTextAreaContainer,
  replyTextArea,
  darkBtn
} from "./styles.css";
import { subHeader, errorMsg } from "sharedStyles/styles.css";
import { DuckContainer, RepliesContainer } from "containers";
import { formatReply } from "helpers/utils";

function Reply({ submit }) {
  function handleSubmit(e) {
    if (Reply.ref.value.length === 0) {
      return;
    }
    submit(Reply.ref.value, e);
    Reply.ref.value = "";
  }
  return (
    <div className={replyTextAreaContainer}>
      <textarea
        ref={ref => (Reply.ref = ref)}
        className={replyTextArea}
        maxLength={140}
        placeholder="Your response"
        type="text"
      />
      <button onClick={handleSubmit} className={darkBtn}>
        {"Submit"}
      </button>
    </div>
  );
}

DuckDetails.propTypes = {
  authedUser: PropTypes.object.isRequired,
  duckId: PropTypes.string.isRequired,
  isFetching: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired,
  addAndHandleReply: PropTypes.func.isRequired
};

//
export default function DuckDetails({ authedUser, duckId, isFetching, error, addAndHandleReply }) {
  return (
    <div className={mainContainer}>
      {isFetching === true ? (
        <p className={subHeader}>{"Fetching"}</p>
      ) : (
        <div className={container}>
          <div className={content}>
            <DuckContainer duckId={duckId} hideLikeCount={false} hideReplyBtn={true} />
            <RepliesContainer duckId={duckId} />
            <Reply
              submit={replyText => addAndHandleReply(duckId, formatReply(authedUser, replyText))}
            />
          </div>
          <div className={repliesContainer} />
        </div>
      )}
      {error ? <p className={errorMsg}>{error}</p> : null}
    </div>
  );
}
