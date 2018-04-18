import React, { Component, Fragment } from "react";
import { Menu, Container, Icon, Popup, Button, Grid, Label } from "semantic-ui-react";
import News from "./News";
import { connect } from "react-redux";

class Header extends Component {
  render() {
    let { setOpenSidebar, news } = this.props;
    return (
      <Fragment>
        <Container fluid>
          <Menu fluid widths={1} size="massive">
            <Menu.Item className="-header-menu">
              <Grid style={{ width: "inherit", height: "inherit" }}>
                <Grid.Column className="-no-padding" mobile={1} tablet={3} computer={3} />
                <Grid.Column className="-no-padding" mobile={7} tablet={10} computer={10}>
                  <span className="-header">golddigger.io</span>
                </Grid.Column>
                <Grid.Column className="-no-padding -header-news " mobile={8} tablet={3} computer={3}>
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
                  {setOpenSidebar ? <Icon name="sidebar" onClick={() => setOpenSidebar(true)} className="-header-icon -clickable" /> : null}
                </Grid.Column>
              </Grid>
            </Menu.Item>
          </Menu>
        </Container>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  news: state.commonReducer.news
});

export default connect(mapStateToProps)(Header);
