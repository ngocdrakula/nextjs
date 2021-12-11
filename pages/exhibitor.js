import React, { Component } from 'react';
import { connect } from 'react-redux'
import { END } from 'redux-saga';
import Router from 'next/router';
import Link from 'next/link';
import ErrorPage from 'next/error'
import { wrapper } from '../redux/store';
import types from '../redux/types'
import { getQuery, MODE } from '../utils/helper';
import Pagination from '../components/pagination/Pagination';
import Livestream from '../components/exhibitorPage/Livestream';
import langConfig from '../lang.config';
import { translate } from '../utils/language';

const pageSize = 9;


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
      loading: true
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
          if (res?.success) {
            this.setState({ exhibitor: res.data, loading: false }, () => {
              dispatch({
                type: types.GET_CATEGORIES,
                payload: { exhibitor: query.id },
                callback: res => {
                  if (res?.success) this.gotoPage();
                }
              });
            });
          }
          else { this.setState({ loading: false }) }
        }
      });
    }
    else { this.setState({ loading: false }) }
  }
  handleChange = e => this.setState({ message: e.target.value })
  handleSubmit = e => {
    e.preventDefault();
    const { user, dispatch } = this.props;
    if (!user) this.openLoginVisitor();
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
  openLoginVisitor = e => {
    e?.preventDefault();
    const { dispatch } = this.props;
    dispatch({ type: types.OPENFORM, payload: MODE.visitor });
  }
  handleSelect = (e, category) => {
    e.preventDefault();
    this.setState({ categorySelected: category, active: 1, currentPage: -1 }, () => this.gotoPage());
  }
  gotoPage = (index) => {
    const { dispatch } = this.props;
    const { exhibitor, categorySelected, currentPage } = this.state;
    const query = {
      page: index !== undefined ? index : currentPage + 1,
      pageSize,
      exhibitorId: exhibitor._id,
    }
    if (categorySelected) query.categoryId = categorySelected;
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
  handleToggle = (e) => {
    e.preventDefault();
    this.setState({ toggle: !this.state.toggle })
  }
  render() {
    const { exhibitor, active, message, categorySelected, products, currentPage, total, toggle, loading } = this.state;
    const { categories, user, livestream } = this.props;
    const currentCategory = categories.find(i => i._id === categorySelected);
    if (!loading && !exhibitor._id) return <ErrorPage statusCode={404} />
    return (
      <div id="content" className="site-content">
        <div id="detail-exhibitor store-detail">
          <div className="store-name">
            <div className="container">
              <Link href={"/user?filter=" + (MODE.exhibitor)}>
                <a className="connect-exhibitor"><img src="/images/user2.png" alt="" />{translate(langConfig.app.Exhibitor)}</a>
              </Link>
              <h3>
                <div className="exhibiton-avatar">
                  {exhibitor.avatar ?
                    <img src={`/api/images/${exhibitor.avatar}`} alt="" />
                    :
                    <img src="/images/no-logo.png" alt="" />
                  }
                </div>
                <span>{exhibitor.name || ""}</span>
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
                      <li className={active === 0 ? "active" : ""}>
                        <a href="#" onClick={e => { e.preventDefault(); this.setState({ active: 0, toggle: !toggle }) }}>{translate(langConfig.app.Introduce)}</a>
                      </li>
                      <li className={active === 1 ? "active" : ""}>
                        <a href="#" onClick={e => { e.preventDefault(); this.setState({ active: 1, toggle: !toggle }) }}>{translate(langConfig.app.Product)}</a>
                      </li>
                      <li className={active === 2 ? "active" : ""}>
                        <a href="#" onClick={e => { e.preventDefault(); this.setState({ active: 2, toggle: !toggle }) }}>{translate(langConfig.app.Livestream)}</a>
                      </li>
                      <li className={active === 3 ? "active" : ""}>
                        <a href="#" onClick={e => { e.preventDefault(); this.setState({ active: 3, toggle: !toggle }) }}>{translate(langConfig.app.Contact)}</a>
                      </li>
                    </ul>
                    <Link href={"/user?filter=" + MODE.exhibitor}>
                      <a className="right"><img src="/images/icon-list.png" alt="" />{translate(langConfig.app.List)}</a>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="store-detail-content bg-body" style={{ display: active === 0 ? 'block' : 'none' }}>
            <div className="container">
              <div className="banner">
                {exhibitor.image ?
                  <img src={`/api/images/${exhibitor.image}`} alt="" />
                  :
                  <img src="/images/no-banner.png" alt="" />}
              </div>
              <div className="row">
                <div className="col-lg-3">
                  <div className="sidebar sidebar-left sidebar-menu">
                    <h3>{translate(langConfig.app.ExhibitionField)}</h3>
                    <ul>
                      {categories.map((cate, index) => {
                        const active = ((!index && !categorySelected) || categorySelected === cate._id)
                        return (
                          <li key={cate._id} className={active ? "active" : ""}>
                            <a href="#" onClick={e => this.handleSelect(e, cate._id)} style={active ? { fontWeight: '500' } : {}}>{cate.name}</a>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                  <div className="sidebar sidebar-left">
                    <h3>{translate(langConfig.app.Contact)}</h3>
                    <p>{(exhibitor.contact || "")?.split('\n').map((d, i) => <React.Fragment key={i}>{i ? <br /> : ""}{d}</React.Fragment>)}</p>
                    <h3>{translate(langConfig.app.SendMessage)}</h3>
                    <form onSubmit={this.handleSubmit}>
                      <div className="form-group">
                        <textarea
                          className="form-control"
                          rows={4}
                          placeholder={translate(langConfig.app.Max250Words)}
                          name="message"
                          value={message}
                          onChange={this.handleChange}
                          onClick={this.openLoginVisitor}
                        />
                      </div>
                      <input type="submit" value={translate(langConfig.app.Send)} />
                    </form>
                    <div className="contact-method">
                      <a href="#" onClick={e => this.handleChat(e, exhibitor)}><img src="/images/chat2.png" alt="" />{translate(langConfig.app.Chat)}</a>
                      <a href={!user ? "#" : "mailto:" + exhibitor.email} onClick={!user ? this.openLoginVisitor : undefined} target="_blank"><img src="/images/mail.png" alt="" />{translate(langConfig.app.Email)}</a>
                      <a href="#" onClick={e => this.handleConnect(e, exhibitor)}><img src="/images/connect2.png" alt="" />{translate(langConfig.app.Trade)}</a>
                    </div>
                  </div>
                </div>
                <div className="col-lg-9">
                  <div className="sidebar-content">
                    <div className="sidebar sidebar-content-top">
                      <div className="row">
                        <div className="col-lg-5">
                          <h3>{translate(langConfig.app.AboutExhibitor)}</h3>
                          <p>{exhibitor.introduce || ""}</p>
                        </div>
                        <div className="col-lg-7">
                          {livestream?.data?.[0] ?
                            <div className="video" dangerouslySetInnerHTML={{
                              __html:
                                `<iframe
                                      src="${livestream?.data?.[0].link}"
                                      width="100%"
                                      height="300"
                                      style="border:none;overflow:hidden"
                                      scrolling="no"
                                      frameborder="0"
                                      allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                                      allowfullScreen={true}
                                  ></iframe>`
                            }} />
                            :
                            <div className="video">
                              <img src="/images/video-thumb.png" alt="" />
                            </div>
                          }
                        </div>
                      </div>
                      <div className="sidebar sidebar-content-bottom">
                        <h3>{translate(langConfig.app.FeaturedProducts)}</h3>
                        <div className="items-list">
                          <div className="row">
                            {products.slice(0, 6).map(product => {
                              return (
                                <div key={product._id} className="col-sm-6 col-lg-4">
                                  <div className="item-detail">
                                    <div className="item-thumb" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', maxHeight: 270 }}>
                                      <img src={"/api/images/" + product.image} alt="" style={{ width: 'auto', height: 'auto' }} />
                                    </div>
                                    <div className="item-description">
                                      <p><strong>{product.name}</strong></p>
                                      <div className="dangerously" dangerouslySetInnerHTML={{ __html: product.description }} />
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                            {!products.length ? <div className="col-sm-12"><h5>{translate(langConfig.app.NoFeaturedProducts)}</h5></div> : ""}
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
        <div className="store-detail-content bg-body" style={{ display: active === 1 ? 'block' : 'none' }}>
          <div className="container">
            <div className="banner">
              <img src="/images/banner.png" alt="" />
            </div>
            <div className="row">
              <div className="col-lg-3">
                <div className="sidebar sidebar-left sidebar-menu">
                  <h3>{translate(langConfig.app.ExhibitionField)}</h3>
                  <ul>
                    {categories.map((cate, index) => {
                      const active = ((!index && !categorySelected) || categorySelected === cate._id)
                      return (
                        <li key={cate._id} className={active ? "active" : ""}>
                          <a href="#" onClick={e => this.handleSelect(e, cate._id)} style={active ? { fontWeight: '500' } : {}}>{cate.name}</a>
                        </li>
                      );
                    })}
                  </ul>
                </div>
                <div className="sidebar sidebar-left">
                  <h3>{translate(langConfig.app.Contact)}</h3>
                  <p>{(exhibitor.contact || "")?.split('\n').map((d, i) => <React.Fragment key={i}>{i ? <br /> : ""}{d}</React.Fragment>)}</p>
                  <h3>{translate(langConfig.app.SendMessage)}</h3>
                  <form onSubmit={this.handleSubmit}>
                    <div className="form-group">
                      <textarea
                        className="form-control"
                        rows={4}
                        placeholder={translate(langConfig.app.Max250Words)}
                        name="message"
                        value={message}
                        onChange={this.handleChange}
                        onClick={this.openLoginVisitor}
                      />
                    </div>
                    <input type="submit" value={translate(langConfig.app.SendNow)} />
                  </form>
                  <div className="contact-method">
                    <a href="#" onClick={e => this.handleChat(e, exhibitor)}><img src="/images/chat2.png" alt="" />{translate(langConfig.app.Chat)}</a>
                    <a href={!user ? "#" : "mailto:" + exhibitor.email} onClick={!user ? this.openLoginVisitor : undefined} target="_blank"><img src="/images/mail.png" alt="" />{translate(langConfig.app.Email)}</a>
                    <a href="#" onClick={e => this.handleConnect(e, exhibitor)}><img src="/images/connect2.png" alt="" />{translate(langConfig.app.Trade)}</a>
                  </div>
                </div>
                <div className="col-lg-9" id="product-list">
                  <div className="sidebar-content">
                    <div className="sidebar sidebar-content-bottom sidebar-items">
                      <h3>{currentCategory?.name || translate(langConfig.app.Product)}</h3>
                      <div className="items-list">
                        <div className="row">
                          {products.map(product => {
                            return (
                              <div key={product._id} className="col-sm-6 col-lg-4">
                                <div className="item-detail">
                                  <div className="item-thumb" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', maxHeight: 270 }}>
                                    <img src={"/api/images/" + product.image} alt="" style={{ width: 'auto', height: 'auto', }} />
                                  </div>
                                  <div className="item-description">
                                    <p><strong>{product.name}</strong></p>
                                    <div className="dangerously" dangerouslySetInnerHTML={{ __html: product.description }} />
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                          {!products.length ? <div className="col-sm-12"><h5>{translate(langConfig.app.NoCategoryProducts)}</h5></div> : ""}
                        </div>
                      </div>
                    </div>
                    <Pagination gotoPage={this.gotoPage} {...{ currentPage, pageSize, total }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {exhibitor?._id ? <Livestream active={active === 2} exhibitor={exhibitor} /> : ""}
        <div className="contact-content bg-body" style={{ display: active === 3 ? 'block' : 'none' }}>
          <div className="container">
            <div className="contact-info">
              <div className="row">
                <div className="col-lg-7">
                  <div className="contact-exhibitor">
                    <h3>{translate(langConfig.app.ContactExhibitor)}</h3>
                    <div className="row address">
                      <div className="col-md-2 col-sm-4">
                        <span>{translate(langConfig.app.Address)}:</span>
                      </div>
                    </div>
                    <div className="exhibitor-info">
                      <div className="row">
                        <div className="col-md-6">
                          <div className="exhibitor-detail">
                            <div className="list-info">
                              <span>{translate(langConfig.app.Phone)} : {user ? exhibitor.phone : ""}</span>
                              <span>{translate(langConfig.app.Hotline)}: {user ? exhibitor.hotline : ""}</span>
                              <span>{translate(langConfig.app.Fax)}: {user ? exhibitor.fax : ""}</span>
                              <span>{translate(langConfig.app.Email)}: {user ? exhibitor.email : ""}</span>
                            </div>
                            {!user ?
                              <a href="#" className="login-view" onClick={this.openLoginVisitor}>{translate(langConfig.app.LoginView)}</a>
                              : ""}
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="exhibitor-detail">
                            <div className="list-info">
                              <span>{translate(langConfig.app.Representative)}: {user ? exhibitor.representative : ""}</span>
                              <span>{translate(langConfig.app.Position)}: {user ? exhibitor.position : ""}</span>
                              <span>{translate(langConfig.app.Mobile)}: {user ? exhibitor.mobile : ""}</span>
                              <span>{translate(langConfig.app.Email)}: {user ? exhibitor.re_email : ""}</span>
                            </div>
                            {!user ?
                              <a href="#" className="login-view" onClick={this.openLoginVisitor}>{translate(langConfig.app.LoginView)}</a>
                              : ""}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row web-address">
                      <div className="col-md-2 col-sm-4">{translate(langConfig.app.Website)}:</div>
                      <div className="col-md-10 col-sm-8">
                        <ul>
                          {exhibitor.website?.split(",").map((web, index) => {
                            return (
                              <li key={index}>
                                <a href={web || "#"} target="_blank">{web || ""}</a>
                              </li>)
                          })}
                        </ul>
                      </div>
                    </div>
                    <div className="contact-method">
                      <ul className="ft-semibold">
                        <li><a href="#" onClick={e => this.handleChat(e, exhibitor)}><img src="/images/chat2.png" alt="" />{translate(langConfig.app.Chat)}</a></li>
                        <li><a href={!user ? "#" : "mailto:" + exhibitor.email} onClick={!user ? this.openLoginVisitor : undefined} target="_blank"><img src="/images/mail.png" alt="" />{translate(langConfig.app.Email)}</a>
                        </li>
                        <li><a href="#" onClick={e => this.handleConnect(e, exhibitor)}><img src="/images/connect2.png" alt="" />{translate(langConfig.app.Trade)}</a></li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4">
                  <div className="contact-form">
                    <div className="form">
                      <h3>{translate(langConfig.app.SendUs)}</h3>
                      <form onSubmit={this.handleSubmit}>
                        <div className="form-group">
                          <input
                            type="input"
                            name="name"
                            className="form-control"
                            placeholder={translate(langConfig.app.FullName)}
                            onClick={this.openLoginVisitor}
                          />
                        </div>
                        <div className="form-group">
                          <textarea
                            className="form-control"
                            rows={4}
                            placeholder={translate(langConfig.app.Max250Words)}
                            name="message"
                            value={message}
                            onChange={this.handleChange}
                            onClick={this.openLoginVisitor}
                          />
                        </div>
                        <input type="submit" value={translate(langConfig.app.SendNow)} />
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

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

export default connect(({ app: { user, categories, livestream } }) => ({ user, categories, livestream }))(Exhibitor)
