import React, { Component } from 'react'
import { connect } from 'react-redux';
import Link from 'next/link';
import types from '../../../redux/types';
import { getQuery, MODE, setCookie } from '../../../utils/helper';
import Head from './Head';
import LoginVisitor from './LoginVisitor';
import LoginExhibitor from './LoginExhibitor';
import RegisterVisitor from './RegisterVisitor';
import Router from 'next/router';
import MessageContainer from '../../Message/MessageContainer';
import MessageIconNoti from '../../Message/MessageIconNoti';
import SocketIO from '../../../utils/SocketIO';
import { stringify } from 'qs';
import MessageCustomer from '../../Message/MessageCustomer';
import TradeForm from './TradeForm';
import ResetPassword from './ResetPassword';
import { getLocale, translate } from '../../../utils/language';
import langConfig from '../../../lang.config';
import Logo from '../Logo';

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            selected: getLocale()
        }
    }
    componentDidMount() {
        const { dispatch } = this.props;
        SocketIO.start();
        dispatch({ type: types.USER_LOGIN_LOCAL });
        dispatch({ type: types.GET_ADMIN_INFO });
        const query = getQuery(decodeURI(Router?.router?.asPath));
        if (query.name) this.setState({ name: query.name });
    }
    componentDidUpdate(prevProps) {
        const { dispatch, user } = this.props;
        if (user?._id && prevProps.user?._id !== user._id) {
            dispatch({
                type: types.GET_USER,
                payload: user._id
            });
        }
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
        dispatch({ type: types.ADMIN_LOGOUT });
        dispatch({
            type: types.USER_LOGOUT,
            callback: e => {
                if (Router.router.route = "/profile") Router.push("/", undefined, { scroll: false })
            }
        });
    }
    checkKeyDown = (e) => {
        if (e.keyCode === 13) {
            this.handleSubmit(e)
        }
    }
    handleChooseLang = (lang) => {
        if (lang != getLocale()) {
            setCookie('NEXT_LOCALE', lang);
            // setCookie('googtrans', `/vi/${lang}`);
            this.setState({ selected: lang, visibleLang: false })
            location.reload();
        }
        else {
            this.setState({ visibleLang: false })
        }
    }
    handleToggleLang = () => {
        const { visibleLang } = this.state;
        this.setState({ visibleLang: !visibleLang });
    }
    render() {
        const { name, selected, visibleLang } = this.state;
        const { user } = this.props;
        return (
            <>
                <Head />
                <header id="header" className="site-header">
                    <div className="header-top">
                        <div className="container">
                            <a href="http://www.vimexpo.com.vn" className="online-exhibition"><img src="/images/online.png" alt="" />vimexpo.com.vn</a>
                            <div href="#" className="lang" onClick={this.handleToggleLang} title={translate(langConfig.app.SwitchLanguage)}>
                                <img src={`/images/lang-${selected}.png`} alt="" />
                                <img src="/images/icon-down.png" alt="" />
                                <ul className={"lang-select" + (visibleLang ? " active" : "")}>
                                    <li className={selected === "vn" ? "active" : ""} onClick={() => this.handleChooseLang('vn')} title="Tiếng Việt">
                                        <img src={`/images/lang-vn.png`} alt="" />
                                    </li>
                                    <li className={selected === "en" ? "active" : ""} onClick={() => this.handleChooseLang('en')} title="English">
                                        <img src={`/images/lang-en.png`} alt="" />
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="header-main header-border">
                        <div className="container">
                            <div className="header-content">
                                <div className="row">
                                    <div className="col-5 col-md-3">
                                        <div className="logo">
                                            <Link href="/"><a><Logo /></a></Link>
                                        </div>
                                    </div>
                                    <div className="col-7 col-md-9 choose-login">
                                        {user?._id ?
                                            <div className="login-guest">
                                                <a href="#" onClick={this.handleLogout}><span>{translate(langConfig.app.Logout)}</span></a>
                                            </div>
                                            :
                                            <div className="login-guest">
                                                <a href="#" onClick={this.openLoginVisitor}>
                                                    <span style={{ fontWeight: "normal" }}>{translate(langConfig.app.Login)} </span>
                                                    <span> {translate(langConfig.app.Visitor)}</span>
                                                </a>
                                            </div>
                                        }
                                        {user?._id ?
                                            <div className="login-guest">
                                                <Link href={`/${user.mode === MODE.visitor ? 'profile' : user.mode === MODE.exhibitor ? 'dashboard' : 'admin'}`}>
                                                    <a>
                                                        <span style={{ textTransform: 'uppercase' }}>{user.name || user.email?.split('@')[0]?.slice(0, 10)}</span>
                                                    </a>
                                                </Link>
                                            </div>
                                            :
                                            <div className="login-exhibitor">
                                                <a href="#" onClick={this.openLoginExhibitor}>
                                                    <span style={{ fontWeight: "normal" }}>{translate(langConfig.app.Login)} </span>
                                                    <span> {translate(langConfig.app.Exhibitor)}</span></a>
                                            </div >
                                        }
                                    </div>
                                </div >
                                <div className="search">
                                    <input
                                        type="text"
                                        name="search"
                                        placeholder={translate(langConfig.app.SearchExhibitor)}
                                        name="name"
                                        value={name}
                                        onChange={this.handleChange}
                                        onKeyDown={this.checkKeyDown}
                                    />
                                    <button onClick={this.handleSubmit}  >
                                        <img src="/images/icon-search.png" alt="" title={translate(langConfig.app.Search)} />
                                    </button>
                                </div>
                            </div >
                        </div >
                    </div >
                </header >
                {
                    user?._id ?
                        <>
                            < MessageContainer />
                            <TradeForm />
                        </>
                        :
                        <>
                            <LoginVisitor />
                            <LoginExhibitor />
                            <RegisterVisitor />
                            <ResetPassword />
                            <MessageCustomer />
                        </>
                }
                <MessageIconNoti />
            </>
        )
    }
}

export default connect(({ app: { user } }) => ({ user }))(Header)
