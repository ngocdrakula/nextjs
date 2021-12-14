import React, { Component } from 'react'
import { connect } from 'react-redux';
import types from '../../../redux/types';
import { createFormData, MODE } from '../../../utils/helper';
import langConfig, { langConcat } from '../../../lang.config';
import { translate } from '../../../utils/language'


class UpdateExhibitor extends Component {
    constructor(props) {
        super(props);
        this.defaultState = {
            email: '',
            newpassword: '',
            name: '',
            address: '',
            phone: '',
            hotline: '',
            fax: '',
            representative: '',
            position: '',
            mobile: '',
            re_email: '',
            website: '',
            introduce: '',
            contact: '',
            nameEN: '',
            positionEN: '',
            representativeEN: '',
            addressEN: '',
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
                nameEN: this.props.onEdit.names?.en,
                positionEN: this.props.onEdit.positions?.en,
                representativeEN: this.props.onEdit.representatives.en,
                addressEN: this.props.onEdit.addresss?.en,
                introduceEN: this.props.onEdit.introduces?.en,
                contactEN: this.props.onEdit.contacts?.en,
                selected: this.props.onEdit.industry[0]?._id,
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
        const { _id, email, newpassword, name, address, phone, hotline, fax, representative, position,
            mobile, re_email, website, introduce, contact, enabled, selected, files, filesAvatar,
            nameEN, positionEN, representativeEN, addressEN, introduceEN, contactEN } = this.state;
        const { industries } = this.props;
        const industry = selected || industries[0]?._id;
        const dataRequied = { email, name, address, phone, representative, position, mobile, re_email, industry }
        const fieldError = Object.keys(dataRequied).find(field => !dataRequied[field]);

        if (fieldError) {
            this.setState({ fieldError, messageError: translate(langConfig.message.error.infomation) })
        }
        else {
            const { dispatch, handleClose } = this.props;
            const data = {
                _id, email, newpassword, name, address, phone, hotline, fax, representative,
                position, mobile, re_email, website, introduce, contact, enabled, mode: MODE.exhibitor, industry,
                nameEN, positionEN, representativeEN, addressEN, introduceEN, contactEN
            }
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
        const { dropActive, email, newpassword, name, address, phone, hotline, fax, representative,
            position, mobile, re_email, website, introduce, contact, enabled,
            selected, dropIndustry, fieldError, message, filesAvatar, files,
            nameEN, positionEN, representativeEN, addressEN, introduceEN, contactEN
        } = this.state;
        const industrySelected = industries.find(i => i._id === selected) || industries[0] || {};
        return (
            <div id="ex-edit-myDynamicModal" className={"modal-create modal fade" + (onEdit ? " in" : "")} style={{ display: onEdit ? 'block' : 'none' }}>
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <form method="POST" action="/" id="ex-edit-form" onSubmit={this.handleSubmit} >
                            <div className="modal-header">
                                <button type="button" className="close" onClick={handleClose}>×</button>
                                {translate(langConfig.app.EditExhibitor)}
                            </div>
                            <div className="modal-body">
                                <div className="row">
                                    <div className="col-md-6 nopadding-right">
                                        <div className={"form-group" + (fieldError === 'name' ? " has-error" : "")}>
                                            <label htmlFor="ex-edit-name">{translate(langConfig.app.ExhibitorName)} (VN)*</label>
                                            <input className="form-control" placeholder={translate(langConcat(langConfig.app.Enter, langConfig.app.ExhibitorName))} required value={name} id="name" name="name" type="text" onChange={this.handleChange} />
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
                                            <label htmlFor="ex-edit-nameEN">{translate(langConfig.app.ExhibitorName)} (EN)*</label>
                                            <input className="form-control" placeholder={translate(langConcat(langConfig.app.Enter, langConfig.app.ExhibitorName))} required value={nameEN} id="nameEN" name="nameEN" type="text" onChange={this.handleChange} />
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
                                            <label htmlFor="ex-edit-email">{translate(langConfig.app.Email)}*</label>
                                            <input className="form-control" placeholder={translate(langConcat(langConfig.app.Enter, langConfig.app.Email))} required value={email} name="email" id="ex-edit-email" type="email" onChange={this.handleChange} />
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
                                            <label htmlFor="ex-edit-newpassword">{translate(langConfig.app.Password)}*</label>
                                            <input className="form-control" autoComplete="new-password" id="ex-edit-newpassword" placeholder={translate(langConcat(langConfig.app.Enter, langConfig.app.Password))} value={newpassword} name="newpassword" type="newpassword" onChange={this.handleChange} />
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
                                        <div className={"form-group" + (fieldError === 'address' ? " has-error" : "")}>
                                            <label htmlFor="ex-edit-address">{translate(langConfig.app.Address)} (VN)*</label>
                                            <input className="form-control" placeholder={translate(langConcat(langConfig.app.Enter, langConfig.app.Address))} required id="ex-edit-address" value={address} name="address" type="text" onChange={this.handleChange} />
                                            <div className="help-block with-errors">
                                                {fieldError === 'address' && message ?
                                                    <ul className="list-unstyled">
                                                        <li>{message}.</li>
                                                    </ul>
                                                    : ""}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6 nopadding-left">
                                        <div className={"form-group" + (fieldError === 'addressEN' ? " has-error" : "")}>
                                            <label htmlFor="ex-edit-addressEN">{translate(langConfig.app.Address)} (EN)*</label>
                                            <input className="form-control" placeholder={translate(langConcat(langConfig.app.Enter, langConfig.app.Address))} required id="ex-edit-addressEN" value={addressEN} name="addressEN" type="text" onChange={this.handleChange} />
                                            <div className="help-block with-errors">
                                                {fieldError === 'addressEN' && message ?
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
                                        <div className={"form-group" + (fieldError === 'website' ? " has-error" : "")}>
                                            <label htmlFor="ex-edit-website">{translate(langConfig.app.Website)}*</label>
                                            <input className="form-control" id="ex-edit-website" placeholder={translate(langConcat(langConfig.app.Enter, langConfig.app.Website))} value={website} name="website" type="text" onChange={this.handleChange} />
                                            <div className="help-block with-errors">
                                                {fieldError === 'website' && message ?
                                                    <ul className="list-unstyled">
                                                        <li>{message}.</li>
                                                    </ul>
                                                    : ""}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6 nopadding-left">
                                        <div className={"form-group" + (fieldError === 'phone' ? " has-error" : "")}>
                                            <label htmlFor="ex-edit-phone">{translate(langConfig.app.Phone)}*</label>
                                            <input className="form-control" id="ex-edit-phone" placeholder={translate(langConcat(langConfig.app.Enter, langConfig.app.Phone))} required value={phone} name="phone" type="text" onChange={this.handleChange} />
                                            <div className="help-block with-errors" >
                                                {fieldError === 'phone' && message ?
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
                                        <div className={"form-group" + (fieldError === 'hotline' ? " has-error" : "")}>
                                            <label htmlFor="ex-edit-hotline">{translate(langConfig.app.Hotline)}</label>
                                            <input className="form-control" placeholder={translate(langConcat(langConfig.app.Enter, langConfig.app.Hotline))} id="ex-edit-hotline" value={hotline} name="hotline" type="text" onChange={this.handleChange} />
                                            <div className="help-block with-errors">
                                                {fieldError === 'hotline' && message ?
                                                    <ul className="list-unstyled">
                                                        <li>{message}.</li>
                                                    </ul>
                                                    : ""}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6 nopadding-left">
                                        <div className={"form-group" + (fieldError === 'fax' ? " has-error" : "")}>
                                            <label htmlFor="ex-edit-fax">{translate(langConfig.app.Fax)}</label>
                                            <input className="form-control" id="ex-edit-fax" placeholder={translate(langConcat(langConfig.app.Enter, langConfig.app.Fax))} value={fax} name="fax" type="text" onChange={this.handleChange} />
                                            <div className="help-block with-errors">
                                                {fieldError === 'fax' && message ?
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
                                        <div className={"form-group" + (fieldError === 'representative' ? " has-error" : "")}>
                                            <label htmlFor="ex-editrepresentative">{translate(langConfig.app.Representative)} (VN)</label>
                                            <input className="form-control" placeholder={translate(langConcat(langConfig.app.Enter, langConfig.app.RepresentativeName))} required id="ex-editrepresentative" value={representative} name="representative" type="text" onChange={this.handleChange} />
                                            <div className="help-block with-errors">
                                                {fieldError === 'representative' && message ?
                                                    <ul className="list-unstyled">
                                                        <li>{message}.</li>
                                                    </ul>
                                                    : ""}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6 nopadding-left">
                                        <div className={"form-group" + (fieldError === 'representativeEN' ? " has-error" : "")}>
                                            <label htmlFor="ex-editrepresentativeEN">{translate(langConfig.app.Representative)} (EN)</label>
                                            <input className="form-control" placeholder={translate(langConcat(langConfig.app.Enter, langConfig.app.RepresentativeName))} required id="ex-editrepresentativeEN" value={representativeEN} name="representativeEN" type="text" onChange={this.handleChange} />
                                            <div className="help-block with-errors">
                                                {fieldError === 'representativeEN' && message ?
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
                                        <div className={"form-group" + (fieldError === 'position' ? " has-error" : "")}>
                                            <label htmlFor="ex-edit-position">{translate(langConfig.app.Position)} (VN)</label>
                                            <input className="form-control" id="ex-edit-position" placeholder={translate(langConcat(langConfig.app.Enter, langConfig.app.Position))} required value={position} name="position" type="text" onChange={this.handleChange} />
                                            <div className="help-block with-errors">
                                                {fieldError === 'position' && message ?
                                                    <ul className="list-unstyled">
                                                        <li>{message}.</li>
                                                    </ul>
                                                    : ""}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6 nopadding-left">
                                        <div className={"form-group" + (fieldError === 'positionEN' ? " has-error" : "")}>
                                            <label htmlFor="ex-edit-positionEN">{translate(langConfig.app.Position)} (EN)</label>
                                            <input className="form-control" id="ex-edit-positionEN" placeholder={translate(langConcat(langConfig.app.Enter, langConfig.app.Position))} required value={positionEN} name="positionEN" type="text" onChange={this.handleChange} />
                                            <div className="help-block with-errors">
                                                {fieldError === 'positionEN' && message ?
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
                                        <div className={"form-group" + (fieldError === 'mobile' ? " has-error" : "")}>
                                            <label htmlFor="ex-edit-mobile">{translate(langConfig.app.Mobile)}</label>
                                            <input className="form-control" placeholder={translate(langConcat(langConfig.app.Enter, langConfig.app.Mobile))} required id="ex-edit-mobile" value={mobile} name="mobile" type="text" onChange={this.handleChange} />
                                            <div className="help-block with-errors">
                                                {fieldError === 'mobile' && message ?
                                                    <ul className="list-unstyled">
                                                        <li>{message}.</li>
                                                    </ul>
                                                    : ""}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6 nopadding-left">
                                        <div className={"form-group" + (fieldError === 're_email' ? " has-error" : "")}>
                                            <label htmlFor="ex-edit-re_email">{translate(langConfig.resources.re_email)}</label>
                                            <input className="form-control" id="ex-edit-re_email" placeholder={translate(langConcat(langConfig.app.Enter, langConfig.resources.re_email))} required value={re_email} name="re_email" type="text" onChange={this.handleChange} />
                                            <div className="help-block with-errors">
                                                {fieldError === 're_email' && message ?
                                                    <ul className="list-unstyled">
                                                        <li>{message}.</li>
                                                    </ul>
                                                    : ""}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className={"form-group" + (fieldError === 'introduce' ? " has-error" : "")}>
                                    <label htmlFor="ex-edit-introduce">{translate(langConfig.app.Introduce)}</label>
                                    <textarea className="form-control summernote" rows={2} placeholder={translate(langConcat(langConfig.app.Enter, langConfig.app.Introduce))} value={introduce} name="introduce" cols={50} id="ex-edit-introduce" onChange={this.handleChange} />
                                    <div className="help-block with-errors">
                                        {fieldError === 'introduce' && message ?
                                            <ul className="list-unstyled">
                                                <li>{message}.</li>
                                            </ul>
                                            : ""}
                                    </div>
                                </div>
                                <div className={"form-group" + (fieldError === 'introduceEN' ? " has-error" : "")}>
                                    <label htmlFor="ex-edit-introduceEN">{translate(langConfig.app.Introduce)} (EN)</label>
                                    <textarea className="form-control summernote" id="ex-edit-introduceEN" rows={2} placeholder={translate(langConcat(langConfig.app.Enter, langConfig.app.AboutExhibitor))} value={introduceEN} name="introduceEN" cols={50} onChange={this.handleChange} />
                                    <div className="help-block with-errors">
                                        {fieldError === 'introduceEN' && message ?
                                            <ul className="list-unstyled">
                                                <li>{message}.</li>
                                            </ul>
                                            : ""}
                                    </div>
                                </div>
                                <div className={"form-group" + (fieldError === 'contact' ? " has-error" : "")}>
                                    <label htmlFor="ex-edit-contact">{translate(langConfig.app.Contact)}</label>
                                    <textarea className="form-control summernote" rows={2} placeholder={translate(langConcat(langConfig.app.Enter, langConfig.app.Contact))} value={contact} name="contact" cols={50} maxLength={40} id="ex-edit-contact" onChange={this.handleChange} />
                                    <div className="help-block with-errors">
                                        {fieldError === 'contact' && message ?
                                            <ul className="list-unstyled">
                                                <li>{message}.</li>
                                            </ul>
                                            : ""}
                                    </div>
                                </div>
                                <div className={"form-group" + (fieldError === 'contactEN' ? " has-error" : "")}>
                                    <label htmlFor="ex-editcontactEN">{translate(langConfig.app.Contact)} (EN)</label>
                                    <textarea className="form-control summernote" id="ex-editcontactEN" rows={2} placeholder={translate(langConcat(langConfig.app.Enter, langConfig.app.Contact))} value={contactEN} name="contactEN" cols={50} maxLength={40} onChange={this.handleChange} />
                                    <div className="help-block with-errors">
                                        {fieldError === 'contactEN' && message ?
                                            <ul className="list-unstyled">
                                                <li>{message}.</li>
                                            </ul>
                                            : ""}
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-8 nopadding-right">
                                        <div className={"form-group" + (fieldError === 'industry' ? " has-error" : "")}>
                                            <label htmlFor="ex-edit-active">{translate(langConfig.resources.industry)}*</label>
                                            <span className={"select2 select2-container select2-container--default" + (dropIndustry ? " select2-container--open" : "")} style={{ width: '100%' }}>
                                                <span className="selection" onClick={this.handleDropdownIndustry}>
                                                    <span className="select2-selection select2-selection--single"  >
                                                        <span className="select2-selection__rendered" id="select2-active-container" title={translate(industrySelected.names) || industrySelected.name}>
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
                                    <div className="col-md-4 nopadding-left">
                                        <div className={"form-group" + (fieldError === 'enabled' ? " has-error" : "")}>
                                            <label htmlFor="ex-edit-active">{translate(langConfig.app.Status)}*</label>
                                            <span className={"select2 select2-container select2-container--default" + (dropActive ? " select2-container--open" : "")} style={{ width: '100%' }}>
                                                <span className="selection" onClick={this.handleDropdown}>
                                                    <span className="select2-selection select2-selection--single"  >
                                                        <span className="select2-selection__rendered" id="select2-ex-edit--container" title={translate(enabled ? langConfig.app.Active : langConfig.app.Inactive)}>
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
                                        <div className="form-group">
                                            <label htmlFor="ex-edit-uploadBtn" className="with-help">{translate(langConfig.app.ExhibitorLogo)}</label>
                                            <label htmlFor="ex-edit-uploadBtn" style={{ height: 100, display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 10 }}>
                                                <img
                                                    src={onEdit?.avatar ? ("/api/images/" + onEdit.avatar) : "/images/no-logo.png"}
                                                    alt={translate(onEdit?.avatar ? langConfig.app.ExhibitorLogo : langConfig.app.NoLogo)}
                                                    style={{ width: 'auto', maxWidth: "100%", height: 'auto', maxHeight: "100%" }}
                                                />
                                            </label>
                                            <div className="row">
                                                <div className="col-md-8 nopadding-right">
                                                    <input id="ex-edit-uploadFile" placeholder={translate(filesAvatar?.length ? langConfig.app.OneFileSelected : langConfig.app.ExhibitorLogo)} className="form-control" style={{ height: 28 }} disabled="disabled" />
                                                    <div className="help-block with-errors">{translate(langConfig.app.MinSize300X300)}</div>
                                                </div>
                                                <div className="col-md-4 nopadding-left">
                                                    <div className="fileUpload btn btn-primary btn-block btn-flat">
                                                        <span>{translate(langConfig.app.Upload)}</span>
                                                        <input type="file" name="ex-avatar" id="ex-edit-uploadBtn" className="upload" onChange={this.handleChooseFilesAvatar} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6 nopadding-left">
                                        <div className="form-group">
                                            <label htmlFor="ex-edit-uploadBtn1" className="with-help">{translate(langConfig.app.Banner)}</label>
                                            <label htmlFor="ex-edit-uploadBtn1" style={{ height: 100, display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 10 }}>
                                                <img
                                                    src={onEdit?.image ? ("/api/images/" + onEdit.image) : "/images/no-banner.png"}
                                                    alt={translate(onEdit?.image ? langConfig.app.Banner : langConfig.app.NoBanner)}
                                                    style={{ width: 'auto', maxWidth: "100%", height: 'auto', maxHeight: "100%" }}
                                                />
                                            </label>
                                            <div className="row">
                                                <div className="col-md-8 nopadding-right">
                                                    <input id="ex-edit-uploadFile1" placeholder={translate(files?.length ? langConfig.app.OneFileSelected : langConfig.app.Banner)} className="form-control" disabled="disabled" style={{ height: 28 }} />
                                                    <div className="help-block with-errors">{translate(langConfig.app.Size1208X300)}</div>
                                                </div>
                                                <div className="col-md-4 nopadding-left">
                                                    <div className="fileUpload btn btn-primary btn-block btn-flat">
                                                        <span>{translate(langConfig.app.Upload)}</span>
                                                        <input type="file" name="ex-image" id="ex-edit-uploadBtn1" className="upload" onChange={this.handleChooseFiles} />
                                                    </div>
                                                </div>
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
                </div >
            </div >
        )
    }
}

export default connect(({ admin: { industries } }) => ({ industries }))(UpdateExhibitor)
