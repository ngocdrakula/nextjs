import React, { Component } from 'react';
import dynamic from 'next/dynamic';
import { connect } from 'react-redux'
import { END } from 'redux-saga';
import Router from 'next/router';
import { wrapper } from '../redux/store';
import types from '../redux/types'
import { getQuery, MODE } from '../utils/helper';



const Header = dynamic(() => import('../components/Header'));
const Footer = dynamic(() => import('../components/Footer'));

class Visitor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visitor: {},
      active: 0,
      message: ''
    };
  }
  componentDidMount() {
    const { dispatch } = this.props;
    const query = getQuery(Router?.router?.asPath);
    if (query.id) {
      dispatch({
        type: types.GET_USER,
        payload: query.id,
        callback: res => {
          if (res?.success) this.setState({ visitor: res.data })
        }
      });
    }
  }
  handleChange = e => this.setState({ message: e.target.value })
  handleSubmit = e => {
    e.preventDefault();
    const { user, dispatch } = this.props;
    if (!user) this.openLoginExhibitor();
    else {
      const { visitor, message } = this.state;
      dispatch({
        type: types.SEND_MESSAGE,
        payload: {
          to: visitor._id,
          message
        },
        callback: res => {
          if (res.success) this.setState({ message: '' })
        }
      })
    }
  }
  openLoginExhibitor = e => {
    e?.preventDefault();
    const { dispatch } = this.props;
    dispatch({ type: types.OPENFORM, payload: MODE.exhibitor });
  }
  handleChat = (e, toUser) => {
    e?.preventDefault();
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
  handleToggle = (e) => {
    e.preventDefault();
    this.setState({ toggle: !this.state.toggle })
  }
  render() {
    const { visitor, active, message, toggle } = this.state;
    const { user } = this.props;
    return (
      <div id="app" className="user-page">
        <Header />
        <div id="content" className="site-content">
          <div id="content" className="site-content">
            <div id="detail-buyer store-detail">
              <div className="store-name">
                <div className="container">
                  <a href="#" className="connect-buyer"><img src="/images/user2.png" alt="" />Người mua</a>
                  <h3>
                    {visitor.avatar ?
                      <img src={`/api/images/${visitor.avatar}`} alt="" />
                      :
                      <img src="/images/logo-showroom.png" alt="" />
                    }
                    <span>{visitor.name || ""}</span>
                  </h3>
                </div>
                <div className="navbar navbar-expand-lg">
                  <button className={"navbar-toggler navbar-toggler-right" + (toggle ? "" : " collapsed")} type="button" onClick={this.handleToggle}>
                    <span className="navbar-toggler-icon" />
                  </button>
                  <div id="navigation">
                    <div className="container">
                      <div className={"collapse navbar-collapse" + (toggle ? " show" : "")} id="navbarResponsive">
                        <ul className="navigation">
                          <li className={active === 0 ? "active" : ""}><a href="#" onClick={e => { e.preventDefault(); this.setState({ active: 0, toggle: !toggle }) }}>Giới thiệu</a></li>
                          <li className={active === 1 ? "active" : ""}><a href="#" onClick={e => { e.preventDefault(); this.setState({ active: 1, toggle: !toggle }) }}>Liên hệ</a></li>
                        </ul>
                        <a href={"/user?filter=" + MODE.visitor} className="right"><img src="/images/icon-list.png" alt="" />Danh sách</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="store-detail-content bg-body" style={{ display: active === 0 ? 'block' : 'none' }}>
                <div className="container">
                  <div className="banner">
                    {visitor.image ?
                      <img src={`/images/${visitor.image}`} alt="" />
                      :
                      <img src="/images/banner.png" alt="" />
                    }
                  </div>
                  <div className="row">
                    <div className="col-lg-3">
                      <div className="sidebar sidebar-left">
                        <h3>Liên hệ</h3>
                        <p>{visitor.contact || ""}</p>
                        <h3>Gửi tin nhắn</h3>
                        <form onSubmit={this.handleSubmit}>
                          <div className="form-group">
                            <textarea
                              className="form-control"
                              rows={4}
                              placeholder="Khoảng 250 từ"
                              name="message"
                              value={message}
                              onChange={this.handleChange}
                              onClick={this.openLoginExhibitor}
                            />
                          </div>
                          <input type="submit" defaultValue="Gửi ngay" />
                        </form>
                        <div className="contact-method">
                          <a href="#" onClick={e => this.handleChat(e, visitor)}><img src="/images/chat2.png" alt="" />Trò chuyện</a>
                          <a href={!user ? "#" : "mailto:" + visitor.email} onClick={!user ? this.openLoginExhibitor : undefined} target="_blank"><img src="/images/mail.png" alt="" />Email</a>
                          <a href="#" onClick={e => this.handleConnect(e, visitor)}><img src="/images/connect2.png" alt="" />Kết nối giao thương</a>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-9">
                      <div className="sidebar-content">
                        <div className="sidebar sidebar-content-top">
                          <div className="row">
                            <div className="col-lg-5">
                              <h3>Giới thiệu Người mua</h3>
                              <p>{visitor.introduce || ""}</p>
                            </div>
                            <div className="col-lg-7">
                              <div className="video">
                                {visitor.video ?
                                  <img src={`/api/images/${visitor.video}`} alt="" />
                                  :
                                  <img src="/images/video-thumb.png" alt="" />
                                }
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="sidebar sidebar-content-bottom">
                          <h3>Sản phẩm cần mua</h3>
                          <p className="ft-semibold">{visitor.productBold || ""}</p>
                          <p>
                            {visitor.product || ""}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="contact-content bg-body" style={{ display: active === 1 ? 'block' : 'none' }}>
                <div className="container">
                  <div className="contact-info">
                    <div className="row">
                      <div className="col-lg-7">
                        <div className="contact-exhibitor">
                          <h3>Liên hệ Người mua</h3>
                          <p className="address">
                            <span>Địa chỉ:</span>
                            <span>{visitor.address}</span>
                          </p>
                          <div className="exhibitor-info">
                            <div className="row">
                              <div className="col-md-6">
                                <div className="exhibitor-detail">
                                  <div className="list-info">
                                    <span>Điện thoại: {user ? visitor.phone : ""}</span>
                                    <span>Hotline: {user ? visitor.hotline : ""}</span>
                                    <span>Fax: {user ? visitor.fax : ""}</span>
                                    <span>Email: {user ? visitor.email : ""}</span>
                                  </div>
                                  {!user ?
                                    <a href="#" className="login-view" onClick={this.openLoginExhibitor}>Đăng nhập để xem</a>
                                    : ""}
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="exhibitor-detail">
                                  <div className="list-info">
                                    <span>Người đại diện: {user ? visitor.representative : ""}</span>
                                    <span>Chức vụ: {user ? visitor.position : ""}</span>
                                    <span>Mobile: {user ? visitor.mobile : ""}</span>
                                    <span>Email: {user ? visitor.re_email : ""}</span>
                                  </div>
                                  {!user ?
                                    <a href="#" className="login-view" onClick={this.openLoginExhibitor}>Đăng nhập để xem</a>
                                    : ""}
                                </div>
                              </div>
                            </div>
                          </div>
                          <p className="web-address"><span>Website:</span><span><a href={visitor.website || "#"}>{visitor.website || ""}</a></span></p>
                          <div className="contact-method">
                            <ul className="ft-semibold">
                              <li><a href="#" onClick={!user ? this.openLoginExhibitor : e => this.handleChat(e, visitor)}><img src="/images/chat2.png" alt="" />Trò chuyện</a></li>
                              <li><a href={!user ? "#" : "mailto:" + visitor.email} onClick={!user ? this.openLoginExhibitor : undefined} target="_blank"><img src="/images/mail.png" alt="" />Email</a></li>
                              <li><a href="#" onClick={e => this.handleConnect(e, visitor)}><img src="/images/connect2.png" alt="" />Kết nối giao thương</a></li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-4">
                        <div className="contact-form">
                          <div className="form">
                            <h3>Gửi tin nhắn cho chúng tôi</h3>
                            <form onSubmit={this.handleSubmit}>
                              <div className="form-group">
                                <input
                                  type="input"
                                  name="name"
                                  className="form-control"
                                  placeholder="Họ và tên"
                                  onClick={this.openLoginExhibitor}
                                />
                              </div>
                              <div className="form-group">
                                <textarea
                                  className="form-control"
                                  rows={4}
                                  placeholder="Khoảng 250 từ"
                                  name="message"
                                  value={message}
                                  onChange={this.handleChange}
                                  onClick={this.openLoginExhibitor}
                                />
                              </div>
                              <input type="submit" defaultValue="Gửi ngay" />
                            </form>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }
}


export const getStaticProps = wrapper.getStaticProps(async ({ store }) => {
  //call all data for SSR
  store.dispatch({ type: types.GET_INDUSTRIES, payload: { page: 0, pageSize: 0, enabled: true } });
  store.dispatch({ type: types.GET_SETTING });

  store.dispatch(END)
  await store.sagaTask.toPromise()
});

export default connect(({ app: { user } }) => ({ user }))(Visitor)
