import React, { Component } from 'react';
import { wrapper } from '../redux/store';
import '../styles/bootstrap.scss';
import '../styles/app.scss';
import '../styles/admin.scss';
import '../styles/globals.css';
import { setLocale } from '../utils/language';
import dynamic from 'next/dynamic';

const Header = dynamic(() => import('../components/Layout/App/Header'));
const Footer = dynamic(() => import('../components/Layout/App/Footer'));

const AdminHead = dynamic(() => import('../components/Layout/Admin/AdminHead'));
import Tooltip from '../components/Layout/Admin/Tooltip';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    if (props.lang) setLocale(props.lang)
  }
  render() {
    const { Component: Page, pageProps, router, lang } = this.props;
    if (router.route === "/admin" || router.route === "/dashboard") {
      return (
        <div className="admin-page">
          <AdminHead />
          <Page {...pageProps} lang={lang} path={router.route} />
          <Tooltip />
        </div>
      )
    }
    return (
      <div id="app" className="user-page">
        <Header />
        <Page {...pageProps} lang={lang} path={router.route} />
        <Footer />
      </div >
    )
  }
}


App.getInitialProps = async (props) => {
  return ({ lang: props?.ctx?.req?.cookies?.['NEXT_LOCALE'] || 'vn' })
};


export default wrapper.withRedux(App)