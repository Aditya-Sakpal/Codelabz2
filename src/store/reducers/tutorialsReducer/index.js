import { combineReducers } from "redux";
import editorReducer from "./editorReducer";
import dataReducer from "./dataReducer";
import createReducer from "./createReducer";
import currentReducer from "./currentReducer";
import imageReducer from "./imageReducer";
import voteReducer from "./voteReducer";
import votedCommentsReducer from "./votedCommentsReducer";

export default combineReducers({
  editor: editorReducer,
  data: dataReducer,
  create: createReducer,
  current: currentReducer,
  images: imageReducer,
  votes: voteReducer,
  votedComments: votedCommentsReducer
});
