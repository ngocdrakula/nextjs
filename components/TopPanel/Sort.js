import React, { Component } from 'react'
import { connect } from 'react-redux';
import types from '../../redux/types';

const sorts = [
    { label: 'A-Z', value: 0 },
    { label: 'Z-A', value: 1 },
    { label: 'Mới nhất trước', value: 2 },
    { label: 'Cũ nhất trước', value: 3 },
];
class Sort extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const { dispatch, sortType } = this.props;
        return (
            <div className="top-panel-box">
                <span className="top-panel-label">Sắp xếp:</span>
                <select name="productSort" defaultValue={sortType} onChange={e => dispatch({ type: types.CHANGE_SORT, payload: Number(e.target.value) })}>
                    {sorts.map((sort, index) => {
                        return (
                            <option key={index} value={sort.value}>{sort.label}</option>
                        );
                    })}
                </select>
            </div>
        );
    }
}

export default connect(({ app: { sortType = 2 } }) => ({ sortType }))(Sort)
