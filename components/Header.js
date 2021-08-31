import React, { Component } from 'react'
import { connect } from 'react-redux';
import types from '../redux/types';
import { getQuery, MODE } from '../utils/helper';
import Head from './Head';
import LoginVisitor from '../components/LoginVisitor';
import LoginExhibitor from '../components/LoginExhibitor';
import RegisterVisitor from '../components/RegisterVisitor';
import Router from 'next/router';
import MessageContainer from './Message/MessageContainer';
import MessageIconNoti from './Message/MessageIconNoti';
import SocketIO from '../utils/SocketIO';
import { stringify } from 'qs';

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: ''
        }
    }
    componentDidMount() {
        const { dispatch } = this.props;
        SocketIO.start();
        dispatch({ type: types.USER_LOGIN_LOCAL });
        const query = getQuery(Router?.router?.asPath);
        if (query.name) this.setState({ name: query.name });
    }
    openLoginVisitor = e => {
        e.preventDefault();
        const { dispatch } = this.props;
        dispatch({ type: types.OPENFORM, payload: MODE.visitor });
    }
    openLoginExhibitor = e => {
        e.preventDefault();
        const { dispatch } = this.props;
        dispatch({ type: types.OPENFORM, payload: MODE.exhibitor });
    }
    handleChange = e => {
        this.setState({ name: e.target.value })
    }
    handleSubmit = e => {
        e.preventDefault();
        const { name } = this.state;
        const query = getQuery(Router?.router?.asPath);
        query.name = name;
        Object.keys(query).map((k) => { if (!query[k]) delete query[k] });
        const url = "user?" + stringify(query)
        Router.push(url, undefined, { scroll: false })
    }
    handleLogout = e => {
        e.preventDefault();
        const { dispatch } = this.props;
        dispatch({ type: types.USER_LOGOUT });
    }
    checkKeyDown = (e) => {
        if (e.keyCode === 13) {
            this.handleSubmit(e)
        }
    }
    render() {
        const { name } = this.state;
        const { user } = this.props;
        return (
            <>
                <Head />
                <header id="header" className="site-header">
                    <div className="header-top">
                        <div className="container">
                            <p>
                                <a href="#" className="online-exhibition"><img src="/images/online.png" alt="" />Triển lãm trực tuyến</a>
                                <a href="#" className="lang"><img src="/images/lang-vn.png" alt="" /><img src="/images/icon-down.png" alt="" /></a>
                            </p>
                        </div>
                    </div>
                    <div className="header-main header-border">
                        <div className="container">
                            <div className="header-content">
                                <div className="row">
                                    <div className="col-5 col-md-3">
                                        <div className="logo">
                                            <a href="/"><img src="/images/logo.png" alt="" /></a>
                                        </div>
                                    </div>
                                    <div className="col-7 col-md-9 choose-login">
                                        {user?._id ?
                                            <div className="login-guest">
                                                <a href="#" onClick={this.handleLogout}><span>Đăng xuất</span></a>
                                            </div>
                                            :
                                            <div className="login-guest">
                                                <a href="#" onClick={this.openLoginVisitor}>Đăng nhập <span>Khách tham quan</span></a>
                                            </div>
                                        }
                                        {user?._id ?
                                            <div className="login-guest">
                                                <a href={`/${user.mode === MODE.visitor ? 'visitor' : 'exhibitor'}?id=${user._id}`}>
                                                    <span style={{ textTransform: 'uppercase' }}>{user.name || user.email?.split('@')[0]?.slice(0, 10)}</span>
                                                </a>
                                            </div>
                                            :
                                            <div className="login-exhibitor">
                                                <a href="#" onClick={this.openLoginExhibitor}>Đăng nhập <span>Nhà trưng bày</span></a>
                                            </div>
                                        }
                                    </div>
                                </div>
                                <div className="search">
                                    <input
                                        type="text"
                                        name="search"
                                        placeholder="Tìm kiếm Nhà trưng bày"
                                        name="name"
                                        value={name}
                                        onChange={this.handleChange}
                                        onKeyDown={this.checkKeyDown}
                                    />
                                    <button onClick={this.handleSubmit}  >
                                        <img src="/images/icon-search.png" alt="" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>
                {user?._id ?
                    <>
                        <MessageContainer />
                        <MessageIconNoti />
                    </>
                    :
                    <>
                        <LoginVisitor />
                        <LoginExhibitor />
                        <RegisterVisitor />
                    </>
                }
            </>
        )
    }
}

export default connect(({ app: { user }, admin: { setting } }) => ({ user, setting }))(Header)
