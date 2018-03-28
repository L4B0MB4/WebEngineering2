import React, { Component } from "react";
import { Button, Feed, Icon, Segment, Grid, Image } from "semantic-ui-react";
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
              <Segment raised className="-post -segment" key={item.timestamp}>
                <Feed.Event>
                  <div>
                    <div className="left-div">
                      <Feed.Content>
                        <Feed.Summary>
                          <Link prefetch href={"/visit/" + item.user.name}>
                            <a>
                              <Image src="../static/bild.jpeg" avatar />
                              {item.user.name}
                            </a>
                          </Link>{" "}{item.shared ? "shared" : "posted"}:
                          <Button className="follow-button" size="mini" animated="fade" onClick={() => this.handleFollow(item.user.name)}>
                            <Button.Content visible>
                              <Icon name="add user" />
                            </Button.Content>
                            <Button.Content hidden>Follow</Button.Content>
                          </Button>
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
                            <Icon name="wait" />{getDate(item.timestamp)}
                          </Feed.Date>
                          <Feed.Date>
                            <Icon name="marker" />Hier noch Ort einfügen
                          </Feed.Date>
                        </Feed.Summary>
                      </Feed.Content>
                    </div>

                    <div className="right-div">
                      <Feed.Extra text>{item.data}</Feed.Extra>
                    </div>
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
                  </div>
                </Feed.Event>
              </Segment>
            );
          })
          : null}
      </Feed>
    );
  }
}

export default OwnFeed;
