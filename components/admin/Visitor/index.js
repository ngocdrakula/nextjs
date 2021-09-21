import React, { Component } from 'react'
import { connect } from 'react-redux';
import types from '../../../redux/types';
import { createFormData } from '../../../utils/helper';
import Pagination from '../../PaginationAdmin';
import AddVisitor from './AddVisitor';
import UpdateVisitor from './UpdateVisitor';

const pageSize = 10;

class Visitor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            onAdd: false,
            selecteds: [],
            name: ''
        }
    }
    componentDidMount() {
        this.gotoPage();
    }
    gotoPage = (page = 0) => {
        const { dispatch } = this.props;
        const { name } = this.state;
        dispatch({
            type: types.ADMIN_GET_VISITOR,
            payload: { page, pageSize, name },
            callback: res => {
                this.setState({ selecteds: [] })
            }
        });
    }
    handleDisable = (visitor) => {
        const { dispatch } = this.props;
        dispatch({
            type: types.SET_TOOLTIP,
            payload: {
                title: `Xác nhận ${visitor.enabled ? 'khóa' : 'hủy khóa'} tài khoản`,
                message: `Bạn có chắc chắn ${visitor.enabled ? 'khóa' : 'hủy khóa'} tài khoản của ${visitor.name} không?`,
                confirm: `${visitor.enabled ? 'Khóa' : 'Hủy khóa'} tài khoản`,
                handleConfirm: () => this.handleConfirm(visitor),
                cancel: 'Hủy',
            }
        })
    }
    handleDelete = (visitor) => {
        const { dispatch } = this.props;
        dispatch({
            type: types.SET_TOOLTIP,
            payload: {
                title: `Xác nhận xóa tài khoản`,
                message: `Bạn có chắc chắn muốn xóa tài khoản của ${visitor.name} không?`,
                confirm: `Xóa tài khoản`,
                handleConfirm: () => {
                    dispatch({
                        type: types.ADMIN_DELETE_USER,
                        payload: visitor._id,
                        callback: res => {
                            if (res?.success) {
                                const { page } = this.props;
                                this.gotoPage(page);
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
    handleConfirm = (visitor) => {
        const { dispatch } = this.props;
        const formData = createFormData({ enabled: !visitor.enabled });
        dispatch({
            type: types.ADMIN_UPDATE_USER,
            payload: { _id: visitor._id, formData }
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
        const { visitors } = this.props;
        if (selecteds.length < visitors.length) {
            this.setState({ selecteds: visitors.map(e => e._id) });
        }
        else {
            this.setState({ selecteds: [] })
        }
    }
    handleChange = e => {
        this.setState({ name: e.target.value });
        clearTimeout(this.timeout);
        this.timeout = setTimeout(this.gotoPage, 1000);
    }
    render() {
        const { active, visitors, page, total } = this.props;
        const { onAdd, onEdit, selecteds, name } = this.state;
        if (!active) return null;
        return (
            <section className="content">
                <div className="box">
                    <div className="box-header with-border">
                        <h3 className="box-title">Khách thăm quan</h3>
                        <div className="box-tools pull-right">
                            <a onClick={this.handleOpenForm} className="ajax-modal-btn btn btn-new btn-flat" style={{ cursor: 'pointer' }}>Thêm khách thăm quan</a>
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
                                {/* <button className="btn btn-default buttons-copy buttons-html5 btn-sm" >
                                    <span>Copy</span>
                                </button>
                                <button className="btn btn-default buttons-csv buttons-html5 btn-sm" >
                                    <span>CSV</span>
                                </button> <button className="btn btn-default buttons-excel buttons-html5 btn-sm" >
                                    <span>Excel</span>
                                </button> <button className="btn btn-default buttons-pdf buttons-html5 btn-sm" >
                                    <span>PDF</span>
                                </button> <button className="btn btn-default buttons-print btn-sm" >
                                    <span>Print</span>
                                </button> */}
                            </div>
                            <div id="DataTables_Table_1_filter" className="dataTables_filter">
                                <label>
                                    <input type="search" className={"form-control input-sm" + (name ? " active" : "")} value={name} onChange={this.handleChange} placeholder="Tìm kiếm" />
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
                                        <th className="sorting_disabled" rowSpan={1} colSpan={1} aria-label="Ảnh đại diện" style={{ width: '54.8px' }}>Ảnh đại diện</th>
                                        <th className="sorting"  rowSpan={1} colSpan={1} aria-label="Tên khách hàng: activate to sort column ascending" style={{ width: '142.8px' }}>Tên khách hàng</th>
                                        <th className="sorting"  rowSpan={1} colSpan={1} aria-label="Email: activate to sort column ascending" style={{ width: 218 }}>Email</th>
                                        <th style={{ textAlign: 'center !important', width: 130 }} className="sorting_disabled" rowSpan={1} colSpan={1} aria-label="Hành động">Hành động</th>
                                    </tr>
                                </thead>
                                <tbody id="massSelectArea">
                                    {visitors.map((visitor, index) => {
                                        const checked = (selecteds.indexOf(visitor._id) + 1) ? "checked" : "";
                                        return (
                                            <tr key={visitor._id} className={index % 2 ? "odd" : "even"} role="row">
                                                <td>
                                                    <div className={checked ? "icheckbox_minimal-blue checked" : "icheckbox_minimal-blue"} aria-checked="false" aria-disabled="false" style={{ position: 'relative' }}>
                                                        <ins
                                                            className="iCheck-helper"
                                                            style={{ position: 'absolute', top: '0%', left: '0%', display: 'block', width: '100%', height: '100%', margin: 0, padding: 0, background: 'rgb(255, 255, 255)', border: 0, opacity: 0 }}
                                                            onClick={() => this.handleSelect(visitor._id)}
                                                        />
                                                    </div>
                                                </td>
                                                <td>
                                                    {visitor.avatar ?
                                                        <img src={"/api/images/" + visitor.avatar} className="img-circle img-sm" alt="Ảnh đại diện" />
                                                        :
                                                        <img src="/images/no-avatar.png" className="img-circle img-sm" alt="Ảnh đại diện" />
                                                    }
                                                </td>
                                                <td title={visitor.name}>
                                                    {visitor.name?.split(0, 15)}
                                                    <a href="#" type="button" className="toggle-widget toggle-confirm pull-right" onClick={() => { this.handleDisable(visitor) }}>
                                                        <i className={"fa fa-heart" + (visitor.enabled ? "-o" : "")} title={visitor.enabled ? "Khóa" : "Hủy khóa"} />
                                                    </a>
                                                </td>
                                                <td>{visitor.email}</td>
                                                <td className="row-options">
                                                    {/* <a onClick={() => this.setState({ onView: visitor })} className="ajax-modal-btn" style={{ cursor: 'pointer' }}>
                                                        <i title="Detail" className="fa fa-expand" />
                                                    </a>&nbsp; */}
                                                    {/* <a href="/admin/vendor/shop/1/staffs">
                                                        <i title="Staffs" className="fa fa-users" />
                                                    </a>&nbsp; */}
                                                    {/* <a href="#" onClick={() => null}>
                                                    <i title="Đăng nhập bằng tài khoản khách thăm quan này" className="fa fa-user-secret" />
                                                </a>&nbsp;&nbsp; */}
                                                    <a onClick={() => this.setState({ onEdit: visitor })} className="ajax-modal-btn" style={{ cursor: 'pointer' }}>
                                                        <i title="Chỉnh sửa" className="fa fa-edit" />
                                                    </a>&nbsp;&nbsp;
                                                    {/* <a data-link="/address/create/shop/1" className="ajax-modal-btn" style={{ cursor: 'pointer' }}>
                                                        <i title="Add address" className="fa fa-plus-square-o" />
                                                    </a>&nbsp; */}
                                                    <a onClick={() => this.handleDelete(visitor)} className="ajax-modal-btn" style={{ cursor: 'pointer' }}>
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
                <AddVisitor onAdd={onAdd} handleClose={this.handleOpenForm} onAdded={this.gotoPage} />
                <UpdateVisitor onEdit={onEdit} handleClose={() => this.setState({ onEdit: null })} />
            </section>
        )
    }
}

export default connect(({ admin: { visitor: { data: visitors, page, total } } }) => ({ visitors, page, total }))(Visitor)
