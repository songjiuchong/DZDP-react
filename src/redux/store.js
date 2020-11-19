import { createStore, applyMiddleware } from "redux";
import rootReducer from "./modules";
import thunk from "redux-thunk"
import api from "./middleware/api"

let store;

if(process.env.NODE_ENV !== "production" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__){
    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
    store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk, api)));
} else {
    store = createStore(rootReducer, applyMiddleware(thunk, api));
}

export default store;