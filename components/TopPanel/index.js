import React, { Component } from 'react';
import { connect } from 'react-redux';
import dynamic from 'next/dynamic';
import types from '../../redux/types';
import ProductResult from './ProductResult';

const Filter = dynamic(() => import('./Filter'));
const Grout = dynamic(() => import('./Grout'));
const ProductLayout = dynamic(() => import('./ProductLayout'));
const Product = dynamic(() => import('./Product'));
const Rotation = dynamic(() => import('./Rotation'));
const Sort = dynamic(() => import('./Sort'));


class TopPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
        }
    }
    handleToggle = () => {
        const { dispatch } = this.props;
        dispatch({ type: types.HIDE_TOPPANEL })
    }
    handleSelect = (panel) => { this.setState({ panel }) }
    handleChange = (e) => this.setState({ search: e.target.value });
    handleSearch = e => {
        e.preventDefault();
        const { search } = this.state;
        const { dispatch } = this.props;
        dispatch({
            type: types.CHANGE_SEARCH,
            payload: search
        })
    }
    render() {
        const { panel } = this.state;
        const { visible } = this.props;
        return (
            <div className="top-panel" style={{ display: 'flex', right: visible ? 0 : -400 }}>
                <div className="top-panel-hide-button"
                    onClick={this.handleToggle}
                    style={visible === undefined ? { display: 'none' } : {}}
                >
                    <span className={"glyphicon glyphicon-triangle-" + (visible ? "right" : "left")} />
                </div>
                <div className="top-panel-box top-panel-box-first">
                    <button onClick={() => this.handleSelect(panel !== 0 ? 0 : null)} className={"top-panel-button" + (panel === 0 ? " top-panel-button-active" : "")}>Sản phẩm</button>{' '}
                    <button onClick={() => this.handleSelect(panel !== 1 ? 1 : null)} className={"top-panel-button" + (panel === 1 ? " top-panel-button-active" : "")}>Bố cục</button>{' '}
                    <button onClick={() => this.handleSelect(panel !== 2 ? 2 : null)} className={"top-panel-button" + (panel === 2 ? " top-panel-button-active" : "")}>Mạch</button>{' '}
                </div>
                <div className="top-panel-box">
                    <form onSubmit={this.handleSearch}>
                        <input type="search" placeholder="Tìm kiếm sản phẩm" className="input-search" onChange={this.handleChange} />
                        <button type="submit" className="search-icon-button"><img src="/icons/search.png" alt="Search" className="search-icon-button-imqge" /></button>{' '}
                        <button type="button" onClick={() => this.handleSelect(panel !== 3 ? 3 : null)} className={"top-panel-button" + (panel === 3 ? " top-panel-button-active" : "")}>Lọc</button>
                    </form>
                    <ProductResult />
                </div>
                <ProductLayout active={panel === 1} />
                <Grout active={panel === 2} />
                <Filter active={panel === 3} />
                <Rotation />
                <Sort />
                <Product />
            </div >
        )
    }
}




export default connect(({ app: { visible } }) => ({ visible }))(TopPanel)