import React, { Component } from 'react'
import { connect } from 'react-redux';
import types from '../../redux/types';

class ProductResult extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        const { layout, areaIndex, products, sizes, fronts, search } = this.props;
        const area = layout?.areas?.[areaIndex] || {};
        const { type } = area;
        const sortedProducts = products.filter(product => {
            if (search && product.name.toLowerCase().search(search.toLowerCase()) === - 1) return false
            if (!product.image) return false;
            if (!sizes.find(s => !s.uncheck && s._id === product.size._id)) return false;
            if (!fronts.find(f => !f.uncheck && f._id === product.front._id)) return false;
            if (!product.room.includes(layout?.room?._id)) return false;
            if (!product.type.includes(type)) return false;
            return true;
        });
        return (
            <div id="topPanelSearchResult" style={sortedProducts.length ? { display: 'none' } : { marginTop: 10 }}>FILTER_TILES_NOT_FOUND</div>
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

export default connect(mStP)(ProductResult)
