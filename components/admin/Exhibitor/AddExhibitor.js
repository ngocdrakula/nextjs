import React, { Component } from 'react'
import { connect } from 'react-redux';
import types from '../../../redux/types';
import { MODE } from '../../../utils/helper';
import langConfig, { langConcat } from '../../../lang.config';
import { translate } from '../../../utils/language'


class AddExhibitor extends Component {
    constructor(props) {
        super(props);
        this.defaultState = {
            email: '',
            password: '',
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
            fieldError: null,
            message: '',
        }
        this.state = { ...this.defaultState };
    }
    componentDidUpdate(prevProps) {
        if (!prevProps.onAdd && this.props.onAdd) {
            this.setState({ ...this.defaultState })
        }
    }
    handleChange = e => this.setState({ [e.target.name]: e.target.value, fieldError: false })
    handleSubmit = e => {
        e.preventDefault();
        const { email, password, name, address, phone, hotline, fax, representative, position,
            mobile, re_email, website, introduce, contact, enabled, selected,
            nameEN, positionEN, representativeEN, addressEN, introduceEN, contactEN } = this.state;
        const { industries } = this.props;
        const industry = selected || industries[0]?._id;
        const data = {
            email, password, name, address, phone, hotline, fax, representative,
            position, mobile, re_email, website, introduce, contact, enabled, mode: MODE.exhibitor, industry,
            nameEN, positionEN, representativeEN, addressEN, introduceEN, contactEN
        }
        const dataRequied = {
            email, password, name, address, phone, representative, position, mobile, re_email, industry,
            nameEN, positionEN, representativeEN
        }
        const fieldError = Object.keys(dataRequied).find(field => !dataRequied[field]);

        if (fieldError) {
            this.setState({ fieldError, message: translate(langConfig.message.error.infomation) })
        }
        else {
            const { dispatch, onAdded } = this.props;
            dispatch({
                type: types.ADMIN_ADD_USER,
                payload: data,
                callback: res => {
                    if (res?.success) {
                        dispatch({
                            type: types.SET_TOOLTIP,
                            payload: {
                                type: 'success',
                                title: translate(langConfig.message.success.created),
                                message: translate(langConfig.app.AddAnotherExhibitor),
                                confirm: translate(langConfig.app.Add),
                                cancel: translate(langConfig.app.Close),
                                handleConfirm: () => { this.setState({ ...this.defaultState });; onAdded(); },
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
    handleDropdownIndustry = () => this.setState({ dropIndustry: !this.state.dropIndustry })

    render() {
        const { onAdd, handleClose, industries } = this.props;
        const { dropActive, email, password, name, address, phone, hotline, fax, representative,
            position, mobile, re_email, website, introduce, contact, enabled,
            selected, dropIndustry, fieldError, message,
             nameEN, positionEN, representativeEN, addressEN, introduceEN, contactEN
             } = this.state;
        const industrySelected = industries.find(i => i._id === selected) || industries[0] || {};
        return (
            <div id="myDynamicModal" className={"modal-create modal fade" + (onAdd ? " in" : "")} style={{ display: onAdd ? 'block' : 'none' }}>
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <form method="POST" action="/" id="form" onSubmit={this.handleSubmit} >
                            <div className="modal-header">
                                <button type="button" className="close" onClick={handleClose}>×</button>
                                {translate(langConfig.app.AddExhibitor)}
                            </div>
                            <div className="modal-body">
                                <div className="row">
                                    <div className="col-md-6 nopadding-right">
                                        <div className={"form-group" + (fieldError === 'name' ? " has-error" : "")}>
                                            <label htmlFor="name">{translate(langConfig.app.ExhibitorName)} (VN)*</label>
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
                                            <label htmlFor="nameEN">{translate(langConfig.app.ExhibitorName)} (EN)*</label>
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
                                            <label htmlFor="email">{translate(langConfig.app.Email)}*</label>
                                            <input className="form-control" placeholder={translate(langConcat(langConfig.app.Enter, langConfig.app.Email))} required value={email} name="email" id="email" type="email" onChange={this.handleChange} />
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
                                        <div className={"form-group" + (fieldError === 'password' ? " has-error" : "")}>
                                            <label htmlFor="password">{translate(langConfig.app.Password)}*</label>
                                            <input className="form-control" id="password" placeholder={translate(langConcat(langConfig.app.Enter, langConfig.app.Password))} required value={password} name="password" type="password" onChange={this.handleChange} />
                                            <div className="help-block with-errors" >
                                                {fieldError === 'password' && message ?
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
                                            <label htmlFor="address">{translate(langConfig.app.Address)} (VN)*</label>
                                            <input className="form-control" placeholder={translate(langConcat(langConfig.app.Enter, langConfig.app.Address))} required id="address" value={address} name="address" type="text" onChange={this.handleChange} />
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
                                            <label htmlFor="addressEN">{translate(langConfig.app.Address)} (EN)*</label>
                                            <input className="form-control" placeholder={translate(langConcat(langConfig.app.Enter, langConfig.app.Address))} required id="addressEN" value={addressEN} name="addressEN" type="text" onChange={this.handleChange} />
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
                                            <label htmlFor="website">{translate(langConfig.app.Website)}*</label>
                                            <input className="form-control" id="website" placeholder={translate(langConcat(langConfig.app.Enter, langConfig.app.Website))} value={website} name="website" type="text" onChange={this.handleChange} />
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
                                            <label htmlFor="phone">{translate(langConfig.app.Phone)}*</label>
                                            <input className="form-control" id="phone" placeholder={translate(langConcat(langConfig.app.Enter, langConfig.app.Phone))} required value={phone} name="phone" type="text" onChange={this.handleChange} />
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
                                            <label htmlFor="hotline">{translate(langConfig.app.Hotline)}</label>
                                            <input className="form-control" placeholder={translate(langConcat(langConfig.app.Enter, langConfig.app.Hotline))} id="hotline" value={hotline} name="hotline" type="text" onChange={this.handleChange} />
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
                                            <label htmlFor="fax">{translate(langConfig.app.Fax)}</label>
                                            <input className="form-control" id="fax" placeholder={translate(langConcat(langConfig.app.Enter, langConfig.app.Fax))} value={fax} name="fax" type="text" onChange={this.handleChange} />
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
                                            <label htmlFor="representative">{translate(langConfig.app.Representative)} (VN)</label>
                                            <input className="form-control" placeholder={translate(langConcat(langConfig.app.Enter, langConfig.app.RepresentativeName))} required id="representative" value={representative} name="representative" type="text" onChange={this.handleChange} />
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
                                            <label htmlFor="representativeEN">{translate(langConfig.app.Representative)} (EN)</label>
                                            <input className="form-control" placeholder={translate(langConcat(langConfig.app.Enter, langConfig.app.RepresentativeName))} required id="representativeEN" value={representativeEN} name="representativeEN" type="text" onChange={this.handleChange} />
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
                                            <label htmlFor="position">{translate(langConfig.app.Position)} (VN)</label>
                                            <input className="form-control" id="position" placeholder={translate(langConcat(langConfig.app.Enter, langConfig.app.Position))} required value={position} name="position" type="text" onChange={this.handleChange} />
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
                                            <label htmlFor="positionEN">{translate(langConfig.app.Position)} (EN)</label>
                                            <input className="form-control" id="positionEN" placeholder={translate(langConcat(langConfig.app.Enter, langConfig.app.Position))} required value={positionEN} name="positionEN" type="text" onChange={this.handleChange} />
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
                                            <label htmlFor="mobile">{translate(langConfig.resources.mobile)}</label>
                                            <input className="form-control" placeholder={translate(langConcat(langConfig.app.Enter, langConfig.resources.mobile))} required id="mobile" value={mobile} name="mobile" type="text" onChange={this.handleChange} />
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
                                            <label htmlFor="re_email">{translate(langConfig.resources.re_email)}</label>
                                            <input className="form-control" id="re_email" placeholder={translate(langConcat(langConfig.app.Enter, langConfig.resources.re_email))} required value={re_email} name="re_email" type="text" onChange={this.handleChange} />
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
                                    <label htmlFor="introduce">{translate(langConfig.app.Introduce)} (VN)</label>
                                    <textarea className="form-control summernote" rows={2} placeholder={translate(langConcat(langConfig.app.Enter, langConfig.app.AboutExhibitor))} value={introduce} name="introduce" cols={50} id="introduce" onChange={this.handleChange} />
                                    <div className="help-block with-errors">
                                        {fieldError === 'introduce' && message ?
                                            <ul className="list-unstyled">
                                                <li>{message}.</li>
                                            </ul>
                                            : ""}
                                    </div>
                                </div>
                                <div className={"form-group" + (fieldError === 'introduceEN' ? " has-error" : "")}>
                                    <label htmlFor="introduceEN">{translate(langConfig.app.Introduce)} (EN)</label>
                                    <textarea className="form-control summernote" rows={2} placeholder={translate(langConcat(langConfig.app.Enter, langConfig.app.AboutExhibitor))} value={introduceEN} name="introduceEN" cols={50} id="introduceEN" onChange={this.handleChange} />
                                    <div className="help-block with-errors">
                                        {fieldError === 'introduceEN' && message ?
                                            <ul className="list-unstyled">
                                                <li>{message}.</li>
                                            </ul>
                                            : ""}
                                    </div>
                                </div>
                                <div className={"form-group" + (fieldError === 'contact' ? " has-error" : "")}>
                                    <label htmlFor="contact">{translate(langConfig.app.Contact)} (VN)</label>
                                    <textarea className="form-control summernote" rows={2} placeholder={translate(langConcat(langConfig.app.Enter, langConfig.app.Contact))} value={contact} name="contact" cols={50} maxLength={40} id="contact" onChange={this.handleChange} />
                                    <div className="help-block with-errors">
                                        {fieldError === 'contact' && message ?
                                            <ul className="list-unstyled">
                                                <li>{message}.</li>
                                            </ul>
                                            : ""}
                                    </div>
                                </div>
                                <div className={"form-group" + (fieldError === 'contactEN' ? " has-error" : "")}>
                                    <label htmlFor="contactEN">{translate(langConfig.app.Contact)} (EN)</label>
                                    <textarea className="form-control summernote" rows={2} placeholder={translate(langConcat(langConfig.app.Enter, langConfig.app.Contact))} value={contactEN} name="contactEN" cols={50} maxLength={40} id="contactEN" onChange={this.handleChange} />
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
                                            <label htmlFor="active">{translate(langConfig.resources.industry)}*</label>
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
                                            <label htmlFor="active">{translate(langConfig.app.Status)}*</label>
                                            <span className={"select2 select2-container select2-container--default" + (dropActive ? " select2-container--open" : "")} style={{ width: '100%' }}>
                                                <span className="selection" onClick={this.handleDropdown}>
                                                    <span className="select2-selection select2-selection--single"  >
                                                        <span className="select2-selection__rendered" id="select2-active-container" title={translate(enabled ? langConfig.app.Active : langConfig.app.Inactive)}>
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
                                <input className="btn btn-flat btn-new" type="submit" value={translate(langConfig.app.Add)} />
                            </div>
                        </form>
                    </div>
                </div>
            </div >
        )
    }
}

export default connect(({ admin: { industries } }) => ({ industries }))(AddExhibitor)
