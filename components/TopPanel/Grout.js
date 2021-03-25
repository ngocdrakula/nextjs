import React, { Component } from 'react'
import { connect } from 'react-redux';
import types from '../../redux/types';

const colors = ["#ffe6a6", "#98745e", "#e5d9cd", "#bfbfbf"];


class Grout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentGrout: 2
        };
    }

    render() {
        const { currentGrout } = this.state;
        const { active, dispatch, grout, groutColor } = this.props;
        return (
            <div className="top-panel-option-box" style={!active ? { display: 'none' } : {}}>
                <div id="topPanelContentSurfaceTabGroutSizeBody" className="top-panel-box">
                    <span className="top-panel-label stiled-checkbox-text">Kích thuớc mạch</span>
                    <input
                        id="topPanelGroutSizeRange"
                        type="range"
                        min={0} max={24}
                        defaultValue={grout}
                        onChange={e => this.setState({ currentGrout: e.target.value })}
                        onMouseUp={e => dispatch({ type: types.CHANGE_GROUT, payload: e.target.value })}
                    />
                    <span id="topPanelGroutSizeText" className="top-panel-label stiled-checkbox-text">{currentGrout} mm</span>
                </div>
                <div className="top-panel-box">
                    <span className="top-panel-label stiled-checkbox-text">Màu mạch</span>
                    <div id="grout-color-picker" className="top-panel-select-color" title="Grout Color" style={{ backgroundColor: groutColor }}>
                    </div>
                    <div id="grout-predefined-color">
                        {colors.map((color, index) => {
                            return (
                                <button
                                    key={index}
                                    style={{ backgroundColor: color }}
                                    className="-btn"
                                    onClick={() => dispatch({ type: types.CHANGE_COLOR, payload: color })}
                                />
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(({ app: { grout = 2, groutColor = '#FFF' } }) => ({ grout, groutColor }))(Grout)
