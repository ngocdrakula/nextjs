import React, { Component } from 'react'
import { connect } from 'react-redux';
import { getLocale } from '../../utils/language';
class Logo extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    render() {
        const setting = this.props.setting[getLocale()] || {};
        const { className } = this.props;
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
