import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getThumbnail } from '../../utils/helper';

class ProductInfoPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        const { visible, handleToggle, layout, areasCustom } = this.props;
        const areas = (layout?.areas || []).map((area, index) => {
            const areaCustom = areasCustom?.[index];
            const products = [...(area.products || [])];
            if (areaCustom) {
                areaCustom.map(item => {
                    if (item.product && !products.find(p => p._id === item.product._id)) {
                        products.push(item.product);
                    }
                });
            }
            return { name: area.type === 'wall' ? 'Tường' : 'Sàn', products };
        });
        return (
            <div id="productInfoPanel" className="top-panel" style={{ display: visible ? 'flex' : 'none' }} onClick={handleToggle} >
                <div className="top-panel-header">Thông tin sản phẩm</div>
                <div id="productInfoTilesList" className="top-panel-box">
                    {areas.map((area, index) => {
                        const products = area.products;
                        if (!products.length) return null
                        return (
                            <React.Fragment key={index}>
                                <p className="top-panel-label">{area.name}</p>
                                {products.map((product, index) => {
                                    return (
                                        <div key={index + product._id} className="top-panel-content-tiles-list-item">
                                            <div className="tile-list-thumbnail-image-holder">
                                                <img src={"/api/images/" + getThumbnail(product)} className="tile-list-thumbnail" />
                                            </div>
                                            <div className="tile-list-text">
                                                <p className="-caption">{product.name}</p>
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
            </div >
        );
    }
}

export default connect(({ app: { layout, areasCustom } }) => ({ layout, areasCustom }))(ProductInfoPanel)