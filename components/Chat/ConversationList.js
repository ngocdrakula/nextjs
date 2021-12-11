import React, { Component } from 'react';
import { connect } from 'react-redux';
import langConfig from '../../lang.config';
import types from '../../redux/types';
import { MODE } from '../../utils/helper';
import { translate } from '../../utils/language';
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
    const { dispatch, conversations, exUser, user } = this.props;
    const currentUser = exUser || user;
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
        payload: { _id, page: 0, pageSize, from: currentUser._id },
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
    const { dispatch, exUser, user } = this.props;
    const currentUser = exUser || user;
    const { name } = this.state;
    dispatch({
      type: types.ADMIN_GET_CONVERSATIONS,
      payload: {
        page: page || 0,
        pageSize,
        name,
        from: currentUser._id
      }
    })
  }
  handleScroll = e => {
    if (!this.loading && e.target.scrollTop >= e.target.scrollHeight - e.target.clientHeight - 10) {
      const { conversations, total, dispatch, exUser, user } = this.props;
      const currentUser = exUser || user;
      const { name } = this.state;
      if (conversations.length < total) {
        this.loading = true;
        dispatch({
          type: types.ADMIN_GET_CONVERSATIONS,
          payload: {
            page: Math.round((conversations.length) / pageSize),
            pageSize,
            name,
            from: currentUser._id
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
    const currentUser = exUser || user;
    return (<div className="col-sm-4 side">
      <div id="leftsidebar">
        <div className="row heading">
          <div className="heading-title">
            <i className="fa fa-comments fa-2x" />  {translate(langConfig.app.Conversation)}
          </div>
        </div>
        <div className="row sidebarContent" onScroll={this.handleScroll}>
          {conversations.map(conversation => {
            const fromId = currentUser?._id
            const toUser = conversation.leader.user._id === fromId ? conversation.member.user : conversation.leader.user;
            const from = conversation.leader.user._id === fromId ? conversation.leader : conversation.member;
            const lastMessage = conversation.messages?.[0];
            const author = lastMessage?.author === toUser._id ? toUser.name : translate(langConfig.app.You);

            return (
              <div
                key={conversation._id}
                className={"row sidebarBody" + (from.seen ? "" : " unread") + (conId === conversation._id ? " active" : "")}
                onClick={e => this.handleSelect(e, conversation._id)}
              >
                <a href="#" className="get-content" style={{ display: 'flex', alignItems: 'center' }}>
                  <div className="chat-avatar" style={{ paddingRight: 10, minWidth: 60 }}>
                    {toUser.avatar ?
                      <img src={"/api/images/" + toUser.avatar} className="img-circle" alt={translate(langConfig.app.Avatar)} />
                      :
                      <img src="/images/no-avatar.png" className="img-circle" alt={translate(langConfig.app.NoAvatar)} />
                    }
                  </div>
                  <div className="sideBar-main nopadding" style={{ width: "100%", overflow: "hidden" }}>
                    <div className="row">
                      <div className="col-sm-8 col-xs-8 sideBar-name">
                        <span className="name-meta">
                          {toUser.name}

                        </span>
                        <span className="excerpt">
                          <span className="small text-muted">{author?.slice(0, 15)}{author?.length > 15 ? "..." : ""}: </span>{lastMessage?.content}
                        </span>
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

export default connect(({ admin: { conversations, exUser, user, total, conId } }) => ({ conversations, exUser, user, total, conId }))(ConversationList);