import url from "../../utils/url";
import { FETCH_DATA } from "../middleware/api";
import { schema as keywordSchema, getKeywordById, getAllKeywords } from "./entities/keywords";
import { schema as shopSchema, getShopById, getAllShops } from "./entities/shops";
import { combineReducers } from "redux";
import {createSelector} from "reselect";

export const types = {
  FETCH_POPULAR_KEYWORDS_REQUEST: "SEARCH/FETCH_POPULAR_KEYWORDS_REQUEST",
  FETCH_POPULAR_KEYWORDS_SUCCESS: "SEARCH/FETCH_POPULAR_KEYWORDS_SUCCESS",
  FETCH_POPULAR_KEYWORDS_FAILURE: "SEARCH/FETCH_POPULAR_KEYWORDS_FAILURE",
  FETCH_RELATED_KEYWORDS_REQUEST: "SEARCH/FETCH_RELATED_KEYWORDS_REQUEST",
  FETCH_RELATED_KEYWORDS_SUCCESS: "SEARCH/FETCH_RELATED_KEYWORDS_SUCCESS",
  FETCH_RELATED_KEYWORDS_FAILURE: "SEARCH/FETCH_RELATED_KEYWORDS_FAILURE",
  SET_INPUT_TEXT: "SEARCH/SET_INPUT_TEXT",
  CLEAR_INPUT_TEXT: "SEARCH/CLEAR_INPUT_TEXT",
  ADD_HISTORY_KEYWORD: "SEARCH/ADD_HISTORY_KEYWORD",
  CLEAR_HISTORY_KEYWORDS: "SEARCH/CLEAR_HISTORY_KEYWORDS",
  FETCH_SHOPS_REQUEST: "SEARCH/FETCH_SHOPS_REQUEST",
  FETCH_SHOPS_SUCCESS: "SEARCH/FETCH_SHOPS_SUCCESS",
  FETCH_SHOPS_FAILURE: "SEARCH/FETCH_SHOPS_FAILURE",
};

const initialState = {
  inputText: "",
  popularKeywords: {
    isFetching: false,
    ids: [],
  },

  /**
   * relatedKeywords对象结构:
   * {
   *  '火锅': {
   *      isFetching: false,
   *      ids: []
   *   }
   * }
   */
  relatedKeywords: {},

  historyKeywords: [], //保存关键词ids
  /**
   * searchedShopsByKeyword对象结构:
   * {
   *  keywordId: {
   *      isFetching: false,
   *      ids: []
   *   }
   * }
   */
  searchedShopsByKeyword: {},
};

export const actions = {
  loadPopularKeywords: () => {
    return (dispatch, getState) => {
      const { ids } = getState().search.popularKeywords;
      if (ids.length > 0) {
        return null;
      }
      const endpoint = url.getPopularKeywords();
      return dispatch(fetchPopularKeywords(endpoint));
    };
  },
  loadRelatedKeywords: (text) => {
    return (dispatch, getState) => {
      const { relatedKeywords } = getState().search;
      if (relatedKeywords[text]) {
        return null;
      }
      const endpoint = url.getRelatedKeywords(text);
      return dispatch(fetchRelatedKeywords(text, endpoint));
    };
  },
  loadRelatedShops: (keywordId) => {
    return (dispatch, getState) => {
      const { searchedShopsByKeyword } = getState().search;
      if (searchedShopsByKeyword[keywordId]) {
        return null;
      }
      const endpoint = url.getRelatedShops(keywordId);
      return dispatch(fetchRelatedShops(keywordId, endpoint));
    };
  },
  setInputText: (text) => ({
    type: types.SET_INPUT_TEXT,
    text,
  }),
  clearInputText: () => ({
    type: types.CLEAR_INPUT_TEXT,
  }),
  addHistoryKeyword: (keywordId) => ({
    type: types.ADD_HISTORY_KEYWORD,
    text: keywordId,
  }),
  clearHistoryKeywords: () => ({
    type: types.CLEAR_HISTORY_KEYWORDS,
  }),
};

const fetchPopularKeywords = (endpoint) => ({
  [FETCH_DATA]: {
    types: [
      types.FETCH_POPULAR_KEYWORDS_REQUEST,
      types.FETCH_POPULAR_KEYWORDS_SUCCESS,
      types.FETCH_POPULAR_KEYWORDS_FAILURE,
    ],
    endpoint,
    schema: keywordSchema,
  },
});

const fetchRelatedKeywords = (text, endpoint) => ({
  [FETCH_DATA]: {
    types: [
      types.FETCH_RELATED_KEYWORDS_REQUEST,
      types.FETCH_RELATED_KEYWORDS_SUCCESS,
      types.FETCH_RELATED_KEYWORDS_FAILURE,
    ],
    endpoint,
    schema: keywordSchema,
  },
  text,
});

const fetchRelatedShops = (text, endpoint) => ({
  [FETCH_DATA]: {
    types: [
      types.FETCH_SHOPS_REQUEST,
      types.FETCH_SHOPS_SUCCESS,
      types.FETCH_SHOPS_FAILURE,
    ],
    endpoint,
    schema: shopSchema,
  },
  text,
});

