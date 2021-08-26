import React, { Component } from 'react';
import dynamic from 'next/dynamic';
import { connect } from 'react-redux'
import { END } from 'redux-saga';
import Router from 'next/router';
import Link from 'next/link';
import { wrapper } from '../redux/store';
import types from '../redux/types'
import { getQuery, MODE } from '../utils/helper';
import Pagination from '../components/Pagination';

const pageSize = 12;
const sorts = [{ label: 'Nổi bật', value: 'feature' }, { label: 'Tên: A-Z', value: 'name' }, { label: 'Tên: Z-A', value: 'namereverse' }]

const Header = dynamic(() => import('../components/Header'));
const Footer = dynamic(() => import('../components/Footer'));

let count = 10;
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
    const query = getQuery(Router?.router?.asPath);
    this.gotoPage(query);
  }
  componentDidUpdate() {
    const { currentPage, sortSelected, industrySelected, filter, name } = this.state;
    const query = getQuery(Router?.router?.asPath);
    query.page = Number(query.page) - 1;
    if ((query.page >= 0 && currentPage !== query.page) ||
      (query.sort && sortSelected !== query.sort) ||
      (query.industry && industrySelected !== query.industry) ||
      (Number(query.filter) >= 0 && filter !== Number(query.filter)) ||
      (query.name !== name)) {
      console.log(query, this.state)

      count--;
      if (count > 0)
        this.gotoPage(query);
    }
  }
  componentWillUnmount() {
    clearTimeout(this.timeout);
  }
  handleSort = (e) => {
    e.preventDefault();
    const { filter, industrySelected, name } = this.state;
    let url = "/user?filter=" + filter + "&page=1&industry=" + industrySelected;
    if (e.target.id) url += "&sort=" + e.target.id
    if (name) url += "&name=" + name
    Router.push(url, undefined, { scroll: false })
  }
  handleSelect = e => {
    e.preventDefault();
    const { filter, sortSelected, name } = this.state;
    let url = "/user?filter=" + filter + "&page=1&industry=" + e.target.id;
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
      industry: params.industry || industries[0]?._id,
    }
    if (params.name) query.name = params.name;
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
            industrySelected: query.industry,
            total,
            filter: Number(params.filter) === MODE.visitor ? MODE.visitor : MODE.exhibitor,
            sortSelected: query.sort,
            name: query.name,
            loaded: true
          }, () => {
            this.timeout = setTimeout(() => {
              const list = document.getElementById('menu-list');
              if (list) list.scrollIntoView();
            }, 1000);
          })
        }
      }
    });
  }
  handleChat = (e, id) => {
    e.preventDefault();
    dispatch({
      type: types.GET_EXHIBITORS,
      payload: {
        page: 0,
        pageSize,
        industry: e.target.id
      }
    })
  }
  handleConnect = (e, id) => {
    e.preventDefault();
    dispatch({
      type: types.GET_EXHIBITORS,
      payload: {
        page: 0,
        pageSize,
        industry: e.target.id
      }
    })
  }
  render() {
    const { industries } = this.props
    const { industrySelected, sortSelected, users, filter, total, currentPage, loaded } = this.state;
    const currentSort = sorts.find(s => s.value === sortSelected);
    const currentIndustry = industries.find(i => i._id === industrySelected);
    return (
      <div id="app" className="user-page">
        <Header />
        <div id="content" className="site-content">
          <div id="list">
            <div className="main-title hd-bg-orange">
              <h2 className="heading">Danh sách</h2>
              <ul className="breadcrumb">
                <li><a href="/">Trang chủ »</a></li>
                <li><a href="#">Triển lãm trực tuyến »</a></li>
                <li><a href="#">Danh sách</a></li>
              </ul>
            </div>
            <div className="list-menu" id="menu-list" name="menu-list">
              <ul className="menu">
                {industries.map((industry, index) => {
                  const active = ((!industrySelected && !index) || (industry._id === industrySelected)) ? " active" : "";
                  return (
                    <li key={industry._id} className={"menu-item" + active}><a href="#" id={industry._id} onClick={this.handleSelect}>{industry.name}</a></li>
                  )
                })}
              </ul>
            </div>
            <div className="lists-list stores-list">
              <div className="container">
                <h3>{currentIndustry?.name || industries[0]?.name}</h3>
                <div className="right">
                  <div className="sort">
                    <p>Thứ tự {currentSort?.label} <img src="/images/icon-down2.png" alt="" style={{ marginLeft: 10 }} /></p>
                    <p>
                      {sorts.map(sort => {
                        return (
                          <span
                            key={sort.value || 0}
                            id={sort.value}
                            onClick={this.handleSort}
                            style={currentSort?.value === sort.value ? { color: '#F48120' } : {}}
                          >
                            {sort.label}
                          </span>
                        );
                      })}
                    </p>
                  </div>
                  <div className="tab">
                    <ul>
                      <li>
                        <Link href={`/user?filter=${MODE.exhibitor}&page=1&industry=${industrySelected}#menu-list`}><a className={filter !== MODE.visitor ? "active" : ""}>Nhà trưng bày</a></Link>
                      </li>
                      <li>
                        <Link href={`/user?filter=${MODE.visitor}&page=1&industry=${industrySelected}#menu-list`} ><a className={filter === MODE.visitor ? "active" : ""}>Người mua</a></Link>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="row tab-content">
                  {loaded && !users[0] ?
                    <div style={{ padding: '10px 50px 20px' }}>
                      <h5>Danh sách trống</h5>
                    </div>
                    : ""}
                  {users.map(user => {
                    return (
                      <div key={user._id} className="col-sm-6">
                        <div className="customer-item store-item">
                          <div className="store-top">
                            <div className="row">
                              <div className="col-lg-4">
                                <a href={`/${filter === MODE.exhibitor ? "exhibitor" : "visitor"}?id=${user._id}`}>
                                  {user.avatar ?
                                    <img src={"/images" + user.avatar} alt="" />
                                    :
                                    <img src="/images/logo-showroom.png" alt="" />
                                  }
                                </a>
                              </div>
                              <div className="col-lg-8">
                                <div className="entry-title">
                                  <h3><a href={`/${filter === MODE.exhibitor ? "exhibitor" : "visitor"}?id=${user._id}`}>{user.name}</a></h3>
                                  <p>{user.introduce}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="store-body">
                            {user.image ?
                              <img src={"/images" + user.image} alt="" />
                              :
                              <img src="/images/showroom1.png" alt="" />
                            }
                          </div>
                          <div className="store-bottom">
                            <a href="#"><img src="/images/talk.png" alt="" />Trò chuyện</a>
                            <a href="#"><img src="/images/connect.png" alt="" />Kết nối giao thương</a>
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

export default connect(({ app: { industries } }) => ({ industries }))(User)
