import React, { Component } from 'react';
import { connect } from 'react-redux';
import types from '../../redux/types';


class MessageIconNoti extends Component {
  constructor(props) {
    super(props);
  }
  handleOpen = () => {
    const { dispatch } = this.props;
    dispatch({ type: types.OPEN_MESSAGE })
  }
  render() {
    const { newMessage, openMessage } = this.props;
    return (
      <div className="notiIcon" style={{ display: openMessage ? 'none' : 'block' }} onClick={this.handleOpen}>
        <img src="/images/chat2.png" />
        {newMessage ?
          <div className="notiText">{newMessage > 99 ? "9+" : newMessage}</div>
          : ""}
      </div>
    );
  }
}

export default connect(({ app: { newMessage, openMessage } }) => ({ newMessage, openMessage }))(MessageIconNoti);