import { TEST_DISPATCH} from './types';

// Register User
// This is an action creator
export const registerUser = (userData) => {
  return {
    type: TEST_DISPATCH,
    payload: userData,
  };
};