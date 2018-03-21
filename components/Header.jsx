import React, { Component } from "react";
import { Menu } from "semantic-ui-react";

export default class Header extends Component {
  render() {
    return (
      <div>
        <link
          rel="stylesheet"
          href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.12/semantic.min.css"
        />
        <link rel="stylesheet" href="static/style.css" />
        <Menu fluid widths={1} size="massive" className="header">
          <Menu.Item>GOLDdigger.io</Menu.Item>
        </Menu>
      </div>
    );
  }
}
