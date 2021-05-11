import React, { Component } from 'react'
import { connect } from 'react-redux';
import { convertLayout, createFormData } from '../../../utils/helper';
import types from '../../../redux/types';
import { admin_getLayoutFromUrl } from '../../../redux/actions/adminActions';

const url = 'https://visualizer.vitto.vn';

class AddLayout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            disabled: true,
        };
    }
    componentDidUpdate(prevProps) {
        const { visible } = this.props;
        if (visible && !prevProps.visible) {
            document.documentElement.classList = "modal-open";
            document.documentElement.style = { paddingRight: 16 };
            this.setState({
                name: '',
                id: '',
                icon: '',
                message: '',
                enabled: true,
                roomSelected: null,
            });
        }
    }
    handleClose = () => {
        this.props.onHide();
        document.documentElement.classList = "modal-open";
        document.documentElement.style = { paddingRight: 16 };
    }
    handleSubmit = e => {
        e.preventDefault();
        const { name, roomSelected, enabled, id } = this.state;
        if (!name) this.setState({ field: 'name', message: 'Tên kiểu bố trí là bắt buộc' });
        else if (!roomSelected) this.setState({ field: 'room', message: 'Loại bề mặt chưa được chọn' });
        else {
            const { dispatch } = this.props;
            const data = {
                name,
                enabled,
                roomId: roomSelected._id,
                url: url + "/get/room2d/" + id,
                src: url
            };
            dispatch({
                type: types.ADMIN_CLONE_LAYOUT,
                payload: data,
                callback: res => {
                    if (res?.data?.success) {
                        this.handleClose();
                        this.props.onAdded();
                    }
                    else if (res?.data?.exist) {
                        this.setState({
                            field: 'name',
                            message: res.data.message
                        })
                    }
                    else {
                        this.setState({
                            field: 'name',
                            message: 'Thêm thất bại.'
                        })
                    }
                }
            })
        }
    }
    handleChange = e => this.setState({ [e.target.name]: e.target.value, field: null, message: null });
    handleCheckbox = e => this.setState({ [e.target.name]: e.target.checked });
    handleLoadUrl = () => {
        const { id } = this.state;
        const layoutUrl = url + "/get/room2d/" + id;
        admin_getLayoutFromUrl(layoutUrl).then(res => {
            if (res?.data?.id) {
                const { name, icon } = res.data;
                this.setState({
                    icon,
                    name: this.state.name || name,
                    originName: name,
                    disabled: false
                })
            }
            else {
                this.setState({
                    message: 'Đường dẫn sai hoặc không đúng định dạng',
                    icon: '',
                    originName: '',
                    disabled: true
                })
            }
        }).catch(e => {
            this.setState({
                message: 'Đường dẫn sai hoặc không đúng định dạng',
                icon: '',
                originName: '',
                disabled: true
            })
        })
    }
    render() {
        const { visible, rooms } = this.props;
        const { enabled, name, originName, icon, id, disabled } = this.state;
        const { roomSelected, roomDropdown, field, message } = this.state;
        return (
            <div>
                <div
                    className={"modal fade" + (visible ? " show" : "")}
                    style={visible ?
                        { paddingRight: 16, display: 'block' }
                        : { display: 'none' }
                    }
                    onClick={e => e.target.className === "modal fade show" ? this.handleClose() : ""}
                >
                    <div className="modal-dialog modal-lg" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Thêm kiểu bố trí</h5>
                                <button type="button" className="close" onClick={this.handleClose}>
                                    <span aria-hidden="true">×</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="py-1">
                                    <form className="form" onSubmit={this.handleSubmit}>
                                        <div className="row">
                                            <div className="col col-8">
                                                <div className="row">
                                                    <div className="col">
                                                        <div className="form-group">
                                                            <label>Địa chỉ kiểu bố trí gốc: <span className="error-field">{field === 'url' && message ? `(${message})` : ""}</span></label>
                                                            <div className="input-group mb-3">
                                                                <div className="input-group-prepend">
                                                                    <span className="input-group-text" id="basic-addon3">{url + "/room2d/"}</span>
                                                                </div>
                                                                <input className="form-control" type="text" name="id" placeholder={1} value={id || ''} onChange={this.handleChange} />
                                                                <button className="btn btn-primary ml-3" type="button" onClick={this.handleLoadUrl}>Load</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col">
                                                        <div className="form-group">
                                                            <label>Tên kiểu bố trí: <span className="error-field">{field === 'name' && message ? `(${message})` : ""}</span></label>
                                                            <input className="form-control" type="text" name="name" placeholder={name} value={name || ''} onChange={this.handleChange} />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col">
                                                        <div className="form-group">
                                                            <label>Khu vực: <span className="error-field">{field === 'room' && message ? `(${message})` : ""}</span></label>
                                                            <div className="input-select">
                                                                <div
                                                                    className="form-control input-select-current"
                                                                    onClick={() => this.setState({ roomDropdown: !roomDropdown })}
                                                                >
                                                                    <span>{roomSelected?.name || "Chọn"}</span>
                                                                    <i className="fas fa-chevron-down" style={{ fontSize: 12 }} />
                                                                </div>
                                                                <ul style={{
                                                                    display: roomDropdown ? 'block' : 'none'
                                                                }}
                                                                    className="input-select-container">
                                                                    {rooms.map(item => {
                                                                        if (!item.enabled) return null;
                                                                        return (
                                                                            <li
                                                                                key={item._id}
                                                                                onClick={() => this.setState({ roomSelected: item, roomDropdown: false, field: null, message: null })}
                                                                                className={"input-select-item" + (roomSelected?._id === item._id ? " active" : "")}
                                                                            >{item.name}</li>
                                                                        )
                                                                    })}
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col col-4">
                                                {icon ?
                                                    <div className="form-group">
                                                        <label>Kết quả:</label>
                                                        <br />
                                                        <label style={{ height: "calc(1.5em + .75rem + 2px)", lineHeight: 'calc(1.5em + .75rem + 2px)' }}><b>{originName}</b></label>
                                                        <div className="w-100 h-100 flex justify-content-center align-items-center" style={{ paddingTop: 20 }}>
                                                            <img src={url + icon} style={{ width: '100%', height: 'auto' }} />
                                                        </div>
                                                    </div>
                                                    : ""}
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col">
                                                <div className="form-group custom-control custom-checkbox">
                                                    <input type="checkbox" className="custom-control-input" name="enabled" id="add-layout-enabled" checked={enabled ? "checked" : ""} onChange={this.handleCheckbox} />
                                                    <label className="custom-control-label" htmlFor="add-layout-enabled">Trạng thái</label>
                                                </div>
                                            </div>
                                            <div className="col d-flex justify-content-end align-items-end">
                                                <div className="form-group">
                                                    <button className="btn btn-primary" type="submit" disabled={disabled}>Lưu lại</button>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div >
                </div >
                <div className={visible ? "modal-backdrop fade show" : ""} />
            </div >
        )
    }
}


export default connect(({ admin }) => ({ rooms: admin.room.data, sizes: admin.size.data }))(AddLayout)
