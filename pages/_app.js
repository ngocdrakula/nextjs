import React, { Component } from 'react';
import { wrapper } from '../redux/store';
import '../styles/globals.css';
// import '../styles/abc.scss';
import { setLocale } from '../utils/language';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    if (props.lang) setLocale(props.lang)
  }
  render() {
    const { Component: Page, pageProps, lang } = this.props
    return (
      <Page {...pageProps} lang={lang} />
    )
  }
}


App.getInitialProps = async (props) => {
  return ({ lang: props?.ctx?.req?.cookies?.['NEXT_LOCALE'] || 'vn' })
};


export default wrapper.withRedux(App)