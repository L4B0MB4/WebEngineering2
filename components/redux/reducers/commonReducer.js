import { actionTypes } from '../actions/commonActions';

const commonReducer = (state = {}, action) => {
  switch (action.type) {
    case actionTypes.RECEIVE_BLOCKCHAIN_FEED:
      return Object.assign({}, state, {payload:action.payload.blockchainFeed});
    default:
      return state;
  }
};

export default commonReducer;
