import * as actions from "../../actions/actionTypes";

const initialState = {
    likedTutorialComments: [],
    loading: false,
    error: null
}


const TutorialsCommentVoteReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case actions.GET_VOTED_TUTORIAL_COMMENTS_START:
            return {
                ...state,
                loading: true,
                error: null
            }
        case actions.GET_VOTED_TUTORIAL_COMMENTS_SUCCESS:
            return {
                ...state,
                likedTutorialComments: payload,
                loading: false,
                error: false
            };

        case actions.GET_VOTED_TUTORIAL_COMMENTS_FAIL:
            return {
                ...state,
                loading: false,
                error: payload
            };

        default:
            return state;
    }
}

export default TutorialsCommentVoteReducer;