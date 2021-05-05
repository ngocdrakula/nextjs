import React, { Component } from 'react'

export default class Logo extends Component {
    render() {
        return (
            <a href="#" className="logo" title={process.env.TITLE}>
                <img id="companyLogo" src="/icons/logo.png" alt={process.env.TITLE} />
            </a>
        )
    }
}
