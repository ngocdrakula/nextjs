import React, { Component } from 'react'
import { connect } from 'react-redux';
import types from '../../../redux/types';
import PaginationAdmin from '../../pagination/PaginationAdmin';
import AddCategory from './AddCategory';
import UpdateCategory from './UpdateCategory';

const pageSize = 100;

class Category extends Component {
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
    componentDidUpdate(prevProps) {
        if (!prevProps.exUser && this.props.exUser?._id) {
            this.gotoPage();
        }
    }
    gotoPage = () => {
        const { dispatch, exUser } = this.props;
        const { name } = this.state;
        dispatch({
            type: types.ADMIN_GET_CATEGORIES,
            payload: { name, exhibitor: exUser?._id },
            callback: res => {
                this.setState({ selecteds: [] })
            }
        });
    }
    handleDisable = (category) => {
        const { dispatch } = this.props;
        dispatch({
            type: types.SET_TOOLTIP,
            payload: {
                title: `Xác nhận ${category.enabled ? 'tắt' : 'bật'} chuyên mục này`,
                message: `Bạn có chắc chắn ${category.enabled ? 'tắt' : 'bật'} chuyên mục này không?`,
                confirm: `${category.enabled ? 'Tắt' : 'Bật'} chuyên mục này`,
                handleConfirm: () => this.handleConfirm(category),
                cancel: 'Hủy',
            }
        })
    }
    handleDelete = (category) => {
        const { dispatch } = this.props;
        dispatch({
            type: types.SET_TOOLTIP,
            payload: {
                title: `Xác nhận xóa chuyên mục`,
                message: `Bạn có chắc chắn muốn xóa chuyên mục này không?`,
                confirm: `Xóa`,
                handleConfirm: () => {
                    dispatch({
                        type: types.ADMIN_DELETE_CATEGORY,
                        payload: category._id,
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
                title: `Xác nhận xóa nhiều chuyên mục`,
                message: `Bạn có chắc chắn muốn xóa ${selecteds.length} chuyên mục không?`,
                confirm: `Xóa chuyên mục này`,
                handleConfirm: () => {
                    dispatch({
                        type: types.ADMIN_DELETE_MULTI_CATEGORY,
                        payload: selecteds,
                        callback: res => {
                            if (res?.success) {
                                this.gotoPage();
                                this.setState({ selecteds: [] })
                            }
                        }
                    });
                },
                cancel: 'Hủy',
            }
        })
    }
    handleConfirm = (category) => {
        const { dispatch } = this.props;
        dispatch({
            type: types.ADMIN_UPDATE_CATEGORY,
            payload: { _id: category._id, enabled: !category.enabled }
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
        const { categories } = this.props;
        if (selecteds.length < categories.length) {
            this.setState({ selecteds: categories.map(e => e._id) });
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
        const { active, categories } = this.props;
        const { onAdd, onEdit, selecteds, name } = this.state;
        if (!active) return null;
        return (
            <section className="content">
                <div className="box">
                    <div className="box-header with-border">
                        <h3 className="box-title">Danh sách chuyên mục</h3>
                        <div className="box-tools pull-right">
                            <a onClick={this.handleOpenForm} className="ajax-modal-btn btn btn-new btn-flat" style={{ cursor: 'pointer' }}>Thêm chuyên mục</a>
                        </div>
                    </div>
                    <div className="box-body">
                        <div id="DataTables_Table_1_wrapper" className="dataTables_wrapper form-inline dt-bootstrap no-footer">
                            <div className="dt-buttons btn-group">
                                {selecteds.length ?
                                    <button className="btn btn-default buttons-copy buttons-html5 btn-sm" onClick={this.handleDeleteAll}>
                                        <span>Xóa {selecteds.length} mục đã chọn</span>
                                    </button>
                                    : ""}
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
                                            </div>
                                        </th>
                                        <th className="sorting_disabled" rowSpan={1} colSpan={1} style={{ width: '54.8px' }}>STT</th>
                                        <th className="sorting_disabled"  rowSpan={1} colSpan={1} aria-label="Tên chuyên mục: activate to sort column ascending" style={{ width: '142.8px' }}>Tên chuyên mục</th>
                                        <th className="sorting_disabled"  rowSpan={1} colSpan={1} aria-label="Trạng thái: activate to sort column ascending" style={{ width: 218 }}>Trạng thái</th>
                                        <th style={{ textAlign: 'center !important', width: 130 }} className="sorting_disabled" rowSpan={1} colSpan={1} aria-label="Hành động">Hành động</th>
                                    </tr>
                                </thead>
                                <tbody id="massSelectArea">
                                    {categories.map((category, index) => {
                                        const checked = (selecteds.indexOf(category._id) + 1) ? "checked" : "";
                                        return (
                                            <tr key={category._id} className={index % 2 ? "odd" : "even"} role="row">
                                                <td>
                                                    <div className={checked ? "icheckbox_minimal-blue checked" : "icheckbox_minimal-blue"} aria-checked="false" aria-disabled="false" style={{ position: 'relative' }}>
                                                        <ins
                                                            className="iCheck-helper"
                                                            style={{ position: 'absolute', top: '0%', left: '0%', display: 'block', width: '100%', height: '100%', margin: 0, padding: 0, background: 'rgb(255, 255, 255)', border: 0, opacity: 0 }}
                                                            onClick={() => this.handleSelect(category._id)}
                                                        />
                                                    </div>
                                                </td>
                                                <td>{index + 1}</td>
                                                <td title={category.name}>
                                                    {category.name}
                                                    <a href="#" type="button" className="toggle-widget toggle-confirm pull-right" onClick={e => { e.preventDefault(); this.handleDisable(category) }}>
                                                        <i className={"fa fa-heart" + (category.enabled ? "-o" : "")} title={category.enabled ? "Bật" : "Tắt"} />
                                                    </a>
                                                </td>
                                                <td>{category.enabled ? "Hoạt động" : "Không hoạt động"}</td>
                                                <td className="row-options">
                                                    <a onClick={() => this.setState({ onEdit: category })} className="ajax-modal-btn" style={{ cursor: 'pointer' }}>
                                                        <i title="Chỉnh sửa" className="fa fa-edit" />
                                                    </a>&nbsp;&nbsp;
                                                    <a onClick={() => this.handleDelete(category)} className="ajax-modal-btn" style={{ cursor: 'pointer' }}>
                                                        <i className="fa fa-trash-o" title="Xóa" />
                                                    </a>&nbsp;&nbsp;
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                            <PaginationAdmin currentPage={0} total={categories.length} pageSize={categories.length} gotoPage={this.gotoPage} />
                        </div>
                    </div>
                </div>
                <AddCategory onAdd={onAdd} handleClose={this.handleOpenForm} onAdded={this.gotoPage} />
                <UpdateCategory onEdit={onEdit} handleClose={() => this.setState({ onEdit: null })} />
            </section>
        )
    }
}

export default connect(({ admin: { categories, exUser } }) => ({ categories, exUser }))(Category)
