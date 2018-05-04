import React, { Component, Fragment } from "react";
import { Image, Item, Segment, Feed, Icon, Label, Grid, Pagination, Button, Card } from "semantic-ui-react";
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
class Impressum extends Component {
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
      <Layout activeItem="impressum" blockchainWrapper={this.blockchainWrapper} user={this.props.user} request={request}>
        <h1>Disclaimer</h1>
        <h2>Address</h2>
        <p>
          golddigger.io <br />
          Felix Waldbach, Isabel Staaden, Lars Bommersbach & Tino Metzger <br />
          Projekt der Vorlesung Web-Engineering <br />
          Kurs TINF16B <br />
          DHBW Stuttgart <br />
          Rotebühlplatz 41 <br />
          70197 Stuttgart
        </p>
        <h2>Privacy Policy</h2>
        <h5>What personal information do we collect from the people that visit our blog, website or app?</h5>
        When ordering or registering on our site, as appropriate, you may be asked to enter your name, email address or other details to
        help you with your experience.
        <h5>When do we collect information?</h5>
        We collect information from you when you register on our site or enter information on our site.
        <h5>How do we use your information?</h5>
        We may use the information we collect from you when you register, make a purchase, sign up for our newsletter, respond to a survey
        or marketing communication, surf the website, or use certain other site features in the following ways:
        <ul>
          <li>To quickly process your transactions.</li>
        </ul>
        <h5>How do we protect your information?</h5>
        We do not use vulnerability scanning and/or scanning to PCI standards. We only provide articles and information. We never ask for
        credit card numbers. We do not use Malware Scanning. Your personal information is contained behind secured networks and is only
        accessible by a limited number of persons who have special access rights to such systems, and are required to keep the information
        confidential. In addition, all sensitive/credit information you supply is encrypted via Secure Socket Layer (SSL) technology. We
        implement a variety of security measures when a user enters, submits, or accesses their information to maintain the safety of your
        personal information. All transactions are processed through a gateway provider and are not stored or processed on our servers.
        <h5>Do we use 'cookies'?</h5>
        Yes. Cookies are small files that a site or its service provider transfers to your computer's hard drive through your Web browser
        (if you allow) that enables the site's or service provider's systems to recognize your browser and capture and remember certain
        information. For instance, we use cookies to help us remember and process the items in your shopping cart. They are also used to
        help us understand your preferences based on previous or current site activity, which enables us to provide you with improved
        services. We also use cookies to help us compile aggregate data about site traffic and site interaction so that we can offer better
        site experiences and tools in the future. We use cookies to:
        <ul>
          <li>Understand and save user's preferences for future visits.</li>
          <li>
            Compile aggregate data about site traffic and site interactions in order to offer better site experiences and tools in the
            future. We may also use trusted third-party services that track this information on our behalf.
          </li>
        </ul>
        You can choose to have your computer warn you each time a cookie is being sent, or you can choose to turn off all cookies. You do
        this through your browser settings. Since browser is a little different, look at your browser's Help Menu to learn the correct way
        to modify your cookies. If you turn cookies off, Some of the features that make your site experience more efficient may not function
        properly.It won't affect the user's experience that make your site experience more efficient and may not function properly.
        <h5>Third-party disclosure</h5>
        We do not sell, trade, or otherwise transfer to outside parties your Personally Identifiable Information.
        <h5>Third-party links</h5>
        We do not include or offer third-party products or services on our website.
        <h5>How does our site handle Do Not Track signals?</h5>
        We honor Do Not Track signals and Do Not Track, plant cookies, or use advertising when a Do Not Track (DNT) browser mechanism is in
        place.
        <h5>Does our site allow third-party behavioral tracking?</h5>
        It's also important to note that we do not allow third-party behavioral tracking
        <h5>Fair Information Practices</h5>
        The Fair Information Practices Principles form the backbone of privacy law in the United States and the concepts they include have
        played a significant role in the development of data protection laws around the globe. Understanding the Fair Information Practice
        Principles and how they should be implemented is critical to comply with the various privacy laws that protect personal information.
        In order to be in line with Fair Information Practices we will take the following responsive action, should a data breach occur:{" "}
        <br />
        We will notify you via email
        <ul>
          <li>Within 1 business day</li>
        </ul>
        We also agree to the Individual Redress Principle which requires that individuals have the right to legally pursue enforceable
        rights against data collectors and processors who fail to adhere to the law. This principle requires not only that individuals have
        enforceable rights against data users, but also that individuals have recourse to courts or government agencies to investigate
        and/or prosecute non-compliance by data processors.
      </Layout>
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

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(Impressum);
