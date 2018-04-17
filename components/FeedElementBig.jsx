import React, { Component, Fragment } from "react";
import { Button, Feed, Icon, Segment, Grid, Image, Container, Dropdown } from "semantic-ui-react";
import Link from "next/link";
import { getDate } from "../components/utils/utils";
import BasicFeedElement from "./BasicFeedElement";

export default class FeedElement extends BasicFeedElement {
  constructor(props) {
    super(props);
    this.state = { content: "" };
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
    if (this.state.textArea) this.state.textArea.value = "";
    this.setState({ content: "", buttonSucess: true, buttonLoading: false, file: undefined });
    setInterval(() => this.setState({ buttonSucess: false }), 1000);
  };

  isLoading = () => {
    return this.state.buttonLoading;
  };
  isSuccessfull = () => {
    return !this.state.buttonLoading && this.state.buttonSucess;
  };
  render() {
    const { item, request, handleLike, handleShare, user } = this.props;
    if (!item.user) item.user = user;
    return (
      <Feed.Event>
        <Segment raised className="-segment">
          <div className="-feed-content-wrapper">
            <Grid>
              <Grid.Column width={5} className="-left-feed-grid">
                <Feed.Content>
                  <Feed.Summary>
                    {this.getUserSection(item)}
                    <Feed.Meta>
                      <Feed.Like>
                        <Icon name="trophy" />
                        {item.likes.length} Ansehen
                      </Feed.Like>
                    </Feed.Meta>
                    <br />
                    <Feed.Date>
                      <Icon name="wait" />
                      {getDate(item.timestamp)}
                    </Feed.Date>
                    <br />
                    <Feed.Date>
                      <Icon name="marker" />Stuttgart
                    </Feed.Date>
                  </Feed.Summary>
                  <br />

                  <div style={{ position: "relative", height: "30px", width: "100%" }}>
                    <Button size="mini" animated="fade" onClick={handleShare} className="-float-left ">
                      <Button.Content visible>
                        <Icon name="share" />
                      </Button.Content>
                      <Button.Content hidden>Share</Button.Content>
                    </Button>
                    <Button size="mini" animated="fade" onClick={handleLike} className="-float-right -like-button">
                      <Button.Content visible>
                        <Icon name="heart" />
                      </Button.Content>
                      <Button.Content hidden>Like</Button.Content>
                    </Button>
                  </div>
                </Feed.Content>
              </Grid.Column>
              <Grid.Column width={11}>{this.getContent(item)}</Grid.Column>
            </Grid>
            {this.getDropDown(item)}
          </div>
          <div style={{ minHeight: "2px", width: "100%" }} className="-border-top " />
          <div className="-feed-content-wrapper">
            <div className="">{this.getComments(item, this.props.user)}</div>
          </div>
          {this.getCommentForm(this)}
        </Segment>
        <br />
      </Feed.Event>
    );
  }
}
