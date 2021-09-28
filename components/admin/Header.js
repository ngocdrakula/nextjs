import React, { Component } from 'react'
import { connect } from 'react-redux';
import types from '../../redux/types';
import { getTime } from '../../utils/helper';

const pageSize = 10;

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
            type: types.ADMIN_GET_NOTI,
            payload: { page: 0, pageSize }
        });
        document.documentElement.addEventListener('click', this.handleClick, true);
    }
    componentWillUnmount() {
        document.documentElement.removeEventListener('click', this.handleClick, true);
    }
    handleClick = (e) => {
        const { active } = this.state;
        if ((!document.getElementById('messages-dropdown')?.contains(e.target) && active === 0) ||
            (!document.getElementById('notifications-dropdown')?.contains(e.target) && active === 1) ||
            (!document.getElementById('user-dropdown')?.contains(e.target) && active === 2)
        ) {
            this.setState({ active: null })
        }
    }
    handleLogout = e => {
        e.preventDefault();
        const { dispatch } = this.props;
        dispatch({ type: types.ADMIN_LOGOUT });
    }
    handleToggle = (active) => this.setState({ active: active !== this.state.active ? active : null })

    render() {
        const { active } = this.state;
        const { setting, handleToggle, handleActiveMessage, handleActiveVisitor, handleActiveUser, user, newMessage, newNoti, notis } = this.props;
        return (

            <header className="main-header">
                <a href="/" className="logo">
                    <span className="logo-mini">{setting?.title || process.env.TITLE}</span>
                    <span className="logo-lg" style={{ fontSize: 14 }}>{setting?.title || process.env.TITLE}</span>
                </a>
                <nav className="navbar navbar-static-top" role="navigation">
                    <a href="#" className="sidebar-toggle" onClick={handleToggle}>
                        <span className="sr-only">Toggle navigation</span>
                    </a>
                    <div className="navbar-custom-menu">
                        <ul className="nav navbar-nav">
                            <li
                                className={"dropdown messages-menu" + (active === 0 ? " open" : "") + (newMessage ? " new" : "")}
                                id="messages-dropdown"
                                onClick={() => this.handleToggle(0)}
                            >
                                <a href="#" className="dropdown-toggle" data-toggle="dropdown">
                                    <i className="fa fa-envelope-o" />
                                </a>
                                <ul className="dropdown-menu">
                                    <li className="header">Bạn có {newMessage} tin nhắn mới</li>
                                    <li>
                                        <ul className="menu">
                                        </ul>
                                    </li>
                                    <li className="footer"><a href="#" onClick={handleActiveMessage}>Xem tất cả tin nhắn</a></li>
                                </ul>
                            </li>
                            <li
                                className={"dropdown notifications-menu" + (active === 1 ? " open" : "") + (newNoti ? " new" : "")}
                                id="notifications-dropdown"
                                onClick={() => this.handleToggle(1)}
                            >
                                <a href="#" className="dropdown-toggle" data-toggle="dropdown">
                                    <i className="fa fa-bell-o" />
                                </a>
                                <ul className="dropdown-menu">
                                    <li className="header">Bạn có {newNoti} thông báo mới</li>
                                    <li>
                                        <ul className="menu">
                                            {notis.map(noti => {
                                                return (
                                                    <li key={noti._id}>
                                                        <a href="#" onClick={handleActiveVisitor}>{noti.read ? noti.message : <b>{noti.message}</b>}</a>
                                                    </li>
                                                )
                                            })}
                                        </ul>
                                    </li>
                                    <li className="footer"><a href="#" onClick={handleActiveVisitor}>Xem tất cả khách thăm quan mới</a></li>
                                </ul>
                            </li>
                            <li
                                className={"dropdown user user-menu" + (active === 2 ? " open" : "")}
                                id="user-dropdown"
                                onClick={() => this.handleToggle(2)}
                            >
                                <a href="#" className="dropdown-toggle" data-toggle="dropdown">
                                    {user.avatar ?
                                        <img src={"/api/images/" + user.avatar} className="user-image" alt="Avatar" />
                                        :
                                        <img src="/images/no-avatar.png" className="user-image" alt="Avatar" />
                                    }
                                    <span className="hidden-xs">{user.name}</span>
                                </a>
                                <ul className="dropdown-menu">
                                    <li className="user-header">
                                        {user.avatar ?
                                            <img src={"/api/images/" + user.avatar} className="user-image" alt="Avatar" />
                                            :
                                            <img src="/images/no-avatar.png" className="user-image" alt="Avatar" />
                                        }
                                        <h4>{user.name}</h4>
                                        <p>
                                            {user.name}
                                            <small>Đã tạo từ {getTime(user.createdAt)[1]}</small>
                                        </p>
                                    </li>
                                    <li className="user-footer">
                                        <div className="pull-left">
                                            <a href="#" onClick={handleActiveUser} className="btn btn-default btn-flat"><i className="fa fa-user" /> Tài khoản</a>
                                        </div>
                                        <div className="pull-right" onClick={this.handleLogout}>
                                            <a href="#" className="btn btn-default btn-flat"><i className="fa fa-sign-out" /> Đăng xuất</a>
                                        </div>
                                    </li>
                                </ul>
                            </li>
                            <li>
                            </li>
                        </ul>
                    </div>
                </nav>
            </header>
        )
    }
}

export default connect(({ admin: { setting, user, newMessage, newNoti, noti: { data: notis } } }) => ({ setting, user, newMessage, newNoti, notis }))(Header)
