import React, { Component } from 'react'
import { connect } from 'react-redux';
import types from '../../redux/types';

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    handleLogout = e => {
        e.preventDefault();
        const { dispatch } = this.props;
        dispatch({ type: types.ADMIN_LOGOUT });
    }
    handleToggleMail = () => this.setState({ toggleMail: !this.state.toggleMail })
    handleToggleNoti = () => this.setState({ toggleNoti: !this.state.toggleNoti })
    handleToggleUser = () => this.setState({ toggleUser: !this.state.toggleUser })


    render() {
        const { toggleMail, toggleNoti, toggleUser } = this.state;
        const { setting, handleToggle, user } = this.props;
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
                            <li className={"dropdown messages-menu" + (toggleMail ? " open" : "")} onClick={this.handleToggleMail}>
                                <a href="#" className="dropdown-toggle" data-toggle="dropdown">
                                    <i className="fa fa-envelope-o" />
                                </a>
                                <ul className="dropdown-menu">
                                    <li className="header">You have 0 messages</li>
                                    <li>
                                        <ul className="menu">
                                        </ul>
                                    </li>
                                    <li className="footer"><a href="#">See All Messages</a></li>
                                </ul>
                            </li>
                            <li className={"dropdown notifications-menu" + (toggleNoti ? " open" : "")} id="notifications-dropdown" onClick={this.handleToggleNoti}>
                                <a href="#" className="dropdown-toggle" data-toggle="dropdown">
                                    <i className="fa fa-bell-o" />
                                </a>
                                <ul className="dropdown-menu">
                                    <li className="header">You have 0 unread notifications</li>
                                    <li>
                                        <ul className="menu">
                                        </ul>
                                    </li>
                                    <li className="footer"><a href="#">View all notifications</a></li>
                                </ul>
                            </li>
                            <li className={"dropdown user user-menu" + (toggleUser ? " open" : "")} id="notifications-dropdown" onClick={this.handleToggleUser}>
                                <a href="#" className="dropdown-toggle" data-toggle="dropdown">
                                    {user.avatar ?
                                        <img src={"/api/images" + user.avatar} className="user-image" alt="Avatar" />
                                        :
                                        <img src="/images/no-avatar.png" className="user-image" alt="Avatar" />
                                    }
                                    <span className="hidden-xs">{user.name}</span>
                                </a>
                                <ul className="dropdown-menu">
                                    <li className="user-header">
                                        {user.avatar ?
                                            <img src={"/api/images" + user.avatar} className="user-image" alt="Avatar" />
                                            :
                                            <img src="/images/no-avatar.png" className="user-image" alt="Avatar" />
                                        }
                                        <h4>Super Admin</h4>
                                        <p>
                                            Super Admin
                                            <small>Member since 4 months ago</small>
                                        </p>
                                    </li>
                                    <li className="user-footer">
                                        <div className="pull-left">
                                            <a href="#" className="btn btn-default btn-flat"><i className="fa fa-user" /> Account</a>
                                        </div>
                                        <div className="pull-right" onClick={this.handleLogout}>
                                            <a href="#" className="btn btn-default btn-flat"><i className="fa fa-sign-out" /> Log out</a>
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

export default connect(({ admin: { setting, user } }) => ({ setting, user }))(Header)
