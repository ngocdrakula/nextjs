import React, { Component } from 'react'
import Checkbox from '../Checkbox';

export default class Checklist extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selecteds: []
        };
        this.input = React.createRef();
    }
    componentWillUnmount() {
        window.removeEventListener('click', this.handleClickOutside);
    }
    componentDidUpdate(prevProps) {
        if (this.props.id !== prevProps.id) {
            this.setState({ selecteds: this.props.selecteds || [] });
        }
    }
    handleClickOutside = (e) => {
        if (this.input?.current && !this.input.current.contains(e.target)) {
            this.handleClick();
        }
    }

    handleClick = () => {
        const { visible, selecteds } = this.state;
        if (!visible) {
            window.addEventListener('click', this.handleClickOutside);
        }
        else {
            window.removeEventListener('click', this.handleClickOutside);
            const { onChange } = this.props;
            if (typeof onChange === 'function') onChange(selecteds);
        }
        this.setState({ visible: !visible });
    }

    handleSelect = (value) => {
        const { selecteds } = this.state;
        if (selecteds.includes(value)) {
            this.setState({ selecteds: selecteds.filter(c => c !== value) });
        } else {
            selecteds.push(value);
            this.setState({ selecteds: [...selecteds] })
        }
    }

    render() {
        const { visible, selecteds } = this.state;
        const { data = [], hover } = this.props;
        return (
            <div className="input-select" ref={this.input}>
                <div className="form-control input-select-current" onClick={this.handleClick}>
                    <span style={{
                        WebkitLineClamp: 1,
                        display: '-webkit-box',
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textAlign: 'left',
                        paddingRight: 10
                    }}>{selecteds.length ? `${selecteds.length} đã chọn` : hover || "Chọn"}</span>
                    <i className="fas fa-chevron-down" style={{ fontSize: 12 }} />
                </div>
                <ul style={{ display: visible ? 'block' : 'none' }} className="input-select-container">
                    {data.map((item, index) => {
                        if (!item) return null;
                        const checked = selecteds.includes(item.value) ? "checked" : "";
                        return (
                            <li
                                key={item.value || `index-${index}`}
                                onClick={() => this.handleSelect(item.value)}
                                className={"input-select-item" + (checked ? " active" : "")}
                            >
                                <Checkbox checked={checked} onChange={() => this.handleSelect(item.value)} />
                                {item.label}
                            </li>
                        )
                    })}
                </ul>
            </div>
        )
    }
}
