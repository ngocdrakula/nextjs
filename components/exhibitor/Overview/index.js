import React, { Component } from 'react'
import { connect } from 'react-redux';
import langConfig, { langConcat } from '../../../lang.config';
import types from '../../../redux/types';
import { createFormData } from '../../../utils/helper';
import { translate } from '../../../utils/language';
import TextEditor from '../../TextEditor';

class Overview extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
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
            enabled: true,
            fieldError: null,
            message: '',
        }
    }
    componentDidMount() {
        if (this.props.exUser) this.handleCancel();
    }

    componentDidUpdate(prevProps) {
        if (!prevProps.exUser && this.props.exUser?._id) {
            this.handleCancel();
        }
    }
    handleChange = e => this.setState({ [e.target.name]: e.target.value, fieldError: null })
    handleSubmit = e => {
        e.preventDefault();
        const { industries, dispatch } = this.props;
        const { _id, email, name, address, phone, hotline, fax, representative, position,
            mobile, re_email, website, introduce, contact, selected, filesAvatar, files } = this.state;
        const industry = selected || industries[0]?._id;
        const dataRequied = { email, name, address, phone, representative, position, mobile, re_email, industry }
        const fieldError = Object.keys(dataRequied).find(field => !dataRequied[field]);

        if (fieldError) {
            this.setState({ fieldError, message: translate(langConfig.message.error.infomation) })
        }
        else {
            const data = {
                _id, email, name, address, phone, hotline, fax, representative,
                position, mobile, re_email, website, introduce, contact, industry,
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
                                handleConfirm: this.handleCancel,
                                handleCancel: this.handleCancel
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

    handleDropdownIndustry = () => this.setState({ dropIndustry: !this.state.dropIndustry })

    handleCancel = () => this.setState({
        ...this.props.exUser,
        selected: this.props.exUser.industry[0]?._id,
        files: null,
        filesAvatar: null,
        fieldError: null,
        message: '',
        onEdit: false,
    })

    handleChooseFilesAvatar = e => {
        this.setState({ filesAvatar: e.target.files })
    }
    handleChooseFiles = e => {
        this.setState({ files: e.target.files })
    }
    render() {
        const { active, exUser, industries } = this.props;
        const { email, name, address, phone, hotline, fax, representative,
            position, mobile, re_email, website, introduce, contact, avatar, image,
            selected, dropIndustry, fieldError, message, onEdit, files, filesAvatar } = this.state;
        const industrySelected = industries.find(i => i._id === selected) || industries[0] || {};
        if (!active) return null;
        return (
            <section className="content">
                <div className="row" style={{ padding: '0 20px 20px 20px' }}>
                    <div className="col-md-3">
                        <div className="card card-primary card-outline">
                            <div className="card-body box-profile">
                                <div className="text-center">
                                    <div className="pic">
                                        <div className="afta-logo-user">
                                            {exUser?.avatar ?
                                                <img className="profile-user-img img-fluid img-circle" src={"/api/images/" + exUser.avatar} alt={translate(langConfig.app.Logo)} />
                                                :
                                                <img className="profile-user-img img-fluid img-circle" src="/images/no-avatar.png" alt={translate(langConfig.app.NoLogo)} />
                                            }
                                        </div>
                                    </div>
                                </div>
                                <h3 className="profile-username text-center">{exUser?.name}</h3>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-9">
                        <div className="card">
                            <div className="card-header p-2">
                                <ul className="nav nav-pills">
                                </ul>
                            </div>
                            <div className="card-body">
                                <div className="tab-content">
                                    <div className="active tab-pane" id="InfoCompany">
                                        <form className="form-horizontal" method="post" action="/" onSubmit={this.handleSubmit}>
                                            <div className="form-group row">
                                                <label htmlFor="ex-up-name" className="col-sm-3 col-form-label">{translate(langConfig.app.ExhibitorName)}:</label>
                                                <div className="col-sm-9">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="ex-up-name"
                                                        placeholder={translate(langConcat(langConfig.app.Enter, langConfig.app.ExhibitorName))}
                                                        value={name}
                                                        onChange={this.handleChange}
                                                        name="name"
                                                        readOnly={!onEdit}
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label htmlFor="ex-up-email" className="col-sm-3 col-form-label">{translate(langConfig.app.Email)}:</label>
                                                <div className="col-sm-9">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="ex-up-email"
                                                        placeholder={translate(langConcat(langConfig.app.Enter, langConfig.app.Email))}
                                                        value={email}
                                                        onChange={this.handleChange}
                                                        name="email"
                                                        readOnly={!onEdit}
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label htmlFor="ex-up-industry" className="col-sm-3 col-form-label">{translate(langConfig.resources.industry)}:</label>
                                                <div className="col-sm-9">
                                                    <span className={"select2 select2-container select2-container--default" + (dropIndustry ? " select2-container--open" : "")} style={{ width: '100%' }}>
                                                        <span className="selection" onClick={onEdit ? this.handleDropdownIndustry : undefined}>
                                                            <span className="select2-selection select2-selection--single" style={{ background: onEdit ? '#FFF' : '#eee', cursor: onEdit ? 'pointer' : 'default' }}  >
                                                                <span className="select2-selection__rendered" id="ex-edit-select2-active-container" title={industrySelected.name}>{industrySelected.name}</span>
                                                                {onEdit ?
                                                                    <span className="select2-selection__arrow" role="presentation">
                                                                        <b role="presentation" />
                                                                    </span>
                                                                    : ""}
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
                                            <div className="form-group row">
                                                <label htmlFor="ex-up-address" className="col-sm-3 col-form-label">{translate(langConfig.app.Address)}:</label>
                                                <div className="col-sm-9">
                                                    <TextEditor
                                                        key={onEdit}
                                                        type="text"
                                                        className="form-control"
                                                        id="ex-up-address"
                                                        placeholder={translate(langConcat(langConfig.app.Enter, langConfig.app.Address))}
                                                        value={address}
                                                        onChange={this.handleChange}
                                                        name="address"
                                                        readOnly={!onEdit}
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label htmlFor="ex-up-website" className="col-sm-3 col-form-label">{translate(langConfig.app.Website)}:</label>
                                                <div className="col-sm-9">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="ex-up-website"
                                                        placeholder={translate(langConfig.app.EnterWebsite)}
                                                        value={website}
                                                        onChange={this.handleChange}
                                                        name="website"
                                                        readOnly={!onEdit}
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label htmlFor="ex-up-phone" className="col-sm-3 col-form-label">{translate(langConfig.app.Phone)}:</label>
                                                <div className="col-sm-9">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="ex-up-phone"
                                                        placeholder={translate(langConcat(langConfig.app.Enter, langConfig.app.Phone))}
                                                        value={phone}
                                                        onChange={this.handleChange}
                                                        name="phone"
                                                        readOnly={!onEdit}
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label htmlFor="ex-up-hotline" className="col-sm-3 col-form-label">{translate(langConfig.app.Hotline)}:</label>
                                                <div className="col-sm-9">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="ex-up-hotline"
                                                        placeholder={translate(langConcat(langConfig.app.Enter, langConfig.app.Hotline))}
                                                        value={hotline}
                                                        onChange={this.handleChange}
                                                        name="hotline"
                                                        readOnly={!onEdit}
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label htmlFor="ex-up-fax" className="col-sm-3 col-form-label">{translate(langConfig.app.Fax)}:</label>
                                                <div className="col-sm-9">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="ex-up-fax"
                                                        placeholder={translate(langConcat(langConfig.app.Enter, langConfig.app.Fax))}
                                                        value={fax}
                                                        onChange={this.handleChange}
                                                        name="fax"
                                                        readOnly={!onEdit}
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label htmlFor="ex-up-representative" className="col-sm-3 col-form-label">{translate(langConfig.app.Representative)}:</label>
                                                <div className="col-sm-9">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="ex-up-representative"
                                                        placeholder={translate(langConcat(langConfig.app.Enter, langConfig.app.RepresentativeName))}
                                                        value={representative}
                                                        onChange={this.handleChange}
                                                        name="representative"
                                                        readOnly={!onEdit}
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label htmlFor="ex-up-position" className="col-sm-3 col-form-label">{translate(langConfig.resources.position)}:</label>
                                                <div className="col-sm-9">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="ex-up-position"
                                                        placeholder={translate(langConcat(langConfig.app.Enter, langConfig.resources.position))}
                                                        value={position}
                                                        onChange={this.handleChange}
                                                        name="position"
                                                        readOnly={!onEdit}
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label htmlFor="ex-up-mobile" className="col-sm-3 col-form-label">{translate(langConfig.resources.mobile)}:</label>
                                                <div className="col-sm-9">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="ex-up-mobile"
                                                        placeholder={translate(langConcat(langConfig.app.Enter, langConfig.resources.mobile))}
                                                        value={mobile}
                                                        onChange={this.handleChange}
                                                        name="mobile"
                                                        readOnly={!onEdit}
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label htmlFor="ex-up-re_email" className="col-sm-3 col-form-label">{translate(langConfig.resources.re_email)}:</label>
                                                <div className="col-sm-9">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="ex-up-re_email"
                                                        placeholder={translate(langConcat(langConfig.app.Enter, langConfig.resources.re_email))}
                                                        value={re_email}
                                                        onChange={this.handleChange}
                                                        name="re_email"
                                                        readOnly={!onEdit}
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label htmlFor="ex-up-introduce" className="col-sm-3 col-form-label">{translate(langConfig.app.Introduce)}:</label>
                                                <div className="col-sm-9">
                                                    <textarea
                                                        className="form-control summernote"
                                                        rows={2}
                                                        placeholder={translate(langConfig.app.EnterExhibitoIntroduce)}
                                                        value={introduce}
                                                        name="introduce"
                                                        cols={50}
                                                        maxLength={800}
                                                        id="ex-up-introduce"
                                                        readOnly={!onEdit}
                                                        onChange={this.handleChange}
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label htmlFor="ex-up-contact" className="col-sm-3 col-form-label">Thông tin liên hệ khác:</label>
                                                <div className="col-sm-9">
                                                    <textarea
                                                        className="form-control summernote"
                                                        placeholder={translate(langConfig.app.EnterOtherContact)}
                                                        value={contact}
                                                        name="contact"
                                                        id="ex-up-contact"
                                                        readOnly={!onEdit}
                                                        onChange={this.handleChange}
                                                        rows={3}
                                                        cols={50}
                                                        maxLength={160}
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-group row" style={{ display: 'flex' }}>
                                                <label htmlFor="inputName" className="col-sm-3 col-form-label">{translate(langConfig.app.Logo)}</label>
                                                <div className="col-sm-9" style={{ marginLeft: 8, maxWidth: '81%' }}>
                                                    {avatar ?
                                                        <img src={"/api/images/" + avatar} style={{ width: 'auto', height: 'auto', maxWidth: 100, maxHeight: 100 }} />
                                                        : <p>{translate(langConfig.app.NoLogo)}</p>
                                                    }
                                                </div>
                                            </div>
                                            <div className="form-group row" id="editLogo" style={{ display: onEdit ? 'flex' : 'none' }}>
                                                <label htmlFor="inputName" className="col-sm-3 col-form-label">{translate(langConfig.app.UploadLogo)}</label>
                                                <div className="col-sm-9" style={{ marginLeft: 8, maxWidth: '81%' }}>
                                                    <input type="file" className="custom-file-input" id="avatar" name="avatar" onChange={this.handleChooseFilesAvatar} />
                                                    <label className="custom-file-label" htmlFor="avatar">{translate(filesAvatar?.length ? langConfig.app.OneFileSelected : langConfig.app.UploadLogo)}</label>
                                                </div>
                                                <span style={{ fontSize: 10, color: 'blue' }}>{translate(langConfig.app.Type)}: .jpg, .png<br />{translate(langConfig.app.Size)}: 2MB</span>
                                            </div>
                                            <div className="form-group row" style={{ display: 'flex' }}>
                                                <label htmlFor="inputName" className="col-sm-3 col-form-label">{translate(langConfig.app.Banner)}</label>
                                                <div className="col-sm-9" style={{ marginLeft: 8, maxWidth: '81%' }}>
                                                    {image ?
                                                        <img src={"/api/images/" + image} style={{ width: 'auto', height: 'auto', maxWidth: 400, maxHeight: 100 }} />
                                                        : <p>{translate(langConfig.app.NoBanner)}</p>
                                                    }
                                                </div>
                                            </div>
                                            <div className="form-group row" id="editLogo" style={{ display: onEdit ? 'flex' : 'none' }}>
                                                <label htmlFor="inputName" className="col-sm-3 col-form-label">{translate(langConfig.app.UploadBanner)}</label>
                                                <div className="col-sm-9" style={{ marginLeft: 8, maxWidth: '81%' }}>
                                                    <input type="file" className="custom-file-input" id="image" name="image" onChange={this.handleChooseFiles} />
                                                    <label className="custom-file-label" htmlFor="image">{translate(files?.length ? langConfig.app.OneFileSelected : langConfig.app.UploadBanner)}</label>
                                                </div>
                                                <span style={{ fontSize: 10, color: 'blue' }}>{translate(langConfig.app.Type)}: .jpg, .png<br />{translate(langConfig.app.Size)}: 2MB</span>
                                            </div>
                                            {fieldError ? <div style={{ color: 'red', padding: '10px 0px' }}>{message}</div> : ""}
                                            {onEdit ?
                                                <div style={{ display: 'flex' }}>
                                                    <div className="form-group" id="btnSubmitData">
                                                        <div className="offset-sm-3 col-sm-9">
                                                            <button type="submit" className="btn btn-primary">{translate(langConfig.app.Save)}</button>
                                                        </div>
                                                    </div>
                                                    <div className="form-group" id="btnCancel" style={{ marginLeft: 10 }}>
                                                        <div className="offset-sm-3 col-sm-10">
                                                            <button type="button" className="btn btn-danger" onClick={this.handleCancel}>{translate(langConfig.app.Cancel)}</button>
                                                        </div>
                                                    </div>
                                                </div>
                                                :
                                                <div className="form-group row" id="btnEditData">
                                                    <div className="offset-sm-3 col-sm-9">
                                                        <button type="button" className="btn btn-primary" onClick={() => this.setState({ onEdit: true })}>{translate(langConfig.app.Edit)}</button>
                                                    </div>
                                                </div>
                                            }
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        )
    }
}

export default connect(({ admin: { exUser, industries } }) => ({ exUser, industries }))(Overview)
