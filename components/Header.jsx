import React, { Component, Fragment } from "react";
import { Menu, Container, Icon, Popup, Button, Grid, Label } from "semantic-ui-react";
import News from "./News";
import { connect } from "react-redux";

class Header extends Component {
  render() {
    let { setOpenSidebar, news } = this.props;
    return (
      <Fragment>
        <title>Golddigger IO</title>
        <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.12/semantic.min.css " />
        <link rel="stylesheet" href={this.props.relPath ? this.props.relPath + "static/style.css" : "static/style.css"} />
        <Container fluid>
          <Menu fluid widths={1} size="massive">
            <Menu.Item className="-header-menu">
              <Grid style={{ width: "inherit", height: "inherit" }}>
                <Grid.Column className="-no-padding" width="3" />
                <Grid.Column className="-no-padding" width="10">
                  <span className="-header">golddigger.io</span>
                </Grid.Column>
                <Grid.Column className="-no-padding -header-news " width="3">
                  <Popup
                    trigger={
                      <Button as="div" className="-header-news-button" labelPosition="right">
                        <Button icon>
                          <Icon name="newspaper" /> News
                        </Button>
                        <Label as="a" basic pointing="left">
                          {news && news.length ? news.length : 0}
                        </Label>
                      </Button>
                    }
                    on="click"
                    hideOnScroll
                    horizontalOffset={70}
                    basic>
                    <News news={news} />
                  </Popup>
                </Grid.Column>
              </Grid>
            </Menu.Item>
          </Menu>
          {setOpenSidebar ? <Icon name="sidebar" onClick={() => setOpenSidebar(true)} className="-header-icon -clickable" /> : null}
        </Container>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  news: state.commonReducer.news
});

export default connect(mapStateToProps)(Header);
