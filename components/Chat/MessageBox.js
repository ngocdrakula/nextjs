import React, { Component } from 'react';
import { connect } from 'react-redux';
import types from '../../redux/types';
import SocketIO from '../../utils/SocketIO';
import Time from './Time';

const pageSize = 10;

class MessageBox extends Component {
    state = {
    };
    constructor(props) {
        super(props);
        this.state = {
            message: ''
        }
    }
    componentDidMount() {
        const { dispatch, exUser, user } = this.props;
        const currentUser = exUser || user;
        this.listen = data => {
            if (data?.type === 'new' || data?.type === 'send') {
                dispatch({
                    type: types.ADMIN_REVICED_MESSAGE,
                    payload: { to: data.to, from: currentUser._id },
                    callback: res => {
                        if (res?.success) {
                            const { conversationsAll, conId } = this.props;
                            const conCurrent = conversationsAll.find(c => c.leader.user._id === data.to || c.member.user._id === data.to);
                            if (conCurrent._id === conId && !currentUser) {
                                this.readMessage();
                                this.scrollToBottom();
                            }
                        }
                    }
                })
            }
        };
        SocketIO.socket.on(currentUser._id, this.listen);
    }
    componentDidUpdate(prevProps) {
        if (prevProps.conId !== this.props.conId || prevProps.conversationsAll !== this.props.conversationsAll) {
            this.scrollToBottom();
            this.readMessage();
            this.focusToWritting();
        }
    }
    componentWillUnmount() {
        clearTimeout(this.timeout)
        const { exUser, user } = this.props;
        const currentUser = exUser || user;
        SocketIO.socket.off(currentUser._id, this.listen)
    }
    readMessage = () => {
        const { conversationsAll, conId, exUser, user, dispatch } = this.props;
        const currentUser = exUser || user;
        const conCurrent = conversationsAll.find(con => con._id === conId);
        if (conCurrent) {
            const { leader, member } = conCurrent;
            const from = leader.user._id === currentUser._id ? leader : member;
            if (!from.seen) {
                dispatch({
                    type: types.ADMIN_READ_MESSAGE,
                    payload: { _id: conCurrent._id, from: currentUser._id },
                    callback: res => {
                        if (res?.success) {
                            this.scrollToBottom();
                        }
                    }
                })
            }
        }
    }
    checkKeyDown = (e) => {
        if (e.keyCode === 13) {
            e.preventDefault();
            this.sendMessage();
        }
    }
    writeMessage = (e) => {
        this.setState({ message: e.target.value });
    }
    sendMessage = (e) => {
        if (e) e.preventDefault();
        const { dispatch, conversationsAll, conId, exUser, user } = this.props;
        const currentUser = exUser || user;
        const { message } = this.state;
        const conCurrent = conversationsAll.find(con => con._id === conId) || {};
        const { leader, member } = conCurrent;
        const to = (leader?.user?._id === currentUser._id ? member?.user : leader?.user) || {};
        if (message && to?._id) {
            dispatch({
                type: types.ADMIN_SEND_MESSAGE,
                payload: { message, to: to._id, conId, from: currentUser._id },
                callback: res => {
                    if (res?.success) this.setState({ message: "" })
                    this.scrollToBottom()
                }
            })
        }
    }
    focusToWritting = (e) => {
        this.Textarea?.focus();
    }
    scrollToBottom = (e) => {
        const conversationBox = document.getElementById('conversationBox');
        if (conversationBox)
            this.timeout = setTimeout(() => {
                conversationBox.scrollTop = conversationBox.scrollHeight;
            }, 200);
    }
    handleScroll = e => {
        if (!this.loading && !e.target.scrollTop) {
            const { conversationsAll, conId, dispatch, exUser, user } = this.props;
            const currentUser = exUser || user;
            const conCurrent = conversationsAll.find(con => con._id === conId);
            if (conCurrent && !conCurrent.loadAll) {
                this.loading = true;
                const oldHeight = e.target.scrollHeight;
                dispatch({
                    type: types.ADMIN_GET_ONE_CONVERSATION,
                    payload: {
                        _id: conCurrent._id,
                        page: Math.floor((conCurrent.messages.length - 1) / pageSize) + 1,
                        pageSize,
                        from: currentUser._id
                    },
                    callback: res => {
                        if (res?.success) {
                            this.loading = false;
                            e.target.scrollTop = e.target.scrollHeight - oldHeight;
                        };
                    }
                })
            }
        }
    }
    render() {
        const { conversationsAll, conId, exUser, user } = this.props;
        const currentUser = exUser || user;
        const { message } = this.state;
        const conCurrent = conversationsAll.find(con => con._id === conId) || {};
        const { leader, member, messages } = conCurrent;
        const toUser = (leader?.user?._id === currentUser._id ? member?.user : leader?.user) || {};
        const fromUser = (leader?.user?._id !== currentUser._id ? member?.user : leader?.user) || {};
        const messagesReverse = messages ? [...messages].reverse() : [];
        return (
            <div id="chatConversation" className="col-sm-8 conversation">
                <div id="openChatbox-146" className="row heading">
                    <div className="col-sm-2 col-md-1 col-xs-3 heading-avatar">
                        {toUser?.avatar ?
                            <img src={"/api/images/" + toUser?.avatar} className="img-circle" alt="Avatar" />
                            :
                            <img src="/images/no-avatar.png" className="img-circle" alt="No Avatar" />
                        }
                    </div>
                    <div className="col-sm-8 col-xs-7 heading-name">
                        <span className="heading-name-meta">{toUser?.name || "Trò chuyện"}</span>
                    </div>
                    <div className="col-sm-1 col-xs-1  heading-dot pull-right">
                    </div>
                </div>
                <div className="row message" id="conversationBox" onScroll={this.handleScroll}>
                    {messagesReverse.map(mes => {
                        return (
                            <div className="row message-body" key={mes._id}>
                                <div className={"col-sm-12 message-main-" + (mes.author === currentUser._id ? "sender" : "receiver")}>
                                    <div className={mes.author === currentUser._id ? "sender" : "receiver"}>
                                        <div className="message-text">{mes.content}</div>
                                    </div>
                                    <Time className="message-time" title="2" value="3" createdAt={mes.createdAt} />
                                </div>
                            </div>
                        )
                    })}
                    {!conId ?
                        <div className="col-sm-12">
                            <p className="lead">Chọn cuộc hội thoại bên trái để trò chuyện</p>
                        </div>
                        : ""}
                    <div id="bottom-message" />
                </div>
                {conId ?
                    <div className="row reply">
                        <form method="POST" onSubmit={this.sendMessage}>
                            <div className="col-sm-1 col-xs-1 reply-attachment" />
                            <div className="col-sm-10 col-xs-10 reply-main">
                                <textarea
                                    id="message"
                                    name="message"
                                    className="form-control"
                                    rows="1"
                                    value={message || ""}
                                    onChange={this.writeMessage}
                                    onKeyDown={this.checkKeyDown}
                                    ref={(e) => this.Textarea = e}
                                    placeholder="Viết tin nhắn" />
                            </div>
                            <div className="col-sm-1 col-xs-1 reply-send nopadding-left">
                                <i className="fa fa-send fa-2x" id="send-btn" onClick={this.sendMessage} />
                            </div>
                        </form>
                    </div>
                    : ""
                }
            </div>
        );
    }
}
export default connect(({ admin: { conversationsAll, exUser, user, conId } }) => ({ conversationsAll, exUser, user, conId }))(MessageBox);