
import React, { Component } from 'react';
import NextHead from 'next/head'
import { connect } from 'react-redux'

export class Head extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { setting } = this.props;
        let children = null;
        try { children = setting.footer && <head dangerouslySetInnerHTML={{ __html: setting.footer }} /> }
        catch { };

        return (
            <NextHead>
                <title>{setting.title || process.env.TITLE}</title>
                <link rel="icon" href="/api/images/favicon.ico" />
                <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />
                <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
                <meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0" />
                <link rel="stylesheet" href="/css/app.css" />
                <link rel="stylesheet" href="/css/color-picker.min.css" />
                <script src="/js/three.js"></script>
                <script src="/js/color-picker.min.js"></script>
                {children}
            </NextHead>
        )
    }
}




export default connect(({ admin: { setting } }) => ({ setting }))(Head)
