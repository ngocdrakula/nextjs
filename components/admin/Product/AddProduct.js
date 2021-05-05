import React, { Component } from 'react'
import { connect } from 'react-redux';
import { createFormData } from '../../../utils/helper';
import types from '../../../redux/types';

class AddProduct extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            code: ''
        };
    }
    componentDidUpdate(prevProps) {
        const { visible } = this.props;
        if (visible && !prevProps.visible) {
            document.documentElement.classList = "modal-open";
            document.documentElement.style = { paddingRight: 16 };
            this.setState({
                name: '',
                code: '',
                enabled: true,
                outSide: false,
                files: null,
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
        const { name, code, sizeSelected, frontSelected, enabled, outSide, files } = this.state;
        console.log(this.state)
        if (!name) this.setState({ field: 'name', message: 'Tên sản phẩm là bắt buộc' });
        else if (!frontSelected) this.setState({ field: 'front', message: 'Loại bề mặt chưa được chọn' });
        else if (!sizeSelected) this.setState({ field: 'size', message: 'Kích thước chưa được chọn' });
        else if (!files?.length) this.setState({ field: 'files', message: 'Ảnh chưa được chọn' });
        else {
            const data = {
                name,
                code: code || name,
                enabled,
                outSide,
                sizeId: sizeSelected._id,
                frontId: frontSelected._id,
                files
            };
            const formData = createFormData(data);
            const { dispatch } = this.props;
            dispatch({
                type: types.ADMIN_ADD_PRODUCT,
                payload: formData,
                callback: res => {
                    console.log(res.data);
                    if (res?.data?.success) {
                        this.handleClose();
                        this.props.onAdded();
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
    handleChange = e => this.setState({ [e.target.name]: e.target.value, field: null, message: null });
    handleCheckbox = e => this.setState({ [e.target.name]: e.target.checked });
    handleChooseFiles = e => {
        const files = e.target.files;
        if (files[0]) {
            const reader = new FileReader();
            reader.onload = () => {
                this.setState({ files, imageLocal: reader.result, field: null, message: null })
            }
            reader.readAsDataURL(files[0]);
        }
        this.setState({ files, imageLocal: null, field: null, message: null });
    }
    render() {
        const { visible, fronts, sizes } = this.props;
        const { code, enabled, front, name, outSide, size } = this.state;
        const { frontSelected, sizeSelected, frontDropdown, sizeDropdown, imageLocal, field, message } = this.state;
        const sizeName = sizeSelected ? `${sizeSelected.width}x${sizeSelected.height} mm` : "Chọn";
        return (
            <div>
                <div
                    className={"modal fade" + (visible ? " show" : "")}
                    style={visible ?
                        { paddingRight: 16, display: 'block' }
                        : { display: 'none' }
                    }
                    onClick={e => e.target.className === "modal fade show" ? this.handleClose() : ""}
                >
                    <div className="modal-dialog modal-lg" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Thêm sản phẩm</h5>
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
                                                            :
                                                            <span className="empty-field">(Có thể để trống nếu giống tên)</span>
                                                        }
                                                    </label>
                                                    <input className="form-control" type="text" name="code" placeholder={code || name || ''} value={code || ''} onChange={this.handleChange} />
                                                </div>
                                                <div className="form-group">
                                                    <label>Loại bề mặt: <span className="error-field">{field === 'front' && message ? `(${message})` : ""}</span></label>
                                                    <div className="input-select">
                                                        <div
                                                            className="form-control input-select-current"
                                                            onClick={() => this.setState({ frontDropdown: !frontDropdown })}
                                                        >
                                                            <span>{frontSelected?.name || "Chọn"}</span>
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
                                                                        onClick={() => this.setState({ frontSelected: item, frontDropdown: false, field: null, message: null })}
                                                                        className={"input-select-item" + (frontSelected?._id === item._id ? " active" : "")}
                                                                    >{item.name}</li>
                                                                )
                                                            })}
                                                        </ul>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label>Kích thước: <span className="error-field">{field === 'size' && message ? `(${message})` : ""}</span></label>
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
                                                                        onClick={() => this.setState({ sizeSelected: item, sizeDropdown: false, field: null, message: null })}
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
                                                            style={{ backgroundImage: `url(${imageLocal})` }} >
                                                        </div>
                                                        <div className={"w-100 h-100 d-flex justify-content-center align-items-center input-upload-over" + (field === 'files' ? " active" : "")}>
                                                            <input type="file" name="files" id="add-files" className="file-hidden" onChange={this.handleChooseFiles} />
                                                            <label htmlFor="add-files">
                                                                <div className={field === 'files' ? "btn btn-danger" : "btn btn-primary"}>{imageLocal ? "Thay đổi" : field === 'files' ? "Vui lòng chọn ảnh" : "Thêm ảnh"}</div>
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
                                                                <input type="checkbox" className="custom-control-input" name="enabled" id="add-enabled" checked={enabled ? "checked" : ""} onChange={this.handleCheckbox} />
                                                                <label className="custom-control-label" htmlFor="add-enabled">Trạng thái</label>
                                                            </div>
                                                        </div>
                                                        <div className="col">
                                                            <div className="form-group custom-control custom-checkbox">
                                                                <input type="checkbox" className="custom-control-input" name="outSide" id="add-outSide" checked={outSide ? "checked" : ""} onChange={this.handleCheckbox} />
                                                                <label className="custom-control-label" htmlFor="add-outSide">Ngoài trời</label>
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
                <div className={visible ? "modal-backdrop fade show" : ""} />
            </div >
        )
    }
}


export default connect(({ admin }) => ({ fronts: admin.front.data, sizes: admin.size.data }))(AddProduct)
