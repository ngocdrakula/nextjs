import React, { Component } from 'react'
import { connect } from 'react-redux';
import langConfig, { langConcat } from '../../../lang.config';
import types from '../../../redux/types';
import { createFormData, MODE } from '../../../utils/helper';
import { translate } from '../../../utils/language';
import TextEditor from '../../TextEditor';


class AddProduct extends Component {
    constructor(props) {
        super(props);
        this.defaultState = {
            nameVN: '',
            nameEN: '',
            enabled: true,
            index: 1,
            fieldError: null,
            message: '',
            descriptionVN: '',
            descriptionEN: '',
            key: 0,
            files: null
        }
        this.state = { ...this.defaultState };
    }
    componentDidUpdate(prevProps) {
        if (!prevProps.onAdd && this.props.onAdd) {
            this.setState({ ...this.defaultState, key: this.state.key + 1, index: 1 })
        }
    }
    handleChange = e => this.setState({ [e.target.name]: e.target.value, fieldError: false })
    handleSubmit = e => {
        e.preventDefault();
        const { nameVN, nameEN, enabled, selected, files, descriptionVN, descriptionEN, index } = this.state;
        const { categories, user, exUser } = this.props;
        const categoryId = selected || categories[0]?._id;
        if (!nameVN || !nameEN) {
            this.setState({ fieldError: !nameVN ? 'nameVN' : 'nameEN', message: translate(langConcat(langConfig.resources.productName, langConfig.message.error.validation.required)) })
        } else if (!categoryId) {
            this.setState({ fieldError: 'category', message: translate(langConfig.app.PleaseAddCategory) })
        } else if (!descriptionVN || !descriptionEN) {
            this.setState({ fieldError: !descriptionVN ? 'descriptionVN' : 'descriptionEN', message: translate(langConcat(langConfig.resources.description, langConfig.message.error.validation.required)) })
        } else if (!files?.length) {
            this.setState({ fieldError: 'files', message: translate(langConcat(langConfig.resources.productImage, langConfig.message.error.validation.required)) })
        } else {
            const { dispatch, onAdded } = this.props;
            const data = { nameVN, nameEN, enabled, categoryId, files, descriptionVN, descriptionEN, index: Number(index) - 1 || 0 };
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
                                title: translate(langConfig.message.success.created),
                                message: translate(langConfig.app.AddAnotherProduct),
                                confirm: translate(langConfig.app.Add),
                                cancel: translate(langConfig.app.Close),
                                handleConfirm: () => { this.setState({ ...this.defaultState, key: this.state.key + 1 }); onAdded(); },
                                handleCancel: () => { onAdded(); this.props.handleClose(); }
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
    handleDropdownCategory = () => this.setState({ dropCategory: !this.state.dropCategory, fieldError: null })

    handleChooseFiles = e => {
        this.setState({ files: e.target.files, fieldError: null })
    }


    render() {
        const { onAdd, handleClose, categories, total } = this.props;
        const { dropActive, nameVN, nameEN, descriptionVN, descriptionEN, enabled, selected, dropCategory, fieldError, message, files, key, index } = this.state;
        const categorySelected = categories.find(i => i._id === selected) || categories[0] || {};
        return (
            <div id="add-pro-myDynamicModal" className={"modal-create modal fade" + (onAdd ? " in" : "")} style={{ display: onAdd ? 'block' : 'none' }}>
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <form method="POST" action="/" id="add-pro-form" onSubmit={this.handleSubmit} >
                            <div className="modal-header">
                                <button type="button" className="close" onClick={handleClose}>??</button>
                                {translate(langConcat(langConfig.app.Add, langConfig.app.Product))}
                            </div>
                            <div className="modal-body">
                                <div className="row">
                                    <div className="col-md-6 nopadding-right">
                                        <div className={"form-group" + (fieldError === 'nameVN' ? " has-error" : "")}>
                                            <label htmlFor="add-pro-nameVN">{translate(langConfig.resources.productName)} (VN)*</label>
                                            <input className="form-control" placeholder={translate(langConcat(langConfig.app.Enter, langConfig.resources.productName))} required value={nameVN} id="add-pro-nameVN" name="nameVN" type="text" onChange={this.handleChange} />
                                            <div className="help-block with-errors">
                                                {fieldError === 'nameVN' && message ?
                                                    <ul className="list-unstyled">
                                                        <li>{message}.</li>
                                                    </ul>
                                                    : ""}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6 nopadding-left">
                                        <div className={"form-group" + (fieldError === 'nameEN' ? " has-error" : "")}>
                                            <label htmlFor="add-pro-nameEN">{translate(langConfig.resources.productName)} (EN)*</label>
                                            <input className="form-control" placeholder={translate(langConcat(langConfig.app.Enter, langConfig.resources.productName))} required value={nameEN} id="add-pro-nameEN" name="nameEN" type="text" onChange={this.handleChange} />
                                            <div className="help-block with-errors">
                                                {fieldError === 'nameEN' && message ?
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
                                            <label htmlFor="add-pro-active">{translate(langConfig.resources.category)}*</label>
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
                                    <div className="col-md-6 nopadding-left">
                                        <div className={"form-group" + (fieldError === 'enabled' ? " has-error" : "")}>
                                            <label htmlFor="add-pro-active">{translate(langConfig.app.Status)}*</label>
                                            <span className={"select2 select2-container select2-container--default" + (dropActive ? " select2-container--open" : "")} style={{ width: '100%' }}>
                                                <span className="selection" onClick={this.handleDropdown}>
                                                    <span className="select2-selection select2-selection--single"  >
                                                        <span className="select2-selection__rendered" id="add-pro-select2-active-container" title={translate(enabled ? langConfig.app.Active : langConfig.app.Inactive)}>
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
                                <div className={"form-group" + (fieldError === 'descriptionVN' ? " has-error" : "")}>
                                    <label htmlFor="add-pro-descriptionVN">{translate(langConfig.resources.description)} (VN)</label>
                                    <TextEditor
                                        key={"descriptionVN" + key}
                                        className="form-control summernote"
                                        placeholder={translate(langConcat(langConfig.app.Enter, langConfig.resources.description)) + " (VN)"}
                                        value={descriptionVN}
                                        name="descriptionVN"
                                        id="add-pro-descriptionVN"
                                        onChange={this.handleChange}
                                    />
                                    <div className="help-block with-errors">
                                        {fieldError === 'descriptionVN' && message ?
                                            <ul className="list-unstyled">
                                                <li>{message}.</li>
                                            </ul>
                                            : ""}
                                    </div>
                                </div>
                                <div className={"form-group" + (fieldError === 'descriptionEN' ? " has-error" : "")}>
                                    <label htmlFor="add-pro-descriptionEN">{translate(langConfig.resources.description)} (EN)</label>
                                    <TextEditor
                                        key={"descriptionEN" + key}
                                        className="form-control summernote"
                                        placeholder={translate(langConcat(langConfig.app.Enter, langConfig.resources.description)) + " (EN)"}
                                        value={descriptionEN}
                                        name="descriptionEN"
                                        id="add-pro-descriptionEN"
                                        onChange={this.handleChange}
                                        row
                                    />
                                    <div className="help-block with-errors">
                                        {fieldError === 'descriptionEN' && message ?
                                            <ul className="list-unstyled">
                                                <li>{message}.</li>
                                            </ul>
                                            : ""}
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className={"form-group" + (fieldError === 'files' ? " has-error" : "")}>
                                            <label htmlFor="add-pro-uploadBtn" className="with-help">{translate(langConfig.resources.productImage)}</label>
                                            <div className="row">
                                                <div className="col-md-9 nopadding-right">
                                                    <input id="add-pro-uploadFile" placeholder={translate(files?.length ? langConfig.app.OneFileSelected : langConfig.resources.productImage)} className="form-control" style={{ height: 28 }} disabled="disabled" />
                                                    <div className="help-block with-errors">{translate(langConfig.app.MinSize300X300)}</div>
                                                </div>
                                                <div className="col-md-3 nopadding-left">
                                                    <div className="fileUpload btn btn-primary btn-block btn-flat">
                                                        <span>{translate(langConfig.app.Upload)}</span>
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
                                <div className="row">
                                    <div className="col-md-6 nopadding-right">
                                        <div className={"form-group" + (fieldError === 'index' ? " has-error" : "")}>
                                            <label htmlFor="add-pro-index">{translate(langConfig.app.Index)}*</label>
                                            <input
                                                className="form-control"
                                                placeholder={translate(langConcat(langConfig.app.Enter, langConfig.app.Index))}
                                                required
                                                value={index}
                                                id="add-pro-index"
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
                                <input className="btn btn-flat btn-new" type="submit" value={translate(langConfig.app.Add)} />
                            </div>
                        </form>
                    </div>
                </div>
            </div >
        )
    }
}

export default connect(({ admin: { categories, exUser, user } }) => ({ categories, exUser, user }))(AddProduct)
