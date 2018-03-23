import React, { Component } from "react";
import { Feed, Icon } from "semantic-ui-react";

class OwnFeed extends Component {
  render() {
    return (
      <Feed>
        {this.props.blockchainFeed?this.props.blockchainFeed.map(item => {
          if(item.user==undefined)return null;
          return (
            <Feed.Event key={item.hash}>
              <Feed.Content>
                <Feed.Summary>
                <Feed.Date>{this.getDate(item.timestamp)}</Feed.Date><br/>
                  <a>{item.user.name}</a> posted:
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
