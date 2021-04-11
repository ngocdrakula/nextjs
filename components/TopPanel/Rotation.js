import React, { Component } from 'react'
import { connect } from 'react-redux';
import types from '../../redux/types';

const rotations = [
    { _id: 0, label: '0°', value: 0, },
    { _id: 90, label: '90°', value: 90, },
    { _id: 135, label: '135°', value: 135, },
    { _id: 180, label: '180°', value: 180, },
]

class Rotation extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    handleSelect = e => this.setState({ selected: e.target.value })

    render() {
        const { dispatch, layout, areaIndex } = this.props;
        const area = layout?.areas[areaIndex] || {};
        const { rotate } = area;
        return (
            <div className="top-panel-box radio-surface-rotation">
                <span className="top-panel-label">Xoay góc ốp/lát:</span>
                {rotations.map((rotation, index) => {
                    return (
                        <React.Fragment key={index}>
                            <input
                                id={"rotatinSelect_" + index}
                                type="radio"
                                name="rotation"
                                checked={rotation.value === rotate ? "checked" : ""}
                                onChange={() => dispatch({ type: types.CHANGE_ROTATE, payload: rotation.value })}
                            />
                            <label htmlFor={"rotatinSelect_" + index}>{rotation.label}</label>
                        </React.Fragment>
                    );
                })}
            </div>
        );
    }
}

export default connect(({ app: { layout, areaIndex } }) => ({ layout, areaIndex }))(Rotation)
