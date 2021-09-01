import React, { Component } from 'react'
import { connect } from 'react-redux';
import types from '../../../redux/types';
import Pagination from '../../PaginationAdmin';
import AddIndustry from './AddIndustry';
import UpdateIndustry from './UpdateIndustry';

const pageSize = 10;

class Industry extends Component {
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
    gotoPage = () => {
        const { dispatch } = this.props;
        const { name } = this.state;
        dispatch({
            type: types.ADMIN_GET_INDUSTRIES,
            payload: { name },
            callback: res => {
                this.setState({ selecteds: [] })
            }
        });
    }
    handleDisable = (industry) => {
        const { dispatch } = this.props;
        dispatch({
            type: types.SET_TOOLTIP,
            payload: {
                title: `Xác nhận ${industry.enabled ? 'tắt' : 'bật'} ngành nghề này`,
                message: `Bạn có chắc chắn ${industry.enabled ? 'tắt' : 'bật'} ngành nghề này không?`,
                confirm: `${industry.enabled ? 'Tắt' : 'Bật'} ngành nghề này`,
                handleConfirm: () => this.handleConfirm(industry),
                cancel: 'Hủy',
            }
        })
    }
    handleDelete = (industry) => {
        const { dispatch } = this.props;
        dispatch({
            type: types.SET_TOOLTIP,
            payload: {
                title: `Xác nhận xóa ngành nghề`,
                message: `Bạn có chắc chắn muốn xóa ngành nghề này không?`,
                confirm: `Xóa`,
                handleConfirm: () => {
                    dispatch({
                        type: types.ADMIN_DELETE_INDUSTRY,
                        payload: industry._id,
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
                title: `Xác nhận xóa nhiều ngành nghề`,
                message: `Bạn có chắc chắn muốn xóa ${selecteds.length} ngành nghề không?`,
                confirm: `Xóa ngành nghề này`,
                handleConfirm: () => {
                    dispatch({
                        type: types.ADMIN_DELETE_MULTI_INDUSTRY,
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
    handleConfirm = (industry) => {
        const { dispatch } = this.props;
        dispatch({
            type: types.ADMIN_UPDATE_INDUSTRY,
            payload: { _id: industry._id, enabled: !industry.enabled }
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
        const { industries } = this.props;
        if (selecteds.length < industries.length) {
            this.setState({ selecteds: industries.map(e => e._id) });
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
        const { active, industries } = this.props;
        const { onAdd, onEdit, selecteds, name } = this.state;
        if (!active) return null;
        return (
            <section className="content">
                <div className="box">
                    <div className="box-header with-border">
                        <h3 className="box-title">Danh sách ngành nghề</h3>
                        <div className="box-tools pull-right">
                            <a onClick={this.handleOpenForm} className="ajax-modal-btn btn btn-new btn-flat" style={{ cursor: 'pointer' }}>Thêm ngành nghề</a>
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
                                        <th className="sorting_disabled" rowSpan={1} colSpan={1} style={{ width: '54.8px' }}>STT</th>
                                        <th className="sorting" tabIndex={0} aria-controls="DataTables_Table_1" rowSpan={1} colSpan={1} aria-label="Tên ngành nghề: activate to sort column ascending" style={{ width: '142.8px' }}>Tên ngành nghề</th>
                                        <th className="sorting" tabIndex={0} aria-controls="DataTables_Table_1" rowSpan={1} colSpan={1} aria-label="Trạng thái: activate to sort column ascending" style={{ width: 218 }}>Trạng thái</th>
                                        <th style={{ textAlign: 'center !important', width: 130 }} className="sorting_disabled" rowSpan={1} colSpan={1} aria-label="Hành động">Hành động</th>
                                    </tr>
                                </thead>
                                <tbody id="massSelectArea">
                                    {industries.map((industry, index) => {
                                        const checked = (selecteds.indexOf(industry._id) + 1) ? "checked" : "";
                                        return (
                                            <tr key={industry._id} className={index % 2 ? "odd" : "even"} role="row">
                                                <td>
                                                    <div className={checked ? "icheckbox_minimal-blue checked" : "icheckbox_minimal-blue"} aria-checked="false" aria-disabled="false" style={{ position: 'relative' }}>
                                                        <ins
                                                            className="iCheck-helper"
                                                            style={{ position: 'absolute', top: '0%', left: '0%', display: 'block', width: '100%', height: '100%', margin: 0, padding: 0, background: 'rgb(255, 255, 255)', border: 0, opacity: 0 }}
                                                            onClick={() => this.handleSelect(industry._id)}
                                                        />
                                                    </div>
                                                </td>
                                                <td>{index + 1}</td>
                                                <td title={industry.name}>
                                                    {industry.name}
                                                    <a href="#" type="button" className="toggle-widget toggle-confirm pull-right" onClick={e => { e.preventDefault(); this.handleDisable(industry) }}>
                                                        <i className={"fa fa-heart" + (industry.enabled ? "-o" : "")} title={industry.enabled ? "Bật" : "Tắt"} />
                                                    </a>
                                                </td>
                                                <td>{industry.enabled ? "Hoạt động" : "Không hoạt động"}</td>
                                                <td className="row-options" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                    <a onClick={() => this.setState({ onEdit: industry })} className="ajax-modal-btn" style={{ cursor: 'pointer' }}>
                                                        <i title="Chỉnh sửa" className="fa fa-edit" />
                                                    </a>&nbsp;&nbsp;
                                                    <a onClick={() => this.handleDelete(industry)} className="ajax-modal-btn" style={{ cursor: 'pointer' }}>
                                                        <i className="fa fa-trash-o" title="Xóa" />
                                                    </a>&nbsp;&nbsp;
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                            <Pagination currentPage={0} total={industries.length} pageSize={industries.length} gotoPage={this.gotoPage} />
                        </div>
                    </div>
                </div>
                <AddIndustry onAdd={onAdd} handleClose={this.handleOpenForm} onAdded={this.gotoPage} />
                <UpdateIndustry onEdit={onEdit} handleClose={() => this.setState({ onEdit: null })} />
            </section>
        )
    }
}

export default connect(({ admin: { industries } }) => ({ industries }))(Industry)
