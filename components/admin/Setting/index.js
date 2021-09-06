import React, { Component } from 'react'
import { connect } from 'react-redux';
import types from '../../../redux/types';
import { createFormData } from '../../../utils/helper';

const status = [{ value: true, label: 'Hoạt động' }, { value: false, label: 'Không hoạt động' }]

class Overview extends Component {
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
            onEdit: false
        }
    }
    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({ type: types.ADMIN_GET_SETTING });
    }

    componentDidUpdate(prevProps) {
        if (prevProps.setting.timestamp !== this.props.setting.timestamp) {
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
        } = this.state;
        const data = {
            title, logoStatus,
            bannerStatus, bannerSubTitle, bannerTitle, bannerStartTime, bannerEndTime,
            bannerLocation, bannerSlogan, bannerDescription, bannerBackground,
            featureStatus, featuresTitle, features: JSON.stringify(features.filter(f => f.title || f.content)),
            countDown,
            exhibitorTitle, exhibitorDescription, visitorTitle, visitorDescription,
            facebook, zalo, spyke, youtube,
        }
        if (!(new Date(countDown)).getTime()) {
            this.setState({
                fieldError: 'countDown',
                message: "Countdown không được để trống",
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
                            title: 'Cập nhật thành công',
                            message: 'Cập nhật thông tin thành công?',
                            confirm: 'Chấp nhận',
                            cancel: 'Đóng'
                        },
                    });
                }
                else if (res?.data) {
                    dispatch({
                        type: types.SET_TOOLTIP,
                        payload: {
                            type: 'error',
                            title: 'Cập nhật thất bại',
                            message: res.data.message || "Vui lòng điền đầy đủ thông tin",
                            confirm: 'Chấp nhận',
                            cancel: 'Đóng'
                        },
                    });
                    this.setState({
                        fieldError: res.data.field,
                        message: res.data.message || "Vui lòng điền đầy đủ thông tin",
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
        ...this.props.setting,
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
    render() {
        const { setting, active } = this.props;
        const {
            title, logoStatus, logoLocal, faviconLocal, bannerLocal, countDown,
            bannerStatus, bannerSubTitle, bannerTitle, bannerStartTime, bannerEndTime,
            bannerLocation, bannerSlogan, bannerDescription, bannerBackground,
            featureStatus, featuresTitle, features,
            exhibitorTitle, exhibitorDescription, visitorTitle, visitorDescription,
            onEdit, fieldError, message, loading,
            dropLogo, dropBanner, dropFeature,
            facebook, zalo, spyke, youtube,
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
                                    <label htmlFor="setting-title" className="col-sm-3 col-form-label">Tiêu đề trang web: </label>
                                    <div className="col-sm-9">
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="setting-title"
                                            placeholder="Nhập tiêu đề trang web"
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
                                                    <label htmlFor="favicon-upload" className="col-sm-6 col-form-label">Favicon: </label>
                                                    {onEdit ?
                                                        <label htmlFor="favicon-upload" className="col-sm-6" title="Thay đổi Favicon">
                                                            <div className="upload-button">Thay đổi</div>
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
                                                    <label htmlFor="logo-upload" className="col-sm-4 col-form-label">Logo: </label>
                                                    <label htmlFor="logo-upload" className="col-sm-4">
                                                        {onEdit ?
                                                            <div className="upload-button" title="Thay đổi Favicon">Thay đổi</div>
                                                            : ""}
                                                    </label>
                                                    <div className="col-sm-4">
                                                        <span className={"text-center select2 select2-container select2-container--default" + (dropLogo ? " select2-container--open" : "")} style={{ width: '100%' }}>
                                                            <span className="selection" onClick={onEdit ? this.handleDropdownLogo : undefined}>
                                                                <span className="select2-selection select2-selection--single" style={{ background: onEdit ? '#FFF' : '#eee', cursor: onEdit ? 'pointer' : 'default' }}  >
                                                                    <span
                                                                        className="select2-selection__rendered"
                                                                        id="ex-edit-select2-active-container"
                                                                        title={logoStatus ? 'Hiển thị' : 'Ẩn Logo'}>{logoStatus ? 'Hiển thị' : 'Ẩn Logo'}</span>
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
                                                                >Hiển thị</div>
                                                                <div
                                                                    className={"select-option-active" + (!logoStatus ? " active" : "")}
                                                                    onClick={() => this.setState({ logoStatus: false, dropLogo: false })}
                                                                >Ẩn Logo</div>
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
                                                                title={bannerStatus ? 'Hiển thị' : 'Ẩn Banner'}>{bannerStatus ? 'Hiển thị' : 'Ẩn Banner'}</span>
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
                                                        >Hiển thị</div>
                                                        <div
                                                            className={"select-option-active" + (!bannerStatus ? " active" : "")}
                                                            onClick={() => this.setState({ bannerStatus: false, dropBanner: false })}
                                                        >Ẩn Banner</div>
                                                    </div>
                                                </span>
                                            </div>
                                            {bannerStatus ?
                                                <>
                                                    <div className="col-sm-12">
                                                        <div className="row">
                                                            {onEdit ? <input id="banner-upload" type="file" className="hide" onChange={this.handleChooseFilesBanner} /> : ""}
                                                            <label htmlFor="banner-upload" className="col-sm-6 col-form-label">Hình ảnh: </label>
                                                            {onEdit ?
                                                                <label htmlFor="banner-upload" className="col-sm-6" title="Thay đổi Banner">
                                                                    <div className="upload-button">Thay đổi</div>
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
                                                    <label htmlFor="setting-bannerSubTitle" className="col-sm-3 col-form-label">Sub-title Banner:</label>
                                                    <div className="col-sm-9">
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            id="setting-bannerSubTitle"
                                                            placeholder="Nhập Sub-title Banner"
                                                            value={bannerSubTitle}
                                                            onChange={this.handleChange}
                                                            name="bannerSubTitle"
                                                            readOnly={!onEdit}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label htmlFor="setting-bannerTitle" className="col-sm-3 col-form-label">Tiêu đề Banner:</label>
                                                    <div className="col-sm-9">
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            id="setting-bannerTitle"
                                                            placeholder="Nhập tiêu đề Banner"
                                                            value={bannerTitle}
                                                            onChange={this.handleChange}
                                                            name="bannerTitle"
                                                            readOnly={!onEdit}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label htmlFor="setting-bannerStartTime" className="col-sm-3 col-form-label">Thời gian bắt đầu:</label>
                                                    <div className="col-sm-9">
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            id="setting-bannerStartTime"
                                                            placeholder="Nhập thời gian bắt đầu"
                                                            value={bannerStartTime}
                                                            onChange={this.handleChange}
                                                            name="bannerStartTime"
                                                            readOnly={!onEdit}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label htmlFor="setting-bannerEndTime" className="col-sm-3 col-form-label">Thời gian kết thúc:</label>
                                                    <div className="col-sm-9">
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            id="setting-bannerEndTime"
                                                            placeholder="Nhập thời gian kết thúc"
                                                            value={bannerEndTime}
                                                            onChange={this.handleChange}
                                                            name="bannerEndTime"
                                                            readOnly={!onEdit}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label htmlFor="setting-bannerLocation" className="col-sm-3 col-form-label">Địa điểm:</label>
                                                    <div className="col-sm-9">
                                                        <textarea
                                                            type="text"
                                                            id="setting-bannerLocation"
                                                            className="form-control summernote"
                                                            rows={2}
                                                            cols={50}
                                                            placeholder="Nhập mô tả ngắn"
                                                            value={bannerLocation}
                                                            name="bannerLocation"
                                                            onChange={this.handleChange}
                                                            readOnly={!onEdit}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label htmlFor="setting-bannerSlogan" className="col-sm-3 col-form-label">Khẩu hiệu:</label>
                                                    <div className="col-sm-9">
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            id="setting-bannerSlogan"
                                                            placeholder="Nhập khẩu hiệu"
                                                            value={bannerSlogan}
                                                            onChange={this.handleChange}
                                                            name="bannerSlogan"
                                                            readOnly={!onEdit}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label htmlFor="setting-bannerDescription" className="col-sm-3 col-form-label">Mô tả ngắn:</label>
                                                    <div className="col-sm-9">
                                                        <textarea
                                                            type="text"
                                                            id="setting-bannerDescription"
                                                            className="form-control summernote"
                                                            rows={3}
                                                            cols={50}
                                                            placeholder="Nhập mô tả ngắn"
                                                            value={bannerDescription}
                                                            name="bannerDescription"
                                                            onChange={this.handleChange}
                                                            readOnly={!onEdit}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label htmlFor="setting-bannerBackground" className="col-sm-3 col-form-label">Màu nền banner:</label>
                                                    <div className="col-sm-9">
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            id="setting-bannerBackground"
                                                            placeholder="Nhập màu nền banner"
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
                                            <label htmlFor="setting-featureStatus" className="col-sm-6 col-form-label">Tính năng:</label>
                                            <div className="col-sm-6">
                                                <span className={"text-center select2 select2-container select2-container--default" + (dropFeature ? " select2-container--open" : "")} style={{ width: '100%' }}>
                                                    <span className="selection" onClick={onEdit ? this.handleDropdownFeature : undefined}>
                                                        <span className="select2-selection select2-selection--single" style={{ background: onEdit ? '#FFF' : '#eee', cursor: onEdit ? 'pointer' : 'default' }}  >
                                                            <span
                                                                className="select2-selection__rendered"
                                                                id="ex-edit-select2-active-container"
                                                                title={featureStatus ? 'Hiển thị' : 'Ẩn Feature'}>{featureStatus ? 'Hiển thị' : 'Ẩn Feature'}</span>
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
                                                        >Hiển thị</div>
                                                        <div
                                                            className={"select-option-active" + (!featureStatus ? " active" : "")}
                                                            onClick={() => this.setState({ featureStatus: false, dropFeature: false })}
                                                        >Ẩn Feature</div>
                                                    </div>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-9">
                                        {featureStatus ?
                                            <>
                                                <div className="form-group row">
                                                    <label htmlFor="setting-featuresTitle" className="col-sm-3 col-form-label">Tiêu đề tính năng:</label>
                                                    <div className="col-sm-9">
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            id="setting-featuresTitle"
                                                            placeholder="Nhập tiêu đề tính năng"
                                                            value={featuresTitle}
                                                            onChange={this.handleChange}
                                                            name="featuresTitle"
                                                            readOnly={!onEdit}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label className="col-md-3 col-form-label">Danh sách tính năng:</label>
                                                    <label className="col-md-9 col-form-label">{features.length} tính năng</label>
                                                </div>
                                                {features.map((feature, index) => {
                                                    return (
                                                        <div key={index} className="form-group row devider">
                                                            <div className="col-md-3">
                                                                <div className="row">
                                                                    <label htmlFor={"setting-feature-title-" + index} className="col-md-12 col-form-label">Tính năng {index + 1}:</label>
                                                                </div>
                                                                {onEdit ?
                                                                    <>
                                                                        <div className="col-md-6">
                                                                            <div className="control-button add" onClick={() => this.handleAdd(index)}>Thêm</div>
                                                                        </div>
                                                                        <div className="col-md-6">
                                                                            <div className="control-button del" onClick={() => this.handleDelete(index)}>Xóa</div>
                                                                        </div>
                                                                    </>
                                                                    : ""}
                                                            </div>
                                                            <div className="col-md-9">
                                                                <div className="form-group row">
                                                                    <label htmlFor={"setting-feature-title-" + index} className="col-md-12 col-form-label">Tiêu đề:</label>
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        id={"setting-feature-title-" + index}
                                                                        placeholder={"Nhập tiêu đề tính năng " + (index + 1)}
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
                                                                        placeholder={"Nhập nội dung tính năng " + (index + 1)}
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
                                                            <div className="control-button add" onClick={() => this.handleAdd(features.length)}>Thêm tính năng</div>
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
                                            <label htmlFor="setting-countDown" className="col-sm-3 col-form-label">Thời gian countDown: </label>
                                            <div className="col-sm-9">
                                                <input
                                                    type="date"
                                                    className="form-control"
                                                    id="setting-countDown"
                                                    placeholder="Nhập thời gian countDown"
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
                                    <label htmlFor="setting-exhibitorTitle" className="col-sm-3 col-form-label">Tiêu đề danh sách nhà trưng bày: </label>
                                    <div className="col-sm-9">
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="setting-exhibitorTitle"
                                            placeholder="Nhập tiêu đề danh sách nhà trưng bày"
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
                                            <label htmlFor="setting-exhibitorTitle" className="col-sm-3 col-form-label">Mô tả ngắn danh sách nhà trưng bày: </label>
                                            <div className="col-sm-9">
                                                <textarea
                                                    type="text"
                                                    id="setting-exhibitorDescription"
                                                    className="form-control summernote"
                                                    rows={2}
                                                    cols={50}
                                                    placeholder="Nhập mô tả ngắn danh sách nhà trưng bày"
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
                                    <label htmlFor="setting-visitorTitle" className="col-sm-3 col-form-label">Tiêu đề danh sách người mua: </label>
                                    <div className="col-sm-9">
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="setting-visitorTitle"
                                            placeholder="Nhập tiêu đề danh sách người mua"
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
                                            <label htmlFor="setting-visitorDescription" className="col-sm-3 col-form-label">Mô tả ngắn danh sách người mua: </label>
                                            <div className="col-sm-9">
                                                <textarea
                                                    type="text"
                                                    id="setting-visitorDescription"
                                                    className="form-control summernote"
                                                    rows={2}
                                                    cols={50}
                                                    placeholder="Nhập mô tả ngắn danh sách người mua"
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
                                    <label className="col-md-3 col-form-label">Liên kết MXH:</label>
                                    <div className="col-md-9">
                                        <div className="form-group row">
                                            <label htmlFor="setting-facebook" className="col-sm-3 col-form-label">Facebook:</label>
                                            <div className="col-sm-9">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="setting-facebook"
                                                    placeholder="Nhập liên kết Facebook"
                                                    value={facebook}
                                                    onChange={this.handleChange}
                                                    name="facebook"
                                                    readOnly={!onEdit}
                                                />
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label htmlFor="setting-zalo" className="col-sm-3 col-form-label">Zalo:</label>
                                            <div className="col-sm-9">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="setting-zalo"
                                                    placeholder="Nhập liên kết Zalo"
                                                    value={zalo}
                                                    onChange={this.handleChange}
                                                    name="zalo"
                                                    readOnly={!onEdit}
                                                />
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label htmlFor="setting-spyke" className="col-sm-3 col-form-label">Spyke:</label>
                                            <div className="col-sm-9">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="setting-spyke"
                                                    placeholder="Nhập liên kết Spyke"
                                                    value={spyke}
                                                    onChange={this.handleChange}
                                                    name="spyke"
                                                    readOnly={!onEdit}
                                                />
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label htmlFor="setting-youtube" className="col-sm-3 col-form-label">Youtube:</label>
                                            <div className="col-sm-9">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="setting-youtube"
                                                    placeholder="Nhập liên kết Youtube"
                                                    value={youtube}
                                                    onChange={this.handleChange}
                                                    name="youtube"
                                                    readOnly={!onEdit}
                                                />
                                            </div>
                                        </div>
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
                                    <div style={{ display: 'flex' }}>
                                        <div className="form-group" id="btnSubmitData">
                                            <div className="offset-sm-3 col-sm-9">
                                                <button type="submit" className="btn btn-primary" disabled={loading}>Lưu</button>
                                            </div>
                                        </div>
                                        <div className="form-group" id="btnCancel" style={{ marginLeft: 10 }}>
                                            <div className="offset-sm-3 col-sm-10">
                                                <button type="button" className="btn btn-danger" onClick={this.handleRefresh}>Hủy</button>
                                            </div>
                                        </div>
                                    </div>
                                    :
                                    <div className="form-group row" id="btnEditData">
                                        <div className="offset-sm-3 col-sm-9">
                                            <button type="button" className="btn btn-primary" onClick={() => this.setState({ onEdit: true })}>Chỉnh sửa</button>
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

export default connect(({ admin: { setting } }) => ({ setting }))(Overview)
