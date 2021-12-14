import React, { Component } from 'react'
import { connect } from 'react-redux';
import Link from 'next/link';
import langConfig from '../../lang.config';
import types from '../../redux/types';
import { MODE } from '../../utils/helper';
import { getLocale, translate } from '../../utils/language';

const pageSize = 6;

class Exhibitor extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    handleSelect = (e, id) => {
        e.preventDefault();
        const { dispatch } = this.props;
        this.setState({ selected: id });
        dispatch({
            type: types.GET_EXHIBITORS,
            payload: {
                page: 0,
                pageSize,
                industry: id
            }
        })
    }
    handleChat = (e, toUser) => {
        e.preventDefault();
        const { user, dispatch } = this.props;
        if (user?._id && user._id !== toUser._id) {
            dispatch({
                type: types.GET_CONVERSATION_TO,
                payload: { ...toUser, open: true },
            });
        }
        else if (!user?._id) {
            dispatch({
                type: types.OPENFORM,
                payload: MODE.visitor,
            });
        }
    }
    handleConnect = (e, toUser) => {
        e.preventDefault();
        const { user, dispatch } = this.props;
        if (user?._id && user._id !== toUser._id) {
            dispatch({
                type: types.CREATE_TRADE,
                payload: toUser,
            });
        }
        else if (!user?._id) {
            dispatch({
                type: types.OPENFORM,
                payload: MODE.visitor,
            });
        }
    }
    render() {
        const setting = this.props.setting[getLocale()] || {};
        const { industries, exhibitors } = this.props
        const { selected } = this.state;
        return (
            <div id="exhibitors">
                <div className="main-title hd-bg-orange">
                    <h2 className="heading">{setting.exhibitorTitle}</h2>
                    <div className="heading-bottom">
                        <img src="/images/heading-bottom-sm.png" alt="" />
                    </div>
                    <p>{setting.exhibitorDescription}</p>
                </div>
                <div className="exhibitor-menu">
                    <ul className="menu">
                        {industries.map((industry, index) => {
                            const active = ((!selected && !index) || (industry._id === selected)) ? " active" : "";
                            return (
                                <li key={industry._id} className={"menu-item" + active}>
                                    <a href="#" onClick={e => this.handleSelect(e, industry._id)}>{translate(industry.names) || industry.name}</a>
                                </li>
                            )
                        })}
                    </ul>
                </div>
                <div className="exhibitors-list stores-list">
                    <div className="container">
                        <div className="row">
                            {exhibitors.map(exhibitor => {
                                return (
                                    <div key={exhibitor._id} className="col-sm-6">
                                        <div className="exhibitor-item store-item">
                                            <div className="store-top">
                                                <div className="row">
                                                    <div className="col-lg-4">
                                                        <Link href={"/exhibitor?id=" + exhibitor._id}>
                                                            <a>
                                                                {exhibitor.avatar ?
                                                                    <img src={`/api/images/${exhibitor.avatar}`} alt="" />
                                                                    :
                                                                    <img src="/images/no-logo.png" alt="" />
                                                                }
                                                            </a>
                                                        </Link>
                                                    </div>
                                                    <div className="col-lg-8">
                                                        <div className="entry-title">
                                                            <h3>{console.log(exhibitor, exhibitor.introduces, translate(exhibitor.introduces))}
                                                                <Link href={"/exhibitor?id=" + exhibitor._id}>
                                                                    <a >{translate(exhibitor.names) || exhibitor.name}</a>
                                                                </Link>
                                                            </h3>
                                                            <p>{translate(exhibitor.introduces) || exhibitor.introduce}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="store-body">
                                                {exhibitor.image ?
                                                    <img src={`/api/images/${exhibitor.image}`} alt="" />
                                                    :
                                                    <img src="/images/no-banner-thumb.png" alt="" />
                                                }

                                            </div>
                                            <div className="store-bottom">
                                                <a href="#" onClick={e => this.handleChat(e, exhibitor)}><img src="/images/talk.png" alt="" />{translate(langConfig.app.Chat)}</a>
                                                <a href="#" onClick={e => this.handleConnect(e, exhibitor)}><img src="/images/connect.png" alt="" />{translate(langConfig.app.TradeConnection)}</a>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    <div className="load-more">
                        <a href={"/user?filter=" + MODE.exhibitor}>{translate(langConfig.app.SeeMore)}</a>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(({ app: { setting, industries, exhibitors, user } }) => ({ setting, industries, exhibitors, user }))(Exhibitor)
