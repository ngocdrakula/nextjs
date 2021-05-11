import React, { Component } from 'react'
import { connect } from 'react-redux';
import Switch from "react-switch";
import types from '../../../redux/types';
import { createFormData } from '../../../utils/helper';
import Page from '../Page';
import PopupConfirm from '../PopupConfirm';
import AddLayout from './AddLayout';
import UpdateLayout from './UpdateLayout';

const pageSize = 20;

class Layout extends Component {
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
            type: types.ADMIN_UPDATE_LAYOUT,
            payload: { _id, formData }
        })
    }
    gotoPage = (page) => {
        const { dispatch } = this.props;
        dispatch({
            type: types.ADMIN_GET_LAYOUTS,
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
            type: types.ADMIN_DELETE_MULTI_LAYOUT,
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
            type: types.ADMIN_DELETE_LAYOUT,
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
        const { selecteds, layoutOnEdit, addVisible } = this.state;
        const totalPage = Math.ceil(total / pageSize) || 1;
        return (
            <div className="row flex-lg-nowrap">
                <div className="col mb-3">
                    <div className="e-panel card">
                        <div className="card-body">
                            <div className="card-title" style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                                <div style={{ display: 'flex', flex: 1 }}>
                                    <h6 className="mr-2">
                                        <span>Kiểu bố trí</span>
                                        <small className="px-1">({total} Kiểu bố trí)</small>
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
                                    >Thêm kiểu bố trí</button>
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
                                                <td className="text-nowrap align-middle"><b>Tên kiểu bố trí</b></td>
                                                <td className="text-nowrap align-middle"><b>Khu vực</b></td>
                                                <td className="text-center align-middle"><b>Trạng thái</b></td>
                                                <td className="text-center align-middle"><b>Tùy chọn</b></td>
                                            </tr>
                                            {data.map(layout => {
                                                const checked = (selecteds.indexOf(layout._id) + 1) ? "checked" : "";
                                                const image = "/api/images/" + layout.images?.[0] + "?width=320&height=180";
                                                return (
                                                    <tr key={layout._id} style={{ textAlign: 'center' }}>
                                                        <td className="align-middle">
                                                            <div
                                                                className="custom-control custom-control-inline custom-checkbox custom-control-nameless align-top"
                                                                style={{ margin: 0, marginLeft: '.5rem' }}
                                                            >
                                                                < input
                                                                    id={layout._id}
                                                                    type="checkbox"
                                                                    className="custom-control-input"
                                                                    onChange={this.handleSelect}
                                                                    checked={checked}
                                                                />
                                                                <label className="custom-control-label" htmlFor={layout._id} />
                                                            </div>
                                                        </td>
                                                        <td className="align-middle text-center" style={{ padding: '4px 12px' }}>
                                                            <div className="d-inline-flex justify-content-center align-items-center align-top itemdiv" style={{ height: 70, maxWidth: 120, padding: '5px 0px' }}>
                                                                <img
                                                                    src={image}
                                                                    style={{
                                                                        maxWidth: "100%",
                                                                        maxHeight: "100%",
                                                                        width: 'auto',
                                                                        height: 'auto',
                                                                    }} />
                                                            </div>
                                                        </td>
                                                        <td className="text-nowrap align-middle">{layout.name}</td>
                                                        <td className="text-nowrap align-middle">
                                                            <span>{layout.room.name}</span>
                                                        </td>
                                                        <td className="text-center align-middle">
                                                            <div>
                                                                <Switch
                                                                    id={layout._id}
                                                                    onChange={this.handleSwitch}
                                                                    checked={layout.enabled}
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
                                                                    onClick={() => this.setState({ layoutOnEdit: layout })}>Sửa</button>
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
                                                                    handleAccept={() => this.handleDelete(layout._id)}
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
                <UpdateLayout layout={layoutOnEdit} onHide={() => this.setState({ layoutOnEdit: null })} />
                <AddLayout visible={addVisible} onHide={() => this.setState({ addVisible: false })} onAdded={() => this.gotoPage(0)} />
            </div >
        )
    }
}


export default connect(({ admin: { layout: { data, page, total } } }) => ({ data, page, total }))(Layout)
