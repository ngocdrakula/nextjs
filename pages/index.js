import React, { Component } from 'react';
import dynamic from 'next/dynamic';
import { connect } from 'react-redux'
import { END } from 'redux-saga';
import { wrapper } from '../redux/store';
import types from '../redux/types'



const Countdown = dynamic(() => import('../components/Home/Countdown'));
const Exhibitor = dynamic(() => import('../components/Home/Exhibitor'));
const Buyer = dynamic(() => import('../components/Home/Buyer'));
const Guide = dynamic(() => import('../components/Home/Guide'));
const Partner = dynamic(() => import('../components/Home/Partner'));
const Feature = dynamic(() => import('../components/Home/Feature'));
const Slider = dynamic(() => import('../components/Home/Slider'));
const Popup = dynamic(() => import('../components/Home/Popup'));

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div id="content" className="site-content">
        <Popup />
        <Slider />
        <Countdown />
        <Feature />
        <Exhibitor />
        <Buyer />
        <Guide />
        <Partner />
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

export default connect(({ app: { user } }) => ({ user }))(Home)
