import React, { Component, Fragment } from "react";
import { Button, Feed, Icon, Segment, Grid, Image, Container, Dropdown } from "semantic-ui-react";
import Request from "../components/utils/request";
import Link from "next/link";
import { getDate } from "../components/utils/utils";
const request = new Request();

class OwnFeed extends Component {
  handleLike = async (username, previousHash) => {
    let publicKey = (await request.callGetPublicKey({ username })).data.publicKey;
    if (!this.props.blockchainWrapper.alreadyLiked(previousHash, publicKey)) {
      this.props.blockchainWrapper.newTransaction("like", {
        previousHash,
        userKey: publicKey
      });
    }
  };

  handleShare = async (username, item) => {
    if (item.shared) return;
    let publicKey = (await request.callGetPublicKey({ username })).data.publicKey;
    this.props.blockchainWrapper.newTransaction("share", {
      previousHash: item.previousHash,
      userKey: publicKey
    });
  };

  render() {
    return (
      <Feed>
        {this.props.blockchainFeed
          ? this.props.blockchainFeed.map(item => {
            if (item.user == undefined) return null;
            return (
              <Feed.Event key={item.timestamp}>
                <Segment raised className="-segment">
                  <div className="left-div">
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
                    <Feed.Extra text className="-post">
                      <Feed.Extra images>
                        <a>{item.data.picture ? <img src={"/api/picture/" + item.data.picture} /> : null}</a>
                      </Feed.Extra>
                      <br />
                      {item.data.text ? item.data.text : null}
                      <br />
                      {item.data.picture ? (
                        <Fragment>
                          <br />
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
                  <Button className="share-button" size="mini" animated="fade" onClick={() => this.handleShare(item.user.name, item)}>
                    <Button.Content visible>
                      <Icon name="share" />
                    </Button.Content>
                    <Button.Content hidden>Share</Button.Content>
                  </Button>
                  <Button
                    className="like-button"
                    size="mini"
                    animated="fade"
                    onClick={() => this.handleLike(item.user.name, item.previousHash)}>
                    <Button.Content visible>
                      <Icon name="heart" />
                    </Button.Content>
                    <Button.Content hidden>Like</Button.Content>
                  </Button>
                </Segment>
                <br />
              </Feed.Event>
            );
          })
          : null}
      </Feed>
    );
  }
}

export default OwnFeed;
