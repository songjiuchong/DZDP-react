import url from "../../utils/url";
import { FETCH_DATA } from "../middleware/api";
import {
  schema as orderSchema,
  TO_PAY_TYPE,
  AVAILABLE_TYPE,
  REFUND_TYPE,
  getAllOrders,
  types as orderTypes,
  actions as orderActions,
} from "./entities/orders";
import { actions as commentActions } from "./entities/comments";
import { combineReducers } from "redux";
import {createSelector} from "reselect";

const typeToKey = {
  [TO_PAY_TYPE]: "toPayIds",
  [AVAILABLE_TYPE]: "availableIds",
  [REFUND_TYPE]: "refundIds",
};

const initialState = {
  orders: {
    isFetching: false,
    fetched: false,
    ids: [],
    toPayIds: [], //待付款的订单
    availableIds: [], //可使用的订单
    refundIds: [], //退款订单
  },
  currentTab: 0,
  currentOrder: {
    id: null,
    isDeleting: false,
    isCommenting: false,
    comment: "",
    stars: 0,
  },
};

export const types = {
  FETCH_ORDERS_REQUEST: "USER/FETCH_ORDERS_REQUEST",
  FETCH_ORDERS_SUCCESS: "USER/FETCH_ORDERS_SUCCESS",
  FETCH_ORDERS_FAILURE: "USER/FETCH_ORDERS_FAILURE",
  SET_CURRENT_TAB: "USER/SET_CURRENT_TAB",
  DELETE_ORDERS_REQUEST: "USER/DELETE_ORDERS_REQUEST",
  DELETE_ORDERS_SUCCESS: "USER/DELETE_ORDERS_SUCCESS",
  DELETE_ORDERS_FAILURE: "USER/DELETE_ORDERS_FAILURE",
  SHOW_DELETE_DIALOG: "USER/SHOW_DELETE_DIALOG",
  HIDE_DELETE_DIALOG: "USER/HIDE_DELETE_DIALOG",
  SHOW_COMMENT_AREA: "USER/SHOW_COMMENT_AREA",
  HIDE_COMMENT_AREA: "USER/HIDE_COMMENT_AREA",
  SET_COMMENT: "USER/SET_COMMENT",
  SET_STARS: "USER/SET_STARS",
  POST_COMMENT_REQUEST: "USER/POST_COMMENT_REQUEST",
  POST_COMMENT_SUCCESS: "USER/POST_COMMENT_SUCCESS",
  POST_COMMENT_FAILURE: "USER/POST_COMMENT_FAILURE",
};

//actions;
export const actions = {
  loadOrders: () => {
    return (dispatch, getState) => {
      const { fetched } = getState().user.orders;
      if (fetched) {
        return null;
      }
      const endpoint = url.getOrders();
      return dispatch(fetchOrders(endpoint));
    };
  },
  setCurrentTab: (index) => ({
    type: types.SET_CURRENT_TAB,
    index,
  }),
  removeOrder: () => {
    return (dispatch, getState) => {
      const { id } = getState().user.currentOrder;
      if (id) {
        dispatch(deleteOrderRequest());
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            dispatch(deleteOrderSuccess(id));
            dispatch(orderActions.deleteOrder(id));
            resolve();
          }, 500);
        });
      }
    };
  },
  showDeleteDialog: (orderId) => ({
    type: types.SHOW_DELETE_DIALOG,
    orderId,
  }),
  hideDeleteDialog: () => ({
    type: types.HIDE_DELETE_DIALOG,
  }),
  showCommentArea: (orderId) => ({
    type: types.SHOW_COMMENT_AREA,
    orderId,
  }),
  hideCommentArea: () => ({
    type: types.HIDE_COMMENT_AREA,
  }),
  setComment: (comment) => ({
    type: types.SET_COMMENT,
    comment,
  }),
  setStars: (stars) => ({
    type: types.SET_STARS,
    stars,
  }),
  submitComment: () => {
    return (dispatch, getState) => {
      dispatch(postCommentRequest());
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const {
            currentOrder: { id, stars, comment },
          } = getState().user;
          const commentObj = {
            id: +new Date(), //模拟服务端成功保存数据后返回了一个commentId
            stars: stars,
            content: comment,
          };
          dispatch(postCommentSuccess());
          dispatch(commentActions.addComment(commentObj));
          dispatch(orderActions.addComment(id, commentObj.id));
          resolve();
        }, 500);
      });
    };
  },
};

const postCommentRequest = () => ({
  type: types.POST_COMMENT_REQUEST,
});

const postCommentSuccess = () => ({
  type: types.POST_COMMENT_SUCCESS,
});

