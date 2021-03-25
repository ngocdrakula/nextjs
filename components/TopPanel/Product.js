import React, { Component } from 'react'
import { connect } from 'react-redux';
import types from '../../redux/types';

class Product extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    handleChoseSecond = product => {
        console.log(product)
    }
    handleChoseFirst = product => {
        console.log(product)
    }

    render() {
        const { dispatch, products, areas, areaIndex, sizes, fronts, locations } = this.props;
        const currentArea = areas[areaIndex];
        const selecteds = currentArea && currentArea.products || [];
        return (
            <div id="topPanelTilesListBox" className="top-panel-box">
                <div id="loadTilesAnimationContainer" style={!products.length ? { display: 'none' } : {}}>
                    <p>Đang tải</p>
                    <div className="circles marginLeft">
                        <span className="circle_1 circle" />
                        <span className="circle_2 circle" />
                        <span className="circle_3 circle" />
                    </div>
                </div>
                <ul>
                    {products.map(product => {

                        if (!product.image) return null;
                        if (!sizes.find(s => !s.uncheck && s._id === product.size._id)) return null;
                        if (!fronts.find(f => !f.uncheck && f._id === product.front._id)) return null;
                        if (!locations.find(l => !l.uncheck && l.outSide === product.outSide)) return null;

                        const disabled = !!(selecteds.findIndex(p => p.width === product.width && p.height === product.height));

                        return (
                            <li key={product._id} className="top-panel-content-tiles-list-item"  >
                                <div className="tile-list-thumbnail-image-holder" onClick={() => dispatch({ type: types.SELECT_PRODUCT, payload: product })}>
                                    <img src={product.image} />
                                </div>
                                <div className="tile-list-text" onClick={() => dispatch({ type: types.SELECT_PRODUCT, payload: product })}>
                                    <p className="-caption">{product.code}</p>
                                    <p>Kích thước: {product.width}mm x {product.height}mm</p>
                                    <p>Bề mặt: {product.front.name}</p>
                                </div>
                                <div className="buttons-holder-tile-list-choose-tile" style={{ display: selecteds.length > 1 ? 'block' : 'none' }}>
                                    <button
                                        type="button"
                                        className="button-tile-list-choose-tile"
                                        onClick={() => dispatch({ type: types.SELECT_FIRST_PRODUCT, payload: product })}
                                    >1</button>
                                    <button
                                        type="button"
                                        className="button-tile-list-choose-tile"
                                        disabled={disabled}
                                        onClick={() => dispatch({ type: types.SELECT_SECOND_PRODUCT, payload: product })}
                                    >2</button>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div>

        );
    }
}
const mStP = ({
    app: {
        products = [],
        areas = [],
        areaIndex = 0,
        sizes = [],
        fronts = [],
        locations = []
    }
}) => ({ products, areas, areaIndex, sizes, fronts, locations });

export default connect(mStP)(Product)
