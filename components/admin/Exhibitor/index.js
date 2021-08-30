import React, { Component } from 'react'
import { connect } from 'react-redux';
import types from '../../../redux/types';
import { createFormData } from '../../../utils/helper';
import Pagination from '../Pagination';
import AddExhibitor from './AddExhibitor';
import UpdateExhibitor from './UpdateExhibitor';

const pageSize = 10;

class Exhibitor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            onAdd: false,
            selecteds: []
        }
    }
    componentDidMount() {
        this.gotoPage();
    }
    gotoPage = (page = 0) => {
        const { dispatch } = this.props;
        const { name } = this.state;
        dispatch({
            type: types.ADMIN_GET_EXHIBITOR,
            payload: { page, pageSize, name },
            callback: res => console.log(res)
        });
    }
    handleDisable = (exhibitor) => {
        const { dispatch } = this.props;
        dispatch({
            type: types.SET_TOOLTIP,
            payload: {
                title: `Xác nhận ${exhibitor.enabled ? 'khóa' : 'hủy khóa'} tài khoản`,
                message: `Bạn có chắc chắn ${exhibitor.enabled ? 'khóa' : 'hủy khóa'} tài khoản của ${exhibitor.name} không?`,
                confirm: `${exhibitor.enabled ? 'Khóa' : 'Hủy khóa'} tài khoản`,
                handleConfirm: () => this.handleConfirm(exhibitor),
                cancel: 'Hủy',
            }
        })
    }
    handleDelete = (exhibitor) => {
        const { dispatch } = this.props;
        dispatch({
            type: types.SET_TOOLTIP,
            payload: {
                title: `Xác nhận xóa tài khoản`,
                message: `Bạn có chắc chắn muốn xóa tài khoản của ${exhibitor.name} không?`,
                confirm: `Xóa tài khoản`,
                handleConfirm: () => {
                    dispatch({
                        type: types.ADMIN_DELETE_USER,
                        payload: exhibitor._id,
                        callback: res => {
                            if (res?.success) {
                                const { page } = this.props;
                                this.gotoPage(page);
                                this.setState({ selecteds: [] })
                            }
                        }
                    });
                },
                cancel: 'Hủy',
            }
        })
    }

    handleDeleteAll = () => {
        const { dispatch } = this.props;
        const { selecteds } = this.state;
        dispatch({
            type: types.SET_TOOLTIP,
            payload: {
                title: `Xác nhận xóa nhiều tài khoản`,
                message: `Bạn có chắc chắn muốn xóa ${selecteds.length} tài khoản không?`,
                confirm: `Xóa tài khoản`,
                handleConfirm: () => {
                    dispatch({
                        type: types.ADMIN_DELETE_MULTI_USER,
                        payload: selecteds,
                        callback: res => {
                            if (res?.success) {
                                const { page } = this.props;
                                this.gotoPage(page);
                                this.setState({ selecteds: [] })
                            }
                        }
                    });
                },
                cancel: 'Hủy',
            }
        })
    }
    handleConfirm = (exhibitor) => {
        const { dispatch } = this.props;
        const formData = createFormData({ enabled: !exhibitor.enabled });
        dispatch({
            type: types.ADMIN_UPDATE_USER,
            payload: { _id: exhibitor._id, formData },
            callback: res => {
                console.log(res)
            }
        })
    }
    handleOpenForm = () => this.setState({ onAdd: !this.state.onAdd });
    handleSelect = (id) => {
        const { selecteds } = this.state;
        if (selecteds.indexOf(id) + 1) {
            this.setState({ selecteds: selecteds.filter(i => i !== id) });
        }
        else {
            selecteds.push(id);
            this.setState({ selecteds: [...selecteds] });
        }
    }
    handleSelectAll = () => {
        const { selecteds } = this.state;
        const { exhibitors } = this.props;
        if (selecteds.length < exhibitors.length) {
            this.setState({ selecteds: exhibitors.map(e => e._id) });
        }
        else {
            this.setState({ selecteds: [] })
        }
    }
    render() {
        const { active, exhibitors, page, total } = this.props;
        const { onAdd, onEdit, selecteds } = this.state;
        if (!active) return null;
        return (
            <section className="content">
                <div className="box">
                    <div className="box-header with-border">
                        <h3 className="box-title">Nhà trưng bày</h3>
                        <div className="box-tools pull-right">
                            <a onClick={this.handleOpenForm} className="ajax-modal-btn btn btn-new btn-flat" style={{ cursor: 'pointer' }}>Thêm nhà trưng bày</a>
                        </div>
                    </div>
                    <div className="box-body">
                        <div id="DataTables_Table_1_wrapper" className="dataTables_wrapper form-inline dt-bootstrap no-footer">
                            <div className="dt-buttons btn-group">
                                {selecteds.length ?
                                    <button className="btn btn-default buttons-copy buttons-html5 btn-sm" onClick={this.handleDeleteAll}>
                                        <span>Xóa {selecteds.length} đã chọn</span>
                                    </button>
                                    : ""}
                                {/* <button className="btn btn-default buttons-copy buttons-html5 btn-sm" tabIndex={0} aria-controls="DataTables_Table_1">
                                    <span>Copy</span>
                                </button>
                                <button className="btn btn-default buttons-csv buttons-html5 btn-sm" tabIndex={0} aria-controls="DataTables_Table_1">
                                    <span>CSV</span>
                                </button> <button className="btn btn-default buttons-excel buttons-html5 btn-sm" tabIndex={0} aria-controls="DataTables_Table_1">
                                    <span>Excel</span>
                                </button> <button className="btn btn-default buttons-pdf buttons-html5 btn-sm" tabIndex={0} aria-controls="DataTables_Table_1">
                                    <span>PDF</span>
                                </button> <button className="btn btn-default buttons-print btn-sm" tabIndex={0} aria-controls="DataTables_Table_1">
                                    <span>Print</span>
                                </button> */}
                            </div>
                            <div id="DataTables_Table_1_filter" className="dataTables_filter">
                                <label>
                                    <input type="search" className="form-control input-sm" aria-controls="DataTables_Table_1" />
                                </label>
                            </div>
                            <table className="table table-hover table-2nd-no-sort dataTable no-footer" id="DataTables_Table_1" role="grid" aria-describedby="DataTables_Table_1_info">
                                <thead>
                                    <tr role="row">
                                        <th className="massActionWrapper sorting_disabled" rowSpan={1} colSpan={1} aria-label="Toggle Dropdown Trash Delete permanently" style={{ width: '44.8px' }}>
                                            <div className="btn-group ">
                                                <button type="button" className="btn btn-xs btn-default checkbox-toggle" onClick={this.handleSelectAll}>
                                                    <i className={selecteds.length ? "fa fa-check-square-o" : "fa fa-square-o"} title="Select all" />
                                                </button>
                                                <button type="button" className="btn btn-xs btn-default dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
                                                    <span className="caret" />
                                                    <span className="sr-only">Toggle Dropdown</span>
                                                </button>
                                                <ul className="dropdown-menu" role="menu">
                                                    <li>
                                                        <a href="#" data-link="/admin/vendor/shop/massTrash" className="massAction " data-doafter="reload">
                                                            <i className="fa fa-trash" /> Trash</a>
                                                    </li>
                                                    <li>
                                                        <a href="#" data-link="/admin/vendor/shop/massDestroy" className="massAction " data-doafter="reload">
                                                            <i className="fa fa-times" /> Delete permanently</a>
                                                    </li>
                                                </ul>
                                            </div>
                                        </th>
                                        <th className="sorting_disabled" rowSpan={1} colSpan={1} aria-label="Logo" style={{ width: '54.8px' }}>Logo</th>
                                        <th className="sorting" tabIndex={0} aria-controls="DataTables_Table_1" rowSpan={1} colSpan={1} aria-label="Tên: activate to sort column ascending" style={{ width: '142.8px' }}>Tên</th>
                                        <th className="sorting" tabIndex={0} aria-controls="DataTables_Table_1" rowSpan={1} colSpan={1} aria-label="Email: activate to sort column ascending" style={{ width: 218 }}>Email</th>
                                        <th className="sorting" tabIndex={0} aria-controls="DataTables_Table_1" rowSpan={1} colSpan={1} aria-label="Loại gian hàng: activate to sort column ascending" style={{ width: 134 }}>Loại gian hàng</th>
                                        <th className="sorting" tabIndex={0} aria-controls="DataTables_Table_1" rowSpan={1} colSpan={1} aria-label="Tiền tệ: activate to sort column ascending" style={{ width: '71.6px' }}>Tiền tệ</th>
                                        <th className="sorting" tabIndex={0} aria-controls="DataTables_Table_1" rowSpan={1} colSpan={1} aria-label="Quốc gia: activate to sort column ascending" style={{ width: 86 }}>Quốc gia</th>
                                        <th style={{ textAlign: 'center !important', width: 130 }} className="sorting_disabled" rowSpan={1} colSpan={1} aria-label="Hành động">Hành động</th>
                                    </tr>
                                </thead>
                                <tbody id="massSelectArea">
                                    {exhibitors.map((exhibitor, index) => {
                                        const checked = (selecteds.indexOf(exhibitor._id) + 1) ? "checked" : "";
                                        return (
                                            <tr key={exhibitor._id} className={index % 2 ? "odd" : "even"} role="row">
                                                <td>
                                                    <div className={checked ? "icheckbox_minimal-blue checked" : "icheckbox_minimal-blue"} aria-checked="false" aria-disabled="false" style={{ position: 'relative' }}>
                                                        <ins
                                                            className="iCheck-helper"
                                                            style={{ position: 'absolute', top: '0%', left: '0%', display: 'block', width: '100%', height: '100%', margin: 0, padding: 0, background: 'rgb(255, 255, 255)', border: 0, opacity: 0 }}
                                                            onClick={() => this.handleSelect(exhibitor._id)}
                                                        />
                                                    </div>
                                                </td>
                                                <td>
                                                    {exhibitor.avatar ?
                                                        <img src={"/api/images/" + exhibitor.avatar} className="img-circle img-sm" alt="Logo" />
                                                        :
                                                        <img src="/images/no-avatar.png" className="img-circle img-sm" alt="Logo" />
                                                    }
                                                </td>
                                                <td title={exhibitor.name}>
                                                    {exhibitor.name?.split(0, 15)}
                                                    <a href="#" type="button" className="toggle-widget toggle-confirm pull-right" onClick={() => { this.handleDisable(exhibitor) }}>
                                                        <i className={"fa fa-heart" + (exhibitor.enabled ? "-o" : "")} title={exhibitor.enabled ? "Khóa" : "Hủy khóa"} />
                                                    </a>
                                                </td>
                                                <td>{exhibitor.email}</td>
                                                <td>Standard Exhibitor</td>
                                                <td>
                                                </td>
                                                <td>
                                                </td>
                                                <td className="row-options" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                    {/* <a onClick={() => this.setState({ onView: exhibitor })} className="ajax-modal-btn" style={{ cursor: 'pointer' }}>
                                                        <i title="Detail" className="fa fa-expand" />
                                                    </a>&nbsp; */}
                                                    {/* <a href="/admin/vendor/shop/1/staffs">
                                                        <i title="Staffs" className="fa fa-users" />
                                                    </a>&nbsp; */}
                                                    <a href="#" onClick={() => null}>
                                                        <i title="Đăng nhập bằng tài khoản nhà trưng bày" className="fa fa-user-secret" />
                                                    </a>&nbsp;&nbsp;
                                                    <a onClick={() => this.setState({ onEdit: exhibitor })} className="ajax-modal-btn" style={{ cursor: 'pointer' }}>
                                                        <i title="Chỉnh sửa" className="fa fa-edit" />
                                                    </a>&nbsp;&nbsp;
                                                    {/* <a data-link="/address/create/shop/1" className="ajax-modal-btn" style={{ cursor: 'pointer' }}>
                                                        <i title="Add address" className="fa fa-plus-square-o" />
                                                    </a>&nbsp; */}
                                                    <a onClick={() => this.handleDelete(exhibitor)} className="ajax-modal-btn" style={{ cursor: 'pointer' }}>
                                                        <i className="fa fa-trash-o" title="Xóa" />
                                                    </a>&nbsp;&nbsp;
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                            <Pagination currentPage={page} total={total} pageSize={pageSize} gotoPage={this.gotoPage} />
                        </div>
                    </div>
                </div>
                <AddExhibitor onAdd={onAdd} handleClose={this.handleOpenForm} onAdded={this.gotoPage} />
                <UpdateExhibitor onEdit={onEdit} handleClose={() => this.setState({ onEdit: null })} />
            </section>
        )
    }
}

export default connect(({ admin: { exhibitor: { data: exhibitors, page, total } } }) => ({ exhibitors, page, total }))(Exhibitor)