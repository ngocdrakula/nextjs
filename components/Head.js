
import React, { Component } from 'react';
import NextHead from 'next/head'
import { connect } from 'react-redux';

export class Head extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { setting } = this.props;
        const { faviconUpdated, favicon, title } = setting;
        const icon = `${faviconUpdated ? "/api" : ""}/images/${favicon}`;
        return (
            <NextHead>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>{title || process.env.TITLE}</title>
                <meta name="description" content={title || process.env.TITLE} />
                <meta name="robots" content="noodp,index,follow" />
                <link href={icon} rel="shortcut icon" type="image/x-icon" />
                <link rel="stylesheet" href="libs/bootstrap/dist/css/bootstrap.min.css" />
                <link rel="stylesheet" href="css/message.css" />
                <link rel="stylesheet" href="css/style.css" />
            </NextHead>
        )
    }
}


export default connect(({ app: { setting } }) => ({ setting }))(Head)
