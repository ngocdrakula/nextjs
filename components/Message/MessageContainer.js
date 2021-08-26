import React, { Component } from 'react';
import { connect } from 'react-redux';
// import MessageBox from './MessageBox';
import socket from '../../utils/socket';
import types from '../../redux/types';
import ConversationList from './ConversationList';
import MessageBox from './MessageBox';

const pageSize = 10;

class MessageContainer extends Component {
  state = {}
  constructor(props) {
    super(props);
    this.state = {}
  }
  componentDidMount() {
    const { dispatch, user } = this.props;
    dispatch({
      type: types.GET_CONVERSATIONS,
      payload: {
        page: 0,
        pageSize
      },
      callback: res => {
        if (res?.success) {
          socket.on(user._id, data => {
            if (data.type === 'message') {
              dispatch({
                type: 'OPEN_CONVERSATION',
                to: data.to,
                focus: false
              });
            }
          });
        }
      }
    })
  }
  handleClose = () => {
    const { dispatch } = this.props;
    dispatch({ type: types.OPEN_MESSAGE })
  }
  handleOpenList = () => {
    const { dispatch } = this.props;
    dispatch({ type: types.OPEN_LIST });
  }
  render() {
    const { openMessage, openList } = this.props;
    return (
      <div className="mesContainer" style={{ visibility: openMessage ? 'visible' : 'hidden' }}>
        <div className="mesContainerHead">
          <div className="mesContainerTitle">Tin nhắn</div>
          <div className="closeButton" onClick={this.handleClose} title="Đóng">X</div>
        </div>
        <div className="mesTask">
          <div className={"mesTaskItem" + (openList ? " active" : "")} onClick={() => !openList && this.handleOpenList()}>
            <img src="/images/chat2.png" />
          </div>
          <div className={"mesTaskItem" + (!openList ? " active" : "")} onClick={() => openList && this.handleOpenList()}>
            <img src="/images/user.png" />
          </div>
        </div>
        <MessageBox />
        <ConversationList />
      </div>
    );
  }
}

export default connect(({ app: { openMessage, openList } }) => ({ openMessage, openList }))(MessageContainer);