import React, { Component } from 'react'
import { connect } from 'react-redux';
import Link from 'next/link';
import langConfig from '../../lang.config';
import types from '../../redux/types';
import { MODE } from '../../utils/helper';
import { translate } from '../../utils/language';

const pageSize = 6;

class Buyer extends Component {
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
            type: types.GET_VISITORS,
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
                payload: MODE.exhibitor,
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
                payload: MODE.exhibitor,
            });
        }
    }
    render() {
        const { setting, industries, visitors } = this.props
        const { selected } = this.state;
        return (
            <div id="buyers">
                <div className="main-title hd-bg-orange">
                    <h2 className="heading">{setting.visitorTitle}</h2>
                    <div className="heading-bottom"><img src="/images/heading-bottom-sm.png" alt="" /></div>
                    <p>{setting.visitorDescription}</p>
                </div>
                <div className="buyer-menu">
                    <ul className="menu">
                        {industries.map((industry, index) => {
                            const active = ((!selected && !index) || (industry._id === selected)) ? " active" : "";
                            return (
                                <li key={industry._id} className={"menu-item" + active}>
                                    <a href="#" onClick={e => this.handleSelect(e, industry._id)}>{industry.name}</a>
                                </li>
                            )
                        })}
                    </ul>
                </div>
                <div className="buyers-list stores-list">
                    <div className="container">
                        <div className="row">{visitors.map(visitor => {
                            return (
                                <div key={visitor._id} className="col-sm-6">
                                    <div className="buyer-item store-item">
                                        <div className="store-top">
                                            <div className="row">
                                                <div className="col-lg-4">
                                                    <Link href={"/visitor?id=" + visitor._id}>
                                                        <a>
                                                            {visitor.avatar ?
                                                                <img src={`/api/images/${visitor.avatar}`} alt="" />
                                                                :
                                                                <img src="/images/no-logo.png" alt="" />
                                                            }
                                                        </a>
                                                    </Link>
                                                </div>
                                                <div className="col-lg-8">
                                                    <div className="entry-title">
                                                        <h3>
                                                            <Link href={"/visitor?id=" + visitor._id}>
                                                                <a>{visitor.name}</a>
                                                            </Link>
                                                        </h3>
                                                        <p>{visitor.introduce}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="store-body">
                                            {visitor.image ?
                                                <img src={`/api/images/${visitor.image}`} alt="" />
                                                :
                                                <img src="/images/no-image-thumb.png" alt="" />
                                            }
                                        </div>
                                        <div className="store-bottom">
                                            <a href="#" onClick={e => this.handleChat(e, visitor)}><img src="/images/talk.png" alt="" />{translate(langConfig.app.Chat)}</a>
                                            <a href="#" onClick={e => this.handleConnect(e, visitor)}><img src="/images/connect.png" alt="" />{translate(langConfig.app.TradeConnection)}</a>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                        </div>
                    </div>
                    <div className="load-more">
                        <a href={"/user?filter=" + MODE.visitor}>{translate(langConfig.app.SeeMore)}</a>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(({ app: { setting, industries, visitors, user } }) => ({ setting, industries, visitors, user }))(Buyer)
