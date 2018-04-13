import React, { Component } from "react";
import { List, Image } from "semantic-ui-react";

export default class News extends Component {
  render() {
    let i = 0;
    const { news } = this.props;
    if (!news) return "No news currently";
    return (
      <List>
        {news ? (
          news.map(item => {
            i++;
            return (
              <List.Item style={{ minWidth: "200px" }} key={i}>
                <Image
                  src={item.user && item.user.profilePicture ? "/api/picture/" + item.user.profilePicture : "../static/bild.jpeg"}
                  avatar
                />
                <List.Content>
                  <List.Header as="a">{item.user ? item.user.name : "someone"}</List.Header>
                  <List.Description>{item.type}d your content</List.Description>
                </List.Content>
              </List.Item>
            );
          })
        ) : (
          <List.Item>
            <List.Content>
              <List.Header>No news currently</List.Header>
            </List.Content>
          </List.Item>
        )}
      </List>
    );
  }
}
