import React, { Component } from "react";
import "./style.css";

class Confirm extends Component {
  render() {
    const { content, onCancel, onConfirm, confirmText, cancelText } = this.props;
    return (
      <div className="confirm">
        <div className="confirm__alert">
          <div className="confirm__content">{content}</div>
          <div className="confirm__btns">
            <a className="confirm__btn" onClick={onCancel}>
              {cancelText}
            </a>
            <a className="confirm__btn" onClick={onConfirm}>
              {confirmText}
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export default Confirm;
