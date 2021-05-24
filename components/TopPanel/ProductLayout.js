import React, { Component } from 'react'
import { connect } from 'react-redux';
import types from '../../redux/types';

const surfaces = [
    { _id: 0, label: 'Tiêu chuẩn', icon: "/icons/square.png" },
    { _id: 1, label: 'Bàn cờ', icon: "/icons/chess.png" },
    { _id: 2, label: 'So le ngang', icon: "/icons/skew.png" },
    { _id: 3, label: 'So le dọc', icon: "/icons/skewVert.png" },
];
const skews = [
    { label: '3/4', value: 3 / 4 },
    { label: '1/2', value: 1 / 2 },
    { label: '1/4', value: 1 / 4 },
];
const colors = ["#ffe6a6", "#98745e", "#e5d9cd", "#bfbfbf"];

class ProductLayout extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    componentDidMount() {
        const { dispatch } = this.props;
        const paint = new CP(document.getElementById('paint-color-picker'));
        paint.on('change', function (color) {
            console.log('color', color)
            dispatch({
                type: types.CHANGE_PAINT,
                payload: `#${color}`
            })
        });
    }

    handleCustom = (e) => this.setState({ [e.target.name]: !!e.target.checked });

    render() {
        const { active, dispatch, layout, areaIndex } = this.props;
        const area = layout?.areas?.[areaIndex] || {};
        const { skewType, skewValue, custom, customRotate, paint } = area;
        return (
            <div className="top-panel-option-box top-panel-box-overflow-y" style={!active ? { display: 'none' } : {}}>
                <div id="topPanelContentFreeDesign" className="top-panel-box">
                    <div style={{ marginBottom: 3 }}>
                        <label htmlFor="paintCheck" className="top-panel-label stiled-checkbox-text">Chỉ sơn</label>
                        <div className="stiled-checkbox">
                            <input
                                type="checkbox"
                                id="paintCheck"
                                name="custom"
                                checked={paint ? 'checked' : ''}
                                onChange={e => dispatch({ type: types.CHANGE_PAINT, payload: e.target.checked ? '#FFFFFF' : null })}
                            />
                            <label htmlFor="paintCheck" />
                        </div>
                    </div>
                    {!paint ?
                        <>
                            <div>
                                <label htmlFor="customCheck" className="top-panel-label stiled-checkbox-text">Tùy chỉnh</label>
                                <div className="stiled-checkbox">
                                    <input
                                        type="checkbox"
                                        id="customCheck"
                                        name="custom"
                                        checked={custom ? 'checked' : ''}
                                        onChange={e => dispatch({ type: types.CHANGE_CUSTOM, payload: e.target.checked })}
                                    />
                                    <label htmlFor="customCheck" />
                                </div>
                            </div>
                            <div >
                                <label htmlFor="rotateCheck" className="top-panel-label stiled-checkbox-text">Bấm để xoay</label>
                                <div className="stiled-checkbox">
                                    <input
                                        type="checkbox"
                                        id="rotateCheck"
                                        name="rotate"
                                        checked={customRotate ? 'checked' : ''}
                                        onChange={e => dispatch({ type: types.CHANGE_CUSTOM_ROTATE, payload: e.target.checked })}
                                    />
                                    <label htmlFor="rotateCheck" />
                                </div>
                            </div>

                        </>
                        : ''}
                </div>
                <div className="top-panel-box radio-surface-pattern" style={{ display: paint ? 'none' : 'block' }}>
                    {surfaces.map((surface, index) => {
                        return (
                            <React.Fragment key={index}>
                                <input
                                    id={"surface_" + index}
                                    type="radio"
                                    name="surface"
                                    checked={skewType === index ? "checked" : ""}
                                    onChange={() => dispatch({ type: types.CHANGE_SKEW_TYPE, payload: index })}
                                />
                                <label htmlFor={"surface_" + index}>
                                    <img src={surface.icon} alt="" className="pattern-image-icon" />
                                    <p>{surface.label}</p>
                                </label>
                            </React.Fragment>
                        );
                    })}
                    <div className="radio-skew-size">
                        {skews.map((skew, index) => {
                            return (
                                <React.Fragment key={index}>
                                    <input
                                        id={"skew_" + index}
                                        type="radio"
                                        name="skew"
                                        disabled={skewType < 2}
                                        checked={skewValue === skew.value ? "checked" : ""}
                                        onChange={() => dispatch({ type: types.CHANGE_SKEW_VALUE, payload: skew.value })}
                                    />
                                    <label htmlFor={"skew_" + index}>{skew.label}</label>
                                </React.Fragment>
                            );
                        })}
                    </div>
                </div>
                <div className="top-panel-box" style={{ display: paint ? 'block' : 'none' }}>
                    <span className="top-panel-label stiled-checkbox-text">Màu sơn</span>
                    <div id="paint-color-picker" className="top-panel-select-color" title="Paint Color" style={{ backgroundColor: paint || '#FFFFFF' }}>
                    </div>
                    <div id="paint-predefined-color">
                        {colors.map((color, index) => {
                            return (
                                <button
                                    key={index}
                                    style={{ backgroundColor: color }}
                                    className="-btn"
                                    onClick={() => dispatch({ type: types.CHANGE_PAINT, payload: color })}
                                />
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(({ app: { layout, areaIndex, custom, rotate } }) => ({ layout, areaIndex, custom, rotate }))(ProductLayout)
