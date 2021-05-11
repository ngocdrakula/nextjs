import React, { Component } from 'react'
import { connect } from 'react-redux';
import { createFormData } from '../../../utils/helper';
import types from '../../../redux/types';

class UpdateLayout extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidUpdate(prevProps) {
        const { layout } = this.props;
        if (layout && !prevProps.layout) {
            document.documentElement.classList = "modal-open";
            document.documentElement.style = { paddingRight: 16 };
            this.setState({
                ...layout,
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
        const { _id, name, roomSelected, enabled } = this.state;
        const { dispatch } = this.props;
        if (!name) this.setState({ field: 'name', message: 'Tên kiểu bố trí là bắt buộc' });
        else {
            const data = { enabled };
            if (name !== this.props.layout.name) data.name = name;
            if (roomSelected) data.roomId = roomSelected._id;
            const formData = createFormData(data);
            this.setState({ loading: true })
            dispatch({
                type: types.ADMIN_UPDATE_LAYOUT,
                payload: { _id, formData },
                callback: res => {
                    if (res?.data?.success) {
                        this.handleClose();
                        this.setState({ loading: false })
                    }
                    else if (res?.data?.exist) {
                        this.setState({
                            field: 'name',
                            message: res.data.message,
                            loading: false
                        })
                    }
                    else {
                        this.setState({
                            field: 'name',
                            message: 'Sửa không thành công.'
                        })
                    }
                }
            })
        }
    }
    handleChange = e => this.setState({ [e.target.name]: e.target.value, message: null });
    handleCheckbox = e => this.setState({ [e.target.name]: e.target.checked });
    render() {
        const { layout, rooms } = this.props;
        const { enabled, name, loading } = this.state;
        const { roomSelected, roomDropdown, field, message } = this.state;
        const image = "/api/images/" + layout?.images?.[0] + "?width=512&height=288";

        return (
            <div>
                <div
                    className={"modal fade" + (layout ? " show" : "")}
                    style={layout ?
                        { paddingRight: 16, display: 'block' }
                        : { display: 'none' }
                    }
                    onClick={e => e.target.className === "modal fade show" ? this.handleClose() : ""}
                >
                    <div className="modal-dialog modal-lg" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Sửa kiểu bố trí</h5>
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
                                                                    <span>{roomSelected?.name || layout?.room?.name}</span>
                                                                    <i className="fas fa-chevron-down" style={{ fontSize: 12 }} />
                                                                </div>
                                                                <ul
                                                                    style={{ display: roomDropdown ? 'block' : 'none' }}
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
                                                {layout?.images?.length ?
                                                    <div className="form-group">
                                                        <div className="w-100 h-100 d-flex justify-content-center align-items-center" style={{ paddingTop: 20 }}>
                                                            <img src={image} style={{ width: '100%', height: 'auto' }} />
                                                        </div>
                                                    </div>
                                                    : ""}
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col">
                                                <div className="form-group custom-control custom-checkbox">
                                                    <input type="checkbox" className="custom-control-input" name="enabled" id="edit-layout-enabled" checked={enabled ? "checked" : ""} onChange={this.handleCheckbox} />
                                                    <label className="custom-control-label" htmlFor="edit-layout-enabled">Trạng thái</label>
                                                </div>
                                            </div>
                                            <div className="col d-flex justify-content-end align-items-end">
                                                <div className="form-group">
                                                    <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? 'Đang lưu...' : 'Lưu lại'}</button>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div >
                </div >
                <div className={layout ? "modal-backdrop fade show" : ""} />
            </div >
        )
    }
}


export default connect(({ admin }) => ({ rooms: admin.room.data, sizes: admin.size.data }))(UpdateLayout)
