import React, { Component, Fragment } from "react";
import { Button, Feed, Icon, Segment, Grid, Image, Container, Dropdown } from "semantic-ui-react";
import Link from "next/link";

export default class FeedElement extends Component {
  checkForVideo() {
    const { item } = this.props;
    if (item.data.text.includes("https://youtu.be")) {
      let video = item.data.text.substring(item.data.text.indexOf("https://youtu.be") + 16);
      video = video.substring(video.indexOf("/"), video.indexOf(" "));
      this.state.video = "https://www.youtube.com/embed/" + video;
    } else if (item.data.text.includes("https://www.youtube.com/watch?v=")) {
      let video = item.data.text.substring(item.data.text.indexOf("https://www.youtube.com/watch?v=") + 32);
      video = video.substring(0, video.indexOf(" "));
      this.state.video = "https://www.youtube.com/embed/" + video;
    } else if (item.data.text.includes("https://open.spotify.com/track/")) {
      let video = item.data.text.substring(item.data.text.indexOf("https://open.spotify.com/track/") + 31);
      video = video.substring(0, video.indexOf("?"));
      this.state.video = "https://open.spotify.com/embed/track/" + video;
    }
  }

  getUserSection(item) {
    return (
      <Fragment>
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
        <br />
        <br />
      </Fragment>
    );
  }

  getDropDown(item) {
    return (
      <Dropdown icon="ellipsis horizontal" className="dropdown">
        <Dropdown.Menu>
          <Dropdown.Item>{item.user.name} folgen</Dropdown.Item>
          <Dropdown.Item text="Post melden" />
        </Dropdown.Menu>
      </Dropdown>
    );
  }

  getContent(item, isMobile = false) {
    return (
      <Feed.Extra text className="-post">
        {item.data.picture ? (
          <Image src={"/api/picture/" + item.data.picture} className={isMobile ? "-feed-image-mobile" : "-feed-image"} />
        ) : null}
        {!item.data.picture && this.state.video ? (
          <iframe
            src={this.state.video}
            frameBorder="0"
            allowFullScreen
            allowtransparency="true"
            allow="encrypted-media"
            className={isMobile ? "-feed-video-mobile" : "-feed-video"}
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
    );
  }
}
