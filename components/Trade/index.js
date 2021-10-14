import React, { Component } from 'react'
import { connect } from 'react-redux';
import types from '../../redux/types';
import { formatTime, MODE } from '../../utils/helper';
import PaginationAdmin from '../PaginationAdmin';
import AddTrade from './AddTrade';
import UpdateTrade from './UpdateTrade';

const pageSize = 10;

class Trade extends Component {
    constructor(props) {
        super(props);
        this.state = {
            onAdd: false,
            selecteds: [],
            name: ''
        }
        this.ref = React.createRef();
    }
    componentDidMount() {
        this.gotoPage();
    }
    componentDidUpdate(prevProps) {
        if (!prevProps.exUser && this.props.exUser?._id) {
            this.gotoPage();
        }
    }
    gotoPage = (page) => {
        const { dispatch, exUser, user } = this.props;
        const { name } = this.state;
        const query = { name, pageSize, page: page || 0 }
        if (user.mode === MODE.admin && exUser) query.from = exUser._id
        dispatch({
            type: types.ADMIN_GET_TRADES,
            payload: query,
            callback: res => {
                this.setState({ selecteds: [] })
            }
        });
    }
    handleDelete = (trade) => {
        const { dispatch } = this.props;
        dispatch({
            type: types.SET_TOOLTIP,
            payload: {
                title: `Xác nhận xóa lịch giao thương`,
                message: `Bạn có chắc chắn muốn xóa lịch giao thương này không?`,
                confirm: `Xóa`,
                handleConfirm: () => {
                    dispatch({
                        type: types.ADMIN_DELETE_TRADE,
                        payload: trade._id,
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
                title: `Xác nhận xóa nhiều lịch giao thương`,
                message: `Bạn có chắc chắn muốn xóa ${selecteds.length} lịch giao thương không?`,
                confirm: `Xóa lịch giao thương này`,
                handleConfirm: () => {
                    dispatch({
                        type: types.ADMIN_DELETE_MULTI_TRADE,
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
        const { trades } = this.props;
        if (selecteds.length < trades.length) {
            this.setState({ selecteds: trades.map(e => e._id) });
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
    handleDownload = (type) => {
        const { dispatch, exUser } = this.props;
        dispatch({
            type: types.ADMIN_CREATE_TRADE_FILE,
            payload: exUser?._id ? { from: exUser._id, type } : { type },
            callback: res => {
                if (res?.success) {
                    const URL = process.env.HOST_NAME === "localhost" ? process.env.API_URL_LOCAL : process.env.API_URL;
                    var a = document.createElement("a");
                    a.href = `${URL}trade/download?fileName=${res.fileName}`;
                    a.setAttribute("download", res.fileName);
                    a.click();
                }
            }
        })
    }
    render() {
        const { active, trades, user, exUser, page, total } = this.props;
        if (!active) return null;
        const { onAdd, onEdit, selecteds, name } = this.state;
        const fromUser = exUser || user;
        return (
            <section className="content">
                <div className="box">
                    <div className="box-header with-border">
                        <h3 className="box-title">Danh sách lịch giao thương</h3>
                        <div className="box-tools pull-right">
                            <a onClick={this.handleOpenForm} className="ajax-modal-btn btn btn-new btn-flat" style={{ cursor: 'pointer' }}>Thêm lịch giao thương</a>
                        </div>
                    </div>
                    <div className="box-body">
                        <div id="DataTables_Table_1_wrapper" className="dataTables_wrapper form-inline dt-bootstrap no-footer">
                            <div className="dt-buttons btn-group">
                                {selecteds.length ?
                                    <>
                                        <button className="btn btn-default buttons-copy buttons-html5 btn-sm" onClick={this.handleDeleteAll}>
                                            <span>Xóa {selecteds.length} mục đã chọn</span>
                                        </button>
                                        <button className="btn btn-default buttons-copy buttons-html5 btn-sm" disabled>
                                            <span>{'I'}</span>
                                        </button>
                                    </>
                                    : ""}
                                <button className="btn btn-default buttons-copy buttons-html5 btn-sm" onClick={() => this.handleDownload("csv")}>
                                    <span>CSV</span>
                                </button>
                                <button className="btn btn-default buttons-copy buttons-html5 btn-sm" onClick={() => this.handleDownload("xls")}>
                                    <span>EXCEL</span>
                                </button>
                            </div>
                            <div id="DataTables_Table_1_filter" className="dataTables_filter">
                                <label>
                                    <input type="search" className={"form-control input-sm" + (name ? " active" : "")} value={name} onChange={this.handleChange} placeholder="Tìm kiếm" />
                                </label>
                            </div>
                            <table className="table table-hover table-2nd-no-sort dataTable no-footer" id="DataTables_Table_1" role="grid" aria-describedby="DataTables_Table_1_info">
                                <thead>
                                    <tr role="row">
                                        <th className="massActionWrapper sorting_disabled" rowSpan={1} colSpan={1} style={{ width: 44.8, minWidth: 44.8 }}>
                                            <div className="btn-group ">
                                                <button type="button" className="btn btn-xs btn-default checkbox-toggle" onClick={this.handleSelectAll}>
                                                    <i className={selecteds.length ? "fa fa-check-square-o" : "fa fa-square-o"} title="Select all" />
                                                </button>
                                            </div>
                                        </th>
                                        {user.mode === MODE.admin && !exUser ?
                                            <>
                                                <th className="sorting_disabled" rowSpan={1} colSpan={1} style={{ width: '142.8px' }}>Thành viên 1</th>
                                                <th className="sorting_disabled" rowSpan={1} colSpan={1} style={{ width: '142.8px' }}>Thành viên 2</th>
                                            </>
                                            : <th className=" sorting_disabled" rowSpan={1} colSpan={1} style={{ width: '142.8px' }}>Thông tin khách hàng</th>
                                        }
                                        <th className=" sorting_disabled" rowSpan={1} colSpan={1} style={{ width: 218 }}>Thời gian</th>
                                        <th className=" sorting_disabled" rowSpan={1} colSpan={1} style={{ width: 218 }}>Nội dung giao thương</th>
                                        {user?.mode !== MODE.admin || exUser ?
                                            <th className=" sorting_disabled" rowSpan={1} colSpan={1} style={{ width: 218 }}>Thời gian đăng ký</th>
                                            : null}
                                        {user.mode === MODE.admin && !exUser ?
                                            <th className=" sorting_disabled" rowSpan={1} colSpan={1} style={{ width: 218 }}>Trạng thái</th>
                                            : null}
                                        <th style={{ textAlign: 'center !important', width: 130 }} className="sorting_disabled" rowSpan={1} colSpan={1} >Hành động</th>
                                    </tr>
                                </thead>
                                <tbody id="massSelectArea">
                                    {trades.map((trade, index) => {
                                        const checked = (selecteds.indexOf(trade._id) + 1) ? "checked" : "";
                                        const from = trade.leader.user === fromUser._id ? trade.leader : trade.member;
                                        const to = trade.leader.user === fromUser._id ? trade.member : trade.leader;
                                        const tradeTime = formatTime(trade.deadline, "YYYY-MM-DD HH:II:SS");
                                        const createTime = formatTime(trade.createdAt, "YYYY-MM-DD HH:II:SS");
                                        const approved = trade.approved ? "Đã duyệt" : "Chưa duyệt"
                                        return (
                                            <tr key={trade._id} className={index % 2 ? "odd" : "even"} role="row">
                                                <td>
                                                    <div className={checked ? "icheckbox_minimal-blue checked" : "icheckbox_minimal-blue"} aria-checked="false" aria-disabled="false" style={{ position: 'relative' }}>
                                                        <ins
                                                            className="iCheck-helper"
                                                            style={{ position: 'absolute', top: '0%', left: '0%', display: 'block', width: '100%', height: '100%', margin: 0, padding: 0, background: 'rgb(255, 255, 255)', border: 0, opacity: 0 }}
                                                            onClick={() => this.handleSelect(trade._id)}
                                                        />
                                                    </div>
                                                </td>
                                                {user.mode === MODE.admin && !exUser ? <td title={from.name}>{from.name} - {from.email}</td> : null}
                                                <td title={to.name}>{to.name} - {to.email}</td>
                                                <td title={tradeTime}>{tradeTime}</td>
                                                <td>{trade.content}</td>
                                                {user.mode === MODE.admin && !exUser ? <td title={approved}>{approved}</td> : null}
                                                {user.mode !== MODE.admin || exUser ? <td title={createTime}>{createTime}</td> : null}
                                                <td className="row-options">
                                                    <a onClick={() => this.setState({ onEdit: trade })} className="ajax-modal-btn" style={{ cursor: 'pointer' }}>
                                                        <i title="Chỉnh sửa" className="fa fa-edit" />
                                                    </a>&nbsp;&nbsp;
                                                    <a onClick={() => this.handleDelete(trade)} className="ajax-modal-btn" style={{ cursor: 'pointer' }}>
                                                        <i className="fa fa-trash-o" title="Xóa" />
                                                    </a>&nbsp;&nbsp;
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                            <PaginationAdmin currentPage={page} total={total} pageSize={pageSize} gotoPage={this.gotoPage} />
                        </div>
                    </div>
                </div>
                {/* <AddTrade onAdd={null} handleClose={this.handleOpenForm} onAdded={this.gotoPage} /> */}
                <UpdateTrade onEdit={onEdit} handleClose={() => this.setState({ onEdit: null })} />
            </section>
        )
    }
}

export default connect(({ admin: { trade: { data: trades, page, total }, exUser, user } }) => ({ trades, page, total, exUser, user }))(Trade)
