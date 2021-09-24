import React, { Component } from 'react'
import { connect } from 'react-redux';
import types from '../../redux/types';
import { formatTime, MODE } from '../../utils/helper';


class UpdateTrade extends Component {
    constructor(props) {
        super(props);
        this.defaultState = {
            content: '',
            deadline: '',
            fromName: '',
            fromEmail: '',
            toName: '',
            toEmail: '',
            approved: false,
            message: '',
        }
        this.state = { ...this.defaultState };
    }
    componentDidUpdate(prevProps) {
        const { onEdit, user } = this.props;
        if (!prevProps.onEdit && onEdit?._id) {
            const leader = user._id === onEdit.leader.user;
            this.setState({
                ...onEdit,
                fromName: leader ? onEdit.leader.name : onEdit.member.name,
                fromEmail: leader ? onEdit.leader.email : onEdit.member.email,
                toName: !leader ? onEdit.leader.name : onEdit.member.name,
                toEmail: !leader ? onEdit.leader.email : onEdit.member.email,
                deadline: formatTime(onEdit.deadline, 'YYYY-MM-DDTHH:II'),
                fieldError: null,
                message: ''
            })
        }
    }
    handleChange = e => this.setState({ [e.target.name]: e.target.value, fieldError: false })
    handleSubmit = e => {
        e.preventDefault();
        const { _id, content, deadline, approved, fromName, fromEmail, toName, toEmail } = this.state;
        const dataRequied = { deadline, fromName, fromEmail, toName, toEmail }
        const fieldError = Object.keys(dataRequied).find(field => !dataRequied[field]);
        if (fieldError) {
            this.setState({ fieldError, message: 'Vui lòng điền đầy đủ thông tin' })
        }
        else {
            const { dispatch, handleClose, onEdit, user } = this.props;
            const leader = user._id === onEdit?.leader.user;
            const data = {
                _id, content, deadline, approved,
                fromName: leader ? fromName : toName,
                fromEmail: leader ? fromEmail : toEmail,
                toName: !leader ? fromName : toName,
                toEmail: !leader ? fromEmail : toEmail
            }
            dispatch({
                type: types.ADMIN_UPDATE_TRADE,
                payload: data,
                callback: res => {
                    if (res?.success) {
                        dispatch({
                            type: types.SET_TOOLTIP,
                            payload: {
                                type: 'success',
                                title: 'Sửa lịch giao thương thành công',
                                message: 'Sửa lịch giao thương thành công',
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
                            message: res.data.message || "Vui lòng điền đầy đủ thông tin"
                        })
                    }
                }
            });
        }
    }
    handleDropdownApproved = () => this.setState({ dropApproved: !this.state.dropApproved })
    handleSelectApproved = () => this.setState({ approved: true, dropApproved: false })
    handleSelectNotApproved = () => this.setState({ approved: false, dropApproved: false })

    render() {
        const { onEdit, handleClose, user, exUser } = this.props;
        const { dropApproved, fieldError, message } = this.state;
        const { content, deadline, approved, fromName, fromEmail, toName, toEmail } = this.state;
        return (
            <div id="trade-edit-myDynamicModal" className={"modal-create modal fade" + (onEdit ? " in" : "")} style={{ display: onEdit ? 'block' : 'none' }}>
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <form method="POST" action="/" id="trade-edit-form" onSubmit={this.handleSubmit}>
                            <div className="modal-header">
                                <button type="button" className="close" onClick={handleClose}>×</button>
                                Sửa lịch giao thương
                            </div>
                            <div className="modal-body">
                                <div className="row">
                                    <div className="col-md-6 nopadding-right">
                                        <div className={"form-group" + (fieldError === 'fromName' ? " has-error" : "")}>
                                            <label htmlFor="trade-edit-fromName">Tên của bạn*</label>
                                            <input className="form-control" placeholder="Nhập tên của bạn" value={fromName} id="trade-edit-fromName" name="fromName" type="text" onChange={this.handleChange} />
                                            <div className="help-block with-errors">
                                                {fieldError === 'fromName' && message ?
                                                    <ul className="list-unstyled">
                                                        <li>{message}.</li>
                                                    </ul>
                                                    : ""}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6 nopadding-left">
                                        <div className={"form-group" + (fieldError === 'fromEmail' ? " has-error" : "")}>
                                            <label htmlFor="trade-edit-fromEmail">Email của bạn*</label>
                                            <input className="form-control" placeholder="Nhập email của bạn" value={fromEmail} id="trade-edit-fromEmail" name="fromEmail" type="text" onChange={this.handleChange} />
                                            <div className="help-block with-errors">
                                                {fieldError === 'fromEmail' && message ?
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
                                        <div className={"form-group" + (fieldError === 'toName' ? " has-error" : "")}>
                                            <label htmlFor="trade-edit-toName">Tên đối tác*</label>
                                            <input className="form-control" placeholder="Nhập tên đối tác" value={toName} id="trade-edit-toName" name="toName" type="text" onChange={this.handleChange} />
                                            <div className="help-block with-errors">
                                                {fieldError === 'toName' && message ?
                                                    <ul className="list-unstyled">
                                                        <li>{message}.</li>
                                                    </ul>
                                                    : ""}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6 nopadding-left">
                                        <div className={"form-group" + (fieldError === 'toEmail' ? " has-error" : "")}>
                                            <label htmlFor="trade-edit-toEmail">Email đối tác*</label>
                                            <input className="form-control" placeholder="Nhập email đối tác" value={toEmail} id="trade-edit-toEmail" name="toEmail" type="text" onChange={this.handleChange} />
                                            <div className="help-block with-errors">
                                                {fieldError === 'toEmail' && message ?
                                                    <ul className="list-unstyled">
                                                        <li>{message}.</li>
                                                    </ul>
                                                    : ""}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className={"form-group" + (fieldError === 'deadline' ? " has-error" : "")}>
                                            <label htmlFor="trade-edit-deadline">Thời gian giao thương*</label>
                                            <input className="form-control" placeholder="Nhập thời gian giao thương" required value={deadline} id="trade-edit-deadline" name="deadline" type="datetime-local" onChange={this.handleChange} />
                                            <div className="help-block with-errors">
                                                {fieldError === 'deadline' && message ?
                                                    <ul className="list-unstyled">
                                                        <li>{message}.</li>
                                                    </ul>
                                                    : ""}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className={"form-group" + (fieldError === 'content' ? " has-error" : "")}>
                                            <label htmlFor="trade-edit-content">Nội dung*</label>
                                            <textarea rows={3} className="form-control" placeholder="Nhập nội dung giao thương" value={content} id="trade-edit-content" name="content" type="text" onChange={this.handleChange} />
                                            <div className="help-block with-errors">
                                                {fieldError === 'content' && message ?
                                                    <ul className="list-unstyled">
                                                        <li>{message}.</li>
                                                    </ul>
                                                    : ""}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {user.mode === MODE.admin && !exUser ?
                                    <div className="row">
                                        <div className="col-md-12">
                                            <div className={"form-group" + (fieldError === 'approved' ? " has-error" : "")}>
                                                <label htmlFor="add-vis-active">Trạng thái</label>
                                                <span className={"select2 select2-container select2-container--default" + (dropApproved ? " select2-container--open" : "")} style={{ width: '100%' }}>
                                                    <span className="selection" onClick={this.handleDropdownApproved}>
                                                        <span className="select2-selection select2-selection--single"  >
                                                            <span className="select2-selection__rendered" id="add-vis-select2-active-container" title={approved ? "Đã duyệt" : "Chưa duyệt"}>{approved ? "Đã duyệt" : "Chưa duyệt"}</span>
                                                            <span className="select2-selection__arrow" role="presentation">
                                                                <b role="presentation" />
                                                            </span>
                                                        </span>
                                                    </span>
                                                    <div className={"dropdown-select" + (dropApproved ? " active" : "")}>
                                                        <div
                                                            className={"select-option-active" + (approved ? " active" : "")}
                                                            onClick={this.handleSelectApproved}
                                                        >Đã duyệt</div>
                                                        <div
                                                            className={"select-option-active" + (!approved ? " active" : "")}
                                                            onClick={this.handleSelectNotApproved}
                                                        >Chưa duyệt</div>
                                                    </div>
                                                </span>
                                                <div className="help-block with-errors" >
                                                    {fieldError === 'approved' && message ?
                                                        <ul className="list-unstyled">
                                                            <li>{message}.</li>
                                                        </ul>
                                                        : ""}
                                                </div>
                                            </div>
                                        </div>
                                    </div> :
                                    ""}
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

export default connect(({ admin: { user, exUser } }) => ({ user, exUser }))(UpdateTrade)
