import React, { Component } from 'react';
import dynamic from 'next/dynamic';
import { connect } from 'react-redux'
import { END } from 'redux-saga';
import Router from 'next/router';
import { wrapper } from '../redux/store';
import types from '../redux/types'
import { getQuery, MODE } from '../utils/helper';
import Pagination from '../components/Pagination';

const pageSize = 9;



const Header = dynamic(() => import('../components/Header'));
const Footer = dynamic(() => import('../components/Footer'));

class Exhibitor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      exhibitor: {},
      active: 0,
      message: '',
      currentPage: -1,
      products: [],
      total: 0,
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
          if (res?.success) this.setState({ exhibitor: res.data }, () => this.gotoPage());
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
      const { exhibitor, message } = this.state;
      dispatch({
        type: types.SEND_MESSAGE,
        payload: {
          to: exhibitor._id,
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
  handleSelect = (e, industry) => {
    e.preventDefault();
    this.setState({ industrySelected: industry, active: 1, currentPage: -1 }, () => this.gotoPage());
  }
  gotoPage = (index) => {
    const { dispatch } = this.props;
    const { exhibitor, industrySelected, currentPage } = this.state;
    const query = {
      page: index !== undefined ? index : currentPage + 1,
      pageSize,
      exhibitorId: exhibitor._id,
    }
    if (industrySelected) query.industryId = industrySelected;
    dispatch({
      type: types.GET_PRODUCTS,
      payload: query,
      callback: res => {
        if (res?.success) {
          const { data, page, total } = res;
          const list = document.getElementById('product-list');
          if (list && index !== undefined) list.scrollIntoView();
          this.setState({ products: data, currentPage: page, total })
        }
      }
    });
  }
  render() {
    const { exhibitor, active, message, industrySelected, products, currentPage, total } = this.state;
    const { user } = this.props;
    const currentIndustry = exhibitor.industry?.find(i => i._id === industrySelected);
    return (
      <div id="app" className="user-page">
        <Header />
        <div id="content" className="site-content">
          <div id="detail-exhibitor store-detail">
            <div className="store-name">
              <div className="container">
                <a href="#" className="connect-exhibitor"><img src="images/user2.png" alt="" />Nhà trưng bày</a>
                <h3>
                  {exhibitor.avatar ?
                    <img src={`/images/${exhibitor.avatar}`} alt="" />
                    :
                    <img src="/images/logo-showroom.png" alt="" />
                  }
                  <span>{exhibitor.name || ""}</span>
                </h3>
              </div>
              <div className="navbar navbar-expand-lg">
                <button className="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarResponsive">
                  <span className="navbar-toggler-icon" />
                </button>
                <div id="navigation">
                  <div className="container">
                    <div className="collapse navbar-collapse" id="navbarResponsive">
                      <ul className="navigation">
                        <li className={active === 0 ? "active" : ""}>
                          <a href="#" onClick={e => { e.preventDefault(); this.setState({ active: 0 }) }}>Giới thiệu</a>
                        </li>
                        <li className={active === 1 ? "active" : ""}>
                          <a href="#" onClick={e => { e.preventDefault(); this.setState({ active: 1 }) }}>Sản phẩm</a>
                        </li>
                        <li className={active === 2 ? "active" : ""}>
                          <a href="#" onClick={e => { e.preventDefault(); this.setState({ active: 2 }) }}>Live stream</a>
                        </li>
                        <li className={active === 3 ? "active" : ""}>
                          <a href="#" onClick={e => { e.preventDefault(); this.setState({ active: 3 }) }}>Liên hệ</a>
                        </li>
                      </ul>
                      <a href={"/user?filter=" + MODE.exhibitor} className="right"><img src="images/icon-list.png" alt="" />Danh sách</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="store-detail-content bg-body" style={{ display: active === 0 ? 'block' : 'none' }}>
              <div className="container">
                <div className="banner">
                  <img src="images/banner.png" alt="" />
                </div>
                <div className="row">
                  <div className="col-lg-3">
                    <div className="sidebar sidebar-left sidebar-menu">
                      <h3>Sản phẩm</h3>
                      <ul>
                        {exhibitor.industry?.map((indus, index) => {
                          const active = ((!index && !industrySelected) || industrySelected === indus._id)
                          return (
                            <li key={indus._id} className={active ? "active" : ""}>
                              <a href="#" onClick={e => this.handleSelect(e, indus._id)} style={active ? { fontWeight: '500' } : {}}>{indus.name}</a>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                    <div className="sidebar sidebar-left">
                      <h3>Liên hệ</h3>
                      <p>{exhibitor.contact || ""}</p>
                      <h3>Gửi tin nhắn</h3>
                      <form onSubmit={this.handleSubmit}>
                        <div className="form-group">
                          <textarea className="form-control" rows={4} placeholder="Khoảng 250 từ" name="message" value={message} onChange={this.handleChange} />
                        </div>
                        <input type="submit" defaultValue="Gửi ngay" />
                      </form>
                      <div className="contact-method">
                        <a href="#"><img src="images/chat2.png" alt="" />Trò chuyện</a>
                        <a href="#"><img src="images/mail.png" alt="" />Email</a>
                        <a href="#"><img src="images/connect2.png" alt="" />Kết nối giao thương</a>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-9">
                    <div className="sidebar-content">
                      <div className="sidebar sidebar-content-top">
                        <div className="row">
                          <div className="col-lg-5">
                            <h3>Giới thiệu Nhà trưng bày</h3>
                            <p>{exhibitor.introduce || ""}</p>
                          </div>
                          <div className="col-lg-7">
                            <div className="video">
                              {exhibitor.video ?
                                <img src={`/images/${exhibitor.video}`} alt="" />
                                :
                                <img src="/images/video-thumb.png" alt="" />
                              }
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="sidebar sidebar-content-bottom">
                        <h3>Sản phẩm tiêu biểu</h3>
                        <div className="items-list">
                          <div className="row">
                            {products.slice(0, 6).map(product => {
                              return (
                                <div key={product._id} className="col-sm-6 col-lg-4">
                                  <div className="item-detail">
                                    <div className="item-thumb">
                                      <img src={"/api/images/" + product.image} alt="" />
                                    </div>
                                    <div className="item-description">
                                      <p><strong>{product.name}</strong>
                                        <br />
                                        {product.description}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="store-detail-content bg-body" style={{ display: active === 1 ? 'block' : 'none' }}>
              <div className="container">
                <div className="banner">
                  <img src="images/banner.png" alt="" />
                </div>
                <div className="row">
                  <div className="col-lg-3">
                    <div className="sidebar sidebar-left sidebar-menu">
                      <h3>Sản phẩm</h3>
                      <ul>
                        {exhibitor.industry?.map((indus, index) => {
                          const active = ((!index && !industrySelected) || industrySelected === indus._id)
                          return (
                            <li key={indus._id} className={active ? "active" : ""}>
                              <a href="#" onClick={e => this.handleSelect(e, indus._id)} style={active ? { fontWeight: '500' } : {}}>{indus.name}</a>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                    <div className="sidebar sidebar-left">
                      <h3>Liên hệ</h3>
                      <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation.</p>
                      <h3>Gửi tin nhắn</h3>
                      <form onSubmit={this.handleSubmit}>
                        <div className="form-group">
                          <textarea className="form-control" rows={4} placeholder="Khoảng 250 từ" name="message" value={message} onChange={this.handleChange} />
                        </div>
                        <input type="submit" defaultValue="Gửi ngay" />
                      </form>
                      <div className="contact-method">
                        <a href="#"><img src="images/chat2.png" alt="" />Trò chuyện</a>
                        <a href="#"><img src="images/mail.png" alt="" />Email</a>
                        <a href="#"><img src="images/connect2.png" alt="" />Kết nối giao thương</a>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-9" id="product-list">
                    <div className="sidebar-content">
                      <div className="sidebar sidebar-content-bottom sidebar-items">
                        <h3>{currentIndustry?.name || "Sản phẩm tiêu biểu"}</h3>
                        <div className="items-list">
                          <div className="row">
                            {products.map(product => {
                              return (
                                <div key={product._id} className="col-sm-6 col-lg-4">
                                  <div className="item-detail">
                                    <div className="item-thumb">
                                      <img src={"/api/images/" + product.image} alt="" />
                                    </div>
                                    <div className="item-description">
                                      <p><strong>{product.name}</strong>
                                        <br />
                                        {product.description}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                        <Pagination gotoPage={this.gotoPage} {...{ currentPage, pageSize, total }} />
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
            <div className="livestream-content bg-body" style={{ display: active === 2 ? 'block' : 'none' }}>
              <div className="container">
                <div className="livestream-head">
                  <img src="images/livestream-thumb.png" alt="" />
                  <div className="row">
                    <div className="col-lg-8">
                      <p className="ft-semibold">Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt.</p>
                    </div>
                    <div className="col-lg-4">
                      <div className="like-share">
                        <button className="like"><img src="images/icon-like.png" alt="" />Thích <span>19</span></button>
                        {" "}
                        <button className="share">Chia sẻ</button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="livestream-list">
                  <div className="row">
                    <div className="col-sm-6">
                      <div className="livestream-item">
                        <div className="row">
                          <div className="col-lg-5">
                            <img src="images/video1.png" alt="" />
                          </div>
                          <div className="col-lg-7">
                            <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="livestream-item">
                        <div className="row">
                          <div className="col-lg-5">
                            <img src="images/video2.png" alt="" />
                          </div>
                          <div className="col-lg-7">
                            <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="livestream-item">
                        <div className="row">
                          <div className="col-lg-5">
                            <img src="images/video3.png" alt="" />
                          </div>
                          <div className="col-lg-7">
                            <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="livestream-item">
                        <div className="row">
                          <div className="col-lg-5">
                            <img src="images/video4.png" alt="" />
                          </div>
                          <div className="col-lg-7">
                            <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="livestream-item">
                        <div className="row">
                          <div className="col-lg-5">
                            <img src="images/video5.png" alt="" />
                          </div>
                          <div className="col-lg-7">
                            <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="livestream-item">
                        <div className="row">
                          <div className="col-lg-5">
                            <img src="images/video6.png" alt="" />
                          </div>
                          <div className="col-lg-7">
                            <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="contact-content bg-body" style={{ display: active === 3 ? 'block' : 'none' }}>
              <div className="container">
                <div className="contact-info">
                  <div className="row">
                    <div className="col-lg-7">
                      <div className="contact-exhibitor">
                        <h3>Liên hệ Nhà trưng bày</h3>
                        <p className="address">
                          <span>Địa chỉ:</span>
                          <span>{exhibitor.address}</span>
                        </p>
                        <div className="exhibitor-info">
                          <div className="row">
                            <div className="col-md-6">
                              <div className="exhibitor-detail">
                                <div className="list-info">
                                  <span>Điện thoại: {user ? exhibitor.phone : ""}</span>
                                  <span>Hotline: {user ? exhibitor.hotline : ""}</span>
                                  <span>Fax: {user ? exhibitor.fax : ""}</span>
                                  <span>Email: {user ? exhibitor.email : ""}</span>
                                </div>
                                {!user ?
                                  <a href="#" className="login-view" onClick={this.openLoginExhibitor}>Đăng nhập để xem</a>
                                  : ""}
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="exhibitor-detail">
                                <div className="list-info">
                                  <span>Người đại diện: {user ? exhibitor.representative : ""}</span>
                                  <span>Chức vụ: {user ? exhibitor.position : ""}</span>
                                  <span>Mobile: {user ? exhibitor.mobile : ""}</span>
                                  <span>Email: {user ? exhibitor.re_email : ""}</span>
                                </div>
                                {!user ?
                                  <a href="#" className="login-view" onClick={this.openLoginExhibitor}>Đăng nhập để xem</a>
                                  : ""}
                              </div>
                            </div>
                          </div>
                        </div>
                        <p className="web-address"><span>Website:</span><span><a href={exhibitor.website || "#"}>{exhibitor.website || ""}</a></span></p>
                        <div className="contact-method">
                          <ul className="ft-semibold">
                            <li><a href="#"><img src="images/chat2.png" alt="" />Trò chuyện</a></li>
                            <li><a href="#"><img src="images/mail.png" alt="" />Email</a></li>
                            <li><a href="#"><img src="images/connect2.png" alt="" />Kết nối giao
                              thương</a></li>
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
                              <input type="input" name="name" className="form-control" placeholder="Họ và tên" />
                            </div>
                            <div className="form-group">
                              <textarea className="form-control" rows={5} placeholder="Tin nhắn (tối đa 250 từ)" name="message" value={message} onChange={this.handleChange} />
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
        <Footer />
      </div >
    )
  }
}


export const getStaticProps = wrapper.getStaticProps(async ({ store }) => {
  //call all data for SSR
  store.dispatch({ type: types.GET_INDUSTRIES, payload: { page: 0, pageSize: 0, enabled: true } });

  store.dispatch(END)
  await store.sagaTask.toPromise()
});

export default connect(({ app: { user } }) => ({ user }))(Exhibitor)
