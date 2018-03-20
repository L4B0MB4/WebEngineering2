import React from 'react'
import { Grid, Image } from 'semantic-ui-react'

const Layout = () => (
  <Grid celled='internally'>
    <Grid.Row>
      <Grid.Column width={3}>
        Menüleiste
      </Grid.Column>
      <Grid.Column width={10}>
        Feed
      </Grid.Column>
      <Grid.Column width={3}>
        Footer
      </Grid.Column>
    </Grid.Row>
  </Grid>
)

export default Layout