//reducer
const popularKeywords = (state = initialState.popularKeywords, aciton) => {
  switch (aciton.type) {
    case types.FETCH_POPULAR_KEYWORDS_REQUEST:
      return { ...state, isFetching: true };
    case types.FETCH_POPULAR_KEYWORDS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        ids: state.ids.concat(aciton.response.ids),
      };
    case types.FETCH_POPULAR_KEYWORDS_FAILURE:
      return {
        ...state,
        isFetching: false,
      };
    default:
      return state;
  }
};

const relatedKeywords = (state = initialState.relatedKeywords, action) => {
  switch (action.type) {
    case types.FETCH_RELATED_KEYWORDS_REQUEST:
    case types.FETCH_RELATED_KEYWORDS_SUCCESS:
    case types.FETCH_RELATED_KEYWORDS_FAILURE:
      return {
        ...state,
        [action.text]: relatedKeywordsByText(state[action.text], action),
      };
    default:
      return state;
  }
};

const relatedKeywordsByText = (
  state = {
    isFetching: false,
    ids: [],
  },
  action
) => {
  switch (action.type) {
    case types.FETCH_RELATED_KEYWORDS_REQUEST:
      return { ...state, isFetching: true };
    case types.FETCH_RELATED_KEYWORDS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        ids: state.ids.concat(action.response.ids),
      };
    case types.FETCH_RELATED_KEYWORDS_FAILURE:
      return {
        ...state,
        isFetching: false,
      };
    default:
      return state;
  }
};

const searchedShopsByKeyword = (
  state = initialState.searchedShopsByKeyword,
  action
) => {
  switch (action.type) {
    case types.FETCH_SHOPS_REQUEST:
    case types.FETCH_SHOPS_SUCCESS:
    case types.FETCH_SHOPS_FAILURE:
      return {
        ...state,
        [action.text]: searchedShops(state[action.text], action),
      };
    default:
      return state;
  }
};

const searchedShops = (
  state = {
    isFetching: false,
    ids: [],
  },
  action
) => {
  switch (action.type) {
    case types.FETCH_SHOPS_REQUEST:
      return { ...state, isFetching: true };
    case types.FETCH_SHOPS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        ids: action.response.ids,
      };
    case types.FETCH_SHOPS_FAILURE:
      return {
        ...state,
        isFetching: false,
      };
    default:
      return state;
  }
};

const inputText = (state = initialState.inputText, action) => {
  switch (action.type) {
    case types.SET_INPUT_TEXT:
      return action.text;
    case types.CLEAR_INPUT_TEXT:
      return "";
    default:
      return state;
  }
};

const historyKeywords = (state = initialState.historyKeywords, action) => {
  switch (action.type) {
    case types.ADD_HISTORY_KEYWORD:
      const data = state.filter((item) => {
        if (item !== action.text) {
          return true;
        }
        return false;
      });
      return [action.text, ...data];
    case types.CLEAR_HISTORY_KEYWORDS:
      return [];
    default:
      return state;
  }
};

const reducer = combineReducers({
  popularKeywords,
  relatedKeywords,
  inputText,
  historyKeywords,
  searchedShopsByKeyword,
});

export default reducer;

//selectors
export const getPopularKeywords = state => {
  return state.search.popularKeywords.ids.map((id) => {
    return getKeywordById(state, id);
  });
};

export const getInputText = state => {
  return state.search.inputText;
};

const getRelatedKeywordsObjs = state => state.search.relatedKeywords;


export const getRelatedKeywords = createSelector([getInputText, getRelatedKeywordsObjs, getAllKeywords], (text, relatedKeywordsObjs, keywords) => {
  if (!text || text.trim().length === 0) {
    return [];
  }
  const relatedKeywords = relatedKeywordsObjs[text];
  if (!relatedKeywords) {
    return [];
  }
  return relatedKeywords.ids.map((id) => {
    return keywords[id];
  });
})

export const getHistoryKeywords = state => {
  return state.search.historyKeywords.map((id) => {
    return getKeywordById(state, id);
  });
};

const getHistoryKeywordsId = state => state.search.historyKeywords;
const getSearchedShopsByKeyword = state => state.search.searchedShopsByKeyword;
export const getSearchedShops = createSelector([getHistoryKeywordsId, getSearchedShopsByKeyword, getAllShops], (keywordIds, searchedShopsByKeyword, shops) => {
  const keywordId = keywordIds[0];
  const relatedShops = searchedShopsByKeyword[keywordId];
  if(!relatedShops) {
    return []
  }
  return relatedShops.ids.map(id => {
    return shops[id];
  })
});

export const getCurrentKeyword = createSelector([getHistoryKeywordsId, getAllKeywords], (keywordIds, keywords) => {
  const keywordId = keywordIds[0];
  if(!keywordId) {
    return "";
  }
  const keywordEle = keywords[keywordId];
  return keywordEle ? keywordEle.keyword : "";
})