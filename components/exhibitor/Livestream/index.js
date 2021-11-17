import React, { Component } from 'react'
import { connect } from 'react-redux';
import types from '../../../redux/types';
import Pagination from '../../pagination/PaginationAdmin';
import AddLivestream from './AddLivestream';
import UpdateLivestream from './UpdateLivestream';

const pageSize = 10;

class Livestream extends Component {
    constructor(props) {
        super(props);
        this.state = {
            onAdd: false,
            selecteds: [],
            title: ''
        }
    }
    componentDidMount() {
        this.gotoPage();
    }
    gotoPage = (page = 0) => {
        const { dispatch, exUser } = this.props;
        const { title } = this.state;
        dispatch({
            type: types.ADMIN_GET_LIVESTREAMS,
            payload: { page, pageSize, title, author: exUser?._id },
            callback: res => {
                this.setState({ selecteds: [] })
            }
        });
    }
    handleDisable = (livestream) => {
        const { dispatch } = this.props;
        dispatch({
            type: types.SET_TOOLTIP,
            payload: {
                title: `Xác nhận ${livestream.enabled ? 'ẩn' : 'hiện'} livestream`,
                message: `Bạn có chắc chắn ${livestream.enabled ? 'ẩn' : 'hiện'} livestream này không?`,
                confirm: `${livestream.enabled ? 'Ẩn' : 'Hiện'} livestream`,
                handleConfirm: () => this.handleConfirm(livestream),
                cancel: 'Hủy',
            }
        })
    }
    handleDelete = (livestream) => {
        const { dispatch } = this.props;
        dispatch({
            type: types.SET_TOOLTIP,
            payload: {
                title: `Xác nhận xóa livestream`,
                message: `Bạn có chắc chắn muốn xóa livestream này không?`,
                confirm: `Xóa livestream`,
                handleConfirm: () => {
                    dispatch({
                        type: types.ADMIN_DELETE_LIVESTREAM,
                        payload: livestream._id,
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
                title: `Xác nhận xóa nhiều livestream`,
                message: `Bạn có chắc chắn muốn xóa ${selecteds.length} livestream không?`,
                confirm: `Xóa livestream`,
                handleConfirm: () => {
                    dispatch({
                        type: types.ADMIN_DELETE_MULTI_LIVESTREAM,
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
    handleConfirm = (livestream) => {
        const { dispatch } = this.props;
        dispatch({
            type: types.ADMIN_UPDATE_LIVESTREAM,
            payload: { _id: livestream._id, enabled: !livestream.enabled }
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
        const { livestreams } = this.props;
        if (selecteds.length < livestreams.length) {
            this.setState({ selecteds: livestreams.map(e => e._id) });
        }
        else {
            this.setState({ selecteds: [] })
        }
    }
    handleChange = e => {
        this.setState({ title: e.target.value });
        clearTimeout(this.timeout);
        this.timeout = setTimeout(this.gotoPage, 1000);
    }
    render() {
        const { active, livestreams, page, total } = this.props;
        const { onAdd, onEdit, selecteds, title } = this.state;
        if (!active) return null;
        return (
            <section className="content">
                <div className="box">
                    <div className="box-header with-border">
                        <h3 className="box-title">Livestream</h3>
                        <div className="box-tools pull-right">
                            <a onClick={this.handleOpenForm} className="ajax-modal-btn btn btn-new btn-flat" style={{ cursor: 'pointer' }}>Thêm livestream</a>
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
                            </div>
                            <div id="DataTables_Table_1_filter" className="dataTables_filter">
                                <label>
                                    <input type="search" className={"form-control input-sm" + (title ? " active" : "")} value={title} onChange={this.handleChange} placeholder="Tìm kiếm theo tiêu đề" />
                                </label>
                            </div>
                            <table className="table table-hover table-2nd-no-sort dataTable no-footer" id="DataTables_Table_1" role="grid" aria-describedby="DataTables_Table_1_info">
                                <thead>
                                    <tr role="row">
                                        <th className="massActionWrapper sorting_disabled" rowSpan={1} colSpan={1} style={{ width: '15%' }}>
                                            <div className="btn-group ">
                                                <button type="button" className="btn btn-xs btn-default checkbox-toggle" onClick={this.handleSelectAll}>
                                                    <i className={selecteds.length ? "fa fa-check-square-o" : "fa fa-square-o"} title="Select all" />
                                                </button>
                                            </div>
                                        </th>
                                        <th className="sorting_disabled" rowSpan={1} colSpan={1} style={{ width: '20%', minWidth: 150 }}>Tiêu đề</th>
                                        <th className="sorting_disabled" rowSpan={1} colSpan={1} style={{ width: '30%' }}>Mô tả</th>
                                        <th className="sorting_disabled" rowSpan={1} colSpan={1} style={{ width: '20%' }}>Link</th>
                                        <th className="sorting_disabled" rowSpan={1} colSpan={1} style={{ width: '10%' }}>Trạng thái</th>
                                        <th className="sorting_disabled" rowSpan={1} colSpan={1} style={{ width: '10%' }} >Hành động</th>
                                    </tr>
                                </thead>
                                <tbody id="massSelectArea">
                                    {livestreams.map((livestream, index) => {
                                        const checked = (selecteds.indexOf(livestream._id) + 1) ? "checked" : "";
                                        return (
                                            <tr key={livestream._id} className={index % 2 ? "odd" : "even"} role="row">
                                                <td>
                                                    <div className={checked ? "icheckbox_minimal-blue checked" : "icheckbox_minimal-blue"} aria-checked="false" aria-disabled="false" style={{ position: 'relative' }}>
                                                        <ins
                                                            className="iCheck-helper"
                                                            style={{ position: 'absolute', top: '0%', left: '0%', display: 'block', width: '100%', height: '100%', margin: 0, padding: 0, background: 'rgb(255, 255, 255)', border: 0, opacity: 0 }}
                                                            onClick={() => this.handleSelect(livestream._id)}
                                                        />
                                                    </div>
                                                </td>
                                                <td title={livestream.title}>
                                                    {livestream.title}
                                                </td>
                                                <td title={livestream.description}>
                                                    {livestream.description}
                                                </td>
                                                <td className="livestream-link">{livestream.link}</td>
                                                <td>{livestream.enabled ? 'Hoạt động' : 'Không hoạt động'}</td>
                                                <td className="row-options">
                                                    <a onClick={() => this.setState({ onEdit: livestream })} className="ajax-modal-btn" style={{ cursor: 'pointer' }}>
                                                        <i title="Chỉnh sửa" className="fa fa-edit" />
                                                    </a>&nbsp;&nbsp;
                                                    <a onClick={() => this.handleDelete(livestream)} className="ajax-modal-btn" style={{ cursor: 'pointer' }}>
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
                <AddLivestream onAdd={onAdd} handleClose={this.handleOpenForm} onAdded={this.gotoPage} />
                <UpdateLivestream onEdit={onEdit} handleClose={() => this.setState({ onEdit: null })} />
            </section >
        )
    }
}

export default connect(({ admin: { livestream: { data: livestreams, page, total }, exUser } }) => ({ livestreams, page, total, exUser }))(Livestream)
