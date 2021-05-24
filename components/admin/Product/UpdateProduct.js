import React, { Component } from 'react'
import { connect } from 'react-redux';
import { createFormData, getThumbnail } from '../../../utils/helper';
import types from '../../../redux/types';
import Select from '../Form/Select';
import CheckList from '../Form/CheckList';

const productTypes = [{ value: 'wall', label: 'Tường' }, { value: 'floor', label: 'Sàn' }];

class UpdateProduct extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidUpdate(prevProps) {
        const { product } = this.props;
        if (product && !prevProps.product) {
            document.documentElement.classList = "modal-open";
            document.documentElement.style = { paddingRight: 16 };
            this.setState({
                ...product,
                imageLocal: null,
                sizeSelected: null,
                frontSelected: null,
                roomSelecteds: [],
                typeSelecteds: [],
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
        const { _id, name, sizeSelected, frontSelected, roomSelecteds, typeSelecteds, enabled, files } = this.state;
        if (!name) this.setState({ field: 'name', message: 'Tên sản phẩm không được để trống' });
        else {
            const data = { enabled };
            if (name !== this.props.product.name) data.name = name;
            if (sizeSelected) data.sizeId = sizeSelected.value;
            if (frontSelected) data.frontId = frontSelected.value;
            if (roomSelecteds.length) data.room = roomSelecteds.join(',');
            if (typeSelecteds.length) data.type = typeSelecteds.join(',');
            if (files && files.length) data.files = files;

            const formData = createFormData(data);
            const { dispatch } = this.props;
            dispatch({
                type: types.ADMIN_UPDATE_PRODUCT,
                payload: { _id, formData },
                callback: res => {
                    if (res?.data?.success) {
                        this.handleClose();
                    }
                    else if (res?.data?.exist) {
                        this.setState({
                            field: res.data.field,
                            message: res.data.message
                        })
                    }
                }
            })
        }
    }
    handleChange = e => this.setState({ [e.target.name]: e.target.value, message: null });
    handleCheckbox = e => this.setState({ [e.target.name]: e.target.checked });
    handleChooseFiles = e => {
        const files = e.target.files;
        this.setState({ files });
        if (files[0]) {
            const reader = new FileReader();
            reader.onload = () => {
                this.setState({ imageLocal: reader.result })
            }
            reader.readAsDataURL(files[0]);
        }
    }
    render() {
        const { product, fronts, sizes, rooms } = this.props;
        const { _id, enabled, front, room, type, name, size, loading } = this.state;
        const { imageLocal, field, message } = this.state;
        const { width, height } = size || {};
        const sizeName = `${width}x${height} mm`;
        const oldRooms = rooms.map(r => r._id).filter(r => room?.includes(r));
        const oldTypes = productTypes.map(t => t.value).filter(t => type?.includes(t));

        const sizeSelects = sizes.filter(s => s.enabled).map(s => ({ value: s._id, label: `${s.width}x${s.height} mm` }));
        const frontSelects = fronts.filter(f => f.enabled).map(f => ({ value: f._id, label: f.name }));
        const roomSelects = rooms.filter(r => r.enabled).map(r => ({ value: r._id, label: r.name }));

        return (
            <div>
                <div
                    className={"modal fade" + (product ? " show" : "")}
                    style={product ?
                        { paddingRight: 16, display: 'block' }
                        : { display: 'none' }
                    }
                    onClick={e => e.target.className === "modal fade show" ? this.handleClose() : ""}
                >
                    <div className="modal-dialog modal-lg" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Sửa sản phẩm</h5>
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
                                                        {field === 'room' && message ?
                                                            <span className="error-field">({message})</span>
                                                            : ""
                                                        }
                                                    </label>
                                                    <CheckList
                                                        id={_id}
                                                        data={roomSelects}
                                                        onChange={roomSelecteds => this.setState({ roomSelecteds })}
                                                        hover="Chọn khu vực"
                                                        selecteds={oldRooms}
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label>
                                                        <span>Kích thước: </span>
                                                        {field === 'size' && message ?
                                                            <span className="error-field">({message})</span>
                                                            : ""
                                                        }
                                                    </label>
                                                    <Select
                                                        id={`${product ? 1 : 0}`}
                                                        data={sizeSelects}
                                                        onChange={(id, sizeSelected) => this.setState({ sizeSelected })}
                                                        hover={sizeName}
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label>
                                                        <span>Loại bề mặt: </span>
                                                        {field === 'front' && message ?
                                                            <span className="error-field">({message})</span>
                                                            : ""
                                                        }
                                                    </label>
                                                    <Select
                                                        id={`${product ? 1 : 0}`}
                                                        data={frontSelects}
                                                        onChange={(id, frontSelected) => this.setState({ frontSelected })}
                                                        hover={front?.name}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col">
                                                <div className="w-100 h-100" style={{ padding: 15, position: 'relative' }}>
                                                    <div className="w-100 h-100 image-upload-change">
                                                        <div
                                                            className="w-100 h-100 d-flex justify-content-center align-items-center image-upload-over"
                                                            style={{ backgroundImage: imageLocal || product?.size ? `url(${imageLocal || "/api/images/" + getThumbnail(product)})` : '#FFF' }} >
                                                        </div>
                                                        <div className="w-100 h-100 d-flex justify-content-center align-items-center input-upload-over">
                                                            <input type="file" name="files" id="files" className="file-hidden" onChange={this.handleChooseFiles} />
                                                            <label htmlFor="files">
                                                                <div className="btn btn-primary">Thay đổi</div>
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
                                                    <CheckList
                                                        id={_id}
                                                        data={productTypes}
                                                        onChange={typeSelecteds => this.setState({ typeSelecteds })}
                                                        hover="Chọn loại sản phẩm"
                                                        selecteds={oldTypes}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col d-flex align-items-end">
                                                <div className="row w-100">
                                                    <div className="col d-flex justify-content-start align-items-center">
                                                        <div className="form-group custom-control custom-checkbox">
                                                            <input type="checkbox" className="custom-control-input" name="enabled" id="update-enabled" checked={enabled ? "checked" : ""} onChange={this.handleCheckbox} />
                                                            <label className="custom-control-label" htmlFor="update-enabled">Trạng thái</label>
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
                <div className={product ? "modal-backdrop fade show" : ""} />
            </div >
        )
    }
}


export default connect(({ admin }) => ({ fronts: admin.front.data, sizes: admin.size.data, rooms: admin.room.data }))(UpdateProduct)
