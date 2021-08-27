import React, { Component } from 'react';
import { connect } from 'react-redux';
import types from '../../redux/types';
import { MODE } from '../../utils/helper';
import socket from '../../utils/socket';
import Time from './Time';

class MessageBox extends Component {
    state = {
    };
    constructor(props) {
        super(props);
        this.state = {}
    }
    componentDidMount() {
        const { user } = this.props;
        console.log(user._id)
        socket.emit('online', 'online')
        socket.on(user._id, data => {
            console.log(data)
            // if (data.type === 'message' || data.type === 'mymessage') {
            //     var toId = data.to._id || data.to;
            //     if (toId === to._id) {
            //         axios.get('/conversation/' + toId + '?order=0')
            //             .then(response => {
            //                 if (response.data && response.data.success) {
            //                     var lastMessage = response.data.data.message[response.data.data.message.length - 1];
            //                     var messageList = message;
            //                     messageList.push(lastMessage);
            //                     var conversation = response.data.data;
            //                     conversation.message = conversation.message.slice(-1);
            //                     dispatch({
            //                         type: 'UPDATE_CONVERSATIONS',
            //                         to: to,
            //                         conversation: conversation,
            //                         newMessage: data.type === 'message' ? true : false,
            //                     });
            //                     this.setState({
            //                         newMessage: data.type === 'message' ? true : false,
            //                         messageList: messageList
            //                     });
            //                 }
            //             }).catch(err => {
            //                 console.log(err);
            //             });
            //     }
            // }
            // else if (data.type === 'read' && data.to === to._id) {
            //     dispatch({
            //         type: 'READ_MESSAGE',
            //         to: to,
            //         time: data.time
            //     });
            //     this.setState({
            //         newMessage: false,
            //         seen: Date.parse(data.time)
            //     });
            // }
        });
    }
    componentDidUpdate(prevProps) {
        if (prevProps.openList && !this.props.openList) this.scrollToTop();
    }
    componentWillUnmount() {
        clearTimeout(this.timeout)
    }
    readMessage = () => {
        if (this.state.newMessage) {
            axios.get("/conversation/read/" + this.props.to._id)
                .then(response => {
                    if (response.data && response.data.success) {
                        this.setState({ newMessage: false })
                    }
                }).catch(err => {
                    console.log(err)
                })
        }
    }
    checkKeyDown = (e) => {
        if (e.keyCode === 13 && !e.shiftKey) {
            e.preventDefault();
            e.target.style.height = "14px";
            this.sendMessage();
        }
        if (e.keyCode === 27) {
            this.hideBox();
        }
    }
    writeMessage = (e) => {
        e.target.style.height = "14px";
        e.target.style.height = (e.target.scrollHeight - 10) + "px";
        if (this.state.newMessage) {
            this.readMessage();
        }
        this.setState({
            message: e.target.value
        });
    }
    sendMessage = (e) => {
        if (e) e.preventDefault();
        const { dispatch, conversations, conId, user } = this.props;
        const { message } = this.state;
        const conCurrent = conversations.find(con => con._id === conId) || {};
        const { leader, member } = conCurrent;
        const to = (leader?.user?._id === user._id ? member?.user : leader?.user) || {};
        if (message && to?._id) {
            dispatch({
                type: types.SEND_MESSAGE,
                payload: { message, to: to._id, conId },
                callback: res => {
                    if (res?.success) this.setState({ message: "" })
                    this.scrollToTop()
                }
            })
        }
    }
    hideBox = () => {
        this.setState({
            onFocus: false
        })
        this.props.dispatch({
            type: 'CLOSE_CONVERSATION',
            to: this.props.to
        });
    }
    focusToWritting = (e) => {
        if (e.target.querySelector('span'))
            this.Textarea.focus();
    }
    scrollToTop = (e) => {
        const bottom = document.getElementById('bottom-message');
        if (bottom) bottom.scrollIntoView();
    }
    render() {
        const { conversations, conId, user, openList } = this.props;
        const conCurrent = conversations.find(con => con._id === conId) || {};
        const { leader, member, messages } = conCurrent;
        const to = (leader?.user?._id === user._id ? member?.user : leader?.user) || {};

        return (
            <>
                <div className={"mesTitle" + (openList ? " hidden" : "")}>
                    <a href={`/${to.mode === MODE.visitor ? "visitor" : "exhibitor"}?id=${to._id}`}>
                        {to.name}
                    </a>
                </div>
                <div className={"mesBox" + (openList ? " hidden" : "")} onClick={this.focusToWritting}>

                    {
                        messages?.[0] ?
                            messages.map((mes, index) => {
                                if (user._id !== mes.author) {
                                    return (
                                        <div className="mesLine" key={index}>
                                            <div className="mesAvatar">
                                                <a href={`/${to.mode === MODE.visitor ? "visitor" : "exhibitor"}?id=${to._id}`}>
                                                    <img src={origin + "/image/avatar/" + mes.author} title={to.name} />
                                                </a>
                                            </div>
                                            <div className="mesOther">
                                                <div className="mesContentContainer">
                                                    <div className="mesContent">
                                                        {mes.content?.split("\n").map((messageLine, line) => {
                                                            return (
                                                                <span key={line}>
                                                                    {messageLine}
                                                                    <br />
                                                                </span>
                                                            )

                                                        })}
                                                    </div>
                                                </div>
                                                <div className="mesTimeContainer left">
                                                    <Time className="mesTime" title="2" value="3" createdAt={mes.createdAt} />
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }
                                else {
                                    return (
                                        <div className="mesLine" key={index}>
                                            <div className="mesAuthor">
                                                <div className="mesContentContainer">
                                                    <div className="mesContent">
                                                        {mes.content?.split("\n").map((messageLine, line) => {
                                                            return (
                                                                <span key={line}>
                                                                    {messageLine}
                                                                    {messageLine ? <br /> : ""}
                                                                </span>
                                                            )

                                                        })}
                                                    </div>
                                                </div>
                                                <div className="mesTimeContainer right">
                                                    <Time className="mesTime" title="2" value="3" createdAt={mes.createdAt} />
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }
                            })
                            :
                            <div className="mesLoader" id={`loader_inbox_${to._id}`}>
                                Bạn hãy là người bắt đầu cuộc trò chuyện!
                            </div>
                    }
                    <div id="bottom-message" />

                </div>
                <div className={"mesInput" + (openList ? " hidden" : "")}>
                    <form action="/messages" onSubmit={this.sendMessage}>
                        <div className="form-group">
                            <div className="mesBoxTextarea">
                                <textarea value={this.state.message || ""}
                                    onChange={this.writeMessage}
                                    onKeyDown={this.checkKeyDown}
                                    onClick={this.readMessage}
                                    ref={(e) => { this.Textarea = e; if (e && this.props.focus) { this.readMessage(); e.focus(); } }}
                                    placeholder="Viết tin nhắn" />
                            </div>
                            <div className="mesBoxSubmit">
                                <input type="submit" value="Gửi" onClick={this.readMessage} />
                            </div>
                        </div>
                    </form>
                </div>
            </>
        );
    }
}
export default connect(({ app: { conversations, openList, user, conId } }) => ({ conversations, openList, user, conId }))(MessageBox);