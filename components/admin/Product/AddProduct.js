import React, { Component } from 'react'
import { connect } from 'react-redux';
import { createFormData } from '../../../utils/helper';
import types from '../../../redux/types';
import Select from '../Form/Select';

const productTypes = [{ value: 'wall', label: 'Tường' }, { value: 'floor', label: 'Sàn' }];

class AddProduct extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
        };
    }
    componentDidUpdate(prevProps) {
        const { visible } = this.props;
        if (visible && !prevProps.visible) {
            document.documentElement.classList = "modal-open";
            document.documentElement.style = { paddingRight: 16 };
            this.setState({
                name: '',
                enabled: true,
                files: null,
                imageLocal: null,
                sizeSelected: null,
                frontSelected: null,
                roomSelected: null,
                typeSelected: null,
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
        const { name, sizeSelected, frontSelected, roomSelected, typeSelected, enabled, files } = this.state;
        if (!name) this.setState({ field: 'name', message: 'Tên sản phẩm là bắt buộc' });
        else if (!frontSelected) this.setState({ field: 'front', message: 'Loại bề mặt chưa được chọn' });
        else if (!sizeSelected) this.setState({ field: 'size', message: 'Kích thước chưa được chọn' });
        else if (!roomSelected) this.setState({ field: 'room', message: 'Khu vực chưa được chọn' });
        else if (!typeSelected) this.setState({ field: 'type', message: 'Loại sản phẩm chưa được chọn' });
        else if (!files?.length) this.setState({ field: 'files', message: 'Ảnh chưa được chọn' });
        else {
            const data = {
                name,
                enabled,
                sizeId: sizeSelected.value,
                frontId: frontSelected.value,
                roomId: roomSelected.value,
                type: typeSelected.value,
                files
            };
            const formData = createFormData(data);
            const { dispatch } = this.props;
            this.setState({ loading: true })
            dispatch({
                type: types.ADMIN_ADD_PRODUCT,
                payload: formData,
                callback: res => {
                    if (res?.data?.success) {
                        this.handleClose();
                        this.props.onAdded();
                        this.setState({ loading: false })
                    }
                    else if (res?.data?.exist) {
                        this.setState({
                            field: res.data.field,
                            message: res.data.message,
                            loading: false
                        })
                    }
                }
            })
        }
    }
    handleChange = e => this.setState({ [e.target.name]: e.target.value, field: null, message: null });
    handleCheckbox = e => this.setState({ [e.target.name]: e.target.checked });
    handleChooseFiles = e => {
        const files = e.target.files;
        if (files[0]) {
            const reader = new FileReader();
            reader.onload = () => {
                this.setState({ files, imageLocal: reader.result, field: null, message: null })
            }
            reader.readAsDataURL(files[0]);
        }
        this.setState({ files, imageLocal: null, field: null, message: null });
    }
    render() {
        const { visible, fronts, sizes, rooms } = this.props;
        const { enabled, name, loading, imageLocal, field, message } = this.state;

        const sizeSelects = sizes.filter(s => s.enabled).map(s => ({ value: s._id, label: `${s.width}x${s.height} mm` }));
        const frontSelects = fronts.filter(f => f.enabled).map(f => ({ value: f._id, label: f.name }));
        const roomSelects = rooms.filter(r => r.enabled).map(r => ({ value: r._id, label: r.name }));
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
                                <h5 className="modal-title">Thêm sản phẩm</h5>
                                <button type="button" className="close" onClick={this.handleClose}>
                                    <span aria-hidden="true">×</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="py-1">
                                    <form className="form" onSubmit={this.handleSubmit}>
                                        <div className="row">
                                            <div className="col">
                                                <div className="form-group">
                                                    <label>Tên sản phẩm: <span className="error-field">{field === 'name' && message ? `(${message})` : ""}</span></label>
                                                    <input className="form-control" type="text" name="name" placeholder={name} value={name || ''} onChange={this.handleChange} />
                                                </div>
                                                <div className="form-group">
                                                    <label>
                                                        <span>Khu vực: </span>
                                                        {field === 'room' && message ? <span className="error-field">({message})</span> : ""}
                                                    </label>
                                                    <Select
                                                        data={roomSelects}
                                                        onChange={(id, roomSelected) => this.setState({ roomSelected })}
                                                        hover="Chọn khu vực"
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label>Kích thước: <span className="error-field">{field === 'size' && message ? `(${message})` : ""}</span></label>
                                                    <Select
                                                        data={sizeSelects}
                                                        onChange={(id, sizeSelected) => this.setState({ sizeSelected })}
                                                        hover="Chọn kích thước"
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label>Loại bề mặt: <span className="error-field">{field === 'front' && message ? `(${message})` : ""}</span></label>
                                                    <Select
                                                        data={frontSelects}
                                                        onChange={(id, frontSelected) => this.setState({ frontSelected })}
                                                        hover="Chọn bề mặt"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col">
                                                <div className="w-100 h-100" style={{ padding: 15, position: 'relative' }}>
                                                    <div className="w-100 h-100 image-upload-change">
                                                        <div
                                                            className="w-100 h-100 d-flex justify-content-center align-items-center image-upload-over"
                                                            style={{ backgroundImage: imageLocal ? `url(${imageLocal})` : '#FFF' }} >
                                                        </div>
                                                        <div className={"w-100 h-100 d-flex justify-content-center align-items-center input-upload-over" + (field === 'files' ? " active" : "")}>
                                                            <input type="file" name="files" id="add-files" className="file-hidden" onChange={this.handleChooseFiles} />
                                                            <label htmlFor="add-files">
                                                                <div className={field === 'files' ? "btn btn-danger" : "btn btn-primary"}>{imageLocal ? "Thay đổi" : field === 'files' ? "Vui lòng chọn ảnh" : "Thêm ảnh"}</div>
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col">
                                                <div className="form-group">
                                                    <label>
                                                        <span>Loại sản phẩm: </span>
                                                        {field === 'type' && message ?
                                                            <span className="error-field">({message})</span>
                                                            : ""
                                                        }
                                                    </label>
                                                    <Select
                                                        data={productTypes}
                                                        onChange={(id, typeSelected) => this.setState({ typeSelected })}
                                                        hover="Chọn loại sản phẩm"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col d-flex align-items-end">
                                                <div className="row w-100">
                                                    <div className="col d-flex justify-content-start align-items-center">
                                                        <div className="form-group custom-control custom-checkbox">
                                                            <input type="checkbox" className="custom-control-input" name="enabled" id="add-enabled" checked={enabled ? "checked" : ""} onChange={this.handleCheckbox} />
                                                            <label className="custom-control-label" htmlFor="add-enabled">Trạng thái</label>
                                                        </div>
                                                    </div>
                                                    <div className="col d-flex justify-content-end align-items-end">
                                                        <div className="form-group">
                                                            <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? 'Đang lưu...' : 'Lưu lại'}</button>
                                                        </div>
                                                    </div>
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


export default connect(({ admin: { front, size, room } }) => ({ fronts: front.data, sizes: size.data, rooms: room.data }))(AddProduct)
