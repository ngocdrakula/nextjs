import React, { Component } from 'react'
import { connect } from 'react-redux';
import types from '../../../redux/types';
import langConfig, { langConcat } from '../../../lang.config';
import { translate } from '../../../utils/language'


class UpdateLivestream extends Component {
    constructor(props) {
        super(props);
        this.defaultState = {
            title: '',
            description: '',
            link: '',
            embed: '',
            enabled: true,
        }
        this.state = { ...this.defaultState };
    }
    componentDidUpdate(prevProps) {
        if (!prevProps.onEdit && this.props.onEdit?._id) {
            this.setState({
                ...this.props.onEdit,
                fieldError: null,
                message: ''
            })
        }
    }
    handleChange = e => {
        if (e.target.name === 'embed') {
            const embed = e.target.value;
            const array = embed.split('"');
            const index = array.findIndex(i => i.includes('src'));
            const link = array[index + 1] || '';
            this.setState({ [e.target.name]: e.target.value, link, fieldError: false })
        } else this.setState({ [e.target.name]: e.target.value, fieldError: false })
    }
    handleSubmit = e => {
        e.preventDefault();
        const { _id, title, description, link, embed, enabled } = this.state;
        const dataRequied = { title, description };
        if (embed) dataRequied.embed = embed;
        else dataRequied.link = link;
        const fieldError = Object.keys(dataRequied).find(field => !dataRequied[field]);

        if (fieldError) {
            this.setState({ fieldError, message: translate(langConfig.message.error.infomation) })
        }
        else {
            const { dispatch, handleClose } = this.props;
            const data = { _id, title, description, link, embed, enabled }
            dispatch({
                type: types.ADMIN_UPDATE_LIVESTREAM,
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
    handleDropdown = () => this.setState({ dropActive: !this.state.dropActive })
    handleSelectEnable = () => this.setState({ enabled: true, dropActive: false })
    handleSelectDisable = () => this.setState({ enabled: false, dropActive: false })
    render() {
        const { onEdit, handleClose } = this.props;
        const { dropActive, title, description, link, embed, enabled, fieldError, message } = this.state;
        return (
            <div id="vis-edit-myDynamicModal" className={"modal-create modal fade" + (onEdit ? " in" : "")} style={{ display: onEdit ? 'block' : 'none' }}>
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <form method="POST" action="/" id="vis-edit-form" onSubmit={this.handleSubmit} >
                            <div className="modal-header">
                                <button type="button" className="close" onClick={handleClose}>×</button>
                                {translate(langConcat(langConfig.app.Edit, langConfig.app.Livestream))}
                            </div>
                            <div className="modal-body">
                                <div className="row">
                                    <div className="col-md-8 nopadding-right">
                                        <div className={"form-group" + (fieldError === 'title' ? " has-error" : "")}>
                                            <label htmlFor="update-live-title">{translate(langConfig.app.Title)}*</label>
                                            <input className="form-control" placeholder="Nhập tên livestream" required value={title} id="update-live-title" name="title" type="text" onChange={this.handleChange} />
                                            <div className="help-block with-errors">
                                                {fieldError === 'title' && message ?
                                                    <ul className="list-unstyled">
                                                        <li>{message}.</li>
                                                    </ul>
                                                    : ""}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-4 nopadding-left">
                                        <div className={"form-group" + (fieldError === 'enabled' ? " has-error" : "")}>
                                            <label htmlFor="update-live-active">{translate(langConfig.app.Status)}*</label>
                                            <span className={"select2 select2-container select2-container--default" + (dropActive ? " select2-container--open" : "")} style={{ width: '100%' }}>
                                                <span className="selection" onClick={this.handleDropdown}>
                                                    <span className="select2-selection select2-selection--single"  >
                                                        <span className="select2-selection__rendered" id="update-live-select2-active-container" title={translate(enabled ? langConfig.app.Active : langConfig.app.Inactive)}>
                                                            {translate(enabled ? langConfig.app.Active : langConfig.app.Inactive)}
                                                        </span>
                                                        <span className="select2-selection__arrow" role="presentation">
                                                            <b role="presentation" />
                                                        </span>
                                                    </span>
                                                </span>
                                                <div className={"dropdown-select" + (dropActive ? " active" : "")}>
                                                    <div
                                                        className={"select-option-active" + (enabled ? " active" : "")}
                                                        onClick={this.handleSelectEnable}
                                                    >{translate(langConfig.app.Active)}</div>
                                                    <div
                                                        className={"select-option-active" + (!enabled ? " active" : "")}
                                                        onClick={this.handleSelectDisable}
                                                    >{translate(langConfig.app.Inactive)}</div>
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
                                <div className={"form-group" + (fieldError === 'description' ? " has-error" : "")}>
                                    <label htmlFor="update-live-description">{translate(langConfig.resources.description)}</label>
                                    <textarea className="form-control summernote" required rows={2} placeholder={translate(langConcat(langConfig.app.Enter, langConfig.resources.description))} value={description} name="description" cols={50} id="update-live-description" onChange={this.handleChange} />
                                    <div className="help-block with-errors">
                                        {fieldError === 'description' && message ?
                                            <ul className="list-unstyled">
                                                <li>{message}.</li>
                                            </ul>
                                            : ""}
                                    </div>
                                </div>
                                <div className={"form-group" + (fieldError === 'embed' ? " has-error" : "")}>
                                    <label htmlFor="update-live-embed">{translate(langConfig.app.EmbedCode)}</label>
                                    <textarea className="form-control summernote" rows={3} placeholder={translate(langConcat(langConfig.app.Enter, langConfig.app.EmbedCode))} value={description} value={embed} name="embed" cols={50} id="update-live-embed" onChange={this.handleChange} />
                                    <div className="help-block with-errors">
                                        {fieldError === 'embed' && message ?
                                            <ul className="list-unstyled">
                                                <li>{message}.</li>
                                            </ul>
                                            : ""}
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className={"form-group" + (fieldError === 'link' ? " has-error" : "")}>
                                            <label htmlFor="update-live-link">{translate(langConfig.resources.link)}</label>
                                            <input className="form-control" placeholder={translate(langConfig.app.EmptyWithEmbedCode)} required value={link} id="update-live-link" name="link" type="text" disabled={!!embed} onChange={this.handleChange} />
                                            <div className="help-block with-errors">
                                                {fieldError === 'link' && message ?
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
                                <input className="btn btn-flat btn-new" type="submit" value={translate(langConfig.app.Save)} />
                            </div>
                        </form>
                    </div>
                </div>
            </div >
        )
    }
}

export default connect(({ }) => ({}))(UpdateLivestream)
