import { actionTypes } from "../actions/commonActions";

const commonReducer = (state = {}, action) => {
  switch (action.type) {
    case actionTypes.RECEIVE_BLOCKCHAIN_FEED:
      return Object.assign({}, state, { blockchainFeed: action.payload });
    case actionTypes.RECEIVE_USER:
      return Object.assign({}, state, { user: action.payload });
    case actionTypes.RECEIVE_VISITED_USER:
      return Object.assign({}, state, { visitedUser: action.payload });
    case actionTypes.RECEIVE_VISITED_USER_CONTENT:
      return Object.assign({}, state, { userContent: action.payload });
    case actionTypes.RECEIVE_VISITED_USER_FOLLOWER:
      return Object.assign({}, state, { followers: action.payload });
    case actionTypes.RECEIVE_BLOCKCHAIN_WRAPPER:
      return Object.assign({}, state, { blockchainWrapper: action.payload });
    case actionTypes.RECEIVE_LIKES:
      return Object.assign({}, state, { likes: action.payload });
    case actionTypes.RECEIVE_NEWS:
      return Object.assign({}, state, { news: action.payload });
    case actionTypes.RECEIVE_FEATURED_USERS:
      return Object.assign({}, state, { featuredUsers: action.payload });
    default:
      return state;
  }
};

export default commonReducer;
