import React, { Component } from 'react';
import { connect } from 'react-redux'
import { END } from 'redux-saga';
import ErrorPage from 'next/error'
import { wrapper } from '../redux/store';
import types from '../redux/types'
import { MODE } from '../utils/helper';
import ProfileInfo from '../components/profile/ProfileInfo';
import ProfileTrade from '../components/profile/ProfileTrade';
import { translate } from '../utils/language';
import langConfig from '../lang.config';
import ChangePassword from '../components/profile/ChangePassword';

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
      <div className="profile-page" style={{ backgroundColor: '#ededed' }}>
        <div className="container">
          {!user ?
            translate(langConfig.app.LoginContinue)
            :
            <div className="row">
              <div className="col-sm-3">
                <div className="profile-info-container">
                  <div className="profile-avatar">
                    {user.avatar ?
                      <img className="user-avatar" src={"/api/images/" + user.avatar} />
                      :
                      <img className="user-no-avatar" src="/images/no-avatar.png" />
                    }
                  </div>
                  <div className="profile-name">
                    {translate(user.names) || user.name}
                  </div>
                </div>
                <div className="profile-list-select">
                  <div className={"profile-select-item" + (active === 0 ? " active" : "")} onClick={e => this.setState({ active: 0 })}>
                    <span>{translate(langConfig.app.AccountInformation)}</span>
                  </div>
                  <div className={"profile-select-item" + (active === 1 ? " active" : "")} onClick={e => this.setState({ active: 1 })}>
                    <span>{translate(langConfig.app.TradeCalendar)}</span>
                  </div>
                  <div className={"profile-select-item" + (active === 2 ? " active" : "")} onClick={e => this.setState({ active: 2 })}>
                    <span>{translate(langConfig.app.ChangePassword)}</span>
                  </div>
                </div>
              </div>
              <div className="col-sm-9">
                <ProfileInfo active={active === 0} />
                <ProfileTrade active={active === 1} />
                <ChangePassword active={active === 2} />
              </div>
            </div>
          }
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

export default connect(({ app: { user, logErr } }) => ({ user, logErr }))(Profile)

