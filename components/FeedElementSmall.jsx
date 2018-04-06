import React, { Component, Fragment } from "react";
import { Button, Feed, Icon, Segment, Grid, Image, Container, Dropdown } from "semantic-ui-react";
import Link from "next/link";
import { getDate } from "../components/utils/utils";
import BasicFeedElement from "./BasicFeedElement";

export default class FeedElement extends BasicFeedElement {
  constructor(props) {
    super(props);
    this.state = {};
    this.checkForVideo();
  }

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
            <br />
            <div className="-feed-font-size">{this.getContent(item, true)}</div>
            {this.getDropDown(item)}
          </div>
          <div style={{ height: "30px", width: "100%" }}>
            <Feed.Meta>
              <Feed.Like className="-float-left ">
                <Icon name="trophy" />
                {item.likes.length} Ansehen
              </Feed.Like>
            </Feed.Meta>
            <Feed.Date className="-float-right ">
              <Icon name="wait" />
              {getDate(item.timestamp)}
            </Feed.Date>
            <br />
            <br />
            <Button size="mini" animated="fade" onClick={() => handleShare(item.user.name, item)} className="-float-left ">
              <Button.Content visible>
                <Icon name="share" />
              </Button.Content>
              <Button.Content hidden>Share</Button.Content>
            </Button>
            <Button
              size="mini"
              animated="fade"
              onClick={() => handleLike(item.user.name, item.previousHash)}
              className="-float-right -like-button">
              <Button.Content visible>
                <Icon name="heart" />
              </Button.Content>
              <Button.Content hidden>Like</Button.Content>
            </Button>
          </div>
          <br />
          <br />
          {this.getComments()}
        </Segment>
        <br />
      </Feed.Event>
    );
  }
}
