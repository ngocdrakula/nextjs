import React, { Component } from 'react';
import Router from 'next/router';

class Home extends Component {
  render() {
    return null
  }
}

Home.getInitialProps = async ({ res }) => {
  if (res) {
    res.writeHead(307, { Location: '/room2d' });
    res.end()
  } else {
    Router.replace('/room2d')
  }
  return {}
};


export default Home