import React, { Component } from 'react'
import { connect } from 'react-redux';
import types from '../redux/types';
import Head from './Head';

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({ type: types.USER_LOGIN_LOCAL });
    }
    componentWillUnmount() {
        window.removeEventListener('click', this.handleClick);
    }
    handleLogout = e => {
        e.preventDefault();
        const { dispatch } = this.props;
        dispatch({
            type: types.USER_LOGOUT,
            callback: e => this.setState({ visible: false })
        });
    }
    handleTogle = () => {
        this.setState({ visible: !this.state.visible });
        window.addEventListener('click', this.handleClick);
    }
    handleClick = e => {
        if (!document.getElementById('dropdown')?.contains(e.target)) {
            this.setState({ visible: false });
            window.removeEventListener('click', this.handleClick);
        }
    }
    render() {
        const { user, handleSelect, setting } = this.props;
        const { visible } = this.state;
        return (
            <>
                <Head />
                <nav className="navbar navbar-default navbar-static-top">
                    <div className="container">
                        <div className="navbar-header">
                            <button type="button" data-toggle="collapse" data-target="#app-navbar-collapse" className="navbar-toggle collapsed">
                                <span className="sr-only">Toggle Navigation</span>
                                <span className="icon-bar" />
                                <span className="icon-bar" />
                                <span className="icon-bar" />
                            </button>
                            <a href="/" className="navbar-brand">{setting?.title || process.env.TITLE}</a>
                        </div>
                        {user ?
                            <ul className="nav navbar-nav navbar-right">
                                <li>
                                    <a href="/home" style={{ padding: 9 }}>
                                        <img src="/icons/noavatar.png" style={{ maxWidth: 32, maxHeight: 32, borderRadius: '50%' }} />
                                    </a>
                                </li>
                                <li className={"dropdown" + (visible ? " open" : "")} id="dropdown">
                                    <a href="#" className="dropdown-toggle" onClick={this.handleTogle}>
                                        {user.name} <span className="caret" />
                                    </a>
                                    <ul role="menu" className="dropdown-menu">
                                        <li>
                                            <a href="#" onClick={this.handleLogout}>Logout</a>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                            :
                            <ul className="nav navbar-nav navbar-right">
                                <li>
                                    <a href="/login" onClick={e => handleSelect(e, 'login')}>Login</a>
                                </li>
                                <li>
                                    <a href="/register" onClick={e => handleSelect(e, 'register')}>Register</a>
                                </li>
                            </ul>
                        }
                        <div id="app-navbar-collapse" className="collapse navbar-collapse">
                            <ul className="nav navbar-nav">
                                <li className="active">
                                    <a href="/home">Home</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </>
        )
    }
}

export default connect(({ user: { user }, admin: { setting } }) => ({ user, setting }))(Header)
