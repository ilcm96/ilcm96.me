import React, { Component } from "react"
import ReactUtterences from "react-utterances"

const repo = "ilcm96/ilcm96-comment"

class Comment extends Component {
  render() {
    return (
      <div className="comment">
        <ReactUtterences repo={repo} type={"pathname"} />
      </div>
    )
  }
}

export default Comment
