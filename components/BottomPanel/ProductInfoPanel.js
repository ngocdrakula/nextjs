import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getThumbnail } from '../../utils/helper';

class ProductInfoPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        const { visible, handleToggle, layout } = this.props;
        const areas = layout?.areas || [];
        return (
            <div id="productInfoPanel" className="top-panel" style={{ display: visible ? 'flex' : 'none' }} onClick={handleToggle}>
                <div className="top-panel-header">Thông tin sản phẩm</div>
                <div id="productInfoTilesList" className="top-panel-box">
                    {areas.map((area, index) => {
                        const products = area.products || [];
                        return (
                            <React.Fragment key={index}>
                                <p className="top-panel-label">{area.name}</p>
                                {products.map(product => {
                                    return (
                                        <div key={product._id} className="top-panel-content-tiles-list-item">
                                            <div className="tile-list-thumbnail-image-holder">
                                                <img src={"/api/images/" + getThumbnail(product)} className="tile-list-thumbnail" />
                                            </div>
                                            <div className="tile-list-text">
                                                <p className="-caption">{product.code}</p>
                                                <p>Kích thước: {product.width}mm x {product.height}mm</p>
                                                <p>Bề mặt: {product.front.name}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </React.Fragment>
                        );
                    })}
                </div>
                <div id="editor">
                </div>
            </div>
        );
    }
}

export default connect(({ app: { layout } }) => ({ layout }))(ProductInfoPanel)