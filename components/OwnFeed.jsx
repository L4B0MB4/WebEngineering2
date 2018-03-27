import React, { Component } from "react";
import { Button, Feed, Icon } from "semantic-ui-react";
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
                  <Feed.Content>
                    <Feed.Summary>
                      <Feed.Date>{getDate(item.timestamp)}</Feed.Date>
                      <br />
                      <Link prefetch href={"/visit/" + item.user.name}>
                        <a>{item.user.name}</a>
                      </Link>{" "}
                      posted:
                      <br />
                      <Button size="mini" animated="fade" onClick={() => this.handleFollow(item.user.name)}>
                        <Button.Content visible>
                          <Icon name="add user" />
                        </Button.Content>
                        <Button.Content hidden>Follow</Button.Content>
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
                      <Button className="share-button" size="mini" animated="fade" onClick={() => this.handleShare(item.user.name, item)}>
                        <Button.Content visible>
                          <Icon name="share" />
                        </Button.Content>
                        <Button.Content hidden>Share</Button.Content>
                      </Button>
                    </Feed.Summary>
                    <Feed.Extra text>{item.data}</Feed.Extra>
                    <Feed.Meta>
                      <Feed.Like>
                        <Icon name="like" />
                        {item.likes.length} Likes
                      </Feed.Like>
                    </Feed.Meta>
                  </Feed.Content>
                </Feed.Event>
              );
            })
          : null}
      </Feed>
    );
  }
}

export default OwnFeed;
