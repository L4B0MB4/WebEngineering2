import React, { Component, Fragment } from "react";

export default class Lux extends Component {
  render() {
    return (
      <Fragment>
        <title>Golddigger IO</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.12/semantic.min.css " />
        <link rel="stylesheet" href={"static/style.css"} />
        {this.props.children}
      </Fragment>
    );
  }
}
