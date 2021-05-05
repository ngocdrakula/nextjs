import React, { Component } from 'react'
import { connect } from 'react-redux';
import types from '../../../redux/types';

class AddSize extends Component {
    constructor(props) {
        super(props);
        this.state = {
            width: '',
            height: ''
        };
    }
    componentDidUpdate(prevProps) {
        const { visible } = this.props;
        if (visible && !prevProps.visible) {
            document.documentElement.classList = "modal-open";
            document.documentElement.style = { paddingRight: 16 };
            this.setState({
                width: '',
                height: '',
                enabled: true,
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
        const { width, height, enabled } = this.state;
        if (!width) this.setState({ field: 'width', message: 'Chiều rộng không được để trống' });
        else if (!height) this.setState({ field: 'height', message: 'Chiều dài không được để trống' });
        else {
            const { dispatch } = this.props;
            const size = { width: Number(width), height: Number(height), enabled };
            dispatch({
                type: types.ADMIN_ADD_SIZE,
                payload: size,
                callback: res => {
                    if (res?.data?.success) {
                        this.handleClose();
                        this.props.onAdded();
                    }
                    else if (res?.data?.exist) {
                        this.setState({
                            field: res.data.field || 'size',
                            message: res.data.message
                        })
                    }
                }
            })
        }
    }
    handleChange = e => this.setState({ [e.target.name]: e.target.value, field: null, message: null });
    handleCheckbox = e => this.setState({ [e.target.name]: e.target.checked });
    render() {
        const { visible } = this.props;
        const { width, height, enabled, field, message } = this.state;
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
                                <h5 className="modal-title">Thêm kích thước</h5>
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
                                                    <label>Chiều rộng: <span className="error-field">{field === 'width' ? `(${message})` : ""}</span></label>
                                                    <input className="form-control" type="text" name="width" placeholder="Đơn vị: mm" value={width || ''} onChange={this.handleChange} />
                                                </div>
                                            </div>
                                            <div className="col">
                                                <div className="form-group">
                                                    <label>Chiều rộng: <span className="error-field">{field === 'height' ? `(${message})` : ""}</span></label>
                                                    <input className="form-control" type="text" name="height" placeholder="Đơn vị: mm" value={height || ''} onChange={this.handleChange} />
                                                </div>
                                            </div>
                                        </div>
                                        {field === 'size' ?
                                            <div className="row">
                                                <div className="col">
                                                    <label><span className="error-field">Kích thước đã tồn tại</span></label>
                                                </div>
                                            </div>
                                            : ""}
                                        <div className="row">
                                            <div className="col">
                                                <div className="form-group custom-control custom-checkbox">
                                                    <input type="checkbox" className="custom-control-input" name="enabled" id="add-size-enabled" checked={enabled ? "checked" : ""} onChange={this.handleCheckbox} />
                                                    <label className="custom-control-label" htmlFor="add-size-enabled">Trạng thái</label>
                                                </div>
                                            </div>
                                            <div className="col d-flex justify-content-end align-items-end">
                                                <div className="form-group">
                                                    <button className="btn btn-primary" type="submit">Lưu lại</button>
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


export default connect(({ admin }) => ({ fronts: admin.front.data, sizes: admin.size.data }))(AddSize)
