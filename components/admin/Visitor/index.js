import React, { Component } from 'react'
import { connect } from 'react-redux';
import langConfig, { langConcat } from '../../../lang.config';
import types from '../../../redux/types';
import { createFormData } from '../../../utils/helper';
import { translate } from '../../../utils/language';
import Pagination from '../../pagination/PaginationAdmin';
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
    componentDidUpdate(prevProps) {
        const { active, newNoti, dispatch } = this.props;
        if (!prevProps.active && active && newNoti) {
            dispatch({
                type: types.ADMIN_READ_NOTI,
                payload: { title: 'register' }
            })
        }
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
                title: translate(visitor.enabled ? langConfig.app.ConfirmDisableUser : langConfig.app.ConfirmEnableUser),
                message: translate(visitor.enabled ? langConfig.app.AreYouSureDisableUser : langConfig.app.AreYouSureEnableUser),
                confirm: translate(visitor.enabled ? langConfig.app.DisableUser : langConfig.app.EnableUser),
                cancel: translate(langConfig.app.Cancel),
                handleConfirm: () => this.handleConfirm(visitor),
            }
        })
    }
    handleDelete = (visitor) => {
        const { dispatch } = this.props;
        dispatch({
            type: types.SET_TOOLTIP,
            payload: {
                title: translate(langConfig.app.ConfirmDeleteUser),
                message: translate(langConfig.app.AreYouSureDeleteUser),
                confirm: translate(langConfig.app.DeleteUser),
                cancel: translate(langConfig.app.Cancel),
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
            }
        })
    }

    handleDeleteAll = () => {
        const { dispatch } = this.props;
        const { selecteds } = this.state;
        dispatch({
            type: types.SET_TOOLTIP,
            payload: {
                title: translate(langConfig.app.ConfirmDeleteMultiUser),
                message: `${translate(langConfig.app.AreYouSureDelete)} ${selecteds.length} ${translate(langConfig.resources.user)}?`,
                confirm: translate(langConfig.app.DeleteUser),
                cancel: translate(langConfig.app.Cancel),
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
                        <h3 className="box-title">{translate(langConfig.app.Visitor)}</h3>
                        <div className="box-tools pull-right">
                            <a onClick={this.handleOpenForm} className="ajax-modal-btn btn btn-new btn-flat" style={{ cursor: 'pointer' }}>
                                {translate(langConcat(langConfig.app.Add, langConfig.app.Visitor))}
                            </a>
                        </div>
                    </div>
                    <div className="box-body">
                        <div id="DataTables_Table_1_wrapper" className="dataTables_wrapper form-inline dt-bootstrap no-footer">
                            <div className="dt-buttons btn-group">
                                {selecteds.length ?
                                    <button className="btn btn-default buttons-copy buttons-html5 btn-sm" onClick={this.handleDeleteAll}>
                                        <span>{translate(langConfig.app.Delete)} {selecteds.length} {translate(langConfig.app.selectedItem)}</span>
                                    </button>
                                    : ""}
                            </div>
                            <div id="DataTables_Table_1_filter" className="dataTables_filter">
                                <label>
                                    <input type="search" className={"form-control input-sm" + (name ? " active" : "")} value={name} onChange={this.handleChange} placeholder={translate(langConfig.app.Search)} />
                                </label>
                            </div>
                            <table className="table table-hover table-2nd-no-sort dataTable no-footer" id="DataTables_Table_1" >
                                <thead>
                                    <tr role="row">
                                        <th className="massActionWrapper sorting_disabled" rowSpan={1} colSpan={1} style={{ width: '5%' }}>
                                            <div className="btn-group ">
                                                <button type="button" className="btn btn-xs btn-default checkbox-toggle" onClick={this.handleSelectAll}>
                                                    <i className={selecteds.length ? "fa fa-check-square-o" : "fa fa-square-o"} title="Select all" />
                                                </button>
                                            </div>
                                        </th>
                                        <th className="sorting_disabled" rowSpan={1} colSpan={1} style={{ width: '15%' }}>{translate(langConfig.app.Avatar)}</th>
                                        <th className="sorting_disabled" rowSpan={1} colSpan={1} style={{ width: '15%' }}>{translate(langConfig.app.Name)} (VN)</th>
                                        <th className="sorting_disabled" rowSpan={1} colSpan={1} style={{ width: '15%' }}>{translate(langConfig.app.Name)} (EN)</th>
                                        <th className="sorting_disabled" rowSpan={1} colSpan={1} style={{ width: '15%' }}>{translate(langConfig.app.Email)}</th>
                                        <th className="sorting_disabled" rowSpan={1} colSpan={1} style={{ width: '15%' }}>{translate(langConfig.resources.industry)}</th>
                                        <th className="sorting_disabled" rowSpan={1} colSpan={1} style={{ width: '10%' }}>{translate(langConfig.app.Status)}</th>
                                        <th className="sorting_disabled" rowSpan={1} colSpan={1} style={{ width: '10%', textAlign: 'center!important' }} >
                                            {translate(langConfig.app.Actions)}
                                        </th>
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
                                                        <img src={"/api/images/" + visitor.avatar} className="img-circle img-sm" alt={translate(langConfig.app.Avatar)} />
                                                        :
                                                        <img src="/images/no-avatar.png" className="img-circle img-sm" alt={translate(langConfig.app.Avatar)} />
                                                    }
                                                </td>
                                                <td title={visitor.name}>
                                                    {visitor.name?.split(0, 15)}
                                                </td>
                                                <td title={visitor.name}>
                                                    {visitor.names?.en?.split(0, 15)}
                                                    <a href="#" type="button" className="toggle-widget toggle-confirm pull-right" onClick={() => { this.handleDisable(visitor) }}>
                                                        <i className={"fa fa-heart" + (visitor.enabled ? "-o" : "")} title={translate(visitor.enabled ? langConfig.app.EnableUser : langConfig.app.DisableUser)} />
                                                    </a>
                                                </td>
                                                <td>{visitor.email}</td>
                                                <td>{visitor.industry?.map(i => translate(i.names) || i.name).join(',') || translate(langConfig.app.NotUpdate)}</td>
                                                <td>{translate(visitor.enabled ? langConfig.app.Active : langConfig.app.Inactive)}</td>
                                                <td className="row-options">
                                                    <a onClick={() => this.setState({ onEdit: visitor })} className="ajax-modal-btn" style={{ cursor: 'pointer' }}>
                                                        <i title={translate(langConfig.app.Edit)} className="fa fa-edit" />
                                                    </a>&nbsp;&nbsp;
                                                    <a onClick={() => this.handleDelete(visitor)} className="ajax-modal-btn" style={{ cursor: 'pointer' }}>
                                                        <i className="fa fa-trash-o" title={translate(langConfig.app.Delete)} />
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

export default connect(({ admin: { visitor: { data: visitors, page, total }, newNoti } }) => ({ visitors, page, total, newNoti }))(Visitor)
