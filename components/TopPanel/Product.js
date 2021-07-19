import React, { Component } from 'react'
import { connect } from 'react-redux';
import types from '../../redux/types';
import { getThumbnail } from '../../utils/helper';

const unitHeight = 100.8, groupLength = 100;

class Product extends Component {
    constructor(props) {
        super(props);
        this.state = {
            limit: groupLength
        }
    }

    handleScroll = (e) => {
        const { scrollTop } = e.target;
        const limit = (Math.floor(scrollTop / unitHeight / groupLength) + 1) * groupLength;
        if (limit > this.state.limit) {
            this.setState({ limit })
        }
    }
    render() {
        const { dispatch, products, layout, areaIndex, sizes, fronts, search } = this.props;
        const area = layout?.areas?.[areaIndex] || {};
        const { products: selecteds = [], skewType, type } = area;
        const sortedProducts = products.filter(product => {
            if (search && product.name.toLowerCase().search(search.toLowerCase()) === - 1) return false
            if (!product.image) return false;
            if (!sizes.find(s => !s.uncheck && s._id === product.size._id)) return false;
            if (!fronts.find(f => !f.uncheck && f._id === product.front._id)) return false;
            if (!product.room.includes(layout?.room?._id)) return false;
            if (!product.type.includes(type)) return false;
            return true;
        });
        const { limit } = this.state;
        return (
            <div id="topPanelTilesListBox" className="top-panel-box" onScroll={this.handleScroll}>
                <div id="loadTilesAnimationContainer" style={products.length ? { display: 'none' } : {}}>
                    <p>Đang tải</p>
                    <div className="circles marginLeft">
                        <span className="circle_1 circle" />
                        <span className="circle_2 circle" />
                        <span className="circle_3 circle" />
                    </div>
                </div>
                <ul>
                    {sortedProducts.map((product, index) => {
                        const disabled = !!(selecteds.findIndex(p => p.size.width === product.size.width && p.size.height === product.size.height));
                        return (
                            <li key={product._id} className="top-panel-content-tiles-list-item"  >
                                <div className="tile-list-thumbnail-image-holder" onClick={() => dispatch({ type: types.SELECT_PRODUCT, payload: product })}>
                                    <img src={index < limit ? "/api/images/" + getThumbnail(product) : undefined} />
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
