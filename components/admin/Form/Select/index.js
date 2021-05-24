import React, { Component } from 'react'

export default class Select extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.input = React.createRef();
    }
    componentWillUnmount() {
        window.removeEventListener('click', this.handleClickOutside);
    }

    componentDidUpdate(prevProps) {
        if (this.props.id !== prevProps.id) {
            this.setState({ selected: null });
        }
    }
    handleClickOutside = (e) => {
        if (this.input?.current && !this.input.current.contains(e.target)) {
            this.handleClick();
        }
    }

    handleClick = () => {
        const { visible } = this.state;
        if (!visible) {
            window.addEventListener('click', this.handleClickOutside);
        }
        else {
            window.removeEventListener('click', this.handleClickOutside);
        }
        this.setState({ visible: !visible });
    }

    handleSelect = (item) => {
        const { visible } = this.state;
        if (!visible) {
            window.addEventListener('click', this.handleClickOutside);
        }
        else {
            window.removeEventListener('click', this.handleClickOutside);
        }
        this.setState({ visible: !visible, selected: item });

        const { onChange } = this.props;
        if (typeof onChange === 'function') onChange(item.value, item);
    }

    render() {
        const { visible, selected } = this.state;
        const { data = [], hover } = this.props;
        return (
            <div className="input-select" ref={this.input}>
                <div className="form-control input-select-current" onClick={this.handleClick}    >
                    <span style={{ WebkitLineClamp: 1, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden', textAlign: 'left', paddingRight: 10 }}>{selected?.label || hover || "Chọn"}</span>
                    <i className="fas fa-chevron-down" style={{ fontSize: 12 }} />
                </div>
                <ul style={{ display: visible ? 'block' : 'none' }} className="input-select-container">
                    {data.map((item, index) => {
                        if (!item) return null
                        return (
                            <li
                                key={item.value || `index-${index}`}
                                onClick={() => this.handleSelect(item)}
                                className={"input-select-item" + (item.value === selected?.value ? " active" : "")}
                            >{item.label}</li>
                        )
                    })}
                </ul>
            </div>
        )
    }
}
