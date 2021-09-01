import React, { Component } from 'react'
import { connect } from 'react-redux';
import types from '../../../redux/types';
import { createFormData, MODE } from '../../../utils/helper';


class UpdateContact extends Component {
    constructor(props) {
        super(props);
        this.defaultState = {
            email: '',
            title: '',
            name: '',
            message: '',
            read: true,
        }
        this.state = { ...this.defaultState };
    }
    componentDidUpdate(prevProps) {
        if (!prevProps.onEdit && this.props.onEdit?._id) {
            this.setState({
                ...this.props.onEdit,
                fieldError: null,
                messageError: ''
            })
        }
    }
    handleChange = e => this.setState({ [e.target.name]: e.target.value, fieldError: false })
    handleSubmit = e => {
        e.preventDefault();
        const { _id, email, name, title, message, read } = this.state;
        const dataRequied = { email, name, title, message }
        const fieldError = Object.keys(dataRequied).find(field => !dataRequied[field]);
        if (fieldError) {
            this.setState({ fieldError, messageError: 'Vui lòng điền đầy đủ thông tin' })
        }
        else {
            const { dispatch, handleClose } = this.props;
            dispatch({
                type: types.ADMIN_UPDATE_CONTACT,
                payload: { _id, email, name, title, message, read },
                callback: res => {
                    if (res?.success) {
                        dispatch({
                            type: types.SET_TOOLTIP,
                            payload: {
                                type: 'success',
                                title: 'Sửa tin nhắn liên hệ thành công',
                                messageError: 'Sửa tin nhắn liên hệ thành công',
                                confirm: 'Chấp nhận',
                                cancel: 'Đóng',
                                handleConfirm: handleClose,
                                handleCancel: handleClose
                            },
                        });
                    }
                    else if (res?.data) {
                        this.setState({
                            fieldError: res.data.field,
                            messageError: res.data.messageError || "Vui lòng điền đầy đủ thông tin"
                        })
                    }
                }
            });
        }
    }
    handleDropdown = () => this.setState({ dropActive: !this.state.dropActive })
    handleSelectEnable = () => this.setState({ read: true, dropActive: false })
    handleSelectDisable = () => this.setState({ read: false, dropActive: false })

    render() {
        const { onEdit, handleClose } = this.props;
        const { dropActive, email, name, title, message, read, fieldError, messageError } = this.state;
        return (
            <div id="ct-edit-myDynamicModal" className={"modal-create modal fade" + (onEdit ? " in" : "")} style={{ display: onEdit ? 'block' : 'none' }}>
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <form method="POST" action="/" id="ct-edit-form" onSubmit={this.handleSubmit} >
                            <div className="modal-header">
                                <button type="button" className="close" onClick={handleClose}>×</button>
                                Sửa nhà trưng bày
                            </div>
                            <div className="modal-body">
                                <div className="row">
                                    <div className="col-md-8 nopadding-right">
                                        <div className={"form-group" + (fieldError === 'title' ? " has-error" : "")}>
                                            <label htmlFor="ct-edit-title">Chủ đề</label>
                                            <input className="form-control" placeholder="Enter Full Name" required value={title} id="ct-edit-title" title="title" type="text" onChange={this.handleChange} />
                                            <div className="help-block with-errors">
                                                {fieldError === 'title' && messageError ?
                                                    <ul className="list-unstyled">
                                                        <li>{messageError}.</li>
                                                    </ul>
                                                    : ""}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-4 nopadding-left">
                                        <div className={"form-group" + (fieldError === 'read' ? " has-error" : "")}>
                                            <label htmlFor="ct-edit-active">Trạng thái*</label>
                                            <span className={"select2 select2-container select2-container--default" + (dropActive ? " select2-container--open" : "")} style={{ width: '100%' }}>
                                                <span className="selection" onClick={this.handleDropdown}>
                                                    <span className="select2-selection select2-selection--single"  >
                                                        <span className="select2-selection__rendered" id="ct-edit-select2-active-container" title={read ? "Đã đọc" : "Chưa đọc"}>{read ? "Đã đọc" : "Chưa đọc"}</span>
                                                        <span className="select2-selection__arrow" role="presentation">
                                                            <b role="presentation" />
                                                        </span>
                                                    </span>
                                                </span>
                                                <div className={"dropdown-select" + (dropActive ? " active" : "")}>
                                                    <div
                                                        className={"select-option-active" + (read ? " active" : "")}
                                                        onClick={this.handleSelectEnable}
                                                    >Đã đọc</div>
                                                    <div
                                                        className={"select-option-active" + (!read ? " active" : "")}
                                                        onClick={this.handleSelectDisable}
                                                    >Chưa đọc</div>
                                                </div>
                                            </span>
                                            <div className="help-block with-errors" >
                                                {fieldError === 'read' && messageError ?
                                                    <ul className="list-unstyled">
                                                        <li>{messageError}.</li>
                                                    </ul>
                                                    : ""}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6 nopadding-right">
                                        <div className={"form-group" + (fieldError === 'email' ? " has-error" : "")}>
                                            <label htmlFor="ct-edit-email">Email*</label>
                                            <input className="form-control" placeholder="Nhập email đăng ký" required value={email} name="email" id="ct-edit-email" type="email" onChange={this.handleChange} />
                                            <div className="help-block with-errors" >
                                                {fieldError === 'email' && messageError ?
                                                    <ul className="list-unstyled">
                                                        <li>{messageError}.</li>
                                                    </ul>
                                                    : ""}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6 nopadding-left">
                                        <div className={"form-group" + (fieldError === 'name' ? " has-error" : "")}>
                                            <label htmlFor="ct-edit-name">Tên</label>
                                            <input className="form-control" placeholder="Enter Full Name" required value={name} id="ct-edit-name" name="name" type="text" onChange={this.handleChange} />
                                            <div className="help-block with-errors">
                                                {fieldError === 'name' && messageError ?
                                                    <ul className="list-unstyled">
                                                        <li>{messageError}.</li>
                                                    </ul>
                                                    : ""}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className={"form-group" + (fieldError === 'message' ? " has-error" : "")}>
                                    <label htmlFor="ct-edit-message">Nội dung tin nhắn</label>
                                    <textarea className="form-control summernote" rows={5} placeholder="Thông tin liên hệ khác của nhà trưng bày" value={message} name="message" cols={50} id="ct-edit-message" onChange={this.handleChange} />
                                    <div className="help-block with-errors">
                                        {fieldError === 'message' && messageError ?
                                            <ul className="list-unstyled">
                                                <li>{messageError}.</li>
                                            </ul>
                                            : ""}
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <input className="btn btn-flat btn-new" type="submit" value="Lưu" />
                            </div>
                        </form>
                    </div>
                </div>
            </div >
        )
    }
}

export default connect(({ }) => ({}))(UpdateContact)
