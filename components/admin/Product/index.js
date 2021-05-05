import React, { Component } from 'react'
import { connect } from 'react-redux';
import Switch from "react-switch";
import types from '../../../redux/types';
import { createFormData } from '../../../utils/helper';
import Page from '../Page';
import PopupConfirm from '../PopupConfirm';
import AddProduct from './AddProduct';
import UpdateProduct from './UpdateProduct';

const pageSize = 20;

class Product extends Component {
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
    handleSwitch = (enabled, e, _id) => {
        const { dispatch } = this.props;
        const formData = createFormData({ enabled })
        dispatch({
            type: types.ADMIN_UPDATE_PRODUCT,
            payload: { _id, formData }
        })
    }
    gotoPage = (page) => {
        const { dispatch } = this.props;
        dispatch({
            type: types.ADMIN_GET_PRODUCTS,
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
            type: types.ADMIN_DELETE_MULTI_PRODUCT,
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
            type: types.ADMIN_DELETE_PRODUCT,
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
        const { data, page, total, locations } = this.props;
        const { selecteds, productOnEdit, addVisible } = this.state;
        const totalPage = Math.round(total / pageSize) || 1;
        return (
            <div className="row flex-lg-nowrap">
                <div className="col mb-3">
                    <div className="e-panel card">
                        <div className="card-body">
                            <div className="card-title" style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                                <div style={{ display: 'flex', flex: 1 }}>
                                    <h6 className="mr-2">
                                        <span>Sản phẩm</span>
                                        <small className="px-1">({total} sản phẩm)</small>
                                    </h6>
                                    <form
                                        onSubmit={e => { e.preventDefault(); if (this.state.page >= 1) this.gotoPage(this.state.page - 1) }}
                                        style={{ marginBottom: '.5rem' }}
                                    >
                                        <span style={{ fontSize: 14, color: '#333333', fontWeight: 600, marginRight: 5 }} >Trang:</span>
                                        <input
                                            type="text"
                                            defaultValue={page + 1}
                                            placeholder="Trang"
                                            onChange={e => this.setState({ page: Number(e.target.value) || 1 })}
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
                                    >Thêm sản phẩm</button>
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
                                                <td className="align-middle text-center"><b>Ảnh</b></td>
                                                <td className="text-nowrap align-middle"><b>Tên sản phẩm</b></td>
                                                <td className="text-nowrap align-middle"><b>Mã sản phẩm</b></td>
                                                <td className="text-nowrap align-middle"><b>Kích thước</b></td>
                                                <td className="text-nowrap align-middle"><b>Loại bề mặt</b></td>
                                                <td className="text-nowrap align-middle"><b>Khu vực</b></td>
                                                <td className="text-center align-middle"><b>Trạng thái</b></td>
                                                <td className="text-center align-middle"><b>Tùy chọn</b></td>
                                            </tr>
                                            {data.map(product => {
                                                const checked = (selecteds.indexOf(product._id) + 1) ? "checked" : "";
                                                const location = locations.find(l => l.outSide === product.outSide) || locations[0];
                                                const outSide = location?.name
                                                return (
                                                    <tr key={product._id} style={{ textAlign: 'center' }}>
                                                        <td className="align-middle">
                                                            <div
                                                                className="custom-control custom-control-inline custom-checkbox custom-control-nameless align-top"
                                                                style={{ margin: 0, marginLeft: '.5rem' }}
                                                            >
                                                                < input
                                                                    id={product._id}
                                                                    type="checkbox"
                                                                    className="custom-control-input"
                                                                    onChange={this.handleSelect}
                                                                    checked={checked}
                                                                />
                                                                <label className="custom-control-label" htmlFor={product._id} />
                                                            </div>
                                                        </td>
                                                        <td className="align-middle text-center" style={{ padding: '4px 12px' }}>
                                                            <div className="bg-light d-inline-flex justify-content-center align-items-center align-top itemdiv">
                                                                <img
                                                                    src={"/api/images/" + product.image}
                                                                    style={{
                                                                        maxWidth: 60,
                                                                        maxHeight: 60,
                                                                        width: 'auto',
                                                                        height: 'auto',
                                                                    }} />
                                                            </div>
                                                        </td>
                                                        <td className="text-nowrap align-middle">{product.name}</td>
                                                        <td className="text-nowrap align-middle">
                                                            <span>{product.code}</span>
                                                        </td>
                                                        <td className="text-nowrap align-middle">
                                                            <span>{product.size.width}x{product.size.height} mm</span>
                                                        </td>
                                                        <td className="text-nowrap align-middle">
                                                            <span>{product.front.name}</span>
                                                        </td>
                                                        <td className="text-nowrap align-middle">
                                                            <span>{outSide}</span>
                                                        </td>
                                                        <td className="text-center align-middle">
                                                            <div>
                                                                <Switch
                                                                    id={product._id}
                                                                    onChange={this.handleSwitch}
                                                                    checked={product.enabled}
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
                                                                    onClick={() => this.setState({ productOnEdit: product })}>Sửa</button>
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
                                                                    handleAccept={() => this.handleDelete(product._id)}
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
                <UpdateProduct product={productOnEdit} onHide={() => this.setState({ productOnEdit: null })} />
                <AddProduct visible={addVisible} onHide={() => this.setState({ addVisible: false })} onAdded={() => this.gotoPage(0)} />
            </div >
        )
    }
}


export default connect(({ admin: { product: { data, page, total }, locations } }) => ({ data, page, total, locations }))(Product)
