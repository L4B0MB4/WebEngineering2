import React, { Component, Fragment } from "react";
import { Button, Feed, Icon, Segment, Grid, Image, Container, Dropdown } from "semantic-ui-react";
import Link from "next/link";
import { getDate } from "../components/utils/utils";

export default class FeedElement extends Component {
  render() {
    const { item, request, handleLike, handleShare, user } = this.props;
    if (!item.user) item.user = user;
    return (
      <Feed.Event>
        <Segment raised className="-segment">
          <div className="-feed-content-wrapper">
            <div className="left-div" style={item.data.picture ? { minHeight: "335px" } : null}>
              <Feed.Content>
                <Feed.Summary>
                  <Link prefetch href={"./visit/" + item.user.name}>
                    <a>
                      <Image src="../static/bild.jpeg" avatar />
                      {item.user.name}
                    </a>
                  </Link>{" "}
                  {item.shared ? "shared" : "posted"}:
                  <br />
                  <br />
                  <Feed.Meta>
                    <Feed.Like>
                      <Icon name="like" />
                      {item.likes.length} Likes
                    </Feed.Like>
                    <br />
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
                  <Feed.Date>
                    <Icon name="marker" />Hier noch Ort einfügen
                  </Feed.Date>
                </Feed.Summary>
              </Feed.Content>
            </div>

            <div className="right-div">
              <Feed.Extra text className="-post" style={item.data.picture ? { minHeight: "280px" } : { minHeight: "142px" }}>
                {item.data.picture ? <Image src={"/api/picture/" + item.data.picture} className="-feed-image" /> : null}
                <br />
                {item.data.text ? item.data.text : null}
                <br />
                {item.data.picture ? (
                  <Fragment>
                    <br />
                  </Fragment>
                ) : null}
              </Feed.Extra>
            </div>
            <Dropdown icon="ellipsis horizontal" className="dropdown">
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => handleShare(item.user.name, item)}>{item.user.name} folgen</Dropdown.Item>
                <Dropdown.Item text="Post melden" />
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <div style={{ height: "30px", width: "100%" }}>
            <Button size="mini" animated="fade" onClick={() => this.handleShare(item.user.name, item)} className="-float-left ">
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
        </Segment>
        <br />
      </Feed.Event>
    );
  }
}
