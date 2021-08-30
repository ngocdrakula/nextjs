import React, { Component } from 'react'
import { connect } from 'react-redux';
import types from '../../../redux/types';
import { MODE } from '../../../utils/helper';


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
        const { email, password, name, address, phone, hotline, fax, representative, position,
            mobile, re_email, website, introduce, contact, enabled, selected } = this.state;
        const { industries } = this.props;
        const industry = selected || industries[0]?._id;
        const data = {
            email, password, name, address, phone, hotline, fax, representative,
            position, mobile, re_email, website, introduce, contact, enabled, mode: MODE.exhibitor, industry
        }
        const dataRequied = { email, password, name, address, phone, representative, position, mobile, re_email, industry }
        const fieldError = Object.keys(dataRequied).find(field => !dataRequied[field]);

        if (fieldError) {
            this.setState({ fieldError, message: 'Vui lòng điền đầy đủ thông tin' })
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
                                title: 'Thêm nhà trưng bày thành công',
                                message: 'Bạn muốn thêm nhà trưng bày khác?',
                                confirm: 'Thêm',
                                cancel: 'Đóng',
                                handleConfirm: () => { this.setState({ ...this.defaultState });; onAdded(); },
                                handleCancel: () => { onAdded(); this.props.handleClose(); }
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


    render() {
        const { onAdd, handleClose, industries } = this.props;
        const { dropActive, email, password, name, address, phone, hotline, fax, representative,
            position, mobile, re_email, website, introduce, contact, enabled,
            selected, dropIndustry, fieldError, message } = this.state;
        const industrySelected = industries.find(i => i._id === selected) || industries[0] || {};
        return (
            <div id="myDynamicModal" className={"modal-create modal fade" + (onAdd ? " in" : "")} style={{ display: onAdd ? 'block' : 'none' }}>
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <form method="POST" action="/" id="form" onSubmit={this.handleSubmit} >
                            <div className="modal-header">
                                <button type="button" className="close" onClick={handleClose}>×</button>
                                Thêm nhà trưng bày
                            </div>
                            <div className="modal-body">
                                <div className="row">
                                    <div className="col-md-8 nopadding-right">
                                        <div className={"form-group" + (fieldError === 'name' ? " has-error" : "")}>
                                            <label htmlFor="name">Tên nhà trưng bày*</label>
                                            <input className="form-control" placeholder="Enter Full Name" required value={name} id="name" name="name" type="text" onChange={this.handleChange} />
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
                                            <label htmlFor="active">Trạng thái*</label>
                                            <span className={"select2 select2-container select2-container--default" + (dropActive ? " select2-container--open" : "")} style={{ width: '100%' }}>
                                                <span className="selection" onClick={this.handleDropdown}>
                                                    <span className="select2-selection select2-selection--single"  >
                                                        <span className="select2-selection__rendered" id="select2-active-container" title={enabled ? "Hoạt động" : "Không hoạt động"}>{enabled ? "Hoạt động" : "Không hoạt động"}</span>
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
                                            <label htmlFor="email">Email*</label>
                                            <input className="form-control" placeholder="Nhập email đăng ký" required value={email} name="email" id="email" type="email" onChange={this.handleChange} />
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
                                            <label htmlFor="password">Mật khẩu*</label>
                                            <input className="form-control" id="password" placeholder="Nhập mật khẩu" required value={password} name="password" type="password" onChange={this.handleChange} />
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
                                            <label htmlFor="address">Địa chỉ*</label>
                                            <input className="form-control" placeholder="Nhập địa chỉ" required id="address" value={address} name="address" type="text" onChange={this.handleChange} />
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
                                            <label htmlFor="active">Ngành công nghiệp*</label>
                                            <span className={"select2 select2-container select2-container--default" + (dropIndustry ? " select2-container--open" : "")} style={{ width: '100%' }}>
                                                <span className="selection" onClick={this.handleDropdownIndustry}>
                                                    <span className="select2-selection select2-selection--single"  >
                                                        <span className="select2-selection__rendered" id="select2-active-container" title={industrySelected.name}>{industrySelected.name}</span>
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
                                            <label htmlFor="website">Website*</label>
                                            <input className="form-control" id="website" placeholder="Nhập trang chủ nhà trưng bày" value={website} name="website" type="text" onChange={this.handleChange} />
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
                                            <label htmlFor="phone">Số điện thoại*</label>
                                            <input className="form-control" id="phone" placeholder="Nhập số điện thoại" required value={phone} name="phone" type="text" onChange={this.handleChange} />
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
                                            <label htmlFor="hotline">Hotline</label>
                                            <input className="form-control" placeholder="Nhập số điện thoại đường dây nóng" id="hotline" value={hotline} name="hotline" type="text" onChange={this.handleChange} />
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
                                            <label htmlFor="fax">Fax</label>
                                            <input className="form-control" id="fax" placeholder="Nhập số fax" value={fax} name="fax" type="text" onChange={this.handleChange} />
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
                                            <label htmlFor="representative">Người đại diện</label>
                                            <input className="form-control" placeholder="Nhập họ tên người đại diện" required id="representative" value={representative} name="representative" type="text" onChange={this.handleChange} />
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
                                            <label htmlFor="position">Chức vụ</label>
                                            <input className="form-control" id="position" placeholder="Nhập chức vụ của người đại diện" required value={position} name="position" type="text" onChange={this.handleChange} />
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
                                            <label htmlFor="mobile">Số điện thoại người đại diện</label>
                                            <input className="form-control" placeholder="Nhập số điện thoại của người đại diện" required id="mobile" value={mobile} name="mobile" type="text" onChange={this.handleChange} />
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
                                            <label htmlFor="re_email">Email người đại diện</label>
                                            <input className="form-control" id="re_email" placeholder="Nhập email của người đại diện" required value={re_email} name="re_email" type="text" onChange={this.handleChange} />
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
                                    <label htmlFor="introduce">Giới thiệu</label>
                                    <textarea className="form-control summernote" rows={2} placeholder="Giới thiệu sơ lược về nhà trưng bày" value={introduce} name="introduce" cols={50} id="introduce" onChange={this.handleChange} />
                                    <div className="help-block with-errors">
                                        {fieldError === 'introduce' && message ?
                                            <ul className="list-unstyled">
                                                <li>{message}.</li>
                                            </ul>
                                            : ""}
                                    </div>
                                </div>
                                <div className={"form-group" + (fieldError === 'contact' ? " has-error" : "")}>
                                    <label htmlFor="contact">Thông tin liên hệ</label>
                                    <textarea className="form-control summernote" rows={2} placeholder="Thông tin liên hệ khác của nhà trưng bày" value={contact} name="contact" cols={50} id="contact" onChange={this.handleChange} />
                                    <div className="help-block with-errors">
                                        {fieldError === 'contact' && message ?
                                            <ul className="list-unstyled">
                                                <li>{message}.</li>
                                            </ul>
                                            : ""}
                                    </div>
                                </div>
                            </div><div className="modal-footer">
                                <input className="btn btn-flat btn-new" type="submit" value="Thêm" />
                            </div>
                        </form>
                    </div>
                </div>
            </div >
        )
    }
}

export default connect(({ admin: { industries } }) => ({ industries }))(AddExhibitor)
