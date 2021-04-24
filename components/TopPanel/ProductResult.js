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
        const { products, sizes, fronts, locations, search } = this.props;
        const sortedProducts = products.filter(product => {
            if (search && product.name.search(search) === - 1) return false
            if (!product.image) return false;
            if (!sizes.find(s => !s.uncheck && s._id === product.size._id)) return false;
            if (!fronts.find(f => !f.uncheck && f._id === product.front._id)) return false;
            if (!locations.find(l => !l.uncheck && l.outSide === product.outSide)) return false;
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
        sizes = [],
        fronts = [],
        locations = [],
        search
    }
}) => ({ products, sizes, fronts, locations, search });

export default connect(mStP)(ProductResult)
