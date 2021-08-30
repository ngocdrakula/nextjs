import React, { Component } from 'react'
import { connect } from 'react-redux';
import types from '../../redux/types';
import { MODE } from '../../utils/helper';

const pageSize = 6;

class Exhibitor extends Component {
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
            type: types.GET_EXHIBITORS,
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
        const { industries, exhibitors } = this.props
        const { selected } = this.state;
        return (
            <div id="exhibitors">
                <div className="main-title hd-bg-orange">
                    <h2 className="heading">Nhà trưng bày</h2>
                    <div className="heading-bottom">
                        <img src="/images/heading-bottom-sm.png" alt="" />
                    </div>
                    <p>Giới thiệu chung về Gian hàng trực tuyến của Nhà trưng bày tại VIMEXPO 2021</p>
                </div>
                <div className="exhibitor-menu">
                    <ul className="menu">
                        {industries.map((industry, index) => {
                            const active = ((!selected && !index) || (industry._id === selected)) ? " active" : "";
                            return (
                                <li key={industry._id} className={"menu-item" + active}><a href="#" id={industry._id} onClick={this.handleSelect}>{industry.name}</a></li>
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
                                                        <a href={"/exhibitor?id=" + exhibitor._id}>
                                                            {exhibitor.avatar ?
                                                                <img src={`/api/images/${exhibitor.avatar}`} alt="" />
                                                                :
                                                                <img src="/images/logo-showroom.png" alt="" />
                                                            }
                                                        </a>
                                                    </div>
                                                    <div className="col-lg-8">
                                                        <div className="entry-title">
                                                            <h3><a href={"/exhibitor?id=" + exhibitor._id}>{exhibitor.name}</a></h3>
                                                            <p>{exhibitor.introduce}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="store-body">
                                                {exhibitor.image ?
                                                    <img src={`/api/images/${exhibitor.image}`} alt="" />
                                                    :
                                                    <img src="/images/showroom1.png" alt="" />
                                                }

                                            </div>
                                            <div className="store-bottom">
                                                <a href="#" onClick={e => this.handleChat(e, exhibitor)}><img src="/images/talk.png" alt="" />Trò chuyện</a>
                                                <a href="#" onClick={e => this.handleChat(e, exhibitor)}><img src="/images/connect.png" alt="" />Kết nối giao thương</a>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    <div className="load-more">
                        <a href={"/user?filter=" + MODE.exhibitor}>Xem thêm</a>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(({ app: { industries, exhibitors, user } }) => ({ industries, exhibitors, user }))(Exhibitor)
