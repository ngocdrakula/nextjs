import React, { Component } from 'react'
import { connect } from 'react-redux';
import types from '../../../redux/types';
import langConfig, { langConcat } from '../../../lang.config';
import { translate } from '../../../utils/language'


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
            this.setState({ fieldError, messageError: translate(langConfig.message.error.infomation) })
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
                                {translate(langConfig.app.EditContact)}
                            </div>
                            <div className="modal-body">
                                <div className="row">
                                    <div className="col-md-8 nopadding-right">
                                        <div className={"form-group" + (fieldError === 'title' ? " has-error" : "")}>
                                            <label htmlFor="ct-edit-title">{translate(langConfig.app.Subject)}</label>
                                            <input className="form-control" placeholder={translate(langConcat(langConfig.app.Enter, langConfig.app.Subject))} required value={title} id="ct-edit-title" title="title" type="text" onChange={this.handleChange} />
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
                                            <label htmlFor="ct-edit-active">{translate(langConfig.app.Status)}*</label>
                                            <span className={"select2 select2-container select2-container--default" + (dropActive ? " select2-container--open" : "")} style={{ width: '100%' }}>
                                                <span className="selection" onClick={this.handleDropdown}>
                                                    <span className="select2-selection select2-selection--single"  >
                                                        <span className="select2-selection__rendered" id="ct-edit-select2-active-container" title={translate(read ? langConfig.app.Read : langConfig.app.Unread)}>
                                                            {translate(read ? langConfig.app.Read : langConfig.app.Unread)}
                                                        </span>
                                                        <span className="select2-selection__arrow" role="presentation">
                                                            <b role="presentation" />
                                                        </span>
                                                    </span>
                                                </span>
                                                <div className={"dropdown-select" + (dropActive ? " active" : "")}>
                                                    <div
                                                        className={"select-option-active" + (read ? " active" : "")}
                                                        onClick={this.handleSelectEnable}
                                                    >{translate(langConfig.app.Read)}</div>
                                                    <div
                                                        className={"select-option-active" + (!read ? " active" : "")}
                                                        onClick={this.handleSelectDisable}
                                                    >{translate(langConfig.app.Unread)}</div>
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
                                            <label htmlFor="ct-edit-email">{translate(langConfig.app.Email)}*</label>
                                            <input className="form-control"
                                                placeholder={translate(langConcat(langConfig.app.Enter, langConfig.app.Email))}
                                                required
                                                value={email}
                                                name="email"
                                                id="ct-edit-email"
                                                type="email"
                                                onChange={this.handleChange}
                                            />
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
                                            <label htmlFor="ct-edit-name">{translate(langConfig.app.FullName)}</label>
                                            <input
                                                className="form-control"
                                                placeholder={translate(langConcat(langConfig.app.Enter, langConfig.app.FullName))}
                                                required
                                                value={name}
                                                id="ct-edit-name"
                                                name="name"
                                                type="text"
                                                onChange={this.handleChange}
                                            />
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
                                    <label htmlFor="ct-edit-message">{translate(langConfig.app.Content)}</label>
                                    <textarea
                                        className="form-control summernote"
                                        placeholder={translate(langConcat(langConfig.app.Enter, langConfig.app.Content))}
                                        value={message}
                                        name="message"
                                        rows={5}
                                        cols={50}
                                        id="ct-edit-message"
                                        onChange={this.handleChange}
                                    />
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
                                <input className="btn btn-flat btn-new" type="submit" value={translate(langConfig.app.Save)} />
                            </div>
                        </form>
                    </div>
                </div>
            </div >
        )
    }
}

export default connect(({ }) => ({}))(UpdateContact)
