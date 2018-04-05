import React, { Component, Fragment } from "react";
import { Button, Feed, Icon, Segment, Grid, Image, Container, Dropdown } from "semantic-ui-react";
import Link from "next/link";
import { getDate } from "../components/utils/utils";

export default class FeedElement extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.checkForVideo();
  }

  checkForVideo() {
    const { item } = this.props;
    if (item.data.text.includes("https://youtu.be")) {
      let video = item.data.text.substring(item.data.text.indexOf("https://youtu.be") + 16);
      video = video.substring(video.indexOf("/"), video.indexOf(" "));
      this.state.video = video;
    } else if (item.data.text.includes("https://www.youtube.com/watch?v=")) {
      let video = item.data.text.substring(item.data.text.indexOf("https://www.youtube.com/watch?v=") + 32);
      video = video.substring(0, video.indexOf(" "));
      this.state.video = video;
    }
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
                <Feed.Summary>
                  <Link prefetch href={"./visit/" + item.user.name}>
                    <a>
                      <Image
                        src={item.user && item.user.profilePicture ? "/api/picture/" + item.user.profilePicture : "../static/bild.jpeg"}
                        avatar
                      />
                      {item.user.name}
                    </a>
                  </Link>{" "}
                  {item.shared ? "shared" : "posted"}:
                </Feed.Summary>
              </Feed.Content>
            </div>
            <br />
            <div className="-feed-font-size">
              <Feed.Extra text className="-post">
                {item.data.picture ? <Image src={"/api/picture/" + item.data.picture} className="-feed-image-mobile" /> : null}
                {!item.data.picture && this.state.video ? (
                  <iframe
                    style={{}}
                    src={"https://www.youtube.com/embed/" + this.state.video}
                    frameBorder="0"
                    allowFullscreen
                    className="-feed-video-mobile"
                  />
                ) : null}
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
                <Dropdown.Item>{item.user.name} folgen</Dropdown.Item>
                <Dropdown.Item text="Post melden" />
              </Dropdown.Menu>
            </Dropdown>
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
        </Segment>
        <br />
      </Feed.Event>
    );
  }
}
