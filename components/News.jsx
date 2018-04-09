import React, { Component } from "react";
import { List, Image } from "semantic-ui-react";

export default class News extends Component {
  render() {
    const { news } = this.props;
    if (!news || news.length == 0) return;
    return (
      <List>
        {news.map(item => {
          return (
            <List.Item>
              <Image avatar src="/assets/images/avatar/small/rachel.png" />
              <List.Content>
                <List.Header as="a">{item.sender}</List.Header>
                <List.Description>{item.type}d your content</List.Description>
              </List.Content>
            </List.Item>
          );
        })}
      </List>
    );
  }
}
