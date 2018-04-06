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
                </Feed.Content>
              </Grid.Column>
              <Grid.Column width={11}>{this.getContent(item)}</Grid.Column>
            </Grid>
            {this.getDropDown(item)}
          </div>
          <div style={{ minHeight: "30px", width: "100%" }} className="-border-top ">
            {this.getLikeAndShare()}
          </div>
          <br />
          <div className="-feed-content-wrapper">
            <div className="">{this.getComments()}</div>
          </div>
          {this.getCommentForm()}
        </Segment>
        <br />
      </Feed.Event>
    );
  }
}
