import React, { Component } from 'react';

export default class Process extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: 100
        }
        this.interval = null;
    }
    componentDidMount() {
        this.interval = setInterval(() => {
            const { loaded } = this.state;
            if (loaded >= 100) clearInterval(this.interval);
            else {
                const radom = Math.floor(Math.random() * 5) + 15;
                this.setState({ loaded: Math.min(loaded + radom, 100) });
            }
        }, 100);
    }
    componentWillUnmount() {
        clearInterval(this.interval);
    }

    render() {
        const { loaded } = this.state;
        return (
            <div id="sourceLoadProgressBarContainer" style={loaded === 100 ? { display: 'none' } : {}}>
                <div className="progress">
                    <div className="progress-bar progress-bar-striped active" style={{ width: loaded + "%" }}>
                        {loaded + "%"}
                    </div>
                </div>
            </div>
        );
    }
}
