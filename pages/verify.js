import React, { Component } from 'react';
import { connect } from 'react-redux'
import { END } from 'redux-saga';
import Router from 'next/router';
import Link from 'next/link';
import { wrapper } from '../redux/store';
import types from '../redux/types'
import { getQuery } from '../utils/helper';
import { translate } from '../utils/language';
import langConfig from '../lang.config';

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
          if (res?.success) this.setState({ verify: true, message: translate(res.messages) })
          else this.setState({ message: translate(res?.data?.messages || langConfig.message.error.code) });
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
      <div id="content" className="site-content">
        <div className="container verify-container">
          {message ?
            <div className="verify-result">
              <p className="verify-noti">
                <span className={`verify-icon icon ${verify ? "verify" : "failed"}`} />
                <span className="verify-message">{message}</span>
              </p>
              <p><Link href="/"><a className="verify-back">{translate(langConfig.app.BackHome)}</a></Link></p>
            </div>
            :
            <div className="verify-loading">
              <span className="verify-icon icon loading" />
              <span className="verify-message">{translate(langConfig.app.Loading)}...</span></div>
          }
        </div >
      </div >
    )
  }
}


export const getStaticProps = wrapper.getStaticProps(async ({ store }) => {
  store.dispatch({ type: types.GET_SETTING });
  store.dispatch(END)
  await store.sagaTask.toPromise()
});

export default connect(({ }) => ({}))(Verify)

