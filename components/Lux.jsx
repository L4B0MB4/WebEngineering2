import React, { Component, Fragment } from "react";

export default class Lux extends Component {
  render() {
    return (
      <Fragment>
        <title>Golddigger IO</title>
        <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.12/semantic.min.css " />
        <link rel="stylesheet" href={this.props.relPath ? this.props.relPath + "static/style.css" : "static/style.css"} />
        {this.props.children}
      </Fragment>
    );
  }
}
