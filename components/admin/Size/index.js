import React, { Component } from 'react'
import { connect } from 'react-redux';
import Switch from "react-switch";
import types from '../../../redux/types';
import Page from '../Page';
import PopupConfirm from '../PopupConfirm';
import AddSize from './AddSize';
import UpdateSize from './UpdateSize';

const pageSize = 100;

class Size extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selecteds: []
        };
    }
    componentDidMount() {
        const { data } = this.props;
        if (!data.length) {
            this.gotoPage(0);
        }
    }
    handleSwitch = (size) => {
        const { dispatch } = this.props;
        dispatch({
            type: types.ADMIN_UPDATE_SIZE,
            payload: size
        })
    }
    gotoPage = (page) => {
        const { dispatch } = this.props;
        dispatch({
            type: types.ADMIN_GET_SIZES,
            payload: { page, pageSize },
            callback: () => this.setState({ selecteds: [] })
        });
    }
    handleSelectAll = () => {
        const { selecteds } = this.state;
        const { data } = this.props;
        if (selecteds.length < data.length) {
            this.setState({ selecteds: data.map(p => p._id) });
        }
        else {
            this.setState({ selecteds: [] })
        }
    }
    handleSelect = (e) => {
        const { selecteds } = this.state;
        const id = e.target.id;
        if (selecteds.indexOf(id) + 1) {
            this.setState({ selecteds: selecteds.filter(i => i !== id) });
        }
        else {
            selecteds.push(id);
            this.setState({ selecteds: [...selecteds] });
        }
    }
    handleDeleteAll = () => {
        const { selecteds } = this.state;
        const { dispatch } = this.props;
        dispatch({
            type: types.ADMIN_DELETE_MULTI_SIZE,
            payload: selecteds,
            callback: result => {
                if (result && result.success) {
                    const { page } = this.props;
                    this.gotoPage(page);
                }
            }
        });
    }
    handleDelete = (_id) => {
        const { dispatch } = this.props;
        dispatch({
            type: types.ADMIN_DELETE_SIZE,
            payload: _id,
            callback: result => {
                if (result && result.success) {
                    const { page } = this.props;
                    this.gotoPage(page);
                }
            }
        });
    }
    render() {
        const { data, page, total } = this.props;
        const { selecteds, sizeOnEdit, addVisible, goPage } = this.state;
        const totalPage = 1;
        return (
            <div className="row flex-lg-nowrap">
                <div className="col mb-3">
                    <div className="e-panel card">
                        <div className="card-body">
                            <div className="card-title" style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                                <div style={{ display: 'flex', flex: 1 }}>
                                    <h6 className="mr-2">
                                        <span>Kích thước</span>
                                        <small className="px-1">({total} kích thước)</small>
                                    </h6>
                                    <form
                                        onSubmit={e => { e.preventDefault(); if (goPage >= 1) this.gotoPage(goPage - 1) }}
                                        style={{ marginBottom: '.5rem' }}
                                    >
                                        <span style={{ fontSize: 14, color: '#333333', fontWeight: 600, marginRight: 5 }} >Trang:</span>
                                        <input
                                            type="text"
                                            defaultValue={page + 1}
                                            placeholder="Trang"
                                            onChange={e => this.setState({ goPage: Number(e.target.value) || 1 })}
                                            style={{
                                                width: 40,
                                                padding: '0px 10px',
                                                fontSize: 14,
                                                borderRadius: 5,
                                                border: '1px solid #666',
                                                textAlign: 'right',
                                            }}
                                        />
                                        <span style={{ fontSize: 14, color: '#333333', fontWeight: 600 }} >  /  {totalPage} </span>
                                        <input
                                            className="page-submit"
                                            type="submit"
                                            value="Đi"
                                            style={{
                                                width: 'auto',
                                                padding: '0px 10px',
                                                fontSize: 14,
                                                textTransform: 'none',
                                                borderRadius: 5,
                                                border: '1px solid #007bff',
                                                background: '#007bff',
                                                color: '#FFF',
                                                marginLeft: 5,
                                            }}
                                        />
                                    </form>
                                </div>
                                <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
                                    {selecteds.length ?
                                        <PopupConfirm
                                            ButtonClick={({ handleClick }) => (
                                                <button
                                                    type="button"
                                                    onClick={handleClick}
                                                    style={{
                                                        padding: '5px 10px',
                                                        fontSize: 14,
                                                        borderRadius: 5,
                                                        border: '1px solid red',
                                                        background: 'red',
                                                        color: '#FFF',
                                                    }}
                                                >Xóa {selecteds.length} mục đã chọn</button>
                                            )}
                                            handleAccept={this.handleDeleteAll}
                                            accept="Bạn có chắc chắn muốn xóa"
                                            ok="Chấp nhận"
                                            cancel="Hủy"
                                        />
                                        : ""}
                                    <button
                                        type="button"
                                        onClick={() => this.setState({ addVisible: true })}
                                        style={{
                                            padding: '5px 10px',
                                            fontSize: 14,
                                            borderRadius: 5,
                                            border: '1px solid #007bff',
                                            background: '#007bff',
                                            color: '#FFF',
                                            marginLeft: 10
                                        }}
                                    >Thêm kích thước</button>
                                </div>
                            </div>
                            <div className="e-table">
                                <div className="table-responsive table-lg mt-3">
                                    <table className="table table-bordered">
                                        <tbody>
                                            <tr style={{ textAlign: 'center' }}>
                                                <td className="align-middle">
                                                    <div
                                                        className="custom-control custom-control-inline custom-checkbox custom-control-nameless align-top"
                                                        style={{ margin: 0, marginLeft: '.5rem' }}
                                                    >
                                                        < input
                                                            id="select-all"
                                                            type="checkbox"
                                                            className="custom-control-input"
                                                            onChange={this.handleSelectAll}
                                                            checked={selecteds.length ? "checked" : ""}
                                                        />
                                                        <label className="custom-control-label" htmlFor="select-all" />
                                                    </div>
                                                </td>
                                                <td className="text-nowrap align-middle"><b>Kích thước</b></td>
                                                <td className="text-nowrap align-middle"><b>Chiều rộng</b></td>
                                                <td className="text-nowrap align-middle"><b>Chiều dài</b></td>
                                                <td className="text-nowrap align-middle"><b>Đơn vị</b></td>
                                                <td className="text-nowrap align-middle"><b>Trạng thái</b></td>
                                                <td className="text-center align-middle"><b>Tùy chọn</b></td>
                                            </tr>
                                            {data.map(size => {
                                                const checked = (selecteds.indexOf(size._id) + 1) ? "checked" : "";
                                                return (
                                                    <tr key={size._id} style={{ textAlign: 'center' }}>
                                                        <td className="align-middle">
                                                            <div
                                                                className="custom-control custom-control-inline custom-checkbox custom-control-nameless align-top"
                                                                style={{ margin: 0, marginLeft: '.5rem' }}
                                                            >
                                                                < input
                                                                    id={size._id}
                                                                    type="checkbox"
                                                                    className="custom-control-input"
                                                                    onChange={this.handleSelect}
                                                                    checked={checked}
                                                                />
                                                                <label className="custom-control-label" htmlFor={size._id} />
                                                            </div>
                                                        </td>
                                                        <td className="text-nowrap align-middle">
                                                            <span>{size.width}x{size.height} mm</span>
                                                        </td>
                                                        <td className="text-nowrap align-middle">
                                                            <span>{size.width}</span>
                                                        </td>
                                                        <td className="text-nowrap align-middle">
                                                            <span>{size.height}</span>
                                                        </td>
                                                        <td className="text-nowrap align-middle">
                                                            <span>mm</span>
                                                        </td>
                                                        <td className="text-center align-middle">
                                                            <div>
                                                                <Switch
                                                                    id={size._id}
                                                                    onChange={enabled => this.handleSwitch({ ...size, enabled })}
                                                                    checked={size.enabled}
                                                                    width={40}
                                                                    height={20}
                                                                    checkedIcon={null}
                                                                    uncheckedIcon={null}
                                                                />
                                                            </div>
                                                        </td>
                                                        <td className="text-center align-middle">
                                                            <div className="btn-group align-top">
                                                                <button
                                                                    className="btn btn-sm btn-outline-secondary badge"
                                                                    type="button"
                                                                    onClick={() => this.setState({ sizeOnEdit: size })}>Sửa</button>
                                                                <PopupConfirm
                                                                    ButtonClick={({ handleClick }) => (
                                                                        <button
                                                                            onClick={handleClick}
                                                                            className="btn btn-sm btn-outline-secondary badge" type="button"
                                                                            style={{
                                                                                borderTopLeftRadius: 0,
                                                                                borderBottomLeftRadius: 0,
                                                                            }}
                                                                        >
                                                                            <i className="fa fa-trash" />
                                                                        </button>
                                                                    )}
                                                                    className="btn-group align-top"
                                                                    handleAccept={() => this.handleDelete(size._id)}
                                                                    accept="Bạn có chắc chắn muốn xóa"
                                                                    ok="Chấp nhận"
                                                                    cancel="Hủy"
                                                                />
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                                <Page {...{ page, totalPage, gotoPage: this.gotoPage }} />
                            </div>
                        </div>
                    </div>
                </div>
                <UpdateSize size={sizeOnEdit} onHide={() => this.setState({ sizeOnEdit: null })} />
                <AddSize visible={addVisible} onHide={() => this.setState({ addVisible: false })} onAdded={() => this.gotoPage(0)} />
            </div >
        )
    }
}


export default connect(({ admin: { size: { data, page, total }, locations } }) => ({ data, page, total, locations }))(Size)
