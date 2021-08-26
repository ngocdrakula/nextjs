
import React, { Component } from 'react';
import NextHead from 'next/head'
import { connect } from 'react-redux';

export class Head extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { setting } = this.props;
        return (
            <NextHead>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>{setting.title || process.env.TITLE}</title>
                <meta name="description" content={setting.title || process.env.TITLE} />
                <meta name="robots" content="noodp,index,follow" />
                <link href="images/favicon.png" rel="shortcut icon" type="image/x-icon" />
                <link rel="stylesheet" href="libs/bootstrap/dist/css/bootstrap.min.css" />
                <link rel="stylesheet" href="css/message.css" />
                <link rel="stylesheet" href="css/style.css" />
            </NextHead>
        )
    }
}


export default connect(({ admin: { setting } }) => ({ setting }))(Head)
