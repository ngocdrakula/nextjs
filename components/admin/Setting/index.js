import React, { Component } from 'react'
import { connect } from 'react-redux';
import types from '../../../redux/types';
import { createFormData } from '../../../utils/helper';

const status = [{ value: true, label: 'Hoạt động' }, { value: false, label: 'Không hoạt động' }]

class Overview extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: 'VIMEXPO 2021 - Triển lãm trực tuyến',
            logo: '/images/logo.png',
            logoStatus: true,
            favicon: '/images/favicon.png',
            bannerStatus: true,
            bannerLogoThumb: '/images/slide-thumb.png',
            bannerSubTitle: 'TRIỂN LÃM TRỰC TUYẾN',
            bannerTitle: 'VIMEXPO 2021',
            bannerStartTime: '27 ',
            bannerEndTime: '29.01.2021',
            bannerLocation: 'Trung tâm Triển lãm Quốc tế I.C.E Hanoi \nCung VHHN, số 91 Trần Hưng Đạo, Hoàn Kiếm, Hà Nội',
            bannerSlogan: 'KẾT NỐI ĐỂ PHÁT TRIỂN',
            bannerDescription: 'Triển lãm trực tuyến VIMEXPO 2021 là kênh Triển lãm \nonline để tăng kết nối, xúc tiến thương mại và phục vụ các \nnhà trưng bày trong và ngoài nước',
            bannerBackground: '#FFCD37',
            countDown: '09/05/2021',
            featuresTitle: 'Nâng tầm triển lãm ảo với các tính năng tuyệt vời',
            features: [
                {
                    title: 'TÀI KHOẢN RIÊNG',
                    content: 'Mỗi đơn vị khi tham dự triển lãm sẽ được cung cấp 1 tài khoản riêng để tiếp cận đối tác với thông tin rõ ràng.'
                }, {
                    title: 'TÌM KIẾM NỘI DUNG',
                    content: 'Hệ thống tìm kiếm theo tên công ty cực kỳ nhanh chóng và thuận tiện.'
                }, {
                    title: 'CHÁT TRỰC TUYẾN',
                    content: 'Tính năng trò chuyện trực tuyến và email tự động giúp kết nối các đối tượng tham gia hiệu quả.'
                }, {
                    title: 'PHÁT SÓNG TRỰC TUYẾN',
                    content: 'Tính năng phát sóng trực tiếp, giúp tiếp cận nhiều hơn, hiệu quả hơn với khách hàng tiềm năng.'
                }, {
                    title: 'GIAN HÀNG ONLINE',
                    content: 'Hệ thống gian hàng 2D mang tới đầy đủ thông tin cùng trải nghiệm hoàn toàn mới.'
                }, {
                    title: 'HỆ THÔNG QUẢN TRỊ',
                    content: 'Cho phép tùy chỉnh dễ dàng thông tin cũng như hình ảnh của nhà trưng bày khi tham gia.'
                }
            ],
            exhibitorTitle: 'Nhà trưng bày',
            exhibitorDescription: 'Giới thiệu chung về Gian hàng trực tuyến của Nhà trưng bày tại VIMEXPO 2021',
            visitorTitle: 'Người mua',
            visitorDescription: 'Giới thiệu chung về Gian hàng trực tuyến của Người mua tại Vimexpo 2021',
            fieldError: null,
            message: ''
        }
    }
    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({ type: types.ADMIN_GET_SETTING });
    }

    componentDidUpdate(prevProps) {
        if (prevProps.setting.timestamps !== this.props.setting.timestamps) {
            this.handleRefresh();
        }
    }
    handleChange = e => this.setState({ [e.target.name]: e.target.value, fieldError: null })
    handleSubmit = e => {
        e.preventDefault();
        const { dispatch } = this.props;
        const {
            title, logoStatus, filesLogo, filesFavicon, filesBanner, countDown,
            bannerStatus, bannerSubTitle, bannerTitle, bannerStartTime, bannerEndTime,
            bannerLocation, bannerSlogan, bannerDescription, bannerBackground, featuresTitle, features,
            exhibitorTitle, exhibitorDescription, visitorTitle, visitorDescription,
        } = this.state;
        const data = {
            title, countDown, logoStatus, logo, favicon, banner,
            bannerStatus, bannerSubTitle, bannerTitle, bannerStartTime, bannerEndTime,
            bannerLocation, bannerSlogan, bannerDescription, bannerBackground, featuresTitle, features,
            exhibitorTitle, exhibitorDescription, visitorTitle, visitorDescription,
        }
        const filesTotal = [];
        if (filesLogo?.length) {
            data.logo = true;
            filesTotal.push(filesLogo[0])
        }
        if (filesFavicon?.length) {
            data.favicon = true;
            filesTotal.push(filesFavicon[0])
        }
        if (filesBanner?.length) {
            data.banner = true;
            filesTotal.push(filesBanner[0])
        }
        if (filesTotal.length) data.files = filesTotal;
        const formData = createFormData(data);

        dispatch({
            type: types.ADMIN_UPDATE_SETTING,
            payload: formData,
            callback: res => {
                if (res?.success) {
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
                    this.setState({
                        fieldError: res.data.field,
                        message: res.data.message || "Vui lòng điền đầy đủ thông tin"
                    })
                }
            }
        });
    }

    handleDropdownLogo = () => this.setState({ dropLogo: !this.state.dropLogo })
    handleDropdownBanner = () => this.setState({ dropBanner: !this.state.dropBanner })

    handleRefresh = () => this.setState({
        ...this.props.setting,
        filesLogo: null,
        filesFavicon: null,
        filesBanner: null,
        fieldError: null,
        message: '',
        onEdit: false
    })

    handleChooseFilesLogo = e => {
        this.setState({ filesLogo: e.target.files })
    }
    handleChooseFilesFavicon = e => {
        this.setState({ filesFavicon: e.target.files })
    }
    handleChooseFilesBanner = e => {
        this.setState({ filesBanner: e.target.files })
    }
    render() {
        const { setting, active } = this.props;
        const {
            title, logoStatus, filesLogo, favicon, filesFavicon, filesBanner, countDown,
            bannerStatus, bannerLogoThumb, bannerSubTitle, bannerTitle, bannerStartTime, bannerEndTime,
            bannerLocation, bannerSlogan, bannerDescription, bannerBackground, featuresTitle, features,
            exhibitorTitle, exhibitorDescription, visitorTitle, visitorDescription,
            onEdit, fieldError, message, dropLogo, dropBanner
        } = this.state;
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
                                            {setting?.logo ?
                                                <img className="profile-user-img img-fluid img-circle" src={"/api/image/" + setting?.logo} alt="Store Logo" />
                                                :
                                                <img className="profile-user-img img-fluid img-circle" src="/image/no-avatar.png" alt="Store Logo" />
                                            }
                                        </div>
                                    </div>
                                </div>
                                <h3 className="profile-username text-center">{setting?.title}</h3>
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
                                                <label htmlFor="setting-title" className="col-sm-3 col-form-label">Tiêu đề trang web:</label>
                                                <div className="col-sm-9">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="setting-title"
                                                        placeholder="Nhập tiêu đề trang web"
                                                        value={title}
                                                        onChange={this.handleChange}
                                                        title="title"
                                                        readOnly={!onEdit}
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label htmlFor="setting-logoStatus" className="col-sm-3 col-form-label">Trạng thái Logo:</label>
                                                <div className="col-sm-9">
                                                    <span className={"select2 select2-container select2-container--default" + (dropLogo ? " select2-container--open" : "")} style={{ width: '100%' }}>
                                                        <span className="selection" onClick={onEdit ? this.handleDropdownLogo : undefined}>
                                                            <span className="select2-selection select2-selection--single" style={{ background: onEdit ? '#FFF' : '#eee', cursor: onEdit ? 'pointer' : 'default' }}  >
                                                                <span
                                                                    className="select2-selection__rendered"
                                                                    id="ex-edit-select2-active-container"
                                                                    title={logoStatus ? 'Hoạt động' : 'Không hoạt động'}>{logoStatus ? 'Hoạt động' : 'Không hoạt động'}</span>
                                                                {onEdit ?
                                                                    <span className="select2-selection__arrow" role="presentation">
                                                                        <b role="presentation" />
                                                                    </span>
                                                                    : ""}
                                                            </span>
                                                        </span>
                                                        <div className={"dropdown-select" + (dropLogo ? " active" : "")}>
                                                            {status.map(stt => {
                                                                return (
                                                                    <div key={stt.label}
                                                                        className={"select-option-active" + (logoStatus === stt.value ? " active" : "")}
                                                                        onClick={() => this.setState({ logoStatus: stt.value, dropLogo: false })}
                                                                    >{stt.label}</div>
                                                                )
                                                            })}
                                                        </div>
                                                    </span>
                                                    <div className="help-block with-errors">
                                                        {fieldError === 'logoStatus' && message ?
                                                            <ul className="list-unstyled">
                                                                <li>{message}.</li>
                                                            </ul>
                                                            : ""}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="form-group row">
                                                <label htmlFor="setting-bannerStatus" className="col-sm-3 col-form-label">Trạng thái Banner:</label>
                                                <div className="col-sm-9">
                                                    <span className={"select2 select2-container select2-container--default" + (dropBanner ? " select2-container--open" : "")} style={{ width: '100%' }}>
                                                        <span className="selection" onClick={onEdit ? this.handleDropdownBanner : undefined}>
                                                            <span className="select2-selection select2-selection--single" style={{ background: onEdit ? '#FFF' : '#eee', cursor: onEdit ? 'pointer' : 'default' }}  >
                                                                <span
                                                                    className="select2-selection__rendered"
                                                                    id="ex-edit-select2-active-container"
                                                                    title={bannerStatus ? 'Hoạt động' : 'Không hoạt động'}>{bannerStatus ? 'Hoạt động' : 'Không hoạt động'}</span>
                                                                {onEdit ?
                                                                    <span className="select2-selection__arrow" role="presentation">
                                                                        <b role="presentation" />
                                                                    </span>
                                                                    : ""}
                                                            </span>
                                                        </span>
                                                        <div className={"dropdown-select" + (dropBanner ? " active" : "")}>
                                                            {status.map(stt => {
                                                                return (
                                                                    <div key={stt.label}
                                                                        className={"select-option-active" + (bannerStatus === stt.value ? " active" : "")}
                                                                        onClick={() => this.setState({ bannerStatus: stt.value, dropBanner: false })}
                                                                    >{stt.label}</div>
                                                                )
                                                            })}
                                                        </div>
                                                    </span>
                                                    <div className="help-block with-errors">
                                                        {fieldError === 'bannerStatus' && message ?
                                                            <ul className="list-unstyled">
                                                                <li>{message}.</li>
                                                            </ul>
                                                            : ""}
                                                    </div>
                                                </div>
                                            </div>
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
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                id="setting-bannerLocation"
                                                                placeholder="Nhập địa điểm"
                                                                value={bannerLocation}
                                                                onChange={this.handleChange}
                                                                name="bannerLocation"
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
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                id="setting-bannerDescription"
                                                                placeholder="Nhập mô tả ngắn"
                                                                value={bannerDescription}
                                                                onChange={this.handleChange}
                                                                name="bannerDescription"
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
                                                            />
                                                        </div>
                                                    </div>
                                                </>
                                                : ""}
                                            <div className="form-group row">
                                                <label htmlFor="setting-countDown" className="col-sm-3 col-form-label">Thời gian bắt đầu (countdown):</label>
                                                <div className="col-sm-9">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="setting-countDown"
                                                        placeholder="Nhập thời gian bắt đầu"
                                                        value={countDown}
                                                        onChange={this.handleChange}
                                                        name="countDown"
                                                        readOnly={!onEdit}
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label htmlFor="setting-featuresTitle" className="col-sm-3 col-form-label">Tiêu đề danh sách tính năng:</label>
                                                <div className="col-sm-9">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="setting-featuresTitle"
                                                        placeholder="Nhập tiêu đề danh sách tính năng"
                                                        value={featuresTitle}
                                                        onChange={this.handleChange}
                                                        name="featuresTitle"
                                                        readOnly={!onEdit}
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label htmlFor="setting-exhibitorTitle" className="col-sm-3 col-form-label">Tiêu đề danh sách nhà trưng bày:</label>
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
                                            <div className="form-group row">
                                                <label htmlFor="setting-exhibitorDescription" className="col-sm-3 col-form-label">Mô tả ngắn danh sách nhà trưng bày:</label>
                                                <div className="col-sm-9">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="setting-exhibitorDescription"
                                                        placeholder="Nhập mô tả ngắn danh sách nhà trưng bày"
                                                        value={exhibitorDescription}
                                                        onChange={this.handleChange}
                                                        name="exhibitorDescription"
                                                        readOnly={!onEdit}
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label htmlFor="setting-visitorTitle" className="col-sm-3 col-form-label">Tiêu đề danh sách người mua:</label>
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
                                            <div className="form-group row">
                                                <label htmlFor="setting-visitorDescription" className="col-sm-3 col-form-label">Mô tả ngắn danh sách người mua:</label>
                                                <div className="col-sm-9">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="setting-visitorDescription"
                                                        placeholder="Nhập mô tả ngắn danh sách người mua"
                                                        value={visitorDescription}
                                                        onChange={this.handleChange}
                                                        name="visitorDescription"
                                                        readOnly={!onEdit}
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-group row" id="editLogo" style={{ display: onEdit ? 'flex' : 'none' }}>
                                                <label htmlFor="inputName" className="col-sm-3 col-form-label">Tải logo lên</label>
                                                <div className="col-sm-9" style={{ marginLeft: 8, maxWidth: '81%' }}>
                                                    <input type="file" className="custom-file-input" id="avatar" name="avatar" onChange={this.handleChooseFilesLogo} />
                                                    <label className="custom-file-label" htmlFor="avatar">{filesLogo?.length ? "Đã chọn 1 tệp" : "Chọn Logo"}</label>
                                                </div>
                                                <span style={{ fontSize: 10, color: 'blue' }}>Loại: .jpg, .png<br />Size: 2MB</span>
                                            </div>
                                            <div className="form-group row" id="editLogo" style={{ display: onEdit ? 'flex' : 'none' }}>
                                                <label htmlFor="inputName" className="col-sm-3 col-form-label">Tải banner lên</label>
                                                <div className="col-sm-9" style={{ marginLeft: 8, maxWidth: '81%' }}>
                                                    <input type="file" className="custom-file-input" id="avatar" name="avatar" onChange={this.handleChooseFilesBanner} />
                                                    <label className="custom-file-label" htmlFor="avatar">{filesBanner?.length ? "Đã chọn 1 tệp" : "Chọn Logo"}</label>
                                                </div>
                                                <span style={{ fontSize: 10, color: 'blue' }}>Loại: .jpg, .png<br />Size: 2MB</span>
                                            </div>
                                            <div className="form-group row" id="editLogo" style={{ display: onEdit ? 'flex' : 'none' }}>
                                                <label htmlFor="inputName" className="col-sm-3 col-form-label">Tải favicon lên</label>
                                                <div className="col-sm-9" style={{ marginLeft: 8, maxWidth: '81%' }}>
                                                    <input type="file" className="custom-file-input" id="avatar" name="avatar" onChange={this.handleChooseFilesFavicon} />
                                                    <label className="custom-file-label" htmlFor="avatar">{filesFavicon?.length ? "Đã chọn 1 tệp" : "Chọn Logo"}</label>
                                                </div>
                                                <span style={{ fontSize: 10, color: 'blue' }}>Loại: .jpg, .png<br />Size: 2MB</span>
                                            </div>
                                            {fieldError ? <div style={{ color: 'red', padding: '10px 0px' }}>{message}</div> : ""}
                                            {onEdit ?
                                                <div style={{ display: 'flex' }}>
                                                    <div className="form-group" id="btnSubmitData">
                                                        <div className="offset-sm-3 col-sm-9">
                                                            <button type="submit" className="btn btn-primary">Lưu</button>
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

export default connect(({ admin: { setting } }) => ({ setting }))(Overview)
