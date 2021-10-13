import React, { Component } from 'react'
import { connect } from 'react-redux';
import langConfig, { langConcat } from '../../lang.config';
import types from '../../redux/types';
import { formatTime, MODE } from '../../utils/helper';
import { translate } from '../../utils/language';


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
            this.setState({ fieldError, message: translate(langConfig.message.error.infomation) })
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
                                title: translate(langConfig.message.success.updated),
                                message: translate(langConfig.app.Updated),
                                confirm: translate(langConfig.app.Accept),
                                cancel: translate(langConfig.app.Close),
                                handleConfirm: handleClose,
                                handleCancel: handleClose
                            },
                        });
                    }
                    else if (res?.data) {
                        this.setState({
                            fieldError: res.data.field,
                            message: translate(res.data.messages || langConfig.message.error.infomation)
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
                                {translate(langConcat(langConfig.app.Edit, langConfig.app.TradeCalendar))}
                            </div>
                            <div className="modal-body">
                                <div className="row">
                                    <div className="col-md-6 nopadding-right">
                                        <div className={"form-group" + (fieldError === 'fromName' ? " has-error" : "")}>
                                            <label htmlFor="trade-edit-fromName">{translate(langConfig.app.YourName)}*</label>
                                            <input className="form-control" placeholder={translate(langConcat(langConfig.app.Enter, langConfig.app.YourName))} value={fromName} id="trade-edit-fromName" name="fromName" type="text" onChange={this.handleChange} />
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
                                            <label htmlFor="trade-edit-fromEmail">{translate(langConfig.app.YourEmail)}*</label>
                                            <input className="form-control" placeholder={translate(langConcat(langConfig.app.Enter, langConfig.app.YourEmail))} value={fromEmail} id="trade-edit-fromEmail" name="fromEmail" type="text" onChange={this.handleChange} />
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
                                            <label htmlFor="trade-edit-toName">{translate(langConfig.app.PartnerName)}*</label>
                                            <input className="form-control" placeholder={translate(langConcat(langConfig.app.Enter, langConfig.app.PartnerName))} value={toName} id="trade-edit-toName" name="toName" type="text" onChange={this.handleChange} />
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
                                            <label htmlFor="trade-edit-toEmail">{translate(langConfig.app.PartnerEmail)}*</label>
                                            <input className="form-control" placeholder={translate(langConcat(langConfig.app.Enter, langConfig.app.PartnerEmail))} value={toEmail} id="trade-edit-toEmail" name="toEmail" type="text" onChange={this.handleChange} />
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
                                            <label htmlFor="trade-edit-deadline">{translate(langConfig.app.TradeTime)}*</label>
                                            <input className="form-control" placeholder={translate(langConcat(langConfig.app.Enter, langConfig.app.TradeTime))} required value={deadline} id="trade-edit-deadline" name="deadline" type="datetime-local" onChange={this.handleChange} />
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
                                            <label htmlFor="trade-edit-content">{translate(langConfig.app.Content)}*</label>
                                            <textarea rows={3} className="form-control" placeholder={translate(langConcat(langConfig.app.Enter, langConfig.app.Content))} value={content} id="trade-edit-content" name="content" type="text" onChange={this.handleChange} />
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
                                                <label htmlFor="add-vis-active">{translate(langConfig.app.Status)}</label>
                                                <span className={"select2 select2-container select2-container--default" + (dropApproved ? " select2-container--open" : "")} style={{ width: '100%' }}>
                                                    <span className="selection" onClick={this.handleDropdownApproved}>
                                                        <span className="select2-selection select2-selection--single"  >
                                                            <span className="select2-selection__rendered" id="add-vis-select2-active-container" title={translate(approved ? langConfig.app.Approved : langConfig.app.NotApproved)}>
                                                                {translate(approved ? langConfig.app.Approved : langConfig.app.NotApproved)}
                                                            </span>
                                                            <span className="select2-selection__arrow" role="presentation">
                                                                <b role="presentation" />
                                                            </span>
                                                        </span>
                                                    </span>
                                                    <div className={"dropdown-select" + (dropApproved ? " active" : "")}>
                                                        <div
                                                            className={"select-option-active" + (approved ? " active" : "")}
                                                            onClick={this.handleSelectApproved}
                                                        >{translate(langConfig.app.Approved)}</div>
                                                        <div
                                                            className={"select-option-active" + (!approved ? " active" : "")}
                                                            onClick={this.handleSelectNotApproved}
                                                        >{translate(langConfig.app.NotApproved)}</div>
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
                                <input className="btn btn-flat btn-new" type="submit" value={translate(langConfig.app.Save)} />
                            </div>
                        </form>
                    </div>
                </div>
            </div >
        )
    }
}

export default connect(({ admin: { user, exUser } }) => ({ user, exUser }))(UpdateTrade)
