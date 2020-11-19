import React, { Component } from "react";
import './style.css';

class SearchBox extends Component {

  render() {
    const {inputText, relatedKeywords} = this.props;
    return (
      <div className="searchBox">
        <div className="searchBox__container">
          <input className="searchBox__text" placeholder="请输入关键词" value = {inputText} onChange={this.handleChange}/>
          <span className="searchBox__clear" onClick={this.handleClear}></span>
          <span className="searchBox__cancel" onClick={this.handleCancel}>取消</span>
        </div>
        {relatedKeywords.length > 0 && this.renderSuggestList(relatedKeywords)}
      </div>
    );
  }

  renderSuggestList(relatedKeywords) {
    return (
      <ul className="searchBox__list">
          {
              relatedKeywords.map(item => {
                return (
                    <li key={item.id} onClick={this.handleClickItem.bind(this, item)} className="searchBox__item">
                        <span className="searchBox__itemKeyword">
                            {item.keyword}
                        </span>
                        <span className="searchBox__itemQuantity">
                            约{item.quantity}结果
                        </span>
                    </li>
                )
              })
          }
      </ul>
    );
  }

  handleClickItem = (item) => {
    this.props.onClickItem(item)
  }

  handleChange = (e) => {
      this.props.onChange(e.target.value)
  }

  handleClear = () => {
    this.props.onClear();
  }

  handleCancel = () => {
    this.props.onCancel();
  }
}

export default SearchBox;
