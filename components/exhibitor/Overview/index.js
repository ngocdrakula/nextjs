import React, { Component } from 'react'
import { connect } from 'react-redux';
import types from '../../../redux/types';
import { createFormData } from '../../../utils/helper';

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
            message: ''
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
            this.setState({ fieldError, message: 'Vui lòng điền đầy đủ thông tin' })
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
                                title: 'Cập nhật thành công',
                                message: 'Cập nhật thông tin thành công?',
                                confirm: 'Chấp nhận',
                                cancel: 'Đóng',
                                handleConfirm: this.handleCancel,
                                handleCancel: this.handleCancel
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
    }

    handleDropdownIndustry = () => this.setState({ dropIndustry: !this.state.dropIndustry })

    handleCancel = () => this.setState({
        ...this.props.exUser,
        selected: this.props.exUser.industry[0]?._id,
        files: null,
        filesAvatar: null,
        fieldError: null,
        message: '',
        onEdit: false
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
                                                <img className="profile-user-img img-fluid img-circle" src={"/api/images/" + exUser.avatar} alt="Store Logo" />
                                                :
                                                <img className="profile-user-img img-fluid img-circle" src="/images/no-avatar.png" alt="Store Logo" />
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
                                                <label htmlFor="ex-up-name" className="col-sm-3 col-form-label">Tên nhà trưng bày:</label>
                                                <div className="col-sm-9">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="ex-up-name"
                                                        placeholder="Nhập tên nhà trưng bày"
                                                        value={name}
                                                        onChange={this.handleChange}
                                                        name="name"
                                                        readOnly={!onEdit}
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label htmlFor="ex-up-email" className="col-sm-3 col-form-label">Email nhà trưng bày:</label>
                                                <div className="col-sm-9">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="ex-up-email"
                                                        placeholder="Nhập email nhà trưng bày"
                                                        value={email}
                                                        onChange={this.handleChange}
                                                        name="email"
                                                        readOnly={!onEdit}
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label htmlFor="ex-up-industry" className="col-sm-3 col-form-label">Ngành công nghiệp:</label>
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
                                                <label htmlFor="ex-up-address" className="col-sm-3 col-form-label">Địa chỉ nhà trưng bày:</label>
                                                <div className="col-sm-9">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="ex-up-address"
                                                        placeholder="Nhập địa chỉ nhà trưng bày"
                                                        value={address}
                                                        onChange={this.handleChange}
                                                        name="address"
                                                        readOnly={!onEdit}
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label htmlFor="ex-up-website" className="col-sm-3 col-form-label">Website nhà trưng bày:</label>
                                                <div className="col-sm-9">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="ex-up-website"
                                                        placeholder="Nhập website nhà trưng bày"
                                                        value={website}
                                                        onChange={this.handleChange}
                                                        name="website"
                                                        readOnly={!onEdit}
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label htmlFor="ex-up-phone" className="col-sm-3 col-form-label">Số điện thoại nhà trưng bày:</label>
                                                <div className="col-sm-9">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="ex-up-phone"
                                                        placeholder="Nhập số điện thoại nhà trưng bày"
                                                        value={phone}
                                                        onChange={this.handleChange}
                                                        name="phone"
                                                        readOnly={!onEdit}
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label htmlFor="ex-up-hotline" className="col-sm-3 col-form-label">Hotline nhà trưng bày:</label>
                                                <div className="col-sm-9">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="ex-up-hotline"
                                                        placeholder="Nhập số điện thoại đường dây nóng nhà trưng bày"
                                                        value={hotline}
                                                        onChange={this.handleChange}
                                                        name="hotline"
                                                        readOnly={!onEdit}
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label htmlFor="ex-up-fax" className="col-sm-3 col-form-label">Số fax nhà trưng bày:</label>
                                                <div className="col-sm-9">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="ex-up-fax"
                                                        placeholder="Nhập số fax nhà trưng bày"
                                                        value={fax}
                                                        onChange={this.handleChange}
                                                        name="fax"
                                                        readOnly={!onEdit}
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label htmlFor="ex-up-representative" className="col-sm-3 col-form-label">Người đại diện:</label>
                                                <div className="col-sm-9">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="ex-up-representative"
                                                        placeholder="Nhập tên người đại diện"
                                                        value={representative}
                                                        onChange={this.handleChange}
                                                        name="representative"
                                                        readOnly={!onEdit}
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label htmlFor="ex-up-position" className="col-sm-3 col-form-label">Chức vụ người đại diện:</label>
                                                <div className="col-sm-9">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="ex-up-position"
                                                        placeholder="Nhập chức vụ người đại diện"
                                                        value={position}
                                                        onChange={this.handleChange}
                                                        name="position"
                                                        readOnly={!onEdit}
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label htmlFor="ex-up-mobile" className="col-sm-3 col-form-label">Số điện thoại người đại diện:</label>
                                                <div className="col-sm-9">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="ex-up-mobile"
                                                        placeholder="Nhập số điện thoại người đại diện"
                                                        value={mobile}
                                                        onChange={this.handleChange}
                                                        name="mobile"
                                                        readOnly={!onEdit}
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label htmlFor="ex-up-re_email" className="col-sm-3 col-form-label">Email người đại diện:</label>
                                                <div className="col-sm-9">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="ex-up-re_email"
                                                        placeholder="Nhập email người đại diện"
                                                        value={re_email}
                                                        onChange={this.handleChange}
                                                        name="re_email"
                                                        readOnly={!onEdit}
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label htmlFor="ex-up-introduce" className="col-sm-3 col-form-label">Giới thiệu chung:</label>
                                                <div className="col-sm-9">
                                                    <textarea
                                                        className="form-control summernote"
                                                        rows={2}
                                                        placeholder="Giới thiệu sơ lược về nhà trưng bày"
                                                        value={introduce}
                                                        name="introduce"
                                                        cols={50}
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
                                                        rows={2}
                                                        placeholder="Nhập thông tin liên hệ khác"
                                                        value={contact}
                                                        name="contact"
                                                        cols={50}
                                                        id="ex-up-contact"
                                                        readOnly={!onEdit}
                                                        onChange={this.handleChange}
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-group row" style={{ display: 'flex' }}>
                                                <label htmlFor="inputName" className="col-sm-3 col-form-label">Logo</label>
                                                <div className="col-sm-9" style={{ marginLeft: 8, maxWidth: '81%' }}>
                                                    {avatar ?
                                                        <img src={"/api/images/" + avatar} style={{ width: 'auto', height: 'auto', maxWidth: 100, maxHeight: 100 }} />
                                                        : <p>Chưa có Logo</p>
                                                    }
                                                </div>
                                            </div>
                                            <div className="form-group row" id="editLogo" style={{ display: onEdit ? 'flex' : 'none' }}>
                                                <label htmlFor="inputName" className="col-sm-3 col-form-label">Tải logo lên</label>
                                                <div className="col-sm-9" style={{ marginLeft: 8, maxWidth: '81%' }}>
                                                    <input type="file" className="custom-file-input" id="avatar" name="avatar" onChange={this.handleChooseFilesAvatar} />
                                                    <label className="custom-file-label" htmlFor="avatar">{filesAvatar?.length ? "Đã chọn 1 tệp" : "Chọn Logo"}</label>
                                                </div>
                                                <span style={{ fontSize: 10, color: 'blue' }}>Loại: .jpg, .png<br />Size: 2MB</span>
                                            </div>
                                            <div className="form-group row" style={{ display: 'flex' }}>
                                                <label htmlFor="inputName" className="col-sm-3 col-form-label">Banner</label>
                                                <div className="col-sm-9" style={{ marginLeft: 8, maxWidth: '81%' }}>
                                                    {image ?
                                                        <img src={"/api/images/" + image} style={{ width: 'auto', height: 'auto', maxWidth: 400, maxHeight: 100 }} />
                                                        : <p>Chưa có Banner</p>
                                                    }
                                                </div>
                                            </div>
                                            <div className="form-group row" id="editLogo" style={{ display: onEdit ? 'flex' : 'none' }}>
                                                <label htmlFor="inputName" className="col-sm-3 col-form-label">Tải logo lên</label>
                                                <div className="col-sm-9" style={{ marginLeft: 8, maxWidth: '81%' }}>
                                                    <input type="file" className="custom-file-input" id="image" name="image" onChange={this.handleChooseFiles} />
                                                    <label className="custom-file-label" htmlFor="image">{files?.length ? "Đã chọn 1 tệp" : "Chọn Banner"}</label>
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
                                                            <button type="button" className="btn btn-danger" onClick={this.handleCancel}>Hủy</button>
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

export default connect(({ admin: { exUser, industries } }) => ({ exUser, industries }))(Overview)
