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
    componentDidMount() {
        const { dispatch } = this.props;
        const picker = new CP(document.getElementById('grout-color-picker'));
        picker.set('#FFFFFF')
        picker.on('change', function (color) {
            dispatch({
                type: types.CHANGE_COLOR,
                payload: `#${color}`
            })
        });
    }

    componentDidUpdate(prevProps) {
        if (this.props.areaIndex !== prevProps.areaIndex) {
            const { layout, areaIndex } = this.props;
            const area = layout?.areas?.[areaIndex] || {};
            const { grout } = area;
            this.setState({ currentGrout: grout || 2 })
        }
    }

    render() {
        const { currentGrout } = this.state;
        const { active, dispatch, layout, areaIndex } = this.props;
        const area = layout?.areas?.[areaIndex] || {};
        const { color = '#ffffff' } = area;
        return (
            <div className="top-panel-option-box" style={!active ? { display: 'none' } : {}}>
                <div id="topPanelContentSurfaceTabGroutSizeBody" className="top-panel-box">
                    <span className="top-panel-label stiled-checkbox-text">Kích thước mạch</span>
                    <input
                        id="topPanelGroutSizeRange"
                        type="range"
                        min={0} max={24}
                        value={currentGrout}
                        onChange={e => this.setState({ currentGrout: e.target.value })}
                        onMouseUp={e => dispatch({ type: types.CHANGE_GROUT, payload: Number(e.target.value) })}
                    />
                    <span id="topPanelGroutSizeText" className="top-panel-label stiled-checkbox-text">{currentGrout} mm</span>
                </div>
                <div className="top-panel-box">
                    <span className="top-panel-label stiled-checkbox-text">Màu mạch</span>
                    <div id="grout-color-picker" className="top-panel-select-color" title="Grout Color" style={{ backgroundColor: color }}>
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

export default connect(({ app: { layout, areaIndex } }) => ({ layout, areaIndex }))(Grout)
