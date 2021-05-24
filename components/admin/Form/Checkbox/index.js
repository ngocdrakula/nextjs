import React, { Component } from 'react'

export default class Checkbox extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.id = "id-" + Date.now() + "-" + Math.floor(Math.random() * 10000);
    }
    render() {
        const { id, onChange, checked = false, defaultChecked } = this.props;
        return (
            <div className="custom-control custom-control-inline custom-checkbox custom-control-nameless align-top" style={{ margin: 0, marginLeft: '.5rem' }}   >
                <input
                    id={id || this.id}
                    type="checkbox"
                    className="custom-control-input"
                    onChange={onChange}
                    checked={checked}
                    defaultChecked={defaultChecked}
                />
                <label className="custom-control-label" htmlFor={id || this.id} />
            </div>
        )
    }
}
