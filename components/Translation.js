import React, { Component } from 'react'
import { connect } from 'react-redux';


class Translation extends Component {
    render() {
        const { locale, } = this.props;
        console.log('y', this.props.locale)
        return (
            <></>
        );
    }
}

export default connect(({ locale: { locale, lang } }) => ({ locale, lang }))(Translation)
