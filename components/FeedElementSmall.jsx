import React, { Component, Fragment } from "react";
import { Button, Feed, Icon, Segment, Grid, Image, Container, Dropdown } from "semantic-ui-react";
import Link from "next/link";
import { getDate } from "../components/utils/utils";
import BasicFeedElement from "./BasicFeedElement";

export default class FeedElement extends BasicFeedElement {
  constructor(props) {
    super(props);
    this.state = { content: "", showResults: false };
    this.checkForVideo();
  }

  sendContent = async () => {
    if (this.state.content.length > 0 && !this.state.file) {
      this.props.blockchainWrapper.newTransaction(
        "comment",
        { text: this.state.content, previousHash: this.props.item.previousHash },
        this.onSuccessFullyPosted
      );
      this.setState({ buttonLoading: true });
    }
  };

  onSuccessFullyPosted = () => {
    if (this.state.inputImage) this.state.inputImage.value = "";
    this.setState({ content: "", buttonSucess: true, buttonLoading: false, file: undefined });
    setInterval(() => this.setState({ buttonSucess: false }), 1000);
  };

  isLoading = () => {
    return this.state.buttonLoading;
  };
  isSuccessfull = () => {
    return !this.state.buttonLoading && this.state.buttonSucess;
  };
  onClick = () => {
    this.setState({ showResults: true });
  };

  onHide = () => {
    this.setState({ showResults: false });
  };

  render() {
    const { item, request, handleLike, handleShare, user } = this.props;
    if (!item.user) item.user = user;
    return (
      <Feed.Event>
        <Segment raised className="-segment">
          <div className="-feed-content-wrapper">
            <div className="">
              <Feed.Content>
                <Feed.Summary>{this.getUserSection(item)}</Feed.Summary>
              </Feed.Content>
            </div>

            <div className="-feed-font-size -float-center">{this.getContent(item, true)}</div>
            {this.getDropDown(item)}
          </div>
          <div style={{ minHeight: "35px", width: "100%" }} className="-border-bottom ">
            <Feed.Meta>
              <Feed.Like className="-float-left ">
                <Icon name="trophy" />
                {item.likes.length} Kudos
              </Feed.Like>
            </Feed.Meta>
            <br />
            <br />
            <Feed.Date className="-float-left ">
              <Icon name="wait" />
              {getDate(item.timestamp)}
            </Feed.Date>
            <br />
            <br />
            {this.getLikeAndShare(handleLike, handleShare, item)}
            <br />
          </div>
          <br />
          {this.state.showResults ?
            <div>
              <a onClick={this.onHide}>Hide Comments</a>
              {this.getComments(item, this.props.user)}
              {this.getCommentForm(this)}
            </div>
            :
            <div>
              <a onClick={this.onClick} >Show Comments</a>
            </div>
          }
        </Segment>
        <br />
      </Feed.Event>
    );
  }
}
