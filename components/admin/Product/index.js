import React, { Component } from 'react'
import { connect } from 'react-redux';
import Switch from "react-switch";
import types from '../../../redux/types';
import { createFormData, getThumbnail } from '../../../utils/helper';
import Page from '../Page';
import PopupConfirm from '../PopupConfirm';
import Select from '../Form/Select';
import Checkbox from '../Form/Checkbox';
import AddProduct from './AddProduct';
import UpdateProduct from './UpdateProduct';

const defaultPageSize = 20;
const pageSizes = [5, 10, 20, 50, 100];
const pageSizeSelects = pageSizes.map(p => ({ value: p, label: `${p}` }));

const productTypes = [{ value: null, label: 'Tất cả' }, { value: 'wall', label: 'Tường' }, { value: 'floor', label: 'Sàn' }];

class Product extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selecteds: [],
            enabled: true,
            pageSize: defaultPageSize,
            loading: true
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
        const { name, code, sizeId, frontId, roomId, type, filterEnable, enabled, pageSize } = this.state;
        const request = {
            page,
            pageSize: pageSize,
            name: name || undefined,
            code: code || undefined,
            sizeId: sizeId || undefined,
            frontId: frontId || undefined,
            roomId: roomId || undefined,
            type: type || undefined,
            enabled: filterEnable ? enabled : undefined,
        };
        this.setState({ loading: true })
        dispatch({
            type: types.ADMIN_GET_PRODUCTS,
            payload: request,
            callback: () => this.setState({ selecteds: [], loading: false })
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
    handleChange = e => this.setState({ [e.target.name]: e.target.value });
    handleSearch = (e) => {
        e.preventDefault();
        this.gotoPage(0)
    }
    handleFilterSize = sizeId => this.setState({ sizeId });
    handleFilterFront = frontId => this.setState({ frontId });
    handleFilterRoom = roomId => this.setState({ roomId });
    handleFilterType = type => this.setState({ type });
    handleFilterEnabled = enabled => this.setState({ enabled });
    handleSelectPageSize = pageSize => this.setState({ pageSize }, () => this.gotoPage(0));


    render() {
        const { data, page, total, sizes, fronts, rooms } = this.props;
        const { selecteds, productOnEdit, addVisible, filterEnable, enabled, pageSize, loading } = this.state;
        const totalPage = Math.ceil(total / (pageSize)) || 1;
        const sizeSelects = [{ value: null, label: 'Tất cả' }, ...sizes.filter(s => s.enabled).map(s => ({ value: s._id, label: `${s.width}x${s.height} mm` }))]
        const frontSelects = [{ value: null, label: 'Tất cả' }, ...fronts.filter(f => f.enabled).map(f => ({ value: f._id, label: f.name }))];
        const roomSelects = [{ value: null, label: 'Tất cả' }, ...rooms.filter(r => r.enabled).map(r => ({ value: r._id, label: r.name }))];
        return (
            <div className="row flex-lg-nowrap">
                <div className="col mb-3">
                    <div className="e-panel card">
                        <div className="card-body">
                            <div className="card-title" style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', marginBottom: 15 }}>
                                <div style={{ display: 'flex', flex: 2 }}>
                                    <h4 className="mr-2">
                                        <span>Sản phẩm</span>
                                        <small className="px-1" style={{ fontSize: '1rem' }}>({total} sản phẩm)</small>
                                    </h4>
                                    <form
                                        onSubmit={e => { e.preventDefault(); if (this.state.page >= 1) this.gotoPage(this.state.page - 1) }}
                                        style={{ marginBottom: '.5rem', display: 'flex', alignItems: 'flex-end' }}
                                    >
                                        <span style={{ fontSize: 14, color: '#333333', fontWeight: 600, marginRight: 5 }} >Trang:</span>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
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
                                            <span style={{ fontSize: 14, color: '#333333', fontWeight: 600, paddingLeft: 3 }}>/ {totalPage} </span>
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
                                        </div>

                                    </form>
                                    <div style={{ display: 'flex', alignItems: 'center', marginLeft: 15 }}>
                                        <span style={{ lineHeight: 2, fontWeight: '400', marginRight: 5 }}>Phân trang:</span>
                                        <Select
                                            data={pageSizeSelects}
                                            onChange={this.handleSelectPageSize}
                                            hover={`${pageSize}`}
                                        />
                                    </div>
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
                            <form onSubmit={this.handleSearch}>
                                <div className="row">
                                    <div className="col-3">
                                        <input
                                            className="form-control"
                                            type="text"
                                            name="name"
                                            placeholder="Tìm kiếm theo tên"
                                            onChange={this.handleChange}
                                        />
                                    </div>
                                    <div className="col-3">
                                        <Select
                                            data={roomSelects}
                                            onChange={this.handleFilterRoom}
                                            hover="Tìm theo khu vực"
                                        />
                                    </div>
                                    <div className="col-3">
                                        <Select
                                            data={sizeSelects}
                                            onChange={this.handleFilterSize}
                                            hover="Tìm theo kích thước"
                                        />
                                    </div>
                                    <div className="col-3">
                                        <Select
                                            data={frontSelects}
                                            onChange={this.handleFilterFront}
                                            hover="Tìm theo bề mặt"
                                        />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-3">
                                        <Select
                                            data={productTypes}
                                            onChange={this.handleFilterType}
                                            hover="Tìm theo loại sản phẩm"
                                        />
                                    </div>
                                    <div className="col-6">
                                        <div className="row">
                                            <div className="col-6">
                                                <Checkbox
                                                    onChange={() => this.setState({ filterEnable: !filterEnable })}
                                                    checked={filterEnable ? "checked" : ""}
                                                />
                                                <span style={{ lineHeight: 2, cursor: 'pointer' }} onClick={() => this.setState({ filterEnable: !filterEnable })}>Lọc theo trạng thái{filterEnable ? ":" : ""}</span>
                                            </div>
                                            <div className="col-6 d-flex justify-content-start align-items-center">
                                                {filterEnable ?
                                                    <Switch
                                                        id="product-filterEnable"
                                                        onChange={this.handleFilterEnabled}
                                                        checked={enabled || false}
                                                        width={40}
                                                        height={20}
                                                        checkedIcon={null}
                                                        uncheckedIcon={null}
                                                    />
                                                    : null}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-3 d-flex justify-content-end">
                                        <div>
                                            <button className="btn btn-primary" type="submit">Tìm kiếm</button>
                                        </div>
                                    </div>
                                </div>
                            </form>
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
                                                <td className="text-nowrap align-middle"><b>Khu vực</b></td>
                                                <td className="text-nowrap align-middle"><b>Kích thước</b></td>
                                                <td className="text-nowrap align-middle"><b>Loại bề mặt</b></td>
                                                <td className="text-nowrap align-middle"><b>Loại sản phẩm</b></td>
                                                <td className="text-center align-middle"><b>Trạng thái</b></td>
                                                <td className="text-center align-middle"><b>Tùy chọn</b></td>
                                            </tr>
                                            {data.map(product => {
                                                const checked = (selecteds.indexOf(product._id) + 1) ? "checked" : "";
                                                const roomList = rooms.filter(r => product.room.includes(r._id));
                                                const typeList = productTypes.filter(t => product.type.includes(t.value));
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
                                                            <div
                                                                className="d-inline-flex justify-content-center align-items-center align-top itemdiv"
                                                                style={{ height: 70, maxWidth: 80,minWidth: 60, padding: '5px 0px' }}>
                                                                <img
                                                                    src={"/api/images/" + getThumbnail(product)}
                                                                    style={{
                                                                        maxWidth: "100%",
                                                                        maxHeight: "100%",
                                                                        width: 'auto',
                                                                        height: 'auto',
                                                                    }} />
                                                            </div>
                                                        </td>
                                                        <td className="text-nowrap align-middle">{product.name}</td>
                                                        <td className="text-nowrap align-middle">
                                                            {roomList.map((room, index) => {
                                                                return (<span key={room._id}>{index ? <>,<br /></> : ''}{room?.name}</span>)
                                                            })}
                                                        </td>
                                                        <td className="text-nowrap align-middle">
                                                            <span>{product.size.width}x{product.size.height} mm</span>
                                                        </td>
                                                        <td className="text-nowrap align-middle">
                                                            <span>{product.front.name}</span>
                                                        </td>
                                                        <td className="text-nowrap align-middle">
                                                            {typeList.map((type, index) => {
                                                                return (<span key={type.value}>{index ? <>,<br /></> : ''}{type?.label}</span>)
                                                            })}
                                                        </td>
                                                        <td className="text-center align-middle">
                                                            <Switch
                                                                id={product._id}
                                                                onChange={this.handleSwitch}
                                                                checked={product.enabled}
                                                                width={40}
                                                                height={20}
                                                                checkedIcon={null}
                                                                uncheckedIcon={null}
                                                            />
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
                                    {!data.length && !loading ?
                                        <div style={{ width: '100%', textAlign: 'center', color: '#999', paddingTop: 10 }}>
                                            <h5>Danh sách sản phẩm trống</h5>
                                        </div>
                                        : ""}
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
const mStP = ({
    admin: {
        product: { data, page, total },
        front, size, room
    }
}) => ({
    data, page, total,
    sizes: size.data,
    fronts: front.data,
    rooms: room.data
});

export default connect(mStP)(Product)
