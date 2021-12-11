import React, { Component } from 'react';
import { connect } from 'react-redux'
import { END } from 'redux-saga';
import Router from 'next/router';
import Link from 'next/link';
import { wrapper } from '../redux/store';
import types from '../redux/types'
import { getQuery, MODE } from '../utils/helper';
import Pagination from '../components/pagination/Pagination';
import { translate } from '../utils/language';
import langConfig from '../lang.config';

const pageSize = 12;
const sorts = [
  { label: langConfig.app.Highlights, value: 'feature' },
  { label: langConfig.app.NameAZ, value: 'name' },
  { label: langConfig.app.NameZA, value: 'namereverse' }
]


class User extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      currentPage: 0,
      total: 0,
      sortSelected: sorts[0].value,
      filter: MODE.exhibitor,
      loaded: false
    };
  }
  componentDidMount() {
    const query = getQuery(decodeURI(Router?.router?.asPath));
    this.gotoPage(query);
  }
  componentDidUpdate() {
    const { currentPage, sortSelected, industrySelected, filter, name } = this.state;
    const query = getQuery(decodeURI(Router?.router?.asPath));
    query.page = Number(query.page) - 1;
    if ((query.page >= 0 && currentPage !== query.page) ||
      (query.sort && sortSelected !== query.sort) ||
      (query.industry && industrySelected !== query.industry) ||
      (Number(query.filter) >= 0 && filter !== Number(query.filter)) ||
      (query.name !== name)
    ) {
      this.gotoPage(query);
    }
  }
  componentWillUnmount() {
    clearTimeout(this.timeout);
  }
  handleSort = (e) => {
    const id = e.target.id
    e.preventDefault();
    const { filter, industrySelected, name } = this.state;
    let url = "/user?filter=" + filter;
    if (industrySelected) url += "&page=1&industry=" + industrySelected;
    if (id) url += "&sort=" + id
    if (name) url += "&name=" + name
    Router.push(url, undefined, { scroll: false })
  }
  handleSelect = (e) => {
    e.preventDefault();
    const id = e.target.id;
    const { filter, sortSelected, name } = this.state;
    let url = "/user?filter=" + filter + "&page=1"
    if (id) url += "&industry=" + id;
    if (sortSelected) url += "&sort=" + sortSelected;
    if (name) url += "&name=" + name
    Router.push(url, undefined, { scroll: false })
  }
  changeURL = (page) => {
    const { filter, sortSelected, industrySelected, name } = this.state;
    let url = "/user?filter=" + filter + "&page=" + (page + 1) + "&industry=" + industrySelected;
    if (sortSelected) url += "&sort=" + sortSelected;
    if (name) url += "&name=" + name
    Router.push(url, undefined, { scroll: false })
  }

  gotoPage = (params) => {
    const { dispatch, industries } = this.props;
    const query = {
      page: params.page || 0,
      pageSize,
    }
    if (params.name) query.name = params.name;
    if (params.industry) query.industry = params.industry;
    const currentSort = sorts.find(s => s.value === params.sort);
    query.sort = currentSort?.value || sorts[0].value;
    dispatch({
      type: Number(params.filter) === MODE.visitor ? types.GET_VISITORS : types.GET_EXHIBITORS,
      payload: query,
      callback: res => {
        if (res?.success) {
          const { data, page, total } = res;
          this.setState({
            users: data,
            currentPage: page,
            industrySelected: query.industry || this.state.industrySelected,
            total,
            filter: Number(params.filter) === MODE.visitor ? MODE.visitor : MODE.exhibitor,
            sortSelected: query.sort,
            name: query.name,
            loaded: true
          }, () => {
            this.timeout = setTimeout(() => {
              const list = document.getElementById('menu-list');
              if (list) list.scrollIntoView();
            }, 500);
          })
        }
      }
    });
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
  handleFilterUser = (e, filter) => {
    e.preventDefault();
    const { sortSelected, name, industrySelected } = this.state;
    let url = "/user?filter=" + filter + "&page=1'"
    if (industrySelected) url += "&industry=" + industrySelected;
    if (sortSelected) url += "&sort=" + sortSelected;
    if (name) url += "&name=" + name
    Router.push(url, undefined, { scroll: false })
  }
  render() {
    const { industries } = this.props
    const { industrySelected, sortSelected, users, filter, total, currentPage, loaded } = this.state;
    const currentSort = sorts.find(s => s.value === sortSelected);
    const currentIndustry = industries.find(i => i._id === industrySelected);
    return (
      <div id="content" className="site-content">
        <div id="list">
          <div className="main-title hd-bg-orange">
            <h2 className="heading">{translate(langConfig.app.List)}</h2>
            <ul className="breadcrumb">
              <li><a href="/">{translate(langConfig.app.Home)} »</a></li>
              <li><a href="#">{translate(langConfig.app.OnlineExhibition)} »</a></li>
              <li><a href="#">{translate(langConfig.app.List)}</a></li>
            </ul>
          </div>
          <div className="list-menu" id="menu-list" name="menu-list">
            <ul className="menu">
              {industries.map((industry, index) => {
                const active = ((industry._id === industrySelected)) ? " active" : "";
                return (
                  <li key={industry._id} className={"menu-item" + active}><a href="#" id={industry._id} onClick={this.handleSelect}>{industry.name}</a></li>
                )
              })}
            </ul>
          </div>
          <div className="lists-list stores-list">
            <div className="container">
              <h3>{currentIndustry?.name || translate(langConfig.app.Exhibitor)}</h3>
              <div className="right">
                <div className="sort">
                  <p>{translate(langConfig.app.Sort)} {translate(currentSort?.label)} <img src="/images/icon-down2.png" alt="" style={{ marginLeft: 10 }} /></p>
                  <p>
                    {sorts.map(sort => {
                      return (
                        <span
                          key={sort.value || 0}
                          id={sort.value}
                          onClick={this.handleSort}
                          style={currentSort?.value === sort.value ? { color: '#F48120' } : {}}
                        >
                          {translate(sort.label)}
                        </span>
                      );
                    })}
                  </p>
                </div>
                <div className="tab">
                  <ul>
                    <li>
                      <a href="#menu-list" className={filter !== MODE.visitor ? "active" : ""} onClick={e => this.handleFilterUser(e, MODE.exhibitor)}>
                        {translate(langConfig.app.Exhibitor)}
                      </a>
                    </li>
                    <li>
                      <a href="#menu-list" className={filter === MODE.visitor ? "active" : ""} onClick={e => this.handleFilterUser(e, MODE.visitor)}>
                        {translate(langConfig.app.Buyer)}
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="row tab-content">
                {loaded && !users[0] ?
                  <div style={{ padding: '10px 50px 20px' }}>
                    <h5>{translate(langConfig.app.ListEmpty)}</h5>
                  </div>
                  : ""}
                {users.map(user => {
                  return (
                    <div key={user._id} className="col-sm-6">
                      <div className="customer-item store-item">
                        <div className="store-top">
                          <div className="row">
                            <div className="col-lg-4">
                              <Link href={`/${filter === MODE.exhibitor ? "exhibitor" : "visitor"}?id=${user._id}`}>
                                <a>
                                  {user.avatar ?
                                    <img src={"/api/images/" + user.avatar} alt="" />
                                    :
                                    <img src="/images/no-logo.png" alt="" />
                                  }
                                </a>
                              </Link>
                            </div>
                            <div className="col-lg-8">
                              <div className="entry-title">
                                <h3>
                                  <Link href={`/${filter === MODE.exhibitor ? "exhibitor" : "visitor"}?id=${user._id}`}>
                                    <a>{user.name}</a>
                                  </Link>
                                </h3>
                                <p>{user.introduce}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="store-body">
                          {user.image ?
                            <img src={"/api/images/" + user.image} alt="" />
                            :
                            <img src="/images/no-banner-thumb.png" alt="" />
                          }
                        </div>
                        <div className="store-bottom">
                          <a href="#" onClick={e => this.handleChat(e, user)}><img src="/images/talk.png" alt="" />{translate(langConfig.app.Chat)} </a>
                          <a href="#" onClick={e => this.handleConnect(e, user)}><img src="/images/connect.png" alt="" />{translate(langConfig.app.Trade)}</a>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
              <Pagination gotoPage={this.changeURL} {...{ currentPage, pageSize, total }} />
            </div>
          </div>
        </div >
      </div >
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

export default connect(({ app: { industries, user } }) => ({ industries, user }))(User)

