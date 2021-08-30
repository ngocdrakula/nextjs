import React, { Component } from 'react'
import { connect } from 'react-redux';
import types from '../../../redux/types';
import { createFormData, MODE } from '../../../utils/helper';


class UpdateExhibitor extends Component {
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
            enabled: true,
        }
        this.state = { ...this.defaultState };
    }
    componentDidUpdate(prevProps) {
        if (!prevProps.onEdit && this.props.onEdit?._id) {
            console.log(this.props.onEdit)
            this.setState({
                ...this.props.onEdit,
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
        const { _id, email, password, name, address, phone, hotline, fax, representative, position,
            mobile, re_email, website, introduce, contact, enabled, selected, files, filesAvatar } = this.state;
        const { industries } = this.props;
        const industry = selected || industries[0]?._id;
        const dataRequied = { email, password, name, address, phone, representative, position, mobile, re_email, industry }
        const fieldError = Object.keys(dataRequied).find(field => !dataRequied[field]);

        if (fieldError) {
            this.setState({ fieldError, message: 'Vui lòng điền đầy đủ thông tin' })
        }
        else {
            const { dispatch, handleClose } = this.props;
            const data = {
                _id, email, password, name, address, phone, hotline, fax, representative,
                position, mobile, re_email, website, introduce, contact, enabled, mode: MODE.exhibitor, industry,
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
            console.log(data)
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
                                title: 'Sửa nhà trưng bày thành công',
                                message: 'Sửa nhà trưng bày thành công',
                                confirm: 'Chấp nhận',
                                cancel: 'Đóng',
                                handleConfirm: handleClose,
                                handleCancel: handleClose
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
        const { dropActive, email, password, name, address, phone, hotline, fax, representative,
            position, mobile, re_email, website, introduce, contact, enabled,
            selected, dropIndustry, fieldError, message, filesAvatar, files } = this.state;
        const industrySelected = industries.find(i => i._id === selected) || industries[0] || {};
        console.log(this.state)
        return (
            <div id="ex-edit-myDynamicModal" className={"modal-create modal fade" + (onEdit ? " in" : "")} style={{ display: onEdit ? 'block' : 'none' }}>
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <form method="POST" action="/" id="ex-edit-form" onSubmit={this.handleSubmit} >
                            <div className="modal-header">
                                <button type="button" className="close" onClick={handleClose}>×</button>
                                Sửa nhà trưng bày
                            </div>
                            <div className="modal-body">
                                <div className="row">
                                    <div className="col-md-8 nopadding-right">
                                        <div className={"form-group" + (fieldError === 'name' ? " has-error" : "")}>
                                            <label htmlFor="ex-edit-name">Tên nhà trưng bày*</label>
                                            <input className="form-control" placeholder="Enter Full Name" required value={name} id="ex-edit-name" name="name" type="text" onChange={this.handleChange} />
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
                                            <label htmlFor="ex-edit-active">Trạng thái*</label>
                                            <span className={"select2 select2-container select2-container--default" + (dropActive ? " select2-container--open" : "")} style={{ width: '100%' }}>
                                                <span className="selection" onClick={this.handleDropdown}>
                                                    <span className="select2-selection select2-selection--single"  >
                                                        <span className="select2-selection__rendered" id="ex-edit-select2-active-container" title={enabled ? "Hoạt động" : "Không hoạt động"}>{enabled ? "Hoạt động" : "Không hoạt động"}</span>
                                                        <span className="select2-selection__arrow" role="presentation">
                                                            <b role="presentation" />
                                                        </span>
                                                    </span>
                                                </span>
                                                <div className={"dropdown-select" + (dropActive ? " active" : "")}>
                                                    <div
                                                        className={"select-option-active" + (enabled ? " active" : "")}
                                                        onClick={this.handleSelectEnable}
                                                    >Hoạt động</div>
                                                    <div
                                                        className={"select-option-active" + (!enabled ? " active" : "")}
                                                        onClick={this.handleSelectDisable}
                                                    >Không hoạt động</div>
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
                                            <label htmlFor="ex-edit-email">Email*</label>
                                            <input className="form-control" placeholder="Nhập email đăng ký" required value={email} name="email" id="ex-edit-email" type="email" onChange={this.handleChange} />
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
                                            <label htmlFor="ex-edit-password">Mật khẩu*</label>
                                            <input className="form-control" id="ex-edit-password" placeholder="Nhập mật khẩu" required value={password} name="password" type="password" onChange={this.handleChange} />
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
                                            <label htmlFor="ex-edit-address">Địa chỉ*</label>
                                            <input className="form-control" placeholder="Nhập địa chỉ" required id="ex-edit-address" value={address} name="address" type="text" onChange={this.handleChange} />
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
                                        <div className={"form-group" + (fieldError === 'industry' ? " has-error" : "")}>
                                            <label htmlFor="ex-edit-active">Ngành công nghiệp*</label>
                                            <span className={"select2 select2-container select2-container--default" + (dropIndustry ? " select2-container--open" : "")} style={{ width: '100%' }}>
                                                <span className="selection" onClick={this.handleDropdownIndustry}>
                                                    <span className="select2-selection select2-selection--single"  >
                                                        <span className="select2-selection__rendered" id="ex-edit-select2-active-container" title={industrySelected.name}>{industrySelected.name}</span>
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
                                <div className="row">
                                    <div className="col-md-6 nopadding-right">
                                        <div className={"form-group" + (fieldError === 'website' ? " has-error" : "")}>
                                            <label htmlFor="ex-edit-website">Website*</label>
                                            <input className="form-control" id="ex-edit-website" placeholder="Nhập trang chủ nhà trưng bày" value={website} name="website" type="text" onChange={this.handleChange} />
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
                                            <label htmlFor="ex-edit-phone">Số điện thoại*</label>
                                            <input className="form-control" id="ex-edit-phone" placeholder="Nhập số điện thoại" required value={phone} name="phone" type="text" onChange={this.handleChange} />
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
                                            <label htmlFor="ex-edit-hotline">Hotline</label>
                                            <input className="form-control" placeholder="Nhập số điện thoại đường dây nóng" id="ex-edit-hotline" value={hotline} name="hotline" type="text" onChange={this.handleChange} />
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
                                            <label htmlFor="ex-edit-fax">Fax</label>
                                            <input className="form-control" id="ex-edit-fax" placeholder="Nhập số fax" value={fax} name="fax" type="text" onChange={this.handleChange} />
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
                                            <label htmlFor="ex-edit-representative">Người đại diện</label>
                                            <input className="form-control" placeholder="Nhập họ tên người đại diện" required id="ex-edit-representative" value={representative} name="representative" type="text" onChange={this.handleChange} />
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
                                        <div className={"form-group" + (fieldError === 'position' ? " has-error" : "")}>
                                            <label htmlFor="ex-edit-position">Chức vụ</label>
                                            <input className="form-control" id="ex-edit-position" placeholder="Nhập chức vụ của người đại diện" required value={position} name="position" type="text" onChange={this.handleChange} />
                                            <div className="help-block with-errors">
                                                {fieldError === 'position' && message ?
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
                                            <label htmlFor="ex-edit-mobile">Số điện thoại người đại diện</label>
                                            <input className="form-control" placeholder="Nhập số điện thoại của người đại diện" required id="ex-edit-mobile" value={mobile} name="mobile" type="text" onChange={this.handleChange} />
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
                                            <label htmlFor="ex-edit-re_email">Email người đại diện</label>
                                            <input className="form-control" id="ex-edit-re_email" placeholder="Nhập email của người đại diện" required value={re_email} name="re_email" type="text" onChange={this.handleChange} />
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
                                    <label htmlFor="ex-edit-introduce">Giới thiệu</label>
                                    <textarea className="form-control summernote" rows={2} placeholder="Giới thiệu sơ lược về nhà trưng bày" value={introduce} name="introduce" cols={50} id="ex-edit-introduce" onChange={this.handleChange} />
                                    <div className="help-block with-errors">
                                        {fieldError === 'introduce' && message ?
                                            <ul className="list-unstyled">
                                                <li>{message}.</li>
                                            </ul>
                                            : ""}
                                    </div>
                                </div>
                                <div className={"form-group" + (fieldError === 'contact' ? " has-error" : "")}>
                                    <label htmlFor="ex-edit-contact">Thông tin liên hệ</label>
                                    <textarea className="form-control summernote" rows={2} placeholder="Thông tin liên hệ khác của nhà trưng bày" value={contact} name="contact" cols={50} id="ex-edit-contact" onChange={this.handleChange} />
                                    <div className="help-block with-errors">
                                        {fieldError === 'contact' && message ?
                                            <ul className="list-unstyled">
                                                <li>{message}.</li>
                                            </ul>
                                            : ""}
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6 nopadding-right">
                                        <div className="form-group">
                                            <label htmlFor="ex-edit-uploadBtn" className="with-help">Logo nhà trưng bày</label>
                                            <label htmlFor="ex-edit-uploadBtn">
                                                {onEdit?.avatar ?
                                                    <img src={"/api/images/" + onEdit?.avatar} alt="Logo nhà trưng bày" style={{ width: 'auto', maxWidth: 100, height: 'auto', maxHeight: 100 }} />
                                                    : "Chưa có logo"
                                                } </label>
                                            <div className="row">
                                                <div className="col-md-9 nopadding-right">
                                                    <input id="ex-edit-uploadFile" placeholder={filesAvatar?.length ? "Đã chọn 1 ảnh" : "Logo nhà trưng bày"} className="form-control" style={{ height: 28 }} disabled="disabled" />
                                                    <div className="help-block with-errors">Kích thước nhỏ nhất 300 x 300px</div>
                                                </div>
                                                <div className="col-md-3 nopadding-left">
                                                    <div className="fileUpload btn btn-primary btn-block btn-flat">
                                                        <span>Tải lên</span>
                                                        <input type="file" name="ex-avatar" id="ex-edit-uploadBtn" className="upload" onChange={this.handleChooseFilesAvatar} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6 nopadding-left">
                                        <div className="form-group">
                                            <label htmlFor="ex-edit-uploadBtn1" className="with-help">Banner</label>
                                            <label htmlFor="ex-edit-uploadBtn1">
                                                {onEdit?.image ?
                                                    <img src={"/api/images/" + onEdit?.image} alt="Banner nhà trưng bày" style={{ width: 'auto', maxWidth: 400, height: 'auto', maxHeight: 100 }} />
                                                    : "Chưa có banner"}
                                            </label>
                                            <div className="row">
                                                <div className="col-md-9 nopadding-right">
                                                    <input id="ex-edit-uploadFile1" placeholder={files?.length ? "Đã chọn 1 ảnh" : "Banner"} className="form-control" disabled="disabled" style={{ height: 28 }} />
                                                    <div className="help-block with-errors">Kích thước 1208 x 300px</div>
                                                </div>
                                                <div className="col-md-3 nopadding-left">
                                                    <div className="fileUpload btn btn-primary btn-block btn-flat">
                                                        <span>Tải lên </span>
                                                        <input type="file" name="ex-image" id="ex-edit-uploadBtn1" className="upload" onChange={this.handleChooseFiles} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <input className="btn btn-flat btn-new" type="submit" value="Lưu" />
                            </div>
                        </form>
                    </div>
                </div>
            </div >
        )
    }
}

export default connect(({ admin: { industries } }) => ({ industries }))(UpdateExhibitor)
