import React, { Component } from 'react'
import { connect } from 'react-redux';
import langConfig, { langConcat } from '../../../lang.config';
import types from '../../../redux/types';
import { createFormData, MODE } from '../../../utils/helper';
import { translate } from '../../../utils/language';


class UpdateVisitor extends Component {
    constructor(props) {
        super(props);
        this.defaultState = {
            email: '',
            newpassword: '',
            name: '',
            phone: '',
            product: '',
            introduce: '',
            contact: '',
            nameEN: '',
            productEN: '',
            introduceEN: '',
            contactEN: '',
            enabled: true,
        }
        this.state = { ...this.defaultState };
    }
    componentDidUpdate(prevProps) {
        if (!prevProps.onEdit && this.props.onEdit?._id) {
            this.setState({
                ...this.props.onEdit,
                selected: this.props.onEdit.industry[0]?._id,
                nameEN: this.props.onEdit.names?.en,
                productEN: this.props.onEdit.products?.en,
                introduceEN: this.props.onEdit.introduces?.en,
                contactEN: this.props.onEdit.contacts?.en,
                files: null,
                filesAvatar: null,
                fieldError: null,
                message: ''
            })
        }
    }
    handleChange = e => this.setState({ [e.target.name]: e.target.value, fieldError: false })
    handleSubmit = e => {
        e.preventDefault();
        const { _id, email, newpassword, name, phone, product, introduce, contact, enabled, selected, files, filesAvatar } = this.state;
        const { industries } = this.props;
        const industry = selected || industries[0]?._id;
        const dataRequied = { email, name, phone, industry }
        const fieldError = Object.keys(dataRequied).find(field => !dataRequied[field]);

        if (fieldError) {
            this.setState({ fieldError, message: translate(langConfig.message.error.infomation) })
        }
        else {
            const { dispatch, handleClose } = this.props;
            const data = { _id, email, newpassword, name, phone, product, introduce, contact, enabled, mode: MODE.visitor, industry, }
            const filesTotal = [];
            if (filesAvatar?.length) {
                data.avatar = true;
                filesTotal.push(filesAvatar[0])
            }
            if (files?.length) {
                data.image = true;
                filesTotal.push(files[0])
            }
            if (filesTotal.length) data.files = filesTotal;
            const formData = createFormData(data);

            dispatch({
                type: types.ADMIN_UPDATE_USER,
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
    handleDropdownIndustry = () => this.setState({ dropIndustry: !this.state.dropIndustry })

    handleChooseFilesAvatar = e => {
        this.setState({ filesAvatar: e.target.files })
    }
    handleChooseFiles = e => {
        this.setState({ files: e.target.files })
    }

    render() {
        const { onEdit, handleClose, industries } = this.props;
        const { dropActive, email, newpassword, name, phone, product, introduce, contact, enabled,
            selected, dropIndustry, fieldError, message, filesAvatar, files,
            nameEN, productEN, introduceEN, contactEN,
        } = this.state;
        const industrySelected = industries.find(i => i._id === selected) || industries[0] || {};
        return (
            <div id="vis-edit-myDynamicModal" className={"modal-create modal fade" + (onEdit ? " in" : "")} style={{ display: onEdit ? 'block' : 'none' }}>
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <form method="POST" action="/" id="vis-edit-form" onSubmit={this.handleSubmit} >
                            <div className="modal-header">
                                <button type="button" className="close" onClick={handleClose}>×</button>
                                {translate(langConfig.app.EditVisitor)}
                            </div>
                            <div className="modal-body">
                                <div className="row">
                                    <div className="col-md-6 nopadding-right">
                                        <div className={"form-group" + (fieldError === 'name' ? " has-error" : "")}>
                                            <label htmlFor="edit-vis-name">{translate(langConfig.app.VisitorName)} (VN)*</label>
                                            <input className="form-control" placeholder={translate(langConcat(langConfig.app.Enter, langConfig.app.VisitorName))} required value={name} id="edit-vis-name" name="name" type="text" onChange={this.handleChange} />
                                            <div className="help-block with-errors">
                                                {fieldError === 'name' && message ?
                                                    <ul className="list-unstyled">
                                                        <li>{message}.</li>
                                                    </ul>
                                                    : ""}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6 nopadding-left">
                                        <div className={"form-group" + (fieldError === 'nameEN' ? " has-error" : "")}>
                                            <label htmlFor="edit-vis-nameEN">{translate(langConfig.app.VisitorName)} (EN)*</label>
                                            <input className="form-control" placeholder={translate(langConcat(langConfig.app.Enter, langConfig.app.VisitorName))} required value={nameEN} id="edit-vis-nameEN" name="nameEN" type="text" onChange={this.handleChange} />
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
                                        <div className={"form-group" + (fieldError === 'email' ? " has-error" : "")}>
                                            <label htmlFor="vis-edit-email">{translate(langConfig.app.Email)}*</label>
                                            <input className="form-control" placeholder={translate(langConcat(langConfig.app.Enter, langConfig.app.Email))} required value={email} name="email" id="vis-edit-email" type="email" onChange={this.handleChange} />
                                            <div className="help-block with-errors" >
                                                {fieldError === 'email' && message ?
                                                    <ul className="list-unstyled">
                                                        <li>{message}.</li>
                                                    </ul>
                                                    : ""}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6 nopadding-left">
                                        <div className={"form-group" + (fieldError === 'newpassword' ? " has-error" : "")}>
                                            <label htmlFor="vis-edit-newpassword">{translate(langConfig.app.Password)}*</label>
                                            <input className="form-control" autoComplete="new-password" id="vis-edit-newpassword" placeholder={translate(langConcat(langConfig.app.Enter, langConfig.app.Password))} value={newpassword} name="newpassword" type="password" onChange={this.handleChange} />
                                            <div className="help-block with-errors" >
                                                {fieldError === 'newpassword' && message ?
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
                                        <div className={"form-group" + (fieldError === 'phone' ? " has-error" : "")}>
                                            <label htmlFor="vis-edit-phone">{translate(langConfig.app.Phone)}*</label>
                                            <input className="form-control" id="vis-edit-phone" placeholder={translate(langConcat(langConfig.app.Enter, langConfig.app.Phone))} required value={phone} name="phone" type="text" onChange={this.handleChange} />
                                            <div className="help-block with-errors" >
                                                {fieldError === 'phone' && message ?
                                                    <ul className="list-unstyled">
                                                        <li>{message}.</li>
                                                    </ul>
                                                    : ""}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6 nopadding-left">
                                        <div className={"form-group" + (fieldError === 'industry' ? " has-error" : "")}>
                                            <label htmlFor="vis-edit-active">{translate(langConfig.resources.industry)}*</label>
                                            <span className={"select2 select2-container select2-container--default" + (dropIndustry ? " select2-container--open" : "")} style={{ width: '100%' }}>
                                                <span className="selection" onClick={this.handleDropdownIndustry}>
                                                    <span className="select2-selection select2-selection--single"  >
                                                        <span className="select2-selection__rendered" id="vis-edit-select2-active-container" title={translate(industrySelected.names) || industrySelected.name}>
                                                            {translate(industrySelected.names) || industrySelected.name}
                                                        </span>
                                                        <span className="select2-selection__arrow" role="presentation">
                                                            <b role="presentation" />
                                                        </span>
                                                    </span>
                                                </span>
                                                <div className={"dropdown-select" + (dropIndustry ? " active" : "")}>
                                                    {industries.map(industry => {
                                                        return (
                                                            <div key={industry._id}
                                                                className={"select-option-active" + (selected === industry._id ? " active" : "")}
                                                                onClick={() => this.setState({ selected: industry._id, dropIndustry: false })}
                                                            >{translate(industry.names) || industry.name}</div>
                                                        )
                                                    })}
                                                </div>
                                            </span>
                                            <div className="help-block with-errors">
                                                {fieldError === 'industry' && message ?
                                                    <ul className="list-unstyled">
                                                        <li>{message}.</li>
                                                    </ul>
                                                    : ""}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className={"form-group" + (fieldError === 'introduce' ? " has-error" : "")}>
                                    <label htmlFor="edit-vis-introduce">{translate(langConfig.app.Introduce)} (VN)</label>
                                    <textarea className="form-control summernote" rows={2} placeholder={translate(langConfig.app.EnterVisitorIntroduce)} value={introduce} name="introduce" cols={50} id="edit-vis-introduce" onChange={this.handleChange} />
                                    <div className="help-block with-errors">
                                        {fieldError === 'introduce' && message ?
                                            <ul className="list-unstyled">
                                                <li>{message}.</li>
                                            </ul>
                                            : ""}
                                    </div>
                                </div>
                                <div className={"form-group" + (fieldError === 'introduceEN' ? " has-error" : "")}>
                                    <label htmlFor="edit-vis-introduceEN">{translate(langConfig.app.Introduce)} (EN)</label>
                                    <textarea className="form-control summernote" rows={2} placeholder={translate(langConfig.app.EnterVisitorIntroduce)} value={introduceEN} name="introduceEN" cols={50} id="edit-vis-introduceEN" onChange={this.handleChange} />
                                    <div className="help-block with-errors">
                                        {fieldError === 'introduceEN' && message ?
                                            <ul className="list-unstyled">
                                                <li>{message}.</li>
                                            </ul>
                                            : ""}
                                    </div>
                                </div>
                                <div className={"form-group" + (fieldError === 'contact' ? " has-error" : "")}>
                                    <label htmlFor="edit-vis-contact">{translate(langConfig.app.Contact)} (VN)</label>
                                    <textarea className="form-control summernote" rows={2} placeholder={translate(langConfig.app.OtherContact)} value={contact} name="contact" cols={50} id="edit-vis-contact" onChange={this.handleChange} />
                                    <div className="help-block with-errors">
                                        {fieldError === 'contact' && message ?
                                            <ul className="list-unstyled">
                                                <li>{message}.</li>
                                            </ul>
                                            : ""}
                                    </div>
                                </div>
                                <div className={"form-group" + (fieldError === 'contactEN' ? " has-error" : "")}>
                                    <label htmlFor="edit-vis-contactEN">{translate(langConfig.app.Contact)} (EN)</label>
                                    <textarea className="form-control summernote" rows={2} placeholder={translate(langConfig.app.OtherContact)} value={contactEN} name="contactEN" cols={50} id="edit-vis-contactEN" onChange={this.handleChange} />
                                    <div className="help-block with-errors">
                                        {fieldError === 'contactEN' && message ?
                                            <ul className="list-unstyled">
                                                <li>{message}.</li>
                                            </ul>
                                            : ""}
                                    </div>
                                </div>
                                <div className={"form-group" + (fieldError === 'product' ? " has-error" : "")}>
                                    <label htmlFor="edit-vis-product">{translate(langConfig.app.ProductsBuy)} (VN)</label>
                                    <textarea className="form-control summernote" rows={2} placeholder={translate(langConfig.app.EnterProductBuy)} value={product} name="product" cols={50} id="edit-vis-product" onChange={this.handleChange} />
                                    <div className="help-block with-errors">
                                        {fieldError === 'product' && message ?
                                            <ul className="list-unstyled">
                                                <li>{message}.</li>
                                            </ul>
                                            : ""}
                                    </div>
                                </div>
                                <div className={"form-group" + (fieldError === 'productEN' ? " has-error" : "")}>
                                    <label htmlFor="edit-vis-productEN">{translate(langConfig.app.ProductsBuy)} (EN)</label>
                                    <textarea className="form-control summernote" rows={2} placeholder={translate(langConfig.app.EnterProductBuy)} value={productEN} name="productEN" cols={50} id="edit-vis-productEN" onChange={this.handleChange} />
                                    <div className="help-block with-errors">
                                        {fieldError === 'productEN' && message ?
                                            <ul className="list-unstyled">
                                                <li>{message}.</li>
                                            </ul>
                                            : ""}
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6 nopadding-right">
                                        <div className="form-group">
                                            <label htmlFor="vis-edit-uploadBtn" className="with-help">{translate(langConfig.app.VisitorLogo)}</label>
                                            <label htmlFor="vis-edit-uploadBtn" style={{ height: 100, display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 10 }}>
                                                <img
                                                    src={onEdit?.avatar ? ("/api/images/" + onEdit.avatar) : "/images/no-logo.png"}
                                                    alt={translate(onEdit?.avatar ? langConfig.app.VisitorLogo : langConfig.app.NoLogo)}
                                                    style={{ width: 'auto', maxWidth: "100%", height: 'auto', maxHeight: "100%" }}
                                                />
                                            </label>
                                            <div className="row">
                                                <div className="col-md-8 nopadding-right">
                                                    <input id="vis-edit-uploadFile" placeholder={translate(filesAvatar?.length ? langConfig.app.OneFileSelected : langConfig.app.VisitorLogo)} className="form-control" style={{ height: 28 }} disabled="disabled" />
                                                    <div className="help-block with-errors">{translate(langConfig.app.MinSize300X300)}</div>
                                                </div>
                                                <div className="col-md-4 nopadding-left">
                                                    <div className="fileUpload btn btn-primary btn-block btn-flat">
                                                        <span>{translate(langConfig.app.Upload)}</span>
                                                        <input type="file" name="ex-avatar" id="vis-edit-uploadBtn" className="upload" onChange={this.handleChooseFilesAvatar} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6 nopadding-left">
                                        <div className="form-group">
                                            <label htmlFor="vis-edit-uploadBtn1" className="with-help">{translate(langConfig.app.Banner)}</label>
                                            <label htmlFor="vis-edit-uploadBtn1" style={{ height: 100, display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 10 }}>
                                                <img
                                                    src={onEdit?.image ? ("/api/images/" + onEdit.image) : "/images/no-banner.png"}
                                                    alt={translate(onEdit?.image ? langConfig.app.Banner : langConfig.app.NoBanner)}
                                                    style={{ width: 'auto', maxWidth: "100%", height: 'auto', maxHeight: "100%" }}
                                                />
                                            </label>
                                            <div className="row">
                                                <div className="col-md-8 nopadding-right">
                                                    <input id="vis-edit-uploadFile1" placeholder={translate(files?.length ? langConfig.app.OneFileSelected : langConfig.app.Banner)} className="form-control" disabled="disabled" style={{ height: 28 }} />
                                                    <div className="help-block with-errors">{translate(langConfig.app.Size1208X300)}</div>
                                                </div>
                                                <div className="col-md-4 nopadding-left">
                                                    <div className="fileUpload btn btn-primary btn-block btn-flat">
                                                        <span>{translate(langConfig.app.Upload)}</span>
                                                        <input type="file" name="ex-image" id="vis-edit-uploadBtn1" className="upload" onChange={this.handleChooseFiles} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-4 nopadding-right">
                                        <div className={"form-group" + (fieldError === 'enabled' ? " has-error" : "")}>
                                            <label htmlFor="edit-vis-active">{translate(langConfig.app.Status)}*</label>
                                            <span className={"select2 select2-container select2-container--default" + (dropActive ? " select2-container--open" : "")} style={{ width: '100%' }}>
                                                <span className="selection" onClick={this.handleDropdown}>
                                                    <span className="select2-selection select2-selection--single"  >
                                                        <span className="select2-selection__rendered" id="edit-vis-select2-active-container" title={translate(enabled ? langConfig.app.Active : langConfig.app.Inactive)}>
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

export default connect(({ admin: { industries } }) => ({ industries }))(UpdateVisitor)
