import React, { Component } from "react";
import SearchBox from "./components/SearchBox";
import PopularSearch from "./components/PopularSearch";
import SearchHistory from "./components/SearchHistory";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import {
  actions as searchActions,
  getPopularKeywords,
  getRelatedKeywords,
  getInputText,
  getHistoryKeywords,
} from "../../redux/modules/search";

class Search extends Component {
  render() {
    const {
      inputText,
      popularKeywords,
      relatedKeywords,
      historyKeywords,
    } = this.props;
    return (
      <div>
        <SearchBox
          inputText={inputText}
          relatedKeywords={relatedKeywords}
          onChange={this.handleChangeInput}
          onClear={this.handleClearInput}
          onCancel={this.handleCancel}
          onClickItem={this.handleClickItem}
        />
        <PopularSearch
          data={popularKeywords}
          onClickItem={this.handleClickItem}
        />
        <SearchHistory
          data={historyKeywords}
          onClickItem={this.handleClickItem}
          onClear = {this.handleClearHistory}
        />
      </div>
    );
  }

  componentDidMount() {
    const { loadPopularKeywords } = this.props.searchActions;
    loadPopularKeywords();
  }

  componentWillUnmount() {
      const { clearInputText } = this.props.searchActions;
      clearInputText();
  }

  handleChangeInput = (text) => {
    const { setInputText, loadRelatedKeywords } = this.props.searchActions;
    setInputText(text);
    loadRelatedKeywords(text);
  };

  handleClearInput = () => {
    const { clearInputText } = this.props.searchActions;
    clearInputText();
  };

  handleCancel = () => {
    this.handleClearInput();
    this.props.history.goBack();
  };

  handleClickItem = (item) => {
    const { setInputText, addHistoryKeyword, loadRelatedShops } = this.props.searchActions;
    setInputText(item.keyword);
    addHistoryKeyword(item.id);
    loadRelatedShops(item.id);
    this.props.history.push("/search_result")
  };

  handleClearHistory = () => {
    const { clearHistoryKeywords } = this.props.searchActions;
    clearHistoryKeywords();
  }
}

const mapStateToProps = (state, props) => {
  return {
    relatedKeywords: getRelatedKeywords(state),
    inputText: getInputText(state),
    popularKeywords: getPopularKeywords(state),
    historyKeywords: getHistoryKeywords(state),
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    searchActions: bindActionCreators(searchActions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Search);
