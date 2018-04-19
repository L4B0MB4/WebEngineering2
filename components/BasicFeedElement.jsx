import React, { Component, Fragment } from "react";
import { Button, Feed, Icon, Segment, Grid, Image, Container, Dropdown, Comment, Form, TextArea, Label } from "semantic-ui-react";
import Link from "next/link";
import { getDate } from "../components/utils/utils";
import { handleLike } from "./utils/utils";

export default class FeedElement extends Component {
  checkForVideo() {
    const { item } = this.props;
    if (item.data.text.includes("https://youtu.be")) {
      let video = item.data.text.substring(item.data.text.indexOf("https://youtu.be") + 16);
      video = video.substring(video.indexOf("/"), video.indexOf(" "));
      this.state.video = "https://www.youtube.com/embed/" + video;
    } else if (item.data.text.includes("https://www.youtube.com/watch?v=")) {
      let video = item.data.text.substring(item.data.text.indexOf("https://www.youtube.com/watch?v=") + 32);
      this.state.video = "https://www.youtube.com/embed/" + video;
    } else if (item.data.text.includes("https://open.spotify.com/track/")) {
      let video = item.data.text.substring(item.data.text.indexOf("https://open.spotify.com/track/") + 31);
      video = video.substring(0, video.indexOf("?"));
      this.state.video = "https://open.spotify.com/embed/track/" + video;
    }
  }

  getCommentForm(classthis) {
    return (
      <div className="-full-width">
        <br />
        <Form size="mini">
          <Form.Group unstackable widths={16} >
            <Form.Field style={{ width: "calc(100% - 96px)" }}>
              <TextArea
                placeholder="Comment here..."
                value={undefined}
                rows={1}
                onChange={e => this.setState({ content: e.target.value, textArea: e.target })}
                style={{ minHeight: "35px" }}
              />
            </Form.Field>
            <Form.Field style={{ textAlign: "center", width: "96px" }}>
              <Button
                type="submit"
                size="mini"
                loading={classthis.isLoading() ? true : false}
                color={classthis.isSuccessfull() ? "green" : null}
                onClick={classthis.isLoading() ? null : classthis.sendContent}
                style={{ minHeight: "35px", width: "100%" }}>
                {classthis.isSuccessfull() ? "Success" : "Comment"}
              </Button>
            </Form.Field>
          </Form.Group>
        </Form>
      </div>
    );
  }

  getComments(item, user) {
    const { comments } = item;
    return (
      <Comment.Group size="mini">
        {comments
          ? comments.map(comment => {
            return (
              <Comment>
                <Comment.Avatar
                  as="a"
                  src={comment.user && comment.user.profilePicture ? "/api/picture/" + comment.user.profilePicture : "../static/bild.jpeg"}
                />
                <Comment.Content>
                  <Comment.Author as="a">{comment.user.name}</Comment.Author>
                  <Comment.Metadata>
                    <div className="-feed-comment-font-color">
                      {comment.likes.length} <Icon name="heart" />
                    </div>
                    <div>{getDate(comment.timestamp)}</div>
                  </Comment.Metadata>
                  <Comment.Text>{comment.data.text}</Comment.Text>
                  <Comment.Actions>
                    <Comment.Action onClick={() => handleLike(this.props.blockchainWrapper, user.name, comment.previousHash)}>
                      <Icon name="heart" style={{ color: "#daa520" }} /> <span className="-feed-comment-font-color">Like!</span>
                    </Comment.Action>
                  </Comment.Actions>
                </Comment.Content>
              </Comment>
            );
          })
          : null}
      </Comment.Group>
    );
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
          <Dropdown.Item>Follow {item.user.name}</Dropdown.Item>
          <Dropdown.Item text="Report Post" />
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
        {item.data.text ? (
          <Fragment>
            {item.data.text}
            <br />
          </Fragment>
        ) : null}
      </Feed.Extra>
    );
  }

  getLikeAndShare(handleLike, handleShare, item) {
    return (
      <Fragment>
        <Button as="div" labelPosition='right' size="mini" animated="fade" onClick={handleShare} className="-float-left -share-button ">
          <Button size="mini">
            <Button.Content visible>
              <Icon name="share" />
            </Button.Content>
            <Button.Content hidden className="-hidden-content">Share</Button.Content>
          </Button>
          <Label as="a" basic pointing='left'>2 k</Label>
        </Button>

        <Button size="mini" animated="fade" onClick={handleLike} className="-float-right -like-button">
          <Button.Content visible>
            <Icon name="heart" />
          </Button.Content>
          <Button.Content hidden>Like</Button.Content>
        </Button>
      </Fragment>
    );
  }
}
