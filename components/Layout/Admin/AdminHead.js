import React, { Component } from 'react';
import NextHead from 'next/head'
import { connect } from 'react-redux'

export class AdminHead extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { setting } = this.props;
        const favicon = `${setting?.faviconUpdated ? "/api" : ""}/images/${setting?.favicon}`;
        return (
            <NextHead>
                <title>{setting.title || process.env.TITLE}</title>
                {setting?.favicon ? <link rel="icon" href={favicon} type="image/x-icon" /> : ""}
                <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />
                <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
                <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no, shrink-to-fit=no" />
                <meta name="author" content="Ngoc Drakula" />
                <link href="https://unpkg.com/ionicons@4.4.4/dist/css/ionicons.min.css" rel="stylesheet" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin={true} />
                <link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,600,300italic,400italic,600italic" rel="stylesheet" />
            </NextHead>
        )
    }
}




export default connect(({ admin: { setting } }) => ({ setting }))(AdminHead)
