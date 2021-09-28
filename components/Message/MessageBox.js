import React, { Component } from 'react';
import { connect } from 'react-redux';
import types from '../../redux/types';
import { getTime, MODE } from '../../utils/helper';
import SocketIO from '../../utils/SocketIO';
import Time from './Time';

const pageSize = 10;

class MessageBox extends Component {
    state = {
    };
    constructor(props) {
        super(props);
        this.state = {}
    }
    componentDidMount() {
        const { user, dispatch } = this.props;
        SocketIO.socket.on(user._id, data => {
            if (data?.type === 'new' || data?.type === 'send') {
                dispatch({
                    type: types.REVICED_MESSAGE,
                    payload: data.to,
                    callback: res => {
                        if (res?.success) {
                            const { conversationsAll, conId, openList } = this.props;
                            const conCurrent = conversationsAll.find(c => c.leader.user._id === data.to || c.member.user._id === data.to);
                            if (conCurrent._id === conId && !openList) {
                                this.readMessage();
                                this.scrollToBottom();
                            }
                        }
                    }
                })
            }
        });
    }
    componentDidUpdate(prevProps) {
        if (prevProps.openList && !this.props.openList) {
            this.scrollToBottom();
            this.readMessage();
            this.focusToWritting();
        }
    }
    componentWillUnmount() {
        clearTimeout(this.timeout)
        clearInterval(this.interval)
        SocketIO.socket.removeAllListeners(this.props.user._id)
    }
    readMessage = () => {
        const { conversationsAll, conId, user, dispatch } = this.props;
        const conCurrent = conversationsAll.find(con => con._id === conId);
        if (conCurrent) {
            const { leader, member } = conCurrent;
            const from = leader.user._id === user._id ? leader : member;
            if (!from.seen) {
                dispatch({
                    type: types.READ_MESSAGE,
                    payload: conCurrent._id,
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
        if (e.keyCode === 13 && !e.shiftKey) {
            e.preventDefault();
            e.target.style.height = "14px";
            this.sendMessage();
        }
    }
    writeMessage = (e) => {
        e.target.style.height = "14px";
        e.target.style.height = (e.target.scrollHeight - 0) + "px";
        this.setState({
            message: e.target.value
        });
    }
    sendMessage = (e) => {
        if (e) e.preventDefault();
        const { dispatch, conversationsAll, conId, user } = this.props;
        const { message } = this.state;
        const conCurrent = conversationsAll.find(con => con._id === conId) || {};
        const { leader, member } = conCurrent;
        const to = (leader?.user?._id === user._id ? member?.user : leader?.user) || {};
        if (message && to?._id) {
            dispatch({
                type: types.SEND_MESSAGE,
                payload: { message, to: to._id, conId },
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
        const bottom = document.getElementById('bottom-message');
        if (bottom) bottom.scrollIntoView();
    }
    handleScroll = e => {
        if (!this.loading && !e.target.scrollTop) {
            const { conversationsAll, conId, dispatch } = this.props;
            const conCurrent = conversationsAll.find(con => con._id === conId);
            if (conCurrent && !conCurrent.loadAll) {
                this.loading = true;
                dispatch({
                    type: types.GET_ONE_CONVERSATION,
                    payload: {
                        id: conCurrent._id,
                        page: Math.floor((conCurrent.messages.length - 1) / pageSize) + 1,
                        pageSize
                    },
                    callback: res => {
                        if (res?.success) {
                            this.loading = false;
                            e.target.scrollTop = 660;
                        };
                    }
                })
            }
        }
    }
    handleShowTime = id => {
        const timeElm = document.getElementById('time-' + id);
        if (timeElm?.className === "mesTimeContainer left hidden") timeElm.className = "mesTimeContainer left";
        if (timeElm?.className === "mesTimeContainer right hidden") timeElm.className = "mesTimeContainer right";
    }
    render() {
        const { conversationsAll, conId, user, openList } = this.props;
        const conCurrent = conversationsAll.find(con => con._id === conId) || {};
        const { leader, member, messages } = conCurrent;
        const to = (leader?.user?._id === user._id ? member?.user : leader?.user) || {};
        const messagesReverse = messages ? [...messages].reverse() : [];
        return (
            <>
                <div className={"mesTitle" + (openList ? " hidden" : "")}>
                    <a href={`/${to.mode === MODE.visitor ? "visitor" : "exhibitor"}?id=${to._id}`} className="textover" title={to.name}>
                        {to.name}
                    </a>
                </div>
                <div className={"mesBox" + (openList ? " hidden" : "")} onClick={this.focusToWritting} onScroll={this.handleScroll}>
                    {
                        messagesReverse[0] ?
                            messagesReverse.map((mes, index) => {
                                if (user._id !== mes.author) {
                                    return (
                                        <div
                                            key={mes._id}
                                            className="mesLine"
                                            title={getTime(mes.createdAt)[2]}
                                            onClick={() => this.handleShowTime(mes._id)}
                                        >
                                            <div className="mesAvatar">
                                                <a href={`/${to.mode === MODE.visitor ? "visitor" : "exhibitor"}?id=${to._id}`}>
                                                    {to.avatar ?
                                                        <img src={"/api/images/" + to.avatar} />
                                                        :
                                                        <img src="/images/logo-showroom.png" />
                                                    }
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
                                                <div
                                                    className={"mesTimeContainer left" + (!messagesReverse[index + 1]?.author || messagesReverse[index + 1]?.author === user._id ? "" : " hidden")}
                                                    id={'time-' + mes._id}
                                                >
                                                    <Time className="mesTime" title="2" value="3" createdAt={mes.createdAt} />
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }
                                else {
                                    return (
                                        <div
                                            key={mes._id}
                                            className="mesLine"
                                            title={getTime(mes.createdAt)[2]}
                                            onClick={() => this.handleShowTime(mes._id)}
                                        >
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
                                                <div
                                                    className={"mesTimeContainer right" + (messagesReverse[index + 1]?.author !== user._id ? "" : " hidden")}
                                                    id={'time-' + mes._id}
                                                >
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
                                    ref={(e) => this.Textarea = e}
                                    placeholder="Viết tin nhắn"
                                />
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
export default connect(({ app: { conversationsAll, openList, user, conId } }) => ({ conversationsAll, openList, user, conId }))(MessageBox);