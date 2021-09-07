import React, { Component } from 'react';
import dynamic from 'next/dynamic';
import { connect } from 'react-redux'
import { END } from 'redux-saga';
import ErrorPage from 'next/error'
import { wrapper } from '../redux/store';
import types from '../redux/types'
import { MODE } from '../utils/helper';
import ProfileInfo from '../components/profile/ProfileInfo';
import ProfileTrade from '../components/profile/ProfileTrade';

const Header = dynamic(() => import('../components/Header'));
const Footer = dynamic(() => import('../components/Footer'));

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: 0
    }
  }
  componentDidUpdate(prevProps) {
    const { dispatch, user } = this.props;
    if (user?._id && prevProps.user?._id !== user._id) {
      if (user?.mode === MODE.visitor) {
        dispatch({
          type: types.GET_USER,
          payload: user._id,
          callback: res => {
            if (res?.success) this.setState({ loaded: true })
          }
        })
      }
      else {
        this.setState({ loaded: true, error: true })
      }
    }
  }
  render() {
    const { user, logErr } = this.props;
    if (logErr || user?.mode === MODE.admin || user?.mode === MODE.exhibitor) {
      return (<ErrorPage statusCode={404} />);
    }
    const { active } = this.state;
    return (
      <div id="app" className="user-page">
        <Header />
        <div className="profile-page" style={{ backgroundColor: '#ededed' }}>
          <div className="container">
            {!user ?
              "Ban chua dang nhap"
              :
              <div className="row">
                <div className="col-sm-3">
                  <div className="profile-info-container">
                    <div className="profile-avatar">
                      {user.avatar ?
                        <img className="user-avatar" src={"/api/images/" + user.avatar} />
                        :
                        <img className="user-no-avatar" src={"/images/no-avatar.png"} />
                      }
                    </div>
                    <div className="profile-name">
                      {user.name}
                    </div>
                  </div>
                  <div className="profile-list-select">
                    <div className={"profile-select-item" + (active === 0 ? " active" : "")} onClick={e => this.setState({ active: 0 })}>
                      <span>Thông tin tài khoản</span>
                    </div>
                    <div className={"profile-select-item" + (active === 1 ? " active" : "")} onClick={e => this.setState({ active: 1 })}>
                      <span>Lịch giao thương</span>
                    </div>
                  </div>
                </div>
                <div className="col-sm-9">
                  <ProfileInfo active={active === 0} />
                  <ProfileTrade active={active === 1} />
                </div>
              </div>
            }
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
  store.dispatch({ type: types.GET_SETTING });

  store.dispatch(END)
  await store.sagaTask.toPromise()
});

export default connect(({ app: { user, logErr } }) => ({ user, logErr }))(Profile)

