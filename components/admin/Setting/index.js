import React, { Component } from 'react'
import { connect } from 'react-redux';
import langConfig, { langConcat } from '../../../lang.config';
import types from '../../../redux/types';
import { createFormData } from '../../../utils/helper';
import { translate } from '../../../utils/language';

class Setting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            bannerSubTitle: '',
            bannerTitle: '',
            bannerStartTime: '',
            bannerEndTime: '',
            bannerLocation: '',
            bannerSlogan: '',
            bannerDescription: '',
            bannerBackground: '',
            countDown: '',
            featuresTitle: '',
            features: [],
            exhibitorTitle: '',
            exhibitorDescription: '',
            visitorTitle: '',
            visitorDescription: '',
            facebook: '',
            zalo: '',
            spyke: '',
            youtube: '',
            fieldError: null,
            message: '',
            footer: '',
            onEdit: false,
            lang: 'vn'
        }
    }
    componentDidMount() {
        this.handleRefresh();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.setting !== this.props.setting) {
            this.handleRefresh();
        }
    }
    handleChange = e => this.setState({ [e.target.name]: e.target.value, fieldError: null })
    handleSubmit = e => {
        e.preventDefault();
        const { dispatch } = this.props;
        const {
            title, filesFavicon, logoStatus, filesLogo,
            bannerStatus, filesBanner, bannerSubTitle, bannerTitle, bannerStartTime,
            bannerEndTime, bannerLocation, bannerSlogan, bannerDescription, bannerBackground,
            featureStatus, featuresTitle, features,
            countDown,
            exhibitorTitle, exhibitorDescription, visitorTitle, visitorDescription,
            facebook, zalo, spyke, youtube,
            footer, lang
        } = this.state;
        const data = {
            title, logoStatus,
            bannerStatus, bannerSubTitle, bannerTitle, bannerStartTime, bannerEndTime,
            bannerLocation, bannerSlogan, bannerDescription, bannerBackground,
            featureStatus, featuresTitle, features: JSON.stringify(features.filter(f => f.title || f.content)),
            countDown,
            exhibitorTitle, exhibitorDescription, visitorTitle, visitorDescription,
            facebook, zalo, spyke, youtube,
            footer, lang
        }
        if (!(new Date(countDown)).getTime()) {
            this.setState({
                fieldError: 'countDown',
                message: translate(langConcat(langConfig.app.CoundownTime, langConfig.message.error.validation.required)),
            })
            return;
        }
        const filesTotal = [];
        if (filesLogo) {
            data.logo = true;
            filesTotal.push(filesLogo)
        }
        if (filesFavicon) {
            data.favicon = true;
            filesTotal.push(filesFavicon)
        }
        if (filesBanner) {
            data.banner = true;
            filesTotal.push(filesBanner)
        }
        if (filesTotal.length) data.files = filesTotal;
        const formData = createFormData(data);
        this.setState({ loading: true })
        dispatch({
            type: types.ADMIN_UPDATE_SETTING,
            payload: formData,
            callback: res => {
                if (res?.success) {
                    this.setState({ loading: false, onEdit: false });
                    dispatch({
                        type: types.SET_TOOLTIP,
                        payload: {
                            type: 'success',
                            title: translate(langConfig.message.success.updated),
                            message: translate(langConfig.app.UpdateInformationSuccess),
                            confirm: translate(langConfig.app.Accept),
                            cancel: translate(langConfig.app.Close)
                        },
                    });
                }
                else if (res?.data) {
                    dispatch({
                        type: types.SET_TOOLTIP,
                        payload: {
                            type: 'error',
                            title: translate(langConfig.message.error.updated_failed),
                            message: translate(res.data.messages || langConfig.message.error.infomation),
                            confirm: translate(langConfig.app.Accept),
                            cancel: translate(langConfig.app.Close)
                        },
                    });
                    this.setState({
                        fieldError: res.data.field,
                        message: translate(res.data.messages || langConfig.message.error.infomation),
                        loading: false
                    })
                }
            }
        });
    }

    handleDropdownLogo = () => this.setState({ dropLogo: !this.state.dropLogo })
    handleDropdownBanner = () => this.setState({ dropBanner: !this.state.dropBanner })
    handleDropdownFeature = () => this.setState({ dropFeature: !this.state.dropFeature })

    handleRefresh = () => this.setState({
        ...this.props.setting[this.state.lang],
        filesLogo: null,
        filesFavicon: null,
        filesBanner: null,
        fieldError: null,
        logoLocal: null,
        faviconLocal: null,
        bannerLocal: null,
        message: '',
        onEdit: false
    })

    handleChooseFilesLogo = e => {
        const files = e.target.files;
        this.setState({ filesLogo: files[0], logoLocal: null });
        if (files[0]) {
            const reader = new FileReader();
            reader.onload = () => this.setState({ logoLocal: reader.result, })
            reader.readAsDataURL(files[0]);
        }
    }
    handleChooseFilesFavicon = e => {
        const files = e.target.files;
        this.setState({ filesFavicon: files[0], faviconLocal: null });
        if (files[0]) {
            const reader = new FileReader();
            reader.onload = () => this.setState({ faviconLocal: reader.result, })
            reader.readAsDataURL(files[0]);
        }
    }
    handleChooseFilesBanner = e => {
        const files = e.target.files;
        this.setState({ filesBanner: files[0], bannerLocal: null });
        if (files[0]) {
            const reader = new FileReader();
            reader.onload = () => this.setState({ bannerLocal: reader.result, })
            reader.readAsDataURL(files[0]);
        }
    }
    handleAdd = index => {
        const { features } = this.state;
        const newFeature = { title: '', content: '' }
        this.setState({ features: [...features.slice(0, index), newFeature, ...features.slice(index)] })
    }
    handleDelete = index => {
        const { features } = this.state;
        this.setState({ features: features.filter((f, i) => i !== index) })
    }
    handleChangeTitle = (e, index) => {
        const { features } = this.state;
        features[index].title = e.target.value;
        this.setState({ features: [...features] })
    }
    handleChangeContent = (e, index) => {
        const { features } = this.state;
        features[index].content = e.target.value;
        this.setState({ features: [...features] })
    }
    handleChangeTime = e => {
        this.setState({ [e.target.name]: e.target.value, fieldError: null })
    }

    handleSelectLang = (lang) => {
        if (lang !== this.state.lang) {
            this.setState({ lang }, () => {
                const { dispatch } = this.props;
                dispatch({
                    type: types.ADMIN_GET_SETTING,
                })
            })
        }
    }

    render() {
        const { active } = this.props;
        const setting = this.props.setting[this.state.lang];
        const {
            title, logoStatus, logoLocal, faviconLocal, bannerLocal, countDown,
            bannerStatus, bannerSubTitle, bannerTitle, bannerStartTime, bannerEndTime,
            bannerLocation, bannerSlogan, bannerDescription, bannerBackground,
            featureStatus, featuresTitle, features,
            exhibitorTitle, exhibitorDescription, visitorTitle, visitorDescription,
            onEdit, fieldError, message, loading,
            dropLogo, dropBanner, dropFeature,
            facebook, zalo, spyke, youtube,
            footer, lang
        } = this.state;
        if (!active || !setting) return null;
        const logo = logoLocal || `${setting.logoUpdated ? "/api" : ""}/images/${setting.logo}`;
        const favicon = faviconLocal || `${setting.faviconUpdated ? "/api" : ""}/images/${setting.favicon}`;
        const banner = bannerLocal || `${setting.bannerUpdated ? "/api" : ""}/images/${setting.bannerLogoThumb}`;
        return (
            <section className="content">
                <form className="form-horizontal" method="post" action="/" onSubmit={this.handleSubmit}>
                    <div className="row" style={{ padding: '0 20px 20px 20px' }}>
                        <div className="col">
                            <div className="card">
                                <div className="form-group row">
                                    <label htmlFor="setting-lang" className="col-sm-3 col-form-label">{translate(langConfig.app.DisplayLanguage)}: </label>
                                    <div className="col-sm-9">
                                        <button
                                            type="button"
                                            disabled={lang === "vn"}
                                            className={"btn" + (lang !== "vn" ? "  btn-primary" : "")}
                                            onClick={() => this.handleSelectLang('vn')}
                                        >{lang === "vn" ?
                                            "Tiếng Việt (Đang chọn)"
                                            :
                                            "Đổi sang Tiếng Việt"}</button>
                                        <button
                                            type="button"
                                            disabled={lang === "en"}
                                            style={{ marginLeft: 10 }}
                                            className={"btn" + (lang !== "en" ? "  btn-primary" : "")}
                                            onClick={() => this.handleSelectLang('en')}
                                        >{lang === "en" ? "English (Selected)" : "Switch to English"}</button>
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label htmlFor="setting-title" className="col-sm-3 col-form-label">{translate(langConfig.app.SiteTitle)}: </label>
                                    <div className="col-sm-9">
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="setting-title"
                                            placeholder={translate(langConfig.app.EnterSiteTitle)}
                                            value={title}
                                            onChange={this.handleChange}
                                            name="title"
                                            readOnly={!onEdit}
                                        />
                                    </div>
                                </div>
                                <div className="form-group row devider">
                                    <div className="col-md-3">
                                        <div className="form-group row">
                                            <div className="col-md-12">
                                                <div className="row">
                                                    {onEdit ? <input id="favicon-upload" type="file" className="hide" onChange={this.handleChooseFilesFavicon} /> : ""}
                                                    <label htmlFor="favicon-upload" className="col-sm-6 col-form-label">{translate(langConfig.app.Favicon)}: </label>
                                                    {onEdit ?
                                                        <label htmlFor="favicon-upload" className="col-sm-6" title={translate(langConfig.app.ChangeFavicon)}>
                                                            <div className="upload-button">{translate(langConfig.app.Change)}</div>
                                                        </label>
                                                        : ""}
                                                </div>
                                            </div>
                                            <div className="col-sm-12">
                                                <label htmlFor="favicon-upload" className="image-container favicon-preview text-center">
                                                    {faviconLocal || setting.favicon ?
                                                        <img className="image-preview" src={favicon} />
                                                        : ""}
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-9">
                                        <div className="form-group row">
                                            <div className="col-md-12">
                                                <div className="row">
                                                    {onEdit ? <input id="logo-upload" type="file" className="hide" onChange={this.handleChooseFilesLogo} /> : ""}
                                                    <label htmlFor="logo-upload" className="col-sm-4 col-form-label">{translate(langConfig.app.Logo)}: </label>
                                                    <label htmlFor="logo-upload" className="col-sm-4">
                                                        {onEdit ?
                                                            <div className="upload-button" title={translate(langConfig.app.ChangeLogo)}>{translate(langConfig.app.Change)}</div>
                                                            : ""}
                                                    </label>
                                                    <div className="col-sm-4">
                                                        <span className={"text-center select2 select2-container select2-container--default" + (dropLogo ? " select2-container--open" : "")} style={{ width: '100%' }}>
                                                            <span className="selection" onClick={onEdit ? this.handleDropdownLogo : undefined}>
                                                                <span className="select2-selection select2-selection--single" style={{ background: onEdit ? '#FFF' : '#eee', cursor: onEdit ? 'pointer' : 'default' }}  >
                                                                    <span
                                                                        className="select2-selection__rendered"
                                                                        id="ex-edit-select2-active-container"
                                                                        title={translate(logoStatus ? langConfig.app.DisplayLogo : langConfig.app.HideLogo)}>
                                                                        {translate(logoStatus ? langConfig.app.DisplayLogo : langConfig.app.HideLogo)}
                                                                    </span>
                                                                    {onEdit ?
                                                                        <span className="select2-selection__arrow" role="presentation">
                                                                            <b role="presentation" />
                                                                        </span>
                                                                        : ""}
                                                                </span>
                                                            </span>
                                                            <div className={"dropdown-select" + (dropLogo ? " active" : "")}>
                                                                <div
                                                                    className={"select-option-active" + (logoStatus ? " active" : "")}
                                                                    onClick={() => this.setState({ logoStatus: true, dropLogo: false })}
                                                                >{translate(langConfig.app.Display)}</div>
                                                                <div
                                                                    className={"select-option-active" + (!logoStatus ? " active" : "")}
                                                                    onClick={() => this.setState({ logoStatus: false, dropLogo: false })}
                                                                >{translate(langConfig.app.HideLogo)}</div>
                                                            </div>
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-sm-12">
                                                <label htmlFor="logo-upload" className="image-container logo-preview text-center">
                                                    {logoLocal || setting.logo ?
                                                        <img className="image-preview" src={logo} />
                                                        : ""}
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group row devider">
                                    <div className="col-md-3">
                                        <div className="row">
                                            <label htmlFor="setting-bannerStatus" className="col-sm-6 col-form-label">Banner:</label>
                                            <div className="col-sm-6">
                                                <span className={"text-center select2 select2-container select2-container--default" + (dropBanner ? " select2-container--open" : "")} style={{ width: '100%' }}>
                                                    <span className="selection" onClick={onEdit ? this.handleDropdownBanner : undefined}>
                                                        <span className="select2-selection select2-selection--single" style={{ background: onEdit ? '#FFF' : '#eee', cursor: onEdit ? 'pointer' : 'default' }}  >
                                                            <span
                                                                className="select2-selection__rendered"
                                                                id="ex-edit-select2-active-container"
                                                                title={translate(bannerStatus ? langConfig.app.DisplayBanner : langConfig.app.HideBanner)}>{translate(bannerStatus ? langConfig.app.DisplayBanner : langConfig.app.HideBanner)}</span>
                                                            {onEdit ?
                                                                <span className="select2-selection__arrow" role="presentation">
                                                                    <b role="presentation" />
                                                                </span>
                                                                : ""}
                                                        </span>
                                                    </span>
                                                    <div className={"dropdown-select" + (dropBanner ? " active" : "")}>
                                                        <div
                                                            className={"select-option-active" + (bannerStatus ? " active" : "")}
                                                            onClick={() => this.setState({ bannerStatus: true, dropBanner: false })}
                                                        >{translate(langConfig.app.Display)}</div>
                                                        <div
                                                            className={"select-option-active" + (!bannerStatus ? " active" : "")}
                                                            onClick={() => this.setState({ bannerStatus: false, dropBanner: false })}
                                                        >{translate(langConfig.app.HideBanner)}</div>
                                                    </div>
                                                </span>
                                            </div>
                                            {bannerStatus ?
                                                <>
                                                    <div className="col-sm-12">
                                                        <div className="row">
                                                            {onEdit ? <input id="banner-upload" type="file" className="hide" onChange={this.handleChooseFilesBanner} /> : ""}
                                                            <label htmlFor="banner-upload" className="col-sm-6 col-form-label">{translate(langConfig.app.Image)}: </label>
                                                            {onEdit ?
                                                                <label htmlFor="banner-upload" className="col-sm-6" title={translate(langConfig.app.ChangeBanner)}>
                                                                    <div className="upload-button">{translate(langConfig.app.Change)}</div>
                                                                </label>
                                                                : ""}
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-12">
                                                        <label htmlFor="banner-upload" className="image-container favicon-preview text-center">
                                                            {bannerLocal || setting.bannerLogoThumb ?
                                                                <img className="image-preview" src={banner} />
                                                                : ""}
                                                        </label>
                                                    </div>
                                                </>
                                                : ""}
                                        </div>
                                    </div>
                                    <div className="col-md-9">
                                        {bannerStatus ?
                                            <>
                                                <div className="form-group row">
                                                    <label htmlFor="setting-bannerSubTitle" className="col-sm-3 col-form-label">{translate(langConfig.app.BannerSubTitle)}:</label>
                                                    <div className="col-sm-9">
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            id="setting-bannerSubTitle"
                                                            placeholder={translate(langConfig.app.EnterSubTitleBanner)}
                                                            value={bannerSubTitle}
                                                            onChange={this.handleChange}
                                                            name="bannerSubTitle"
                                                            readOnly={!onEdit}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label htmlFor="setting-bannerTitle" className="col-sm-3 col-form-label">{translate(langConfig.app.BannerTitle)}:</label>
                                                    <div className="col-sm-9">
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            id="setting-bannerTitle"
                                                            placeholder={translate(langConfig.app.EnterBannerTitle)}
                                                            value={bannerTitle}
                                                            onChange={this.handleChange}
                                                            name="bannerTitle"
                                                            readOnly={!onEdit}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label htmlFor="setting-bannerStartTime" className="col-sm-3 col-form-label">{translate(langConfig.app.StartTime)}:</label>
                                                    <div className="col-sm-9">
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            id="setting-bannerStartTime"
                                                            placeholder={translate(langConfig.app.EnterStartTime)}
                                                            value={bannerStartTime}
                                                            onChange={this.handleChange}
                                                            name="bannerStartTime"
                                                            readOnly={!onEdit}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label htmlFor="setting-bannerEndTime" className="col-sm-3 col-form-label">{translate(langConfig.app.EndTime)}:</label>
                                                    <div className="col-sm-9">
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            id="setting-bannerEndTime"
                                                            placeholder={translate(langConfig.app.EnterEndTime)}
                                                            value={bannerEndTime}
                                                            onChange={this.handleChange}
                                                            name="bannerEndTime"
                                                            readOnly={!onEdit}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label htmlFor="setting-bannerLocation" className="col-sm-3 col-form-label">{translate(langConfig.app.Location)}:</label>
                                                    <div className="col-sm-9">
                                                        <textarea
                                                            type="text"
                                                            id="setting-bannerLocation"
                                                            className="form-control summernote"
                                                            rows={2}
                                                            cols={50}
                                                            placeholder={translate(langConfig.app.EnterLocation)}
                                                            value={bannerLocation}
                                                            name="bannerLocation"
                                                            onChange={this.handleChange}
                                                            readOnly={!onEdit}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label htmlFor="setting-bannerSlogan" className="col-sm-3 col-form-label">{translate(langConfig.app.Slogan)}:</label>
                                                    <div className="col-sm-9">
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            id="setting-bannerSlogan"
                                                            placeholder={translate(langConfig.app.EnterSlogan)}
                                                            value={bannerSlogan}
                                                            onChange={this.handleChange}
                                                            name="bannerSlogan"
                                                            readOnly={!onEdit}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label htmlFor="setting-bannerDescription" className="col-sm-3 col-form-label">{translate(langConfig.app.Description)}:</label>
                                                    <div className="col-sm-9">
                                                        <textarea
                                                            type="text"
                                                            id="setting-bannerDescription"
                                                            className="form-control summernote"
                                                            rows={3}
                                                            cols={50}
                                                            placeholder={translate(langConfig.app.EnterDescription)}
                                                            value={bannerDescription}
                                                            name="bannerDescription"
                                                            onChange={this.handleChange}
                                                            readOnly={!onEdit}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label htmlFor="setting-bannerBackground" className="col-sm-3 col-form-label">{translate(langConfig.app.BannerBackgroundColor)}:</label>
                                                    <div className="col-sm-9">
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            id="setting-bannerBackground"
                                                            placeholder={translate(langConfig.app.EnterBannerBackgroundColor)}
                                                            value={bannerBackground}
                                                            onChange={this.handleChange}
                                                            name="bannerBackground"
                                                            readOnly={!onEdit}
                                                            style={{ backgroundColor: bannerBackground }}
                                                        />
                                                    </div>
                                                </div>
                                            </>
                                            : ""}
                                    </div>
                                </div>
                                <div className="form-group row devider">
                                    <div className="col-md-3">
                                        <div className="row">
                                            <label htmlFor="setting-featureStatus" className="col-sm-6 col-form-label">{translate(langConfig.app.Feature)}:</label>
                                            <div className="col-sm-6">
                                                <span className={"text-center select2 select2-container select2-container--default" + (dropFeature ? " select2-container--open" : "")} style={{ width: '100%' }}>
                                                    <span className="selection" onClick={onEdit ? this.handleDropdownFeature : undefined}>
                                                        <span className="select2-selection select2-selection--single" style={{ background: onEdit ? '#FFF' : '#eee', cursor: onEdit ? 'pointer' : 'default' }}  >
                                                            <span
                                                                className="select2-selection__rendered"
                                                                id="ex-edit-select2-active-container"
                                                                title={translate(featureStatus ? langConfig.app.DisplayFeature : langConfig.app.HideFeature)}>
                                                                {translate(featureStatus ? langConfig.app.DisplayFeature : langConfig.app.HideFeature)}
                                                            </span>
                                                            {onEdit ?
                                                                <span className="select2-selection__arrow" role="presentation">
                                                                    <b role="presentation" />
                                                                </span>
                                                                : ""}
                                                        </span>
                                                    </span>
                                                    <div className={"dropdown-select" + (dropFeature ? " active" : "")}>
                                                        <div
                                                            className={"select-option-active" + (featureStatus ? " active" : "")}
                                                            onClick={() => this.setState({ featureStatus: true, dropFeature: false })}
                                                        >{translate(langConfig.app.Display)}</div>
                                                        <div
                                                            className={"select-option-active" + (!featureStatus ? " active" : "")}
                                                            onClick={() => this.setState({ featureStatus: false, dropFeature: false })}
                                                        >{translate(langConfig.app.HideFeature)}</div>
                                                    </div>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-9">
                                        {featureStatus ?
                                            <>
                                                <div className="form-group row">
                                                    <label htmlFor="setting-featuresTitle" className="col-sm-3 col-form-label">{translate(langConfig.app.FeatureTitle)}:</label>
                                                    <div className="col-sm-9">
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            id="setting-featuresTitle"
                                                            placeholder={translate(langConfig.app.EnterFeatureTitle)}
                                                            value={featuresTitle}
                                                            onChange={this.handleChange}
                                                            name="featuresTitle"
                                                            readOnly={!onEdit}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label className="col-md-3 col-form-label">{translate(langConfig.app.FeatureList)}:</label>
                                                    <label className="col-md-9 col-form-label">{features.length} {translate(langConfig.app.feature)}</label>
                                                </div>
                                                {features.map((feature, index) => {
                                                    return (
                                                        <div key={index} className="form-group row devider">
                                                            <div className="col-md-3">
                                                                <div className="row">
                                                                    <label htmlFor={"setting-feature-title-" + index} className="col-md-12 col-form-label">{translate(langConfig.app.Feature)} {index + 1}:</label>
                                                                </div>
                                                                {onEdit ?
                                                                    <>
                                                                        <div className="col-md-6">
                                                                            <div className="control-button add" onClick={() => this.handleAdd(index)}>{translate(langConfig.app.Add)}</div>
                                                                        </div>
                                                                        <div className="col-md-6">
                                                                            <div className="control-button del" onClick={() => this.handleDelete(index)}>{translate(langConfig.app.Delete)}</div>
                                                                        </div>
                                                                    </>
                                                                    : ""}
                                                            </div>
                                                            <div className="col-md-9">
                                                                <div className="form-group row">
                                                                    <label htmlFor={"setting-feature-title-" + index} className="col-md-12 col-form-label">{translate(langConfig.app.Title)}:</label>
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        id={"setting-feature-title-" + index}
                                                                        placeholder={translate(langConfig.app.EnterFeatureTitle) + " " + (index + 1)}
                                                                        value={feature.title}
                                                                        onChange={e => this.handleChangeTitle(e, index)}
                                                                        name="feature"
                                                                        readOnly={!onEdit}
                                                                    />
                                                                </div>
                                                                <div className="form-group row">
                                                                    <label htmlFor={"setting-feature-content-" + index} className="col-md-12 col-form-label">Nội dung:</label>
                                                                    <textarea
                                                                        type="text"
                                                                        id={"setting-feature-content-" + index}
                                                                        className="form-control summernote"
                                                                        rows={2}
                                                                        cols={50}
                                                                        placeholder={translate(langConfig.app.EnterFeatureContent) + " " + (index + 1)}
                                                                        value={feature.content}
                                                                        name="bannerDescription"
                                                                        onChange={e => this.handleChangeContent(e, index)}
                                                                        readOnly={!onEdit}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                                {onEdit ?
                                                    <div className="form-group row">
                                                        <div className="col-md-12">
                                                            <div className="control-button add" onClick={() => this.handleAdd(features.length)}>{translate(langConfig.app.AddFeature)}</div>
                                                        </div>
                                                    </div>
                                                    : ""}
                                            </>
                                            : ""}
                                    </div>
                                </div>
                                <div className="form-group row devider">
                                    <div className="col-sm-12">
                                        <div className="form-group row">
                                            <label htmlFor="setting-countDown" className="col-sm-3 col-form-label">{translate(langConfig.app.CoundownTime)}: </label>
                                            <div className="col-sm-9">
                                                <input
                                                    type="date"
                                                    className="form-control"
                                                    id="setting-countDown"
                                                    placeholder={translate(langConfig.app.EnterCoundownTime)}
                                                    value={countDown}
                                                    onChange={this.handleChangeTime}
                                                    name="countDown"
                                                    required
                                                    readOnly={!onEdit}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label htmlFor="setting-exhibitorTitle" className="col-sm-3 col-form-label">{translate(langConfig.app.ExhibitorListTitle)}: </label>
                                    <div className="col-sm-9">
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="setting-exhibitorTitle"
                                            placeholder={translate(langConfig.app.EnterExhibitorListTitle)}
                                            value={exhibitorTitle}
                                            onChange={this.handleChange}
                                            name="exhibitorTitle"
                                            readOnly={!onEdit}
                                        />
                                    </div>
                                </div>
                                <div className="form-group row devider">
                                    <div className="col-sm-12">
                                        <div className="form-group row">
                                            <label htmlFor="setting-exhibitorTitle" className="col-sm-3 col-form-label">{translate(langConfig.app.ExhibitorListDescription)}: </label>
                                            <div className="col-sm-9">
                                                <textarea
                                                    type="text"
                                                    id="setting-exhibitorDescription"
                                                    className="form-control summernote"
                                                    rows={2}
                                                    cols={50}
                                                    placeholder={translate(langConfig.app.EnterExhibitorListDescription)}
                                                    value={exhibitorDescription}
                                                    name="exhibitorDescription"
                                                    onChange={this.handleChange}
                                                    readOnly={!onEdit}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label htmlFor="setting-visitorTitle" className="col-sm-3 col-form-label">{translate(langConfig.app.VisitorListTitle)}: </label>
                                    <div className="col-sm-9">
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="setting-visitorTitle"
                                            placeholder={translate(langConfig.app.EnterVisitorListTitle)}
                                            value={visitorTitle}
                                            onChange={this.handleChange}
                                            name="visitorTitle"
                                            readOnly={!onEdit}
                                        />
                                    </div>
                                </div>
                                <div className="form-group row devider">
                                    <div className="col-sm-12">
                                        <div className="form-group row">
                                            <label htmlFor="setting-visitorDescription" className="col-sm-3 col-form-label">{translate(langConfig.app.VisitorListDescription)}: </label>
                                            <div className="col-sm-9">
                                                <textarea
                                                    type="text"
                                                    id="setting-visitorDescription"
                                                    className="form-control summernote"
                                                    rows={2}
                                                    cols={50}
                                                    placeholder={translate(langConfig.app.EnterVisitorListDescription)}
                                                    value={visitorDescription}
                                                    name="visitorDescription"
                                                    onChange={this.handleChange}
                                                    readOnly={!onEdit}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group row devider">
                                    <label className="col-md-3 col-form-label">{translate(langConfig.app.SocialNetwork)}:</label>
                                    <div className="col-md-9">
                                        <div className="form-group row">
                                            <label htmlFor="setting-facebook" className="col-sm-3 col-form-label">{translate(langConfig.app.Facebook)}:</label>
                                            <div className="col-sm-9">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="setting-facebook"
                                                    placeholder={translate(langConfig.app.EnterFacebookLink)}
                                                    value={facebook}
                                                    onChange={this.handleChange}
                                                    name="facebook"
                                                    readOnly={!onEdit}
                                                />
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label htmlFor="setting-zalo" className="col-sm-3 col-form-label">{translate(langConfig.app.Zalo)}:</label>
                                            <div className="col-sm-9">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="setting-zalo"
                                                    placeholder={translate(langConfig.app.Zalo)}
                                                    value={zalo}
                                                    onChange={this.handleChange}
                                                    name="zalo"
                                                    readOnly={!onEdit}
                                                />
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label htmlFor="setting-spyke" className="col-sm-3 col-form-label">{translate(langConfig.app.Spyke)}:</label>
                                            <div className="col-sm-9">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="setting-spyke"
                                                    placeholder={translate(langConfig.app.EnterSpykeLink)}
                                                    value={spyke}
                                                    onChange={this.handleChange}
                                                    name="spyke"
                                                    readOnly={!onEdit}
                                                />
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label htmlFor="setting-youtube" className="col-sm-3 col-form-label">{translate(langConfig.app.Youtube)}:</label>
                                            <div className="col-sm-9">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="setting-youtube"
                                                    placeholder={translate(langConfig.app.EnterYoutubeLink)}
                                                    value={youtube}
                                                    onChange={this.handleChange}
                                                    name="youtube"
                                                    readOnly={!onEdit}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group row devider">
                                    <label className="col-md-3 col-form-label" htmlFor="setting-footer">{translate(langConfig.app.EmbedCode)}:</label>
                                    <div className="col-md-9">
                                        <textarea
                                            type="text"
                                            id="setting-footer"
                                            className="form-control summernote"
                                            rows={3}
                                            cols={50}
                                            placeholder={translate(langConfig.app.EnterEmbedCode)}
                                            value={footer}
                                            name="footer"
                                            onChange={this.handleChange}
                                            readOnly={!onEdit}
                                        />
                                    </div>
                                </div>

                                {onEdit && fieldError && message ?
                                    <div className="form-group row">
                                        <div className="col-sm-12">
                                            <span className="setting-error">{message}</span>
                                        </div>
                                    </div>
                                    : ""}
                                {onEdit ?
                                    <div className="row">
                                        <div className="offset-sm-3 col-sm-9" >
                                            <div className="col d-flex">
                                                <div className="form-group" id="btnSubmitData" style={{ marginRight: 10 }}>
                                                    <button type="submit" className="btn btn-primary" disabled={loading}>{translate(langConfig.app.Save)}</button>
                                                </div>
                                                <div className="form-group" id="btnCancel" style={{ marginLeft: 10 }}>
                                                    <button type="button" className="btn btn-danger" onClick={this.handleRefresh}>{translate(langConfig.app.Cancel)}</button>
                                                </div>
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
                            </div>
                        </div>
                    </div>
                </form>
            </section >
        )
    }
}

export default connect(({ admin: { setting } }) => ({ setting }))(Setting)
