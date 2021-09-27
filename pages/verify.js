import React, { Component } from 'react';
import dynamic from 'next/dynamic';
import { connect } from 'react-redux'
import { END } from 'redux-saga';
import Router from 'next/router';
import Link from 'next/link';
import { wrapper } from '../redux/store';
import types from '../redux/types'
import { getQuery } from '../utils/helper';
const Header = dynamic(() => import('../components/Header'));
const Footer = dynamic(() => import('../components/Footer'));

class Verify extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    const { dispatch } = this.props;
    const query = getQuery(Router?.router?.asPath);
    if (query.token) {
      dispatch({
        type: types.VERIFY_ACCOUNT,
        payload: { token: query.token },
        callback: res => {
          if (res?.success) this.setState({ verify: true, message: res.message })
          else this.setState({ message: res?.data?.message || 'Mã xác thực tài khoản không chính xác hoặc đã hết hạn' });
        }
      });
    }
    dispatch({
      type: types.OPEN_MESSAGE
    })
  }
  render() {
    const { message, verify } = this.state;
    return (
      <div id="app" className="verify-page">
        <Header />
        <div id="content" className="site-content">
          <div className="container verify-container">
            {message ?
              <div className="verify-result">
                <p className="verify-noti">
                  <span className={`verify-icon icon ${verify ? "verify" : "failed"}`} />
                  <span className="verify-message">{message}</span>
                </p>
                <p><Link href="/"><a className="verify-back">Quay lại trang chủ</a></Link></p>
              </div>
              :
              <div className="verify-loading">
                <span className="verify-icon icon loading" />
                <span className="verify-message">Loading...</span></div>
            }
          </div >
        </div >
        <Footer />
      </div>
    )
  }
}


export const getStaticProps = wrapper.getStaticProps(async ({ store }) => {
  store.dispatch({ type: types.GET_SETTING });
  store.dispatch(END)
  await store.sagaTask.toPromise()
});

export default connect(({ }) => ({}))(Verify)

