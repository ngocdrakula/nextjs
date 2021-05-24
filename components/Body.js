import React, { Component } from 'react';
import { connect } from 'react-redux'

export class Body extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { setting } = this.props;
        if (!setting.body) return null;
        let children = null;
        try { children = <div dangerouslySetInnerHTML={{ __html: setting.body }} /> }
        catch (e) { };

        return (
            children
        )
    }
}




export default connect(({ admin: { setting } }) => ({ setting }))(Body)
