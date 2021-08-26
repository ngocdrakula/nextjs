import React, { Component } from 'react';
import { getTime } from '../../utils/helper';


export default class Time extends Component {
    state = {
        reset: true
    }
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        if (this.props.value === 3) {
            setInterval(() => {
                this.setState({
                    reset: !this.state.reset
                })
            }, 60000)
        }
    }

    render() {
        const { createdAt, className, title, value } = this.props
        var time = getTime(createdAt);
        return (
            this.state.reset ?
                <span className={className} title={time[title || 0]}>
                    {time[value || 0]}
                </span>
                :
                <span className={className} title={time[title || 0]}>
                    {time[value || 0]}
                </span>
        );
    }
}