import React, { Component } from 'react'
import { connect } from 'react-redux';
import types from '../../../redux/types';
import { createFormData, MODE } from '../../../utils/helper';
import TextEditor from '../../TextEditor';
import { translate } from '../../../utils/language';
import langConfig, { langConcat } from '../../../lang.config';


class UpdateProduct extends Component {
    constructor(props) {
        super(props);
        this.defaultState = {
            name: '',
            description: '',
            enabled: true,
        }
        this.state = { ...this.defaultState };
    }
    componentDidUpdate(prevProps) {
        if (!prevProps.onEdit && this.props.onEdit?._id) {
            this.setState({
                ...this.props.onEdit,
                files: null,
                fieldError: null,
                message: ''
            })
        }
    }
    handleChange = e => this.setState({ [e.target.name]: e.target.value, fieldError: false })
    handleSubmit = e => {
        e.preventDefault();
        const { _id, name, description, enabled, category, files } = this.state;
        const { categories } = this.props;
        const categoryId = categories.find(c => c._id === category) ? category : categories[0]?._id;
        if (!name) {
            this.setState({ fieldError: 'name', message: translate(langConcat(langConfig.resources.productName, langConfig.message.error.validation.required)) })
        } else if (!categoryId) {
            this.setState({ fieldError: 'category', message: translate(langConfig.app.PleaseAddCategory) })
        } else if (!description) {
            this.setState({ fieldError: 'description', message: translate(langConcat(langConfig.resources.description, langConfig.message.error.validation.required)) })
        } else {
            const { dispatch, handleClose } = this.props;
            const data = { _id, name, categoryId, description, enabled }
            if (files?.length) data.files = files;
            const formData = createFormData(data);
            dispatch({
                type: types.ADMIN_UPDATE_PRODUCT,
                payload: { _id, formData },
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
    handleDropdownCategory = () => this.setState({ dropCategory: !this.state.dropCategory })

    handleChooseFiles = e => {
        this.setState({ files: e.target.files })
    }

    render() {
        const { onEdit, handleClose, categories } = this.props;
        const { dropActive, name, description, enabled, category, image, dropCategory, fieldError, message, files } = this.state;
        const categorySelected = categories.find(i => i._id === category) || categories[0] || {};
        return (
            <div id="edit-pro-myDynamicModal" className={"modal-create modal fade" + (onEdit ? " in" : "")} style={{ display: onEdit ? 'block' : 'none' }}>
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <form method="POST" action="/" id="edit-pro-form" onSubmit={this.handleSubmit} >
                            <div className="modal-header">
                                <button type="button" className="close" onClick={handleClose}>×</button>
                                {translate(langConcat(langConfig.app.Edit, langConfig.app.Product))}
                            </div>
                            <div className="modal-body">
                                <div className="row">
                                    <div className="col-md-8 nopadding-right">
                                        <div className={"form-group" + (fieldError === 'name' ? " has-error" : "")}>
                                            <label htmlFor="edit-pro-name">{translate(langConfig.resources.productName)}*</label>
                                            <input className="form-control" placeholder={translate(langConcat(langConfig.app.Edit, langConfig.resources.productName))} required value={name} id="edit-pro-name" name="name" type="text" onChange={this.handleChange} />
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
                                            <label htmlFor="edit-pro-active">{translate(langConfig.app.Status)}*</label>
                                            <span className={"select2 select2-container select2-container--default" + (dropActive ? " select2-container--open" : "")} style={{ width: '100%' }}>
                                                <span className="selection" onClick={this.handleDropdown}>
                                                    <span className="select2-selection select2-selection--single"  >
                                                        <span className="select2-selection__rendered" id="edit-pro-select2-active-container" title={translate(enabled ? langConfig.app.Active : langConfig.app.Inactive)}>
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
                                        <div className={"form-group" + (fieldError === 'category' ? " has-error" : "")}>
                                            <label htmlFor="edit-pro-active">{translate(langConfig.resources.category)}*</label>
                                            <span className={"select2 select2-container select2-container--default" + (dropCategory ? " select2-container--open" : "")} style={{ width: '100%' }}>
                                                <span className="selection" onClick={this.handleDropdownCategory}>
                                                    <span className="select2-selection select2-selection--single"  >
                                                        <span className="select2-selection__rendered" id="edit-pro-select2-active-container" title={categorySelected.name}>{categorySelected.name}</span>
                                                        <span className="select2-selection__arrow" role="presentation">
                                                            <b role="presentation" />
                                                        </span>
                                                    </span>
                                                </span>
                                                <div className={"dropdown-select" + (dropCategory ? " active" : "")}>
                                                    {categories.map(category => {
                                                        return (
                                                            <div key={category._id}
                                                                className={"select-option-active" + (category === category._id ? " active" : "")}
                                                                onClick={() => this.setState({ category: category._id, dropCategory: false })}
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
                                    <label htmlFor="edit-pro-description">{translate(langConfig.resources.description)}</label>
                                    <TextEditor
                                        className="form-control summernote"
                                        placeholder={translate(langConcat(langConfig.app.Enter, langConfig.resources.description))}
                                        value={description}
                                        name="description"
                                        id="edit-pro-description"
                                        onChange={this.handleChange}
                                    />
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
                                            <label htmlFor="edit-pro-uploadBtn" className="with-help">{translate(langConfig.resources.productImage)}</label>
                                            <label htmlFor="vis-edit-uploadBtn">
                                                {image ?
                                                    <img src={"/api/images/" + image} alt={translate(langConfig.resources.productImage)} style={{ width: 'auto', maxWidth: 100, height: 'auto', maxHeight: 100 }} />
                                                    :
                                                    <img src="/images/no-avatar.png" alt={translate(langConfig.resources.productImage)} style={{ width: 'auto', maxWidth: 100, height: 'auto', maxHeight: 100 }} />
                                                }
                                            </label>
                                            <div className="row">
                                                <div className="col-md-9 nopadding-right">
                                                    <input id="edit-pro-uploadFile" placeholder={translate(files?.length ? langConfig.app.OneFileSelected : langConfig.resources.productImage)} className="form-control" style={{ height: 28 }} disabled="disabled" />
                                                    <div className="help-block with-errors">{translate(langConfig.app.MinSize300X300)}</div>
                                                </div>
                                                <div className="col-md-3 nopadding-left">
                                                    <div className="fileUpload btn btn-primary btn-block btn-flat">
                                                        <span>{translate(langConfig.app.UploadAvatar)}</span>
                                                        <input type="file" name="ex-avatar" id="edit-pro-uploadBtn" className="upload" onChange={this.handleChooseFiles} />
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
                                <input className="btn btn-flat btn-new" type="submit" value={translate(langConfig.app.Save)} />
                            </div>
                        </form>
                    </div>
                </div>
            </div >
        )
    }
}

export default connect(({ admin: { categories } }) => ({ categories }))(UpdateProduct)
