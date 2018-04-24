import React, { Component, Fragment } from "react";
import { Image, Item, Segment, Feed, Icon, Label, Grid, Pagination, Button, Card } from "semantic-ui-react";
import OwnHeader from "../components/HeaderUnconnected";
import Layout from "../components/layout.jsx";
import Lux from "../components/Lux";
import { bindActionCreators } from "redux";
import {
  receiveBlockchainFeed,
  receiveUser,
  receiveVisitedUserContent,
  receiveVisitedUserFollower,
  receiveBlockchainWrapper,
  receiveNews
} from "../components/redux/actions/commonActions";
import initStore from "../components/redux/store";
import withRedux from "next-redux-wrapper";
import Request from "../components/utils/request";

const request = new Request();
class Kontakt extends Component {
  static async getInitialProps({ store, query, req }) {
    if (req) {
      store.dispatch(receiveBlockchainFeed(query.blockchainFeed));
      store.dispatch(receiveUser(query.user));
    } else {
      let res = await request.callgetFollowerFeed();
      store.dispatch(receiveBlockchainFeed(res.data));
      res = await request.callGetUser();
      store.dispatch(receiveUser(res.data));
    }
    receiveNews([]);
  }

  render() {
    return (
      <Lux>
        <Layout activeItem="about" blockchainWrapper={this.blockchainWrapper} user={this.props.user} request={request}>
          <h1>About us</h1>
          <br />
          <br />
          <br />
          <Card.Group centered itemsPerRow={2} doubling>
            <Card>
              <Image src="../static/lars.jpeg" />
              <Card.Content>
                <Card.Header>Lars Bommersbach</Card.Header>
                <Card.Meta>CEO, Leading Tech Specialist & Blockchain Inventor and Innovator</Card.Meta>
                <Card.Description>
                  In this case the title says it all: You can't spell Blockchain without Lars Bommersbach. The two time NFL MVP and leading
                  hammer throw world record holder changed the whole business world with his new and completely different, decentralized
                  finance and transaction mechanism. Because this is not enough he founded golddigger.io and while ruining every
                  world-leading global bank he is also changing the game of Social Media right now. Thanks to this man the future looks
                  bright. Oh, and just in case you are attempting to steal his loved motorcycle: Don't attempt it unless you can hack RSA
                  encryption.
                </Card.Description>
              </Card.Content>
            </Card>

            <Card>
              <Image src="../static/isi.jpg" size="large" />
              <Card.Content>
                <Card.Header>Isabel Staaden</Card.Header>
                <Card.Meta>Frontend Makeup Specialist & Worldwide Women Ambassador</Card.Meta>
                <Card.Description>
                  Isabel was already one of the biggest players in IT business when everything started in the Silicon Valley in 1951. The
                  fact that you can't tell her age by her looks (compared to her old friend and apprentice Bill Gates) says everything about
                  her Makeup skills. Because of her passion for gold chains, shoes, teeth and even golden food everyone who was involved in
                  the deal knew that she would be the right one to finally make golddigger.io unique.
                </Card.Description>
              </Card.Content>
            </Card>

            <Card>
              <Image src="../static/felix.jpg" />
              <Card.Content>
                <Card.Header>Prof. Dr. Med. Felix Waldbach</Card.Header>
                <Card.Meta>Backend of Excellence Lead Engineer North America and NBA Commissioner</Card.Meta>
                <Card.Description>
                  Dr. Waldbach is the leading Backend Engineer for all departments in North America. He graduated in Applied Medicine and
                  Super Human Science in 2012 but decided to switch to something bigger. Today most people know him for his excellent
                  contribution to global web applications like golddigger.io, wasgehtdigger.io and aufsmauldigga.io.
                </Card.Description>
              </Card.Content>
            </Card>

            <Card>
              <Image src="../static/tino.jpg" />
              <Card.Content>
                <Card.Header>Tino Metzger</Card.Header>
                <Card.Meta>Incarnate hyperbrain in Frontend Chief Development & Anti Greenhouse Effect Activist </Card.Meta>
                <Card.Description>
                  Even though Tino just joint the golddigger.io association on 4/20 you can already see his massive impact on the unique and
                  revolutionary frontend design and also the user count. Because he has connections to Greenhouse people from all over the
                  world he was able to create a massive fanbase for this organization. So whenever you dig some gold here just remember that
                  this OG mbzy made all of this possible.
                </Card.Description>
              </Card.Content>
            </Card>
          </Card.Group>
        </Layout>
      </Lux>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  receiveBlockchainFeed: bindActionCreators(receiveBlockchainFeed, dispatch),
  receiveBlockchainWrapper: bindActionCreators(receiveBlockchainWrapper, dispatch),
  receiveNews: bindActionCreators(receiveNews, dispatch)
});

const mapStateToProps = state => ({
  blockchainFeed: state.commonReducer.blockchainFeed,
  user: state.commonReducer.user,
  userContent: state.commonReducer.userContent,
  followers: state.commonReducer.followers,
  blockchainWrapper: state.commonReducer.blockchainWrapper,
  news: state.commonReducer.news
});

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(Kontakt);
