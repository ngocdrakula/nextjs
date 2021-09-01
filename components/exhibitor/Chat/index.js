import React, { Component } from 'react'
import { connect } from 'react-redux';
import types from '../../../redux/types';
import { MODE } from '../../../utils/helper';
import SocketIO from '../../../utils/SocketIO';
import ConversationList from './ConversationList';
import MessageBox from './MessageBox';


const pageSize = 10;

class Overview extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    componentDidMount() {
        if (this.props.exUser) this.handleConnect();
    }

    componentDidUpdate(prevProps) {
        const { exUser } = this.props;
        if (!prevProps.exUser?._id && exUser._id) {
            this.handleConnect(prevProps.exUser?._id);
        }
    }
    handleConnect = (oldId) => {
        const { dispatch, exUser } = this.props;
        if (oldId) SocketIO.socket?.removeAllListeners(oldId);

        dispatch({
            type: types.ADMIN_GET_CONVERSATIONS,
            payload: {
                page: 0,
                pageSize,
                from: exUser._id
            },
            callback: res => {
                if (res?.success) {
                    SocketIO.socket?.on(exUser._id, data => {
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

    handleLogout = e => {
        e.preventDefault();
        const { dispatch } = this.props;
        dispatch({ type: types.ADMIN_EXHIBITOR_LOGOUT });
    }

    render() {
        const { active, user, exUser } = this.props
        if (!active || !exUser?._id) return null;
        return (
            <section className="content">
                {user.mode === MODE.admin ?
                    <div className="callout callout-info">
                        <p>
                            <strong><i className="icon ion-md-nuclear" /> Chú ý! </strong>
                            Bạn đang đăng nhập tài khoản của <b>{exUser?.name}</b>. Hãy cẩn thận khi xem hoặc gửi tin nhắn từ tài khoản này.
                            <a href="#" className="nav-link pull-right" onClick={this.handleLogout}>
                                <i className="fa fa-sign-out" title="Log out" />
                            </a>
                        </p>
                    </div>
                    : ""}
                <div id="chatbox" style={user.mode === MODE.admin ? { height: 'calc(100% - 115px)' } : {}}>
                    <div className="row chatContent">
                        <ConversationList />
                        <MessageBox />
                    </div>
                </div>
            </section>

        )
    }
}

export default connect(({ admin: { exUser, user } }) => ({ exUser, user }))(Overview)
