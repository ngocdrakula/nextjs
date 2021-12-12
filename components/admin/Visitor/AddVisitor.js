import React, { Component } from 'react'
import { connect } from 'react-redux';
import langConfig, { langConcat } from '../../../lang.config';
import types from '../../../redux/types';
import { MODE } from '../../../utils/helper';
import { translate } from '../../../utils/language';


class AddVisitor extends Component {
    constructor(props) {
        super(props);
        this.defaultState = {
            email: '',
            password: '',
            name: '',
            phone: '',
            introduce: '',
            contact: '',
            product: '',
            enabled: true,
            fieldError: null,
            message: ''
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
        const { email, password, name, phone, introduce, contact, product, enabled, selected } = this.state;
        const { industries } = this.props;
        const industry = selected || industries[0]?._id;
        const data = { email, password, name, phone, introduce, contact, product, enabled, mode: MODE.visitor, industry }
        const dataRequied = { email, password, name, phone, industry }
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
                                message: translate(langConfig.app.AddAnotherVisitor),
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
        const { dropActive, email, password, name, phone, introduce, contact, product, enabled, selected, dropIndustry, fieldError, message } = this.state;
        const industrySelected = industries.find(i => i._id === selected) || industries[0] || {};
        return (
            <div id="add-vis-myDynamicModal" className={"modal-create modal fade" + (onAdd ? " in" : "")} style={{ display: onAdd ? 'block' : 'none' }}>
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <form method="POST" action="/" id="add-vis-form" onSubmit={this.handleSubmit} >
                            <div className="modal-header">
                                <button type="button" className="close" onClick={handleClose}>×</button>
                                {translate(langConfig.app.AddVisitor)}
                            </div>
                            <div className="modal-body">
                                <div className="row">
                                    <div className="col-md-8 nopadding-right">
                                        <div className={"form-group" + (fieldError === 'name' ? " has-error" : "")}>
                                            <label htmlFor="add-vis-name">{translate(langConfig.app.VisitorName)}*</label>
                                            <input className="form-control" placeholder={translate(langConcat(langConfig.app.Enter, langConfig.app.VisitorName))} required value={name} id="add-vis-name" name="name" type="text" onChange={this.handleChange} />
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
                                            <label htmlFor="add-vis-active">{translate(langConfig.app.Status)}*</label>
                                            <span className={"select2 select2-container select2-container--default" + (dropActive ? " select2-container--open" : "")} style={{ width: '100%' }}>
                                                <span className="selection" onClick={this.handleDropdown}>
                                                    <span className="select2-selection select2-selection--single"  >
                                                        <span className="select2-selection__rendered" id="add-vis-select2-active-container" title={translate(enabled ? langConfig.app.Active : langConfig.app.Inactive)}>
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
                                        <div className={"form-group" + (fieldError === 'email' ? " has-error" : "")}>
                                            <label htmlFor="add-vis-email">{translate(langConfig.app.Email)}*</label>
                                            <input className="form-control" placeholder={translate(langConcat(langConfig.app.Enter, langConfig.app.Email))} required value={email} name="email" id="add-vis-email" type="email" onChange={this.handleChange} />
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
                                            <label htmlFor="add-vis-password">{translate(langConfig.app.Password)}*</label>
                                            <input className="form-control" id="add-vis-password" placeholder={translate(langConcat(langConfig.app.Enter, langConfig.app.Password))} required value={password} name="password" type="password" onChange={this.handleChange} />
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
                                        <div className={"form-group" + (fieldError === 'phone' ? " has-error" : "")}>
                                            <label htmlFor="add-vis-phone">{translate(langConfig.app.Phone)}*</label>
                                            <input className="form-control" id="add-vis-phone" placeholder={translate(langConcat(langConfig.app.Enter, langConfig.app.Phone))} required value={phone} name="phone" type="text" onChange={this.handleChange} />
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
                                            <label htmlFor="add-vis-active">{translate(langConfig.resources.industry)}*</label>
                                            <span className={"select2 select2-container select2-container--default" + (dropIndustry ? " select2-container--open" : "")} style={{ width: '100%' }}>
                                                <span className="selection" onClick={this.handleDropdownIndustry}>
                                                    <span className="select2-selection select2-selection--single"  >
                                                        <span className="select2-selection__rendered" id="add-vis-select2-active-container" title={industrySelected.name}>{industrySelected.name}</span>
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
                                                            >{industry.name}</div>
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
                                    <label htmlFor="add-vis-introduce">{translate(langConfig.app.Introduce)}</label>
                                    <textarea className="form-control summernote" rows={2} placeholder={translate(langConfig.app.EnterVisitorIntroduce)} value={introduce} name="introduce" cols={50} id="add-vis-introduce" onChange={this.handleChange} />
                                    <div className="help-block with-errors">
                                        {fieldError === 'introduce' && message ?
                                            <ul className="list-unstyled">
                                                <li>{message}.</li>
                                            </ul>
                                            : ""}
                                    </div>
                                </div>
                                <div className={"form-group" + (fieldError === 'contact' ? " has-error" : "")}>
                                    <label htmlFor="add-vis-contact">{translate(langConfig.app.Contact)}</label>
                                    <textarea className="form-control summernote" rows={2} placeholder={translate(langConfig.app.OtherContact)} value={contact} name="contact" cols={50} id="add-vis-contact" onChange={this.handleChange} />
                                    <div className="help-block with-errors">
                                        {fieldError === 'contact' && message ?
                                            <ul className="list-unstyled">
                                                <li>{message}.</li>
                                            </ul>
                                            : ""}
                                    </div>
                                </div>
                                <div className={"form-group" + (fieldError === 'product' ? " has-error" : "")}>
                                    <label htmlFor="add-vis-product">{translate(langConfig.app.ProductsBuy)}</label>
                                    <textarea className="form-control summernote" rows={2} placeholder={translate(langConfig.app.EnterProductBuy)} value={product} name="product" cols={50} id="add-vis-product" onChange={this.handleChange} />
                                    <div className="help-block with-errors">
                                        {fieldError === 'product' && message ?
                                            <ul className="list-unstyled">
                                                <li>{message}.</li>
                                            </ul>
                                            : ""}
                                    </div>
                                </div>
                            </div><div className="modal-footer">
                                <input className="btn btn-flat btn-new" type="submit" value={translate(langConfig.app.Add)} />
                            </div>
                        </form>
                    </div>
                </div>
            </div >
        )
    }
}

export default connect(({ admin: { industries } }) => ({ industries }))(AddVisitor)
