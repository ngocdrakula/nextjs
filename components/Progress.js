import React, { Component } from 'react';
import { connect } from 'react-redux';

class Process extends Component {
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
            if (loaded >= 90) clearInterval(this.interval);
            else {
                const radom = Math.floor(Math.random() * 5) + 5;
                this.setState({ loaded: Math.min(loaded + radom, 90) });
            }
        }, 100);
    }
    componentWillUnmount() {
        clearInterval(this.interval);
    }
    componentDidUpdate(prevProps) {
        if (!prevProps.progress && this.props.progress) {
            clearInterval(this.interval);
            this.setState({ loaded: 100 });
        }
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

export default connect(({ app: { progress } }) => ({ progress }))(Process)