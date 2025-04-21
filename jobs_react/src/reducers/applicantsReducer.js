import { SET_APPLICANTS } from "../actions/applicantActions";

const initialState = {
  applicants: [],
  loading: false
};

export const applicantsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_APPLICANTS:
      return {
        ...state,
        applicants: action.payload,
        loading: false,
      };
    default:
      return state;
  }
};
