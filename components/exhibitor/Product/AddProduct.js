import React, { Component } from 'react'
import { connect } from 'react-redux';
import types from '../../../redux/types';
import { createFormData, MODE } from '../../../utils/helper';


class AddProduct extends Component {
    constructor(props) {
        super(props);
        this.defaultState = {
            name: '',
            enabled: true,
            fieldError: null,
            message: '',
            files: null
        }
        this.state = { ...this.defaultState };
    }
    componentDidUpdate(prevProps) {
        if (!prevProps.onAdd && this.props.onAdd) {
            this.setState({ ...this.defaultState })
        }
    }
    handleChange = e => this.setState({ [e.target.name]: e.target.value, fieldError: false })
    handleSubmit = e => {
        e.preventDefault();
        const { name, enabled, selected, files, description } = this.state;
        const { categories, user, exUser } = this.props;
        const categoryId = selected || categories[0]?._id;
        if (!name) {
            this.setState({ fieldError: 'name', message: 'Tên không được để trống' })
        } else if (!categoryId) {
            this.setState({ fieldError: 'category', message: 'Vui lòng thêm một chuyên mục trước' })
        } else if (!description) {
            this.setState({ fieldError: 'description', message: 'Vui lòng thêm mô tả cho sản phẩm' })
        } else if (!files?.length) {
            this.setState({ fieldError: 'files', message: 'Vui lòng chọn một hình ảnh' })
        } else {
            const { dispatch, onAdded } = this.props;
            const data = { name, enabled, categoryId, files, description };
            if (user.mode === MODE.admin) data.exhibitorId = exUser?._id;
            const formData = createFormData(data);
            dispatch({
                type: types.ADMIN_ADD_PRODUCT,
                payload: formData,
                callback: res => {
                    if (res?.success) {
                        dispatch({
                            type: types.SET_TOOLTIP,
                            payload: {
                                type: 'success',
                                title: 'Thêm sản phẩm thành công',
                                message: 'Bạn muốn thêm sản phẩm khác?',
                                confirm: 'Thêm',
                                cancel: 'Đóng',
                                handleConfirm: () => { this.setState({ ...this.defaultState });; onAdded(); },
                                handleCancel: () => { onAdded(); this.props.handleClose(); }
                            },
                        });
                    }
                    else if (res?.data) {
                        this.setState({
                            fieldError: res.data.field,
                            message: res.data.message || "Vui lòng điền đầy đủ thông tin"
                        })
                    }
                }
            });
        }
    }
    handleDropdown = () => this.setState({ dropActive: !this.state.dropActive })
    handleSelectEnable = () => this.setState({ enabled: true, dropActive: false })
    handleSelectDisable = () => this.setState({ enabled: false, dropActive: false })
    handleDropdownCategory = () => this.setState({ dropCategory: !this.state.dropCategory, fieldError: null })

    handleChooseFiles = e => {
        this.setState({ files: e.target.files, fieldError: null })
    }


