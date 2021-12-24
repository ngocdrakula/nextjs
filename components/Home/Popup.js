import React, { Component } from 'react'
import { connect } from 'react-redux';
import { getLocale } from '../../utils/language';

class Popup extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
        this.timeout = null;
    }
    componentDidMount() {
        this.timeout = setTimeout(() => {
            this.setState({ className: "active" });
        }, 1000);
    }
    componentWillUnmount() {
        clearTimeout(this.timeout);
    }
    handleClose = e => {
        this.setState({ className: "active-hide" });
        this.timeout2 = setTimeout(() => {
            this.setState({ className: 'hide' })
        }, 1000);
    }

    render() {
        const setting = this.props.setting[getLocale()] || {};
        const { popupStatus, popupImage, popupLink, popupTitle } = setting;
        if (!popupStatus) return null;
        const { className } = this.state;
        return (
            <div id="popup" className={className} onClick={e => e.target.id === "popup" ? this.handleClose : undefined}>
                <div className="popup-container">
                    <a className="popup-link" href={popupLink} target="_blank" title={popupTitle}>
                        <img className="popup-img" src={`/api/images/${popupImage}`} alt={popupTitle} />
                    </a>
                    <div className="popup-close" onClick={this.handleClose} />
                </div>
            </div >
        );
    }
}

export default connect(({ app: { setting } }) => ({ setting }))(Popup)
