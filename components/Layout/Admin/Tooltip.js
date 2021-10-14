import React, { Component } from 'react'
import { connect } from 'react-redux';
import types from '../../../redux/types';

const colors = { success: 'green', failed: 'yellow', error: 'red' };
class Tootip extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    handleConfirm = () => {
        const { tooltip, dispatch } = this.props;
        if (typeof tooltip?.handleConfirm === 'function') tooltip.handleConfirm();
        dispatch({
            type: types.SET_TOOLTIP,
            payload: null
        });
    }
    handleCancel = () => {
        const { tooltip, dispatch } = this.props;
        if (typeof tooltip?.handleCancel === 'function') tooltip.handleCancel();
        dispatch({
            type: types.SET_TOOLTIP,
            payload: null
        });
    }
    render() {
        const { tooltip } = this.props;
        const { title, message, confirm, cancel, type } = tooltip || {};
        const color = colors[type || 'error'] || colors.error;
        return (
            <div className={"jconfirm jconfirm-light" + (tooltip ? " jconfirm-open" : " hidden")}>
                <div className="jconfirm-bg" style={{ transitionDuration: '0.4s', transitionTimingFunction: 'cubic-bezier(0.36, 0.55, 0.19, 1)' }} />
                <div className="jconfirm-scrollpane">
                    <div className="jconfirm-row">
                        <div className="jconfirm-cell">
                            <div className="jconfirm-holder" style={{ paddingTop: 40, paddingBottom: 40 }}>
                                <div className="jc-bs3-container container">
                                    <div className="jc-bs3-row row justify-content-md-center justify-content-sm-center justify-content-xs-center justify-content-lg-center">
                                        <div className="jconfirm-box-container jconfirm-animated col-md-4 col-md-offset-4 col-sm-6 col-sm-offset-3 col-xs-10 col-xs-offset-1 jconfirm-no-transition" style={{ transform: 'translate(0px, 0px)', transitionDuration: '0.4s', transitionTimingFunction: 'cubic-bezier(0.36, 0.55, 0.19, 1)' }}>
                                            <div className={`jconfirm-box jconfirm-hilight-shake jconfirm-type-${color} jconfirm-type-animated`} role="dialog" aria-labelledby="jconfirm-box20928" tabIndex={-1} style={{ transitionDuration: '0.4s', transitionTimingFunction: 'cubic-bezier(0.36, 0.55, 0.19, 1)', transitionProperty: 'all, margin' }}>
                                                <div className="jconfirm-closeIcon" style={{ display: 'none' }}>×</div>
                                                <div className="jconfirm-title-c">
                                                    <span className="jconfirm-icon-c" />
                                                    <span className="jconfirm-title">{title || "Vui lòng xác nhận"}</span>
                                                </div>
                                                <div className="jconfirm-content-pane no-scroll" style={{ transitionDuration: '0.4s', transitionTimingFunction: 'cubic-bezier(0.36, 0.55, 0.19, 1)', height: 20, maxHeight: '63.55px' }}>
                                                    <div className="jconfirm-content" id="jconfirm-box20928">
                                                        <div>{message || "Bạn có chắc chắn không?"}</div>
                                                    </div>
                                                </div>
                                                <div className="jconfirm-buttons">
                                                    <button type="button" onClick={this.handleConfirm} className={`btn btn-${color}`}>{confirm || "Chấp nhận"}</button>
                                                    <button type="button" onClick={this.handleCancel} className="btn btn-default">{cancel || "Hủy"}</button>
                                                </div>
                                                <div className="jconfirm-clear" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(({ admin: { tooltip } }) => ({ tooltip }))(Tootip)
