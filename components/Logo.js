import React, { Component } from 'react'
import defaultAxios from '../utils/axios';

export default class Logo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            uploaded: true
        };
    }
    componentDidMount() {
        this.handleCheckLogo();
    }
    handleCheckLogo = () => {
        defaultAxios.get("/images/logo.png").then(data => this.setState({ uploaded: true })).catch(e => this.setState({ uploaded: false }))
    }
    render() {
        if (!this.state.uploaded) return null
        return (
            <a href="#" className="logo" title={process.env.TITLE}>
                <img id="companyLogo" src="/api/images/logo.png" alt={process.env.TITLE} />
            </a>
        )
    }
}
