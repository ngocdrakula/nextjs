import React, { Component } from 'react';
import { connect } from 'react-redux';
import types from '../../redux/types';

class ConversationList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      order: 0
    }
  }
  handleSelect = (id) => {
    const { dispatch } = this.props
    dispatch({
      type: types.GET_ONE_CONVERSATION,
      payload: id,
    })
  }
  handleChange = e => this.setState({ name: e.target.value });
  handleSubmit = e => {
    e.preventDefault();
    console.log(this.state.name)
  }
  render() {
    const { conversations, user, openList } = this.props;
    const { name } = this.state;
    return (
      <>
        <div className={"messageListHead" + (openList ? "" : " hidden")}>Cuộc hội thoại</div>
        <div className={"messageList" + (openList ? "" : " hidden")}>
          {conversations.map((conversation, index) => {
            const to = conversation.leader.user._id === user._id ? conversation.member.user : conversation.leader.user;
            const from = conversation.leader.user._id === user._id ? conversation.leader.user : conversation.member.user;
            const lastMessage = conversation.messages?.[conversation.messages.length - 1];
            const author = lastMessage?.author === to._id ? to.name : "Bạn";
            const inboxNew = from.seen ? " inboxNew" : "";
            return (
              <div key={index} className={"inboxLine" + inboxNew} onClick={() => this.handleSelect(conversation._id)}  >
                <div className="inboxAvatar">
                  <img src={"/images/" + (to.avatar || "logo-showroom.png")} />
                </div>
                <div className="inboxContent">
                  <div className="inboxUsername">
                    <div className="link textover">
                      {to.name}
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
          <input name="name" value={name} onChange={this.handleChange} />
        </form>
      </>
    );
  }
}

export default connect(({ app: { conversations, user, openList } }) => ({ conversations, user, openList }))(ConversationList);