import React, { Component } from 'react'
import { connect } from 'react-redux';
import types from '../../../redux/types';
import langConfig, { langConcat } from '../../../lang.config';
import { translate } from '../../../utils/language'


class UpdateLivestream extends Component {
    constructor(props) {
        super(props);
        this.defaultState = {
            titleVN: '',
            titleEN: '',
            descriptionVN: '',
            descriptionEN: '',
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
                titleVN: this.props.onEdit.titles?.vn || this.props.onEdit.title,
                titleEN: this.props.onEdit.titles?.en,
                descriptionVN: this.props.onEdit.descriptions?.vn || this.props.onEdit.description,
                descriptionEN: this.props.onEdit.descriptions?.en,
                index: this.props.index,
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
        const { _id, titleVN, titleEN, descriptionVN, descriptionEN, link, embed, enabled, index } = this.state;
        const dataRequied = { titleVN, titleEN, descriptionVN, descriptionEN };
        if (embed) dataRequied.embed = embed;
        else dataRequied.link = link;
        const fieldError = Object.keys(dataRequied).find(field => !dataRequied[field]);

        if (fieldError) {
            this.setState({ fieldError, message: translate(langConfig.message.error.infomation) })
        }
        else {
            const { dispatch, handleClose, onRefresh } = this.props;
            const data = { _id, titleVN, titleEN, descriptionVN, descriptionEN, link, embed, enabled }
            if (index !== this.props.index) data.index = Number(index) + (Math.sign(index - this.props.index) - 1) / 2;
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
                                handleConfirm: () => { if (index !== this.props.index) onRefresh(); handleClose(); },
                                handleCancel: () => { if (index !== this.props.index) onRefresh(); handleClose(); }
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
        const { onEdit, handleClose, total } = this.props;
        const { dropActive, titleVN, titleEN, descriptionVN, descriptionEN, link, embed, enabled, fieldError, message, index } = this.state;
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
                                    <div className="col-md-6 nopadding-right">
                                        <div className={"form-group" + (fieldError === 'titleVN' ? " has-error" : "")}>
                                            <label htmlFor="edit-live-titleVN">{translate(langConfig.app.LivestreamTitle)} (VN)*</label>
                                            <input className="form-control" placeholder={translate(langConcat(langConfig.app.Enter, langConfig.app.LivestreamTitle))} required value={titleVN} id="edit-live-titleVN" name="titleVN" type="text" onChange={this.handleChange} />
                                            <div className="help-block with-errors">
                                                {fieldError === 'titleVN' && message ?
                                                    <ul className="list-unstyled">
                                                        <li>{message}.</li>
                                                    </ul>
                                                    : ""}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6 nopadding-left">
                                        <div className={"form-group" + (fieldError === 'titleEN' ? " has-error" : "")}>
                                            <label htmlFor="edit-live-titleEN">{translate(langConfig.app.LivestreamTitle)} (EN)*</label>
                                            <input className="form-control" placeholder={translate(langConcat(langConfig.app.Enter, langConfig.app.LivestreamTitle))} required value={titleEN} id="edit-live-titleEN" name="titleEN" type="text" onChange={this.handleChange} />
                                            <div className="help-block with-errors">
                                                {fieldError === 'titleEN' && message ?
                                                    <ul className="list-unstyled">
                                                        <li>{message}.</li>
                                                    </ul>
                                                    : ""}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className={"form-group" + (fieldError === 'descriptionVN' ? " has-error" : "")}>
                                    <label htmlFor="edit-live-descriptionVN">{translate(langConfig.resources.description)}* (VN)</label>
                                    <textarea className="form-control summernote" required rows={2} placeholder={translate(langConcat(langConfig.app.Enter, langConfig.resources.description))} value={descriptionVN} name="descriptionVN" cols={50} id="edit-live-descriptionVN" onChange={this.handleChange} />
                                    <div className="help-block with-errors">
                                        {fieldError === 'descriptionVN' && message ?
                                            <ul className="list-unstyled">
                                                <li>{message}.</li>
                                            </ul>
                                            : ""}
                                    </div>
                                </div>
                                <div className={"form-group" + (fieldError === 'descriptionEN' ? " has-error" : "")}>
                                    <label htmlFor="edit-live-descriptionEN">{translate(langConfig.resources.description)}* (EN)</label>
                                    <textarea className="form-control summernote" required rows={2} placeholder={translate(langConcat(langConfig.app.Enter, langConfig.resources.description))} value={descriptionEN} name="descriptionEN" cols={50} id="edit-live-descriptionEN" onChange={this.handleChange} />
                                    <div className="help-block with-errors">
                                        {fieldError === 'descriptionEN' && message ?
                                            <ul className="list-unstyled">
                                                <li>{message}.</li>
                                            </ul>
                                            : ""}
                                    </div>
                                </div>
                                <div className={"form-group" + (fieldError === 'embed' ? " has-error" : "")}>
                                    <label htmlFor="edit-live-embed">{translate(langConfig.app.EmbedCode)}</label>
                                    <textarea className="form-control summernote" rows={3} placeholder={translate(langConcat(langConfig.app.Enter, langConfig.app.EmbedCode))} value={embed} name="embed" cols={50} id="edit-live-embed" onChange={this.handleChange} />
                                    <div className="help-block with-errors">
                                        {fieldError === 'embed' && message ?
                                            <ul className="list-unstyled">
                                                <li>{message}.</li>
                                            </ul>
                                            : ""}
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6 nopadding-right">
                                        <div className={"form-group" + (fieldError === 'link' ? " has-error" : "")}>
                                            <label htmlFor="edit-live-link">{translate(langConfig.resources.link)}</label>
                                            <input className="form-control" placeholder={translate(langConfig.app.EmptyWithEmbedCode)} required value={link} id="edit-live-link" name="link" type="text" disabled={!!embed} onChange={this.handleChange} />
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
                                        <div className={"form-group" + (fieldError === 'enabled' ? " has-error" : "")}>
                                            <label htmlFor="edit-live-active">{translate(langConfig.app.Status)}*</label>
                                            <span className={"select2 select2-container select2-container--default" + (dropActive ? " select2-container--open" : "")} style={{ width: '100%' }}>
                                                <span className="selection" onClick={this.handleDropdown}>
                                                    <span className="select2-selection select2-selection--single"  >
                                                        <span className="select2-selection__rendered" id="edit-live-select2-active-container" title={translate(enabled ? langConfig.app.Active : langConfig.app.Inactive)}>
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
                                <div className="row">
                                    <div className="col-md-6 nopadding-right">
                                        <div className={"form-group" + (fieldError === 'index' ? " has-error" : "")}>
                                            <label htmlFor="edit-live-index">{translate(langConfig.app.Index)}*</label>
                                            <input
                                                className="form-control"
                                                placeholder={translate(langConcat(langConfig.app.Enter, langConfig.app.Index))}
                                                required
                                                value={index}
                                                id="edit-live-index"
                                                name="index"
                                                type="number"
                                                min={1}
                                                max={(total || 0) + 1}
                                                onChange={this.handleChange}
                                            />
                                            <div className="help-block with-errors">
                                                {fieldError === 'index' && message ?
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
