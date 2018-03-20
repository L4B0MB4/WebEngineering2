import React, {Component} from "react";
import { Grid, Image } from "semantic-ui-react";

export default class Layout extends Component
{
  render ()
  {
    return(
      <div>
        <link
          rel="stylesheet"
          href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.12/semantic.min.css"
        />
        <Grid celled="internally">
          <Grid.Row>
            <Grid.Column width={3}>Menüleiste</Grid.Column>
            <Grid.Column width={10}>{this.props.children}</Grid.Column>
            <Grid.Column width={3}>Footer</Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    )
  }
}
