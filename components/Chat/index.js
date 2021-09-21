import React, { Component } from 'react'
import { connect } from 'react-redux';
import types from '../../redux/types';
import { MODE } from '../../utils/helper';
import SocketIO from '../../utils/SocketIO';
import ConversationList from './ConversationList';
import MessageBox from './MessageBox';


const pageSize = 10;

class Overview extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    componentDidMount() {
        const { dispatch, exUser, user } = this.props;
        const currentUser = exUser || user;
        dispatch({
            type: types.ADMIN_GET_CONVERSATIONS,
            payload: {
                page: 0,
                pageSize,
                from: currentUser._id
            },
            callback: res => {
                if (res?.success) {
                    SocketIO.socket?.on(currentUser._id, data => {
                        if (data.type === 'message') {
                            dispatch({
                                type: 'OPEN_CONVERSATION',
                                to: data.to,
                            });
                        }
                    });
                }
            }
        })
    }

    componentWillUnmount() {
        const { exUser, user } = this.props;
        const currentUser = exUser || user;
        SocketIO.socket?.removeAllListeners(currentUser._id);
    }

    handleLogout = e => {
        e.preventDefault();
        const { dispatch } = this.props;
        dispatch({ type: types.ADMIN_EXHIBITOR_LOGOUT });
    }

    render() {
        const { active, exUser, user } = this.props;
        const currentUser = exUser || user;
        if (!active || !currentUser._id) return null;
        return (
            <section className="content">
                {user.mode === MODE.admin && exUser ?
                    <div className="callout callout-info">
                        <p>
                            <strong><i className="icon ion-md-nuclear" /> Chú ý! </strong>
                            Bạn đang đăng nhập tài khoản của <b>{currentUser?.name}</b>. Hãy cẩn thận khi xem hoặc gửi tin nhắn từ tài khoản này.
                            <a href="#" className="nav-link pull-right" onClick={this.handleLogout}>
                                <i className="fa fa-sign-out" title="Log out" />
                            </a>
                        </p>
                    </div>
                    : ""}
                <div id="chatbox" style={user.mode === MODE.admin && exUser ? { height: 'calc(100% - 115px)' } : {}}>
                    <div className="row chatContent">
                        <ConversationList />
                        <MessageBox />
                    </div>
                </div>
            </section>

        )
    }
}

export default connect(({ admin: { currentUser, user, exUser } }) => ({ currentUser, user, exUser }))(Overview)
