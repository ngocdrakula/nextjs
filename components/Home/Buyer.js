import React, { Component } from 'react'
import { connect } from 'react-redux';
import types from '../../redux/types';
import { MODE } from '../../utils/helper';

const pageSize = 6;

class Buyer extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    handleSelect = e => {
        e.preventDefault();
        const { dispatch } = this.props;
        this.setState({ selected: e.target.id });
        dispatch({
            type: types.GET_VISITORS,
            payload: {
                page: 0,
                pageSize,
                industry: e.target.id
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
        else if (user?._id) {
            dispatch({
                type: types.OPENFORM,
                payload: MODE.exhibitor,
            });
        }
    }
    render() {
        const { industries, visitors } = this.props
        const { selected } = this.state;
        return (
            <div id="buyers">
                <div className="main-title hd-bg-orange">
                    <h2 className="heading">Người mua</h2>
                    <div className="heading-bottom"><img src="/images/heading-bottom-sm.png" alt="" /></div>
                    <p>Giới thiệu chung về Gian hàng trực tuyến của Người mua tại Vimexpo 2021</p>
                </div>
                <div className="buyer-menu">
                    <ul className="menu">
                        {industries.map((industry, index) => {
                            const active = ((!selected && !index) || (industry._id === selected)) ? " active" : "";
                            return (
                                <li key={industry._id} className={"menu-item" + active}><a href="#" id={industry._id} onClick={this.handleSelect}>{industry.name}</a></li>
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
                                                    <a href={"/visitor?id=" + visitor._id}>
                                                        {visitor.avatar ?
                                                            <img src={`/api/images/${visitor.avatar}`} alt="" />
                                                            :
                                                            <img src="/images/logo-showroom.png" alt="" />
                                                        }
                                                    </a>
                                                </div>
                                                <div className="col-lg-8">
                                                    <div className="entry-title">
                                                        <h3><a href={"/visitor?id=" + visitor._id}>{visitor.name}</a></h3>
                                                        <p>{visitor.introduce}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="store-body">
                                            {visitor.image ?
                                                <img src={`/api/images/${visitor.image}`} alt="" />
                                                :
                                                <img src="/images/showroom1.png" alt="" />
                                            }
                                        </div>
                                        <div className="store-bottom">
                                            <a href="#" onClick={e => this.handleChat(e, visitor)}><img src="/images/talk.png" alt="" />Trò chuyện</a>
                                            <a href="#" onClick={e => this.handleChat(e, visitor)}><img src="/images/connect.png" alt="" />Kết nối giao thương</a>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                        </div>
                    </div>
                    <div className="load-more">
                        <a href={"/user?filter=" + MODE.visitor}>Xem thêm</a>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(({ app: { industries, visitors, user } }) => ({ industries, visitors, user }))(Buyer)
