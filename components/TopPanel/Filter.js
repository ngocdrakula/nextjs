import React, { Component } from 'react'
import { connect } from 'react-redux';
import types from '../../redux/types';

class Filter extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    render() {
        const { dispatch, active, sizes, fronts, rooms } = this.props;
        return (
            <div className="top-panel-box top-panel-option-box top-panel-box-overflow-y" style={!active ? { display: 'none' } : {}}>
                <div className="filter-block">
                    <div className="-header">Kích thước</div>
                    <div className="filter-block-support-buttons">
                        <span onClick={() => dispatch({ type: types.SIZES_SELECT_ALL })}> Chọn hết </span>
                        <span onClick={() => dispatch({ type: types.SIZES_CLEAR_ALL })}> Bỏ chọn </span>
                        <span onClick={() => dispatch({ type: types.SIZES_REVERSE })}> Đảo chọn </span>
                    </div>
                    {sizes.map((size, index) => {
                        return (
                            <div key={size._id} className="filter-item-checkbox">
                                <input
                                    id={"filterSize_" + size._id}
                                    type="checkbox"
                                    checked={size.uncheck ? "" : "checked"}
                                    onChange={() => dispatch({ type: types.SIZES_SELECT_ONE, payload: index })}
                                />
                                <label htmlFor={"filterSize_" + size._id}>{size.width}x{size.height}mm</label>
                            </div>
                        );
                    })}
                </div>
                <div className="filter-block">
                    <div className="-header">Bề mặt</div>
                    <div className="filter-block-support-buttons">
                        <span onClick={() => dispatch({ type: types.FRONTS_SELECT_ALL })}> Chọn hết </span>
                        <span onClick={() => dispatch({ type: types.FRONTS_CLEAR_ALL })}> Bỏ chọn </span>
                        <span onClick={() => dispatch({ type: types.FRONTS_REVERSE })}> Đảo chọn </span>
                    </div>
                    {fronts.map((front, index) => {
                        return (
                            <div key={front._id} className="filter-item-checkbox">
                                <input
                                    id={"filterFront_" + front._id}
                                    type="checkbox"
                                    checked={front.uncheck ? "" : "checked"}
                                    onChange={() => dispatch({ type: types.FRONTS_SELECT_ONE, payload: index })}
                                />
                                <label htmlFor={"filterFront_" + front._id}>{front.name}</label>
                            </div>
                        );
                    })}
                </div>
                <div className="filter-block">
                    <div className="-header">Khu vực</div>
                    <div className="filter-block-support-buttons">
                        <span onClick={() => dispatch({ type: types.ROOMS_SELECT_ALL })}> Chọn hết </span>
                        <span onClick={() => dispatch({ type: types.ROOMS_CLEAR_ALL })}> Bỏ chọn </span>
                        <span onClick={() => dispatch({ type: types.ROOMS_REVERSE })}> Đảo chọn </span>
                    </div>
                    {rooms.map((room, index) => {
                        return (
                            <div key={room._id} className="filter-item-checkbox">
                                <input
                                    id={"filteLocation_" + room._id}
                                    type="checkbox"
                                    checked={room.uncheck ? "" : "checked"}
                                    onChange={() => dispatch({ type: types.ROOMS_SELECT_ONE, payload: index })}
                                />
                                <label htmlFor={"filteLocation_" + room._id}>{room.name}</label>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
}

export default connect(({ app: { sizes = [], fronts = [], rooms = [] } }) => ({ sizes, fronts, rooms, }))(Filter)
