import React, { Component } from 'react';
import { connect } from 'react-redux';
import types from '../../../redux/types';
import { MODE } from '../../../utils/helper';
import Time from './Time';

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
  handleSelect = (e, _id) => {
    e?.preventDefault();
    const { dispatch, conversations, exUser } = this.props;
    const conCurrent = conversations.find(c => c._id === _id);
    if (conCurrent?.currentPage >= 0) {
      dispatch({
        type: types.ADMIN_SELECT_CONVERSATION,
        payload: _id,
      });
    }
    else {
      dispatch({
        type: types.ADMIN_GET_ONE_CONVERSATION,
        payload: { _id, page: 0, pageSize, from: exUser._id },
        callback: res => {
          if (res?.success) {
            dispatch({
              type: types.ADMIN_SELECT_CONVERSATION,
              payload: _id,
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
    const { dispatch, exUser } = this.props;
    const { name } = this.state;
    dispatch({
      type: types.ADMIN_GET_CONVERSATIONS,
      payload: {
        page: page || 0,
        pageSize,
        name,
        from: exUser._id
      }
    })
  }
  handleScroll = e => {
    if (!this.loading && e.target.scrollTop >= e.target.scrollHeight - e.target.clientHeight - 10) {
      const { conversations, total, dispatch, exUser } = this.props;
      const { name } = this.state;
      if (conversations.length < total) {
        this.loading = true;
        dispatch({
          type: types.ADMIN_GET_CONVERSATIONS,
          payload: {
            page: Math.round((conversations.length) / pageSize),
            pageSize,
            name,
            from: exUser._id
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
  render() {
    const { conversations, user, exUser, conId } = this.props;
    return (<div className="col-sm-4 side">
      <div id="leftsidebar">
        <div className="row heading">
          <div className="heading-title">
            <i className="fa fa-comments fa-2x" />  Cuộc hội thoại
          </div>
        </div>
        <div className="row sidebarContent" onScroll={this.handleScroll}>
          {conversations.map(conversation => {
            const fromId = user?.mode === MODE.admin ? user._id : exUser?._id
            const toUser = conversation.leader.user._id === fromId ? conversation.member.user : conversation.leader.user;
            const from = conversation.leader.user._id === fromId ? conversation.leader : conversation.member;
            const lastMessage = conversation.messages?.[0];
            const author = lastMessage?.author === toUser._id ? toUser.name : "Bạn";

            return (
              <div
                key={conversation._id}
                className={"row sidebarBody" + (from.seen ? "" : " unread") + (conId === conversation._id ? " active" : "")}
                onClick={e => this.handleSelect(e, conversation._id)}
              >
                <a href="#" className="get-content" style={{}}>
                  <div className="col-sm-3 col-xs-3">
                    {toUser.avatar ?
                      <img src={"/api/images/" + toUser.avatar} className="img-circle" alt="Avatar" />
                      :
                      <img src="/images/no-avatar.png" className="img-circle" alt="No Avatar" />
                    }
                  </div>
                  <div className="col-sm-9 col-xs-9 sideBar-main nopadding">
                    <div className="row">
                      <div className="col-sm-8 col-xs-8 sideBar-name">
                        <span className="name-meta">
                          {toUser.name}

                        </span>
                        <p className="excerpt">
                          <span className="small text-muted">{author?.slice(0, 15)}{author?.length > 15 ? "..." : ""}: </span>{lastMessage?.content}
                        </p>
                      </div>
                      <div className="col-sm-4 col-xs-4 pull-right time">
                        {lastMessage ?
                          <Time className="time-meta pull-right" title="2" value="3" createdAt={lastMessage.createdAt} /> : ""}
                      </div>
                    </div>
                  </div>
                </a>
              </div>
            )
          })}
        </div>
      </div>
    </div>
    );
  }
}

export default connect(({ admin: { conversations, exUser, total, conId } }) => ({ conversations, exUser, total, conId }))(ConversationList);