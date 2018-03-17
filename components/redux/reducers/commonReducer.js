import { actionTypes } from '../actions/commonActions';

const ProfileReducer = (state = {}, action) => {
  switch (action.type) {
    case actionTypes.RECEIVE_INFO:
      return Object.assign({}, state, {info:{payload:action.payload}});
    default:
      return state;
  }
};

export default ProfileReducer;
