import React, { Component } from 'react'
import { connect } from 'react-redux';
import types from '../../redux/types';
import { formatTime, MODE } from '../../utils/helper';


class UpdateTrade extends Component {
    constructor(props) {
        super(props);
        this.defaultState = {
            link: '',
            deadline: '',
            enabled: true,
            approved: false,
        }
        this.state = { ...this.defaultState };
    }
    componentDidUpdate(prevProps) {
        if (!prevProps.onEdit && this.props.onEdit?._id) {
            this.setState({
                ...this.props.onEdit,
                deadline: formatTime(this.props.onEdit.deadline, 'YYYY-MM-DDTHH:II'),
                fieldError: null,
                message: ''
            })
        }
    }
    handleChange = e => this.setState({ [e.target.name]: e.target.value, fieldError: false })
    handleSubmit = e => {
        e.preventDefault();
        const { _id, link, deadline, enabled, approved } = this.state;
        const dataRequied = { deadline }
        const fieldError = Object.keys(dataRequied).find(field => !dataRequied[field]);

        if (fieldError) {
            this.setState({ fieldError, message: 'Vui lòng điền đầy đủ thông tin' })
        }
        else {
            const { dispatch, handleClose } = this.props;
            const data = { _id, link, deadline, enabled, approved }
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
    handleDropdown = () => this.setState({ dropActive: !this.state.dropActive })
    handleSelectEnable = () => this.setState({ enabled: true, dropActive: false })
    handleSelectDisable = () => this.setState({ enabled: false, dropActive: false })

    handleDropdownApproved = () => this.setState({ dropApproved: !this.state.dropApproved })
    handleSelectApproved = () => this.setState({ approved: true, dropApproved: false })
    handleSelectNotApproved = () => this.setState({ approved: false, dropApproved: false })
    render() {
        const { onEdit, handleClose, user, exUser } = this.props;
        const { dropActive, dropApproved, link, deadline, approved, enabled, fieldError, message } = this.state;
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
                                        <div className="form-group">
                                            <label htmlFor="trade-edit-name">Thành viên giao thương 1*</label>
                                            <input className="form-control" readOnly value={onEdit?.leader.name} />
                                        </div>
                                    </div>
                                    <div className="col-md-6 nopadding-left">
                                        <div className="form-group">
                                            <label htmlFor="trade-edit-name">Thành viên giao thương 2*</label>
                                            <input className="form-control" readOnly value={onEdit?.member.name} />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6 nopadding-right">
                                        <div className={"form-group" + (fieldError === 'link' ? " has-error" : "")}>
                                            <label htmlFor="trade-edit-link">Link giao thương*</label>
                                            <input className="form-control" placeholder="Nhập link giao thương" value={link} id="trade-edit-link" name="link" type="text" onChange={this.handleChange} />
                                            <div className="help-block with-errors">
                                                {fieldError === 'link' && message ?
                                                    <ul className="list-unstyled">
                                                        <li>{message}.</li>
                                                    </ul>
                                                    : ""}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6 nopadding-left">
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
                                    <div className="col-md-6 nopadding-right">
                                        <div className={"form-group" + (fieldError === 'enabled' ? " has-error" : "")}>
                                            <label htmlFor="trade-edit-active">Trạng thái*</label>
                                            <span className={"select2 select2-container select2-container--default" + (dropActive ? " select2-container--open" : "")} style={{ width: '100%' }}>
                                                <span className="selection" onClick={this.handleDropdown}>
                                                    <span className="select2-selection select2-selection--single"  >
                                                        <span className="select2-selection__rendered" id="trade-edit-select2-active-container" title={enabled ? "Hoạt động" : "Không hoạt động"}>{enabled ? "Hoạt động" : "Không hoạt động"}</span>
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
                                    {user.mode === MODE.admin && !exUser ?
                                        <div className="col-md-6 nopadding-left">
                                            <div className={"form-group" + (fieldError === 'approved' ? " has-error" : "")}>
                                                <label htmlFor="add-vis-active">Trạng thái duyệt*</label>
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
                                        : ""}
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

export default connect(({ admin: { user, exUser } }) => ({ user, exUser }))(UpdateTrade)
