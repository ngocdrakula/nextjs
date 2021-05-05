import React, { Component } from 'react'
import { connect } from 'react-redux';
import { createFormData } from '../../../utils/helper';
import types from '../../../redux/types';

class AddProduct extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidUpdate(prevProps) {
        const { product } = this.props;
        if (product && !prevProps.product) {
            document.documentElement.classList = "modal-open";
            document.documentElement.style = { paddingRight: 16 };
            this.setState({
                ...product,
                imageLocal: null,
                sizeSelected: null,
                frontSelected: null
            });
        }
    }
    handleClose = () => {
        this.props.onHide();
        document.documentElement.classList = "modal-open";
        document.documentElement.style = { paddingRight: 16 };
    }
    handleSubmit = e => {
        e.preventDefault();
        const { _id, name, code, sizeSelected, frontSelected, enabled, outSide, files } = this.state;
        if (!name) this.setState({ field: 'name', message: 'Tên sản phẩm không được để trống' });
        else if (!code) this.setState({ field: 'code', message: 'Mã sản phẩm không được để trống' });
        else {
            const data = { enabled, outSide };

            if (name !== this.props.product.name) data.name = name;
            if (code !== this.props.product.code) data.code = code || name;
            if (sizeSelected) data.sizeId = sizeSelected._id;
            if (frontSelected) data.frontId = frontSelected._id;
            if (files && files.length) data.files = files;

            const formData = createFormData(data);
            const { dispatch } = this.props;
            dispatch({
                type: types.ADMIN_UPDATE_PRODUCT,
                payload: { _id, formData },
                callback: res => {
                    if (res?.data?.success) {
                        this.handleClose();
                    }
                    else if (res?.data?.exist) {
                        this.setState({
                            field: res.data.field,
                            message: res.data.message
                        })
                    }
                }
            })
        }
    }
    handleChange = e => this.setState({ [e.target.name]: e.target.value, message: null });
    handleCheckbox = e => this.setState({ [e.target.name]: e.target.checked });
    handleChooseFiles = e => {
        const files = e.target.files;
        this.setState({ files });
        if (files[0]) {
            const reader = new FileReader();
            reader.onload = () => {
                this.setState({ imageLocal: reader.result })
            }
            reader.readAsDataURL(files[0]);
        }
    }
    render() {
        const { product, fronts, sizes } = this.props;
        const { code, enabled, front, image, name, outSide, size } = this.state;
        const { frontSelected, sizeSelected, frontDropdown, sizeDropdown, imageLocal, field, message } = this.state;

        const { width, height } = sizeSelected || size || {};
        const sizeName = `${width}x${height} mm`;
        return (
            <div>
                <div
                    className={"modal fade" + (product ? " show" : "")}
                    style={product ?
                        { paddingRight: 16, display: 'block' }
                        : { display: 'none' }
                    }
                    onClick={e => e.target.className === "modal fade show" ? this.handleClose() : ""}
                >
                    <div className="modal-dialog modal-lg" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Sửa sản phẩm</h5>
                                <button type="button" className="close" onClick={this.handleClose}>
                                    <span aria-hidden="true">×</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="py-1">
                                    <form className="form" onSubmit={this.handleSubmit}>
                                        <div className="row">
                                            <div className="col">
                                                <div className="form-group">
                                                    <label>Tên sản phẩm: <span className="error-field">{field === 'name' && message ? `(${message})` : ""}</span></label>
                                                    <input className="form-control" type="text" name="name" placeholder={name} value={name || ''} onChange={this.handleChange} />
                                                </div>
                                                <div className="form-group">
                                                    <label>
                                                        <span>Mã sản phẩm: </span>
                                                        {field === 'code' && message ?
                                                            <span className="error-field">({message})</span>
                                                            : ""
                                                        }
                                                    </label>
                                                    <input className="form-control" type="text" name="code" placeholder={code} value={code || ''} onChange={this.handleChange} />
                                                </div>
                                                <div className="form-group">
                                                    <label>Kích thước:</label>
                                                    <div className="input-select">
                                                        <div
                                                            className="form-control input-select-current"
                                                            onClick={() => this.setState({ frontDropdown: !frontDropdown })}
                                                        >
                                                            <span>{frontSelected?.name || front?.name}</span>
                                                            <i className="fas fa-chevron-down" style={{ fontSize: 12 }} />
                                                        </div>
                                                        <ul style={{
                                                            display: frontDropdown ? 'block' : 'none'
                                                        }}
                                                            className="input-select-container">
                                                            {fronts.map(item => {
                                                                if (!item.enabled) return null;
                                                                return (
                                                                    <li
                                                                        key={item._id}
                                                                        onClick={() => this.setState({ frontSelected: item, frontDropdown: false })}
                                                                        className={"input-select-item" + (frontSelected?._id === item._id ? " active" : "")}
                                                                    >{item.name}</li>
                                                                )
                                                            })}
                                                        </ul>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label>Loại bề mặt:</label>
                                                    <div className="input-select">
                                                        <div
                                                            className="form-control input-select-current"
                                                            onClick={() => this.setState({ sizeDropdown: !sizeDropdown })}
                                                        >
                                                            <span>{sizeName}</span>
                                                            <i className="fas fa-chevron-down" style={{ fontSize: 12 }} />
                                                        </div>
                                                        <ul style={{
                                                            display: sizeDropdown ? 'block' : 'none'
                                                        }}
                                                            className="input-select-container">
                                                            {sizes.map(item => {
                                                                if (!item.enabled) return null;
                                                                const { width, height } = item;
                                                                const itemName = `${width}x${height} mm`;
                                                                return (
                                                                    <li
                                                                        key={item._id}
                                                                        onClick={() => this.setState({ sizeSelected: item, sizeDropdown: false })}
                                                                        className={"input-select-item" + (sizeSelected?._id === item._id ? " active" : "")}
                                                                    >{itemName}</li>
                                                                )
                                                            })}
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col">
                                                <div className="w-100 h-100" style={{ padding: 15, position: 'relative' }}>
                                                    <div className="w-100 h-100 image-upload-change">
                                                        <div
                                                            className="w-100 h-100 d-flex justify-content-center align-items-center image-upload-over"
                                                            style={{ backgroundImage: `url(${imageLocal || `/api/images/${image}`})` }} >
                                                        </div>
                                                        <div className="w-100 h-100 d-flex justify-content-center align-items-center input-upload-over">
                                                            <input type="file" name="files" id="files" className="file-hidden" onChange={this.handleChooseFiles} />
                                                            <label htmlFor="files">
                                                                <div className="btn btn-primary">Thay đổi</div>
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col">
                                            <div className="row">
                                                <div className="col">
                                                    <div className="row">
                                                        <div className="col">
                                                            <div className="form-group custom-control custom-checkbox">
                                                                <input type="checkbox" className="custom-control-input" name="enabled" id="enabled" checked={enabled ? "checked" : ""} onChange={this.handleCheckbox} />
                                                                <label className="custom-control-label" htmlFor="enabled">Trạng thái</label>
                                                            </div>
                                                        </div>
                                                        <div className="col">
                                                            <div className="form-group custom-control custom-checkbox">
                                                                <input type="checkbox" className="custom-control-input" name="outSide" id="outSide" checked={outSide ? "checked" : ""} onChange={this.handleCheckbox} />
                                                                <label className="custom-control-label" htmlFor="outSide">Ngoài trời</label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col d-flex justify-content-end align-items-end">
                                                    <div className="form-group">
                                                        <button className="btn btn-primary" type="submit">Lưu lại</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div >
                </div >
                <div className={product ? "modal-backdrop fade show" : ""} />
            </div >
        )
    }
}


export default connect(({ admin }) => ({ fronts: admin.front.data, sizes: admin.size.data }))(AddProduct)
