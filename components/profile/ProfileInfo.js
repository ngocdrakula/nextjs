import React, { Component } from 'react';
import { connect } from 'react-redux'
import langConfig, { langConcat } from '../../lang.config';
import types from '../../redux/types'
import { createFormData, MODE } from '../../utils/helper';
import { translate } from '../../utils/language';


class ProfileInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            representative: '',
            name: '',
            address: '',
            phone: '',
            mobile: '',
            website: '',
            position: '',
            product: '',
            email: '',
        };
    }
    componentDidMount() {
        const { user, dispatch } = this.props;
        dispatch({
            type: types.GET_USER,
            payload: user._id,
            callback: res => {
                if (res?.success) {
                    this.setState({
                        ...res.data,
                        selected: res.data?.industry?.[0]?._id,
                        loaded: true
                    })
                }
            }
        });
    }

    handleChange = e => this.setState({ [e.target.name]: e.target.value, fieldError: null })
    handleRefresh = () => {
        const { user } = this.props;
        this.setState({
            representative: user?.representative || '',
            name: user?.name || '',
            address: user?.address || '',
            phone: user?.phone || '',
            mobile: user?.mobile || '',
            website: user?.website || '',
            position: user?.position || '',
            product: user?.product || '',
            email: user?.email || '',
            selected: user?.industry?.[0]?._id,
            onEdit: false
        })
    }
    handleSubmit = e => {
        e.preventDefault();
        const { industries, dispatch, user } = this.props;
        const { email, name, product, address, phone, representative, position,
            mobile, re_email, website, selected, filesImage, files } = this.state;
        const industry = selected || industries[0]?._id;
        const dataRequied = { email, name, representative, industry }
        const fieldError = Object.keys(dataRequied).find(field => !dataRequied[field]);

        if (fieldError) {
            this.setState({ fieldError, message: translate(langConfig.message.error.infomation) })
        }
        else {
            const data = {
                email, name, product, address, phone, representative,
                position, mobile, re_email, website, industry,
            }
            const filesTotal = [];
            if (filesImage?.length) {
                data.avatar = true;
                filesTotal.push(filesImage[0])
            }
            if (files?.length) {
                data.image = true;
                filesTotal.push(files[0])
            }
            if (filesTotal.length) data.files = filesTotal;
            const formData = createFormData(data);
            this.setState({ loading: true })
            dispatch({
                type: types.UPDATE_USER,
                payload: { _id: user._id, formData },
                callback: res => {
                    if (res?.success) {
                        this.setState({
                            success: true,
                            message: translate(res.data.messages),
                            onEdit: false,
                            loading: false
                        })
                    }
                    else if (res?.data) {
                        this.setState({
                            fieldError: res.data.field,
                            message: translate(res.data.messages || langConfig.message.error.infomation),
                            loading: false
                        })
                    }
                }
            });
        }
    }
    handleChooseFiles = e => {
        const files = e.target.files;
        this.setState({ files: files[0], local: null });
        if (files[0]) {
            const reader = new FileReader();
            reader.onload = () => this.setState({ local: reader.result, })
            reader.readAsDataURL(files[0]);
        }
    }
    handleChooseFilesImage = e => {
        const files = e.target.files;
        this.setState({ filesImage: files[0], localImage: null });
        if (files[0]) {
            const reader = new FileReader();
            reader.onload = () => this.setState({ localImage: reader.result, })
            reader.readAsDataURL(files[0]);
        }
    }

    handleDropdownIndustry = () => this.setState({ dropIndustry: !this.state.dropIndustry })

    render() {
        const { active, user, industries } = this.props;
        const { onEdit, success, dropIndustry, selected } = this.state;
        const { representative, name, address, phone, mobile, website, position, product, email } = this.state;
        const { local, localImage, fieldError, message, loading } = this.state;
        const industrySelected = industries.find(i => i._id === selected) || industries[0] || {};
        const preview = local || (user?.avatar ? "/api/images/" + user.avatar : "/images/no-avatar.png");
        const previewImage = localImage || (user?.image ? "/api/images/" + user.image : "/images/no-image.png");
        return (
            <div className="profile-content" style={{ display: active ? 'block' : 'none' }}>
                <form className="profile-update form-horizontal" onSubmit={this.handleSubmit}>
                    <div className="form-group row">
                        <label className="col-sm-2 col-form-label" htmlFor="representative">{translate(langConfig.app.FullName)}: </label>
                        <div className="col-sm-10">
                            <input type="text" className="form-control" placeholder={translate(langConcat(langConfig.app.Enter, langConfig.app.FullName))} name="representative" value={representative} required readOnly={!onEdit} onChange={onEdit ? this.handleChange : undefined} />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-2 col-form-label" htmlFor="name">{translate(langConfig.app.CompanyName)}: </label>
                        <div className="col-sm-10">
                            <input type="text" className="form-control" placeholder={translate(langConcat(langConfig.app.Enter, langConfig.app.CompanyName))} name="name" value={name} required readOnly={!onEdit} onChange={onEdit ? this.handleChange : undefined} />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-2 col-form-label" htmlFor="address">{translate(langConfig.app.Address)}: </label>
                        <div className="col-sm-10">
                            <input type="text" className="form-control" placeholder={translate(langConcat(langConfig.app.Enter, langConfig.app.Address))} name="address" value={address} readOnly={!onEdit} onChange={onEdit ? this.handleChange : undefined} />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-2 col-form-label" htmlFor="phone">{translate(langConfig.app.Phone)}: </label>
                        <div className="col-sm-10">
                            <input type="text" className="form-control" placeholder={translate(langConcat(langConfig.app.Enter, langConfig.app.Phone))} name="phone" value={phone} readOnly={!onEdit} onChange={onEdit ? this.handleChange : undefined} />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-2 col-form-label" htmlFor="mobile">{translate(langConfig.app.Mobile)}: </label>
                        <div className="col-sm-10">
                            <input type="text" className="form-control" placeholder={translate(langConcat(langConfig.app.Enter, langConfig.app.Mobile))} name="mobile" value={mobile} readOnly={!onEdit} onChange={onEdit ? this.handleChange : undefined} />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-2 col-form-label" htmlFor="website">{translate(langConfig.app.Website)}: </label>
                        <div className="col-sm-10">
                            <input type="text" className="form-control" placeholder={translate(langConfig.app.EnterWebsite)} name="website" value={website} readOnly={!onEdit} onChange={onEdit ? this.handleChange : undefined} />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-2 col-form-label" htmlFor="position">{translate(langConfig.app.Position)}: </label>
                        <div className="col-sm-10">
                            <input type="text" className="form-control" placeholder={translate(langConcat(langConfig.app.Enter, langConfig.app.Position))} name="position" value={position} readOnly={!onEdit} onChange={onEdit ? this.handleChange : undefined} />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-2 col-form-label" htmlFor="product">{translate(langConfig.app.Product)}: </label>
                        <div className="col-sm-10">
                            <input type="text" className="form-control" placeholder={translate(langConcat(langConfig.app.Enter, langConfig.app.ProductsBuy))} name="product" value={product} readOnly={!onEdit} onChange={onEdit ? this.handleChange : undefined} />
                        </div>
                    </div>
                    <div className="form-group row industry">
                        <label className="col-sm-2 col-form-label" htmlFor="industry">{translate(langConfig.resources.industry)}: </label>
                        <div className="col-sm-10">
                            <div className={"industry-select" + (dropIndustry ? " open" : "")}>
                                <div
                                    className={"form-control industry-placeholder" + (!onEdit ? " disabled" : "")}
                                    onClick={onEdit ? this.handleDropdownIndustry : undefined}
                                    title={translate(industrySelected.names) || industrySelected.name}
                                >
                                    {translate(industrySelected.names) || industrySelected.name}
                                </div>
                                <div className={"dropdown-select" + (dropIndustry ? " active" : "")}>
                                    {industries.map(industry => {
                                        return (
                                            <div key={industry._id}
                                                className={"industry-option" + (selected === industry._id ? " active" : "")}
                                                onClick={() => this.setState({ selected: industry._id, dropIndustry: false })}
                                            >{translate(industry.names) || industry.name}</div>
                                        )
                                    })}
                                </div>
                            </div>
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
                        <label className="col-sm-2 col-form-label" htmlFor="email">{translate(langConfig.app.Email)}:</label>
                        <div className="col-sm-10">
                            <input type="text" className="form-control" placeholder={translate(langConcat(langConfig.app.Enter, langConfig.app.Email))} name="email" value={email} required readOnly={!onEdit} onChange={onEdit ? this.handleChange : undefined} />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-2 col-form-label">{translate(langConfig.app.Avatar)}:</label>
                        <div className="col-sm-10">
                            <div className="user-avatar-preview">
                                <img src={preview} />
                            </div>
                            <input type="file" id="avatar" className="hidden" onChange={this.handleChooseFiles} />
                            {onEdit ?
                                <label className="custom-file-label" htmlFor="avatar">{translate(local ? langConfig.app.OneFileSelected : langConfig.app.UploadAvatar)}</label>
                                : ""}
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-2 col-form-label">{translate(langConfig.app.Banner)}:</label>
                        <div className="col-sm-10">
                            <div className="user-image-preview">
                                <img src={previewImage} />
                            </div>
                            <input type="file" id="image" className="hidden" onChange={this.handleChooseFilesImage} />
                            {onEdit ?
                                <label className="custom-file-label" htmlFor="image">{translate(localImage ? langConfig.app.OneFileSelected : langConfig.app.UploadBanner)}</label>
                                : ""}
                        </div>
                    </div>
                    <div className="form-group row">
                        <div className="offset-sm-2 col-sm-10">
                            {onEdit ?
                                <>
                                    <div>
                                        {fieldError ? <div className="fieldError">{message}</div> : ""}
                                        <button type="submit" className="btn btn-primary" disabled={loading}>{translate(langConfig.app.Save)}</button>
                                        {"  "}
                                        <button type="button" className="btn btn-danger" onClick={this.handleRefresh}>{translate(langConfig.app.Cancel)}</button>
                                    </div>
                                </>
                                :
                                <>
                                    {success ? <div className="success">{translate(langConfig.message.success.updated)}</div> : ""}
                                    <button type="button" className="edit-but btn btn-primary" onClick={() => this.setState({ onEdit: true, success: false })}>{translate(langConfig.app.Edit)}</button>
                                </>
                            }
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}

export default connect(({ app: { user, industries } }) => ({ user, industries }))(ProfileInfo)

