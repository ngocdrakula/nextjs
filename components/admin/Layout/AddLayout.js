import React, { Component } from 'react'
import { connect } from 'react-redux';
import { convertLayoutClient, createFormData } from '../../../utils/helper';
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
            this.handleReload(null);
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
        else if (!roomSelected) this.setState({ field: 'room', message: 'Không gian chưa được chọn' });
        else {
            this.handleCreateLayout(this.handleCloneLayout)
        }
    }
    handleCloneLayout = (callback) => {
        const { name, roomSelected, enabled, id } = this.state;
        const { dispatch } = this.props;
        const data = {
            name,
            enabled,
            roomId: roomSelected._id,
            url: url + "/get/room2d/" + id,
            src: url
        };
        this.setState({ submitting: true, process: 5 })
        dispatch({
            type: types.ADMIN_CLONE_LAYOUT,
            payload: data,
            callback: res => {
                if (res?.data?.success) {
                    this.handleReload(true);
                    this.props.onAdded();
                }
                else if (res?.data?.exist) {
                    this.setState({
                        field: 'name',
                        message: res.data.message,
                        submitting: false
                    })
                }
                else {
                    if (typeof callback === 'function') callback()
                    else {
                        this.setState({
                            field: 'name',
                            message: 'Thêm không thành công.',
                            submitting: false
                        })
                    }
                }
            }
        });

    }
    handleCreateLayout = async (callback) => {
        this.setState({ submitting: true, progress: 10 })
        const { layout, name, roomSelected, enabled } = this.state;
        const { dispatch } = this.props;
        if (layout?.id) {
            const { image, shadow, shadow_matt, surfaces } = layout;
            try {
                const layout = convertLayoutClient(JSON.parse(surfaces));
                const { vertical, horizontal, cameraFov, areas } = layout;
                const origin = shadow ? await this.loadImageFromUrl(shadow) : null;
                this.setState({ progress: 30 })
                await this.delay(2000);
                const transparent = await this.loadImageFromUrl(image);
                this.setState({ progress: 60 })
                await this.delay(2000);
                const matt = shadow_matt ? await this.loadImageFromUrl(shadow_matt) : null;
                this.setState({ progress: 90 });
                if (!origin && !matt) throw {}
                const files = [origin || matt, transparent, matt || origin];
                const data = { name, roomId: roomSelected._id, files, vertical, horizontal, cameraFov, areas, enabled };
                const formData = createFormData(data);
                dispatch({
                    type: types.ADMIN_ADD_LAYOUT,
                    payload: formData,
                    callback: res => {
                        if (res?.data?.success) {
                            this.handleReload(true)
                            this.props.onAdded();
                        }
                        else if (res?.data?.exist) {
                            this.setState({
                                field: 'name',
                                message: res.data.message,
                                submitting: false
                            })
                        }
                        else {
                            if (typeof callback === 'function') callback()
                            else {
                                this.setState({
                                    field: 'name',
                                    message: 'Thêm không thành công.',
                                    submitting: false
                                })
                            }
                        }
                    }
                });

            } catch (e) {
                if (typeof callback === 'function') callback()
                else this.setState({
                    field: 'name',
                    message: 'Thêm không thành công.',
                    submitting: false
                })
            }
        }

    }
    delay = async (timeout) => {
    }
    loadImageFromUrl = async img => {
        const src = "/api/admin/getUrl?url=" + url + img;
        return new Promise(resolve => {
            var request = new XMLHttpRequest();
            request.responseType = "blob";
            request.onload = function () {
                return resolve(request.response);
            }
            request.onerror = function () {
                return resolve(null);
            }
            request.onabort = function () {
                return resolve(null);
            }
            request.open("GET", src);
            request.send();
        })
    }
    loadImageByCanvas = async src => {
        return new Promise(resolve => {
            const image = new Image;
            const c = document.createElement("canvas");
            const ctx = c.getContext("2d");

            image.onload = function () {
                c.width = this.naturalWidth;     // update canvas size to match image
                c.height = this.naturalHeight;
                ctx.drawImage(this, 0, 0);       // draw in image
                c.toBlob(function (blob) {        // get content as JPEG blob
                    return resolve(blob);
                }, "image/jpeg", 0.75);
            };
            image.crossOrigin = "";              // if from different origin
            image.src = src;
        })
    }
    handleReload = (success) => {
        this.setState({
            name: '',
            id: success ? Number(this.state.id || 0) + 1 : '',
            icon: '',
            message: '',
            enabled: true,
            roomSelected: success ? this.state.roomSelected : null,
            loading: false,
            submitting: false,
            changed: false,
            success
        });
    }
    handleChange = e => {
        this.setState({
            [e.target.name]: e.target.value,
            field: null,
            message: null,
            changed: e.target.name === 'name',
            success: false
        });
    }
    handleCheckbox = e => this.setState({ [e.target.name]: e.target.checked, success: false });
    handleLoadUrl = () => {
        const { id } = this.state;
        const layoutUrl = url + "/get/room2d/" + id;
        this.setState({ loading: true, success: false, message: '' })
        admin_getLayoutFromUrl(layoutUrl).then(res => {
            if (res?.data?.id) {
                const { name, icon } = res.data;
                this.setState({
                    icon,
                    name: this.state.changed ? this.state.name : name,
                    originName: name,
                    disabled: false,
                    loading: false,
                    layout: res.data,
                })
            }
            else {
                this.setState({
                    message: 'Đường dẫn sai hoặc không đúng định dạng',
                    field: 'url',
                    icon: '',
                    originName: '',
                    disabled: true,
                    loading: false
                })
            }
        }).catch(e => {
            this.setState({
                message: 'Đường dẫn sai hoặc không đúng định dạng',
                field: 'url',
                icon: '',
                originName: '',
                disabled: true,
                loading: false
            })
        })
    }
    render() {
        const { visible, rooms } = this.props;
        const { enabled, name, originName, icon, id, disabled, progress } = this.state;
        const { roomSelected, roomDropdown, field, message, loading, submitting, success } = this.state;
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
                                <h5 className="modal-title">Thêm kiểu bố trí </h5>
                                {success ? <div style={{ fontSize: 16, color: 'green', marginLeft: 5, lineHeight: '30px' }}> (Thêm thành công)</div> : ''}
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
                                                                <button className="btn btn-primary ml-3" type="button" onClick={this.handleLoadUrl} disabled={loading}>
                                                                    {loading ? 'Loading...' : 'Kiểm tra'}
                                                                </button>
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
                                                        <div className="w-100 h-100 d-flex justify-content-center align-items-center" style={{ paddingTop: 20 }}>
                                                            <img src={url + icon} style={{ width: '100%', height: 'auto' }} />
                                                        </div>
                                                    </div>
                                                    : loading ?
                                                        <div className="w-100 h-100 d-flex justify-content-center align-items-center" style={{ paddingTop: 20 }}>
                                                            <div className="">Vui lòng chờ...</div>
                                                        </div>
                                                        : ''}
                                            </div>
                                        </div>
                                        {submitting && progress ?
                                            <div className="row">
                                                <div className="col">
                                                    <div className="progress" style={{ marginBottom: 10 }}>
                                                        <div className="progress-bar progress-bar-striped active" style={{ width: progress + "%" }}>{progress}%</div>
                                                    </div>
                                                </div>
                                            </div>
                                            : ''}
                                        <div className="row">
                                            <div className="col">
                                                <div className="form-group custom-control custom-checkbox">
                                                    <input type="checkbox" className="custom-control-input" name="enabled" id="add-layout-enabled" checked={enabled ? "checked" : ""} onChange={this.handleCheckbox} />
                                                    <label className="custom-control-label" htmlFor="add-layout-enabled">Trạng thái</label>
                                                </div>
                                            </div>
                                            <div className="col d-flex justify-content-end align-items-end">
                                                <div className="form-group">
                                                    <button className="btn btn-primary" type="submit" disabled={disabled || submitting}>{submitting ? 'Đang lưu...' : 'Lưu lại'}</button>
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