    render() {
        const { onAdd, handleClose, categories } = this.props;
        const { dropActive, name, description, enabled, selected, dropCategory, fieldError, message, files } = this.state;
        const categorySelected = categories.find(i => i._id === selected) || categories[0] || {};
        return (
            <div id="add-pro-myDynamicModal" className={"modal-create modal fade" + (onAdd ? " in" : "")} style={{ display: onAdd ? 'block' : 'none' }}>
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <form method="POST" action="/" id="add-pro-form" onSubmit={this.handleSubmit} >
                            <div className="modal-header">
                                <button type="button" className="close" onClick={handleClose}>×</button>
                                Thêm sản phẩm
                            </div>
                            <div className="modal-body">
                                <div className="row">
                                    <div className="col-md-8 nopadding-right">
                                        <div className={"form-group" + (fieldError === 'name' ? " has-error" : "")}>
                                            <label htmlFor="add-pro-name">Tên sản phẩm*</label>
                                            <input className="form-control" placeholder="Nhập tên sản phẩm" required value={name} id="add-pro-name" name="name" type="text" onChange={this.handleChange} />
                                            <div className="help-block with-errors">
                                                {fieldError === 'name' && message ?
                                                    <ul className="list-unstyled">
                                                        <li>{message}.</li>
                                                    </ul>
                                                    : ""}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-4 nopadding-left">
                                        <div className={"form-group" + (fieldError === 'enabled' ? " has-error" : "")}>
                                            <label htmlFor="add-pro-active">Trạng thái*</label>
                                            <span className={"select2 select2-container select2-container--default" + (dropActive ? " select2-container--open" : "")} style={{ width: '100%' }}>
                                                <span className="selection" onClick={this.handleDropdown}>
                                                    <span className="select2-selection select2-selection--single"  >
                                                        <span className="select2-selection__rendered" id="add-pro-select2-active-container" title={enabled ? "Hoạt động" : "Không hoạt động"}>{enabled ? "Hoạt động" : "Không hoạt động"}</span>
                                                        <span className="select2-selection__arrow" role="presentation">
                                                            <b role="presentation" />
                                                        </span>
                                                    </span>
                                                </span>
                                                <div className={"dropdown-select" + (dropActive ? " active" : "")}>
                                                    <div
                                                        className={"select-option-active" + (enabled ? " active" : "")}
                                                        onClick={this.handleSelectEnable}
                                                    >Hoạt động</div>
                                                    <div
                                                        className={"select-option-active" + (!enabled ? " active" : "")}
                                                        onClick={this.handleSelectDisable}
                                                    >Không hoạt động</div>
                                                </div>
                                            </span>
                                            <div className="help-block with-errors" >
                                                {fieldError === 'enabled' && message ?
                                                    <ul className="list-unstyled">
                                                        <li>{message}.</li>
                                                    </ul>
                                                    : ""}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6 nopadding-right">
                                        <div className={"form-group" + (fieldError === 'category' ? " has-error" : "")}>
                                            <label htmlFor="add-pro-active">Chuyên mục*</label>
                                            <span className={"select2 select2-container select2-container--default" + (dropCategory ? " select2-container--open" : "")} style={{ width: '100%' }}>
                                                <span className="selection" onClick={this.handleDropdownCategory}>
                                                    <span className="select2-selection select2-selection--single"  >
                                                        <span className="select2-selection__rendered" id="add-pro-select2-active-container" title={categorySelected.name}>{categorySelected.name}</span>
                                                        <span className="select2-selection__arrow" role="presentation">
                                                            <b role="presentation" />
                                                        </span>
                                                    </span>
                                                </span>
                                                <div className={"dropdown-select" + (dropCategory ? " active" : "")}>
                                                    {categories.map(category => {
                                                        return (
                                                            <div key={category._id}
                                                                className={"select-option-active" + (selected === category._id ? " active" : "")}
                                                                onClick={() => this.setState({ selected: category._id, dropCategory: false })}
                                                            >{category.name}</div>
                                                        )
                                                    })}
                                                </div>
                                            </span>
                                            <div className="help-block with-errors">
                                                {fieldError === 'category' && message ?
                                                    <ul className="list-unstyled">
                                                        <li>{message}.</li>
                                                    </ul>
                                                    : ""}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className={"form-group" + (fieldError === 'description' ? " has-error" : "")}>
                                    <label htmlFor="add-pro-description">Mô tả</label>
                                    <textarea className="form-control summernote" required rows={2} placeholder="Mô tả sơ lược về sản phẩm" value={description} name="description" cols={50} id="add-pro-description" onChange={this.handleChange} />
                                    <div className="help-block with-errors">
                                        {fieldError === 'description' && message ?
                                            <ul className="list-unstyled">
                                                <li>{message}.</li>
                                            </ul>
                                            : ""}
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className={"form-group" + (fieldError === 'files' ? " has-error" : "")}>
                                            <label htmlFor="add-pro-uploadBtn" className="with-help">Ảnh sản phẩm</label>
                                            <div className="row">
                                                <div className="col-md-9 nopadding-right">
                                                    <input id="add-pro-uploadFile" placeholder={files?.length ? "Đã chọn 1 ảnh" : "Ảnh sản phẩm"} className="form-control" style={{ height: 28 }} disabled="disabled" />
                                                    <div className="help-block with-errors">Kích thước nhỏ nhất 300 x 300px</div>
                                                </div>
                                                <div className="col-md-3 nopadding-left">
                                                    <div className="fileUpload btn btn-primary btn-block btn-flat">
                                                        <span>Tải lên</span>
                                                        <input type="file" name="ex-avatar" id="add-pro-uploadBtn" className="upload" onChange={this.handleChooseFiles} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="help-block with-errors">
                                                {fieldError === 'files' && message ?
                                                    <ul className="list-unstyled">
                                                        <li>{message}.</li>
                                                    </ul>
                                                    : ""}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <input className="btn btn-flat btn-new" type="submit" value="Thêm" />
                            </div>
                        </form>
                    </div>
                </div>
            </div >
        )
    }
}

export default connect(({ admin: { categories, exUser, user } }) => ({ categories, exUser, user }))(AddProduct)
