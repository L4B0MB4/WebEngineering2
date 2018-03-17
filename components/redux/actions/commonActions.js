import Request from '../../request';

export const actionTypes = {
  RECEIVE_INFO: 'RECEIVE_INFO',
};

export function receiveInfo(data) {
  return {
    type: actionTypes.RECEIVE_INFO,
    payload:
    {
      data
    }
  };
}
