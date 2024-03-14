import * as actions from "../../actions/actionTypes";

const initialState = {
    likedTutorials: [],
    loading: false,
    error: null
}

const TutorialsVoteReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case actions.GET_VOTED_TUTORIALS_START:
            return {
                ...state,
                loading: true,
                error: null
            }
        case actions.GET_VOTED_TUTORIALS_SUCCESS:
            return {
                ...state,
                likedTutorials: payload,
                loading: false,
                error: false
            };

        case actions.GET_VOTED_TUTORIALS_FAIL:
            return {
                ...state,
                loading: false,
                error: payload
            };

        default:
            return state;
    }
}

export default TutorialsVoteReducer;