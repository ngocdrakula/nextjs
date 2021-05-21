import React, { Component } from 'react'
import { connect } from 'react-redux';
import types from '../../redux/types';
import { getThumbnail } from '../../utils/helper';

class Product extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        const { dispatch, products, layout, areaIndex, sizes, fronts, search } = this.props;
        const area = layout?.areas[areaIndex] || {};
        const { products: selecteds = [], skewType, type } = area;
        const sortedProducts = products.filter(product => {
            if (search && product.name.search(search) === - 1) return false
            if (!product.image) return false;
            if (!sizes.find(s => !s.uncheck && s._id === product.size._id)) return false;
            if (!fronts.find(f => !f.uncheck && f._id === product.front._id)) return false;
            if (layout?.room?._id !== product.room) return false;
            if (type && type !== product.type) return false;
            return true;
        })
        return (
            <div id="topPanelTilesListBox" className="top-panel-box">
                <div id="loadTilesAnimationContainer" style={products.length ? { display: 'none' } : {}}>
                    <p>Đang tải</p>
                    <div className="circles marginLeft">
                        <span className="circle_1 circle" />
                        <span className="circle_2 circle" />
                        <span className="circle_3 circle" />
                    </div>
                </div>
                <ul>
                    {sortedProducts.map(product => {
                        const disabled = !!(selecteds.findIndex(p => p.size.width === product.size.width && p.size.height === product.size.height));
                        return (
                            <li key={product._id} className="top-panel-content-tiles-list-item"  >
                                <div className="tile-list-thumbnail-image-holder" onClick={() => dispatch({ type: types.SELECT_PRODUCT, payload: product })}>
                                    <img src={"/api/images/" + getThumbnail(product)} />
                                </div>
                                <div className="tile-list-text" onClick={() => dispatch({ type: types.SELECT_PRODUCT, payload: product })}>
                                    <p className="-caption">{product.name}</p>
                                    <p>Kích thước: {product.size.width}mm x {product.size.height}mm</p>
                                    <p>Bề mặt: {product.front.name}</p>
                                </div>
                                <div className="buttons-holder-tile-list-choose-tile" style={{ display: skewType === 1 ? 'block' : 'none' }}>
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
        layout,
        areaIndex,
        sizes = [],
        fronts = [],
        search
    }
}) => ({ products, layout, areaIndex, sizes, fronts, search });

export default connect(mStP)(Product)
