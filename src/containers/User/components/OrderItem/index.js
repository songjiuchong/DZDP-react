import React, { Component } from "react";
import "./style.css";

class OrderItem extends Component {
  render() {
    const {
      data: { title, statusText, orderPicUrl, channel, text, type, commentId },
      isCommenting,
    } = this.props;
    return (
      <div className="orderItem">
        <div className="orderItem__title">
          <span>{title}</span>
        </div>
        <div className="orderItem__main">
          <div className="orderItem__imgWrapper">
            <div className="orderItem__tag">{statusText}</div>
            <img className="orderItem__img" src={orderPicUrl} alt="" />
          </div>
          <div className="orderItem__content">
            <div className="orderItem__line">{text[0]}</div>
            <div className="orderItem__line">{text[1]}</div>
          </div>
        </div>
        <div className="orderItem__bottom">
          <div className="orderItem__type">{channel}</div>
          <div>
            {type === 1 && !commentId ? (
              <div className="orderItem__btn" onClick={this.props.onComment}>
                评价
              </div>
            ) : null}
            <div className="orderItem__btn" onClick={this.props.onRemove}>
              删除
            </div>
          </div>
        </div>
        {isCommenting ? this.renderEditArea() : null}
      </div>
    );
  }

  renderEditArea() {
    return (
      <div className="orderItem__commentContainer">
        <textarea
          className="orderItem__comment"
          onChange={this.handleCommentChange}
          value={this.props.comment}
        />
        {this.renderStars()}
        <button
          className="orderItem__commentBtn"
          onClick={this.props.onSubmitComment}
        >
          提交
        </button>
        <button
          className="orderItem__commentBtn"
          onClick={this.props.onCancelComment}
        >
          取消
        </button>
      </div>
    );
  }

  renderStars() {
    const { stars } = this.props;
    return (
      <div>
        {[1, 2, 3, 4, 5].map((item, index) => {
          const lightClass = stars >= item ? "orderItem__star--light" : "";
          return (
            <span
              key={index}
              className={"orderItem__star " + lightClass}
              onClick={this.props.onStarsChange.bind(this, item)}
            >
              ★
            </span>
          );
        })}
      </div>
    );
  }

  handleCommentChange = (e) => {
    this.props.onCommentChange(e.target.value);
  };
}

export default OrderItem;
