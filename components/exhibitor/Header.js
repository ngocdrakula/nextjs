import React, { Component } from 'react'
import { connect } from 'react-redux';
import langConfig from '../../lang.config';
import types from '../../redux/types';
import { getTime, MODE } from '../../utils/helper';
import { translate } from '../../utils/language';

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    componentDidMount() {
        const { dispatch, user } = this.props;
        if (user.mode !== MODE.admin) {
            dispatch({ type: types.GET_VISIT });
        }
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
        dispatch({ type: types.ADMIN_EXHIBITOR_LOGOUT });
    }

    handleToggle = (active) => this.setState({ active: active !== this.state.active ? active : null })


    render() {
        const { active } = this.state;
        const { setting, handleToggle, user, newMessage, handleActiveMessage, handleActiveUser } = this.props;
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
                                    <li className="header">{translate(langConfig.app.YouHave)} {newMessage} {translate(langConfig.app.newMesssage)}</li>
                                    <li>
                                        <ul className="menu">
                                        </ul>
                                    </li>
                                    <li className="footer"><a href="#" onClick={handleActiveMessage}>{translate(langConfig.app.ViewAllMessage)}</a></li>
                                </ul>
                            </li>
                            <li
                                className={"dropdown notifications-menu" + (active === 1 ? " open" : "")}
                                id="notifications-dropdown"
                                onClick={() => this.handleToggle(1)}
                            >
                                <a href="#" className="dropdown-toggle" data-toggle="dropdown">
                                    <i className="fa fa-bell-o" />
                                </a>
                                <ul className="dropdown-menu">
                                    <li className="header">{translate(langConfig.app.YouHave)} 0 {translate(langConfig.app.notification)}</li>
                                    <li>
                                        <ul className="menu">
                                        </ul>
                                    </li>
                                    <li className="footer"><a href="#">{translate(langConfig.app.ViewAllNotification)}</a></li>
                                </ul>
                            </li>
                            <li
                                className={"dropdown user user-menu" + (active === 2 ? " open" : "")}
                                id="user-dropdown"
                                onClick={() => this.handleToggle(2)}
                            >
                                <a href="#" className="dropdown-toggle" data-toggle="dropdown">
                                    {user.avatar ?
                                        <img src={"/api/images/" + user.avatar} className="user-image" alt={translate(langConfig.app.Avatar)} />
                                        :
                                        <img src="/images/no-avatar.png" className="user-image" alt={translate(langConfig.app.NoAvatar)} />
                                    }
                                    <span className="hidden-xs">{user.name}</span>
                                </a>
                                <ul className="dropdown-menu">
                                    <li className="user-header">
                                        {user.avatar ?
                                            <img src={"/api/images/" + user.avatar} className="user-image" alt={translate(langConfig.app.Avatar)} />
                                            :
                                            <img src="/images/no-avatar.png" className="user-image" alt={translate(langConfig.app.NoAvatar)} />
                                        }
                                        <h4>{user.name}</h4>
                                        <p>
                                            {user.name}
                                            <small>{translate(langConfig.app.MemberFrom)} {getTime(user.createdAt)[1]}</small>
                                        </p>
                                    </li>
                                    <li className="user-footer">
                                        <div className="pull-left">
                                            <a href="#" onClick={handleActiveUser} className="btn btn-default btn-flat"><i className="fa fa-user" /> {translate(langConfig.app.Account)}</a>
                                        </div>
                                        <div className="pull-right" onClick={this.handleLogout}>
                                            <a href="#" className="btn btn-default btn-flat"><i className="fa fa-sign-out" /> {translate(langConfig.app.Logout)}</a>
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

export default connect(({ admin: { setting, exUser, user, newMessage } }) => ({ setting, user: exUser || user, newMessage }))(Header)
