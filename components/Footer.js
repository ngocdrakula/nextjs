import React, { Component } from 'react';
import { connect } from 'react-redux'

export class Footer extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { setting } = this.props;
        if (!setting.footer) return null;
        let children = null;
        try { children = <footer dangerouslySetInnerHTML={{ __html: setting.footer }} /> }
        catch { };

        return (
            children
        )
    }
}




export default connect(({ admin: { setting } }) => ({ setting }))(Footer)
