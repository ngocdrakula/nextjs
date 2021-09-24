import React, { Component } from 'react';
import { connect } from 'react-redux';
import types from '../../redux/types';
import { MODE } from '../../utils/helper';

const pageSize = 10;


class ConversationList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: ''
    }
  }
  componentWillUnmount() {
    clearTimeout(this.timeout)
  }
  handleSelect = (id) => {
    const { dispatch, conversations } = this.props;
    const conCurrent = conversations.find(c => c._id === id);
    if (conCurrent?.currentPage >= 0) {
      dispatch({
        type: types.SELECT_CONVERSATION,
        payload: id,
      });
    }
    else {
      dispatch({
        type: types.GET_ONE_CONVERSATION,
        payload: { id, page: 0, pageSize },
        callback: res => {
          if (res?.success) {
            dispatch({
              type: types.SELECT_CONVERSATION,
              payload: id,
            });
          }
        }
      });
    }
  }
  handleChange = e => {
    this.setState({ name: e.target.value });
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.gotoPage()
    }, 1000);
  }
  handleSubmit = e => {
    e.preventDefault();
    this.gotoPage();
  }
  gotoPage = (page) => {
    const { dispatch } = this.props;
    const { name } = this.state;
    dispatch({
      type: types.GET_CONVERSATIONS,
      payload: {
        page: page || 0,
        pageSize,
        name
      }
    })
  }
  handleScroll = e => {
    if (!this.loading && e.target.scrollTop >= e.target.scrollHeight - e.target.clientHeight - 10) {
      const { conversations, total, dispatch } = this.props;
      const { name } = this.props;
      if (conversations.length < total) {
        this.loading = true;
        dispatch({
          type: types.GET_CONVERSATIONS,
          payload: {
            page: Math.round((conversations.length) / pageSize),
            pageSize,
            name
          },
          callback: res => {
            if (res?.success) {
              this.loading = false;
            };
          }
        })
      }
    }
  }
  handleChat = () => {
    const { user, admin, dispatch } = this.props;
    if (user?._id && admin?._id) {
      dispatch({
        type: types.GET_CONVERSATION_TO,
        payload: { ...admin, open: true },
      });
    }
    else if (user?._id) {
      dispatch({
        type: types.OPENFORM,
        payload: MODE.exhibitor,
      });
    }
  }
  render() {
    const { conversations, user, openList, admin } = this.props;
    const { name } = this.state;
    return (
      <>
        <div className={"messageListHead" + (openList ? "" : " hidden")} onClick={user?.mode !== MODE.admin ? this.handleChat : undefined}>
          <div className="mes-admin-icon">
            <img src="/images/user2.png" />
          </div>
          {user?.mode !== MODE.admin ?
            <span>Nhắn tin với Admin</span>
            :
            <span>Cuộc hội thoại</span>
          }
        </div>
        <div className={"messageList" + (openList ? "" : " hidden")} onScroll={this.handleScroll}>
          {conversations.map((conversation, index) => {
            const toUser = conversation.leader.user._id === user._id ? conversation.member.user : conversation.leader.user;
            const from = conversation.leader.user._id === user._id ? conversation.leader : conversation.member;
            const lastMessage = conversation.messages?.[0];
            const author = lastMessage?.author === toUser._id ? toUser.name : "Bạn";
            const inboxNew = !from.seen ? " inboxNew" : "";
            return (
              <div key={index} className={"inboxLine" + inboxNew} onClick={() => this.handleSelect(conversation._id)}  >
                <div className="inboxAvatar">
                  {toUser.avatar ?
                    <img src={"/api/images/" + toUser.avatar} />
                    :
                    <img src="/images/logo-showroom.png" />
                  }
                </div>
                <div className="inboxContent">
                  <div className="inboxUsername">
                    <div className="link textover" title={toUser.name}>
                      {toUser.name}
                    </div>
                  </div>
                  <div className="inboxLastMessage textover">
                    {author}: {lastMessage?.content}
                  </div>
                </div>
                <div className="newMessageNoti">
                  <div className="newMessageTick" />
                </div>
              </div>
            );
          })}
        </div>
        <form className={"search-con" + (openList ? "" : " hidden")} onSubmit={this.handleSubmit}>
          <button type="submit"><img src="/images/icon-search.png" alt="" /></button>
          <input name="inbox-name" autoComplete={"inbox-name"} value={name} onChange={this.handleChange} />
        </form>
      </>
    );
  }
}

export default connect(({ app: { conversations, user, openList, total, admin } }) => ({ conversations, user, openList, total, admin }))(ConversationList);