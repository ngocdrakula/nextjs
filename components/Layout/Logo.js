import React, { Component } from 'react'
import { connect } from 'react-redux';
class Logo extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    render() {
        const { setting, className } = this.props;
        const { logo, logoUpdated, title, logoStatus } = setting;
        const image = `${logoUpdated ? "/api" : ""}/images/${logo}`;
        return (
            logoStatus ?
                <img className={className} src={image} alt={title} />
                : ""
        )
    }
}

export default connect(({ app: { setting } }) => ({ setting }))(Logo)
