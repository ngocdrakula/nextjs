import React, { Component } from 'react';
import NextHead from 'next/head'
import { connect } from 'react-redux'

export class AdminHead extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { setting } = this.props;
        return (
            <NextHead>
                <title>{setting.title || process.env.TITLE}</title>
                <link rel="icon" href="/api/images/favicon.ico" />
                <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />
                <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
                <meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0" />
                <link href="https://fonts.googleapis.com/css?family=Montserrat:400,700,200" rel="stylesheet" />
                <link rel="stylesheet" href="/css/animate.min.css" />
                <link rel="stylesheet" href="/css/template.min.css" />
                <link rel="stylesheet" href="/css/admin.css" />
                <link rel="stylesheet" href="/css/login.css" />
            </NextHead>
        )
    }
}




export default connect(({ admin: { setting } }) => ({ setting }))(AdminHead)