const deleteOrderRequest = () => ({
  type: types.DELETE_ORDERS_REQUEST,
});

const deleteOrderSuccess = (orderId) => ({
  type: types.DELETE_ORDERS_SUCCESS,
  orderId,
});

const fetchOrders = (endpoint) => ({
  [FETCH_DATA]: {
    types: [
      types.FETCH_ORDERS_REQUEST,
      types.FETCH_ORDERS_SUCCESS,
      types.FETCH_ORDERS_FAILURE,
    ],
    endpoint,
    schema: orderSchema,
  },
});

//reducers
const orders = (state = initialState.orders, action) => {
  switch (action.type) {
    case types.FETCH_ORDERS_REQUEST:
      return { ...state, isFetching: true };
    case types.FETCH_ORDERS_SUCCESS:
      const toPayIds = action.response.ids.filter(
        (id) => action.response.orders[id].type === TO_PAY_TYPE
      );
      const availableIds = action.response.ids.filter(
        (id) => action.response.orders[id].type === AVAILABLE_TYPE
      );
      const refundIds = action.response.ids.filter(
        (id) => action.response.orders[id].type === REFUND_TYPE
      );
      return {
        ...state,
        isFetching: false,
        fetched: true,
        ids: state.ids.concat(action.response.ids),
        toPayIds: state.toPayIds.concat(toPayIds),
        availableIds: state.availableIds.concat(availableIds),
        refundIds: state.refundIds.concat(refundIds),
      };
    case orderTypes.DELETE_ORDER:
    case types.DELETE_ORDERS_SUCCESS:
      return {
        ...state,
        ids: removeOrderId(state, "ids", action.orderId),
        toPayIds: removeOrderId(state, "toPayIds", action.orderId),
        availableIds: removeOrderId(state, "availableIds", action.orderId),
        refundIds: removeOrderId(state, "refundIds", action.orderId),
      };
    case orderTypes.ADD_ORDER:
      const { order } = action;
      const key = typeToKey[order.type];
      return key
        ? {
            ...state,
            ids: [order.id].concat(state.ids),
            [key]: [order.id].concat(state[key]),
          }
        : {
            ...state,
            ids: [order.id].concat(state.ids),
          };
    default:
      return state;
  }
};

const removeOrderId = (state, key, orderId) => {
  return state[key].filter((id) => {
    return id !== orderId;
  });
};

const currentTab = (state = initialState.currentTab, action) => {
  switch (action.type) {
    case types.SET_CURRENT_TAB:
      return action.index;
    default:
      return state;
  }
};

const currentOrder = (state = initialState.currentOrder, action) => {
  switch (action.type) {
    case types.SHOW_DELETE_DIALOG:
      return {
        ...state,
        id: action.orderId,
        isDeleting: true,
      };
    case types.HIDE_DELETE_DIALOG:
    case types.DELETE_ORDERS_SUCCESS:
    case types.DELETE_ORDERS_FAILURE:
    case types.HIDE_COMMENT_AREA:
    case types.POST_COMMENT_SUCCESS:
    case types.POST_COMMENT_FAILURE:
      return initialState.currentOrder;
    case types.SHOW_COMMENT_AREA:
      return {
        ...state,
        id: action.orderId,
        isCommenting: true,
      };
    case types.SET_COMMENT:
      return { ...state, comment: action.comment };
    case types.SET_STARS:
      return { ...state, stars: action.stars };
    default:
      return state;
  }
};

const reducer = combineReducers({
  orders,
  currentTab,
  currentOrder,
});

export default reducer;

//selectors
export const getCurrentTab = (state) => state.user.currentTab;

const getUserOrders = (state) => state.user.orders;

export const getOrders = createSelector(
  [getCurrentTab, getUserOrders, getAllOrders],
  (tabIndex, userOrders, orders) => {
    const key = ["ids", "toPayIds", "availableIds", "refundIds"][tabIndex];
    userOrders[key].map((id) => {
      return orders[id];
    });
  }
);

export const getDeletingOrderId = (state) => {
  return state.user.currentOrder && state.user.currentOrder.isDeleting
    ? state.user.currentOrder.id
    : null;
};

export const getCommentingOrderId = (state) => {
  return state.user.currentOrder && state.user.currentOrder.isCommenting
    ? state.user.currentOrder.id
    : null;
};

export const getCurrentOrderComment = (state) => {
  return state.user.currentOrder ? state.user.currentOrder.comment : "";
};

export const getCurrentOrderStars = (state) => {
  return state.user.currentOrder ? state.user.currentOrder.stars : 0;
};
