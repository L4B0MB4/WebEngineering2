import React, { Component } from "react";
import { Button, Feed, Icon } from "semantic-ui-react";
import Request from "../components/utils/request";
const request = new Request();


class OwnFeed extends Component {

  handleLike=async(username,previousHash)=>
  {
    let publicKey = (await request.callGetPublicKey({username})).data.publicKey
    this.props.blockchainWrapper.newTransaction("like",{previousHash,userKey:publicKey});
  }

  render() {
    return (
      <Feed>
        {this.props.blockchainFeed?this.props.blockchainFeed.map(item => {
          if(item.user==undefined)return null;
          return (
            <Feed.Event key={item.timestamp}>
              <Feed.Content>
                <Feed.Summary>
                <Feed.Date>{this.getDate(item.timestamp)}</Feed.Date><br/>
                  <a>{item.user.name}</a> posted:
                  <br/>
                  <Button size="mini" animated="fade" onClick={()=>this.handleFollow(item.user.name)}>
                    <Button.Content visible>
                      <Icon name="add user" />
                    </Button.Content>
                    <Button.Content hidden>Follow</Button.Content>
                  </Button>
                  <Button className="like-button" size="mini" animated="fade" onClick={()=>this.handleLike(item.user.name,item.previousHash)} >
                    <Button.Content visible>
                      <Icon name="heart" />
                    </Button.Content>
                    <Button.Content hidden>Like</Button.Content>
                  </Button>
                </Feed.Summary>
                <Feed.Extra text>{item.data}</Feed.Extra>
                <Feed.Meta>
                  <Feed.Like>
                    <Icon name="like" />
                    1 Likes
                  </Feed.Like>
                </Feed.Meta>
              </Feed.Content>
            </Feed.Event>
          );
        }):null}
      </Feed>
    );
  }

  getDate = timestamp => {
    let d = new Date(timestamp);
    let hrs = d.getHours();
    let mins = d.getMinutes();
    let days = d.getDay();
    let mnth = d.getMonth();
    let year = d.getFullYear();
    if (hrs < 10) hrs = "0" + hrs;
    if (mins < 10) mins = "0" + mins;
    if (days < 10) days = "0" + days;
    if (mnth < 10) mnth = "0" + mnth;
    return hrs + ":" + mins + " " + days + "." + mnth + "." + year;
  };
}

export default OwnFeed;
