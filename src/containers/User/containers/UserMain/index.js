import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import {
  actions as userActions,
  getCurrentTab,
  getDeletingOrderId,
  getCurrentOrderComment,
  getCurrentOrderStars,
  getCommentingOrderId,
} from "../../../../redux/modules/user";
import OrderItem from "../../components/OrderItem";
import Confirm from "../../../../components/Confirm";
import "./style.css";

const tabTitles = ["全部订单", "待付款", "可使用", "退款/售后"];

class UserMain extends Component {
  render() {
    const { currentTab, data, deletingOrderId } = this.props;
    return (
      <div className="userMain">
        <div className="userMain__menu">
          {tabTitles.map((item, index) => {
            return (
              <div
                key={index}
                className="userMain__tab"
                onClick={this.handleClickTab.bind(this, index)}
              >
                <span
                  className={
                    currentTab === index
                      ? "userMain__title userMain__title--active"
                      : "userMain__title"
                  }
                >
                  {item}
                </span>
              </div>
            );
          })}
        </div>
        <div className="userMain__content">
          {data && data.length > 0
            ? this.renderOrderList(data)
            : this.renderEmpty()}
        </div>
        {deletingOrderId ? this.renderConfirmDialog() : null}
      </div>
    );
  }

  handleClickTab = (index) => {
    this.props.userActions.setCurrentTab(index);
  };

  renderOrderList = (data) => {
    const { commentingOrderId, orderComment, orderStars } = this.props;
    return data.map((item) => {
      return (
        <OrderItem
          key={item.id}
          data={item}
          onRemove={this.handleRemove.bind(this, item.id)}
          isCommenting={item.id === commentingOrderId}
          comment={item.id === commentingOrderId ? orderComment : ""}
          stars={item.id === commentingOrderId ? orderStars : 0}
          onCommentChange={this.handleCommentChange}
          onStarsChange={this.handleStarsChange}
          onComment={this.handleComment.bind(this,item.id)}
          onSubmitComment={this.handleSubmitComment}
          onCancelComment={this.handleCancelComment}
        />
      );
    });
  };

  renderEmpty = () => {
    return (
      <div className="userMain__empty">
        <div className="userMain__emptyIcon" />
        <div className="userMain__emptyText1">您还没有相关订单</div>
        <div className="userMain__emptyText2">去逛逛看有哪些想买的</div>
      </div>
    );
  };

  renderConfirmDialog = () => {
    const {
      userActions: { hideDeleteDialog, removeOrder },
    } = this.props;
    return (
      <Confirm
        content="确定删除该订单吗?"
        cancelText="取消"
        confirmText="确定"
        onCancel={hideDeleteDialog}
        onConfirm={removeOrder}
      />
    );
  };

  handleSubmitComment = () => {
    const {userActions: {submitComment}} = this.props;
    submitComment()
  }

  handleCancelComment = () => {
    const {userActions: {hideCommentArea}} = this.props;
    hideCommentArea()
  }

  handleComment = orderId => {
    const {userActions: {showCommentArea}} = this.props
    showCommentArea(orderId)
  }

  handleStarsChange = stars => {
    const {userActions:{setStars}} = this.props;
    setStars(stars)
  }

  handleCommentChange = comment => {
    const {userActions: {setComment}} = this.props;
    setComment(comment)
  }

  handleRemove = (orderId) => {
    this.props.userActions.showDeleteDialog(orderId);
  };
}

const mapStateToProps = (state, props) => {
  return {
    currentTab: getCurrentTab(state),
    deletingOrderId: getDeletingOrderId(state),
    commentingOrderId: getCommentingOrderId(state),
    orderComment: getCurrentOrderComment(state),
    orderStars: getCurrentOrderStars(state),
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    userActions: bindActionCreators(userActions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserMain);
