import React, { Component } from 'react'
import { connect } from 'react-redux';
import langConfig, { langConcat } from '../../../lang.config';
import types from '../../../redux/types';
import { createFormData } from '../../../utils/helper';
import Pagination from '../../pagination/PaginationAdmin';
import { translate } from '../../../utils/language';
import AddExhibitor from './AddExhibitor';
import UpdateExhibitor from './UpdateExhibitor';

const pageSize = 10;

class Exhibitor extends Component {
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
            type: types.ADMIN_GET_EXHIBITOR,
            payload: { page, pageSize, name },
            callback: res => {
                this.setState({ selecteds: [] })
            }
        });
    }
    handleDisable = (exhibitor) => {
        const { dispatch } = this.props;
        dispatch({
            type: types.SET_TOOLTIP,
            payload: {
                title: translate(exhibitor.enabled ? langConfig.app.ConfirmDisableUser : langConfig.app.ConfirmEnableUser),
                message: translate(exhibitor.enabled ? langConfig.app.AreYouSureDisableUser : langConfig.app.AreYouSureEnableUser),
                confirm: translate(exhibitor.enabled ? langConfig.app.DisableUser : langConfig.app.EnableUser),
                cancel: translate(langConfig.app.Cancel),
                handleConfirm: () => this.handleConfirm(exhibitor),
            }
        })
    }
    handleDelete = (exhibitor) => {
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
                        payload: exhibitor._id,
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
    handleConfirm = (exhibitor) => {
        const { dispatch } = this.props;
        const formData = createFormData({ enabled: !exhibitor.enabled });
        dispatch({
            type: types.ADMIN_UPDATE_USER,
            payload: { _id: exhibitor._id, formData }
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
    handleSwitch = exhibitor => {
        const { dispatch } = this.props;
        dispatch({
            type: types.ADMIN_GET_USER,
            payload: exhibitor._id
        });
    }
    handleChange = e => {
        this.setState({ name: e.target.value });
        clearTimeout(this.timeout);
        this.timeout = setTimeout(this.gotoPage, 1000);
    }
    render() {
        const { active, exhibitors, page, total } = this.props;
        const { onAdd, onEdit, selecteds, name } = this.state;
        if (!active) return null;
        return (
            <section className="content">
                <div className="box">
                    <div className="box-header with-border">
                        <h3 className="box-title">{translate(langConfig.app.Exhibitor)}</h3>
                        <div className="box-tools pull-right">
                            <a onClick={this.handleOpenForm} className="ajax-modal-btn btn btn-new btn-flat" style={{ cursor: 'pointer' }}>
                                {translate(langConcat(langConfig.app.Add, langConfig.app.Exhibitor))}
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
                            <table className="table table-hover table-2nd-no-sort dataTable no-footer" id="DataTables_Table_1">
                                <thead>
                                    <tr role="row">
                                        <th className="massActionWrapper sorting_disabled" rowSpan={1} colSpan={1} style={{ width: '10%' }}>
                                            <div className="btn-group ">
                                                <button type="button" className="btn btn-xs btn-default checkbox-toggle" onClick={this.handleSelectAll}>
                                                    <i className={selecteds.length ? "fa fa-check-square-o" : "fa fa-square-o"} title={translate(langConfig.app.SelectAll)} />
                                                </button>
                                            </div>
                                        </th>
                                        <th className="sorting_disabled" rowSpan={1} colSpan={1} style={{ width: '10%' }}>{translate(langConfig.app.Logo)}</th>
                                        <th className="sorting_disabled" rowSpan={1} colSpan={1} style={{ width: '20%' }}>{translate(langConfig.app.Name)}</th>
                                        <th className="sorting_disabled" rowSpan={1} colSpan={1} style={{ width: '25%' }}>{translate(langConfig.app.Email)}</th>
                                        <th className="sorting_disabled" rowSpan={1} colSpan={1} style={{ width: '15%' }}>{translate(langConfig.resources.industry)}</th>
                                        <th className="sorting_disabled" rowSpan={1} colSpan={1} style={{ width: '10%' }}>{translate(langConfig.app.Status)}</th>
                                        <th className="sorting_disabled" rowSpan={1} colSpan={1} style={{ width: '10%', textAlign: 'center !important', }}>
                                            {translate(langConfig.app.Actions)}
                                        </th>
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
                                                        <img src={"/api/images/" + exhibitor.avatar} className="img-circle img-sm" alt={translate(langConfig.app.Logo)} />
                                                        :
                                                        <img src="/images/no-avatar.png" className="img-circle img-sm" alt={translate(langConfig.app.Logo)} />
                                                    }
                                                </td>
                                                <td title={exhibitor.name}>
                                                    {exhibitor.name?.split(0, 15)}
                                                    <a href="#" type="button" className="toggle-widget toggle-confirm pull-right" onClick={e => { e.preventDefault(); this.handleDisable(exhibitor) }}>
                                                        <i className={"fa fa-heart" + (exhibitor.enabled ? "-o" : "")} title={translate(exhibitor.enabled ? langConfig.app.EnableUser : langConfig.app.DisableUser)} />
                                                    </a>
                                                </td>
                                                <td>{exhibitor.email}</td>
                                                <td>{exhibitor.industry?.map(i => i.name).join(',') || ''}</td>
                                                <td>{translate(exhibitor.enabled ? langConfig.app.Active : langConfig.app.Inactive)}</td>
                                                <td className="row-options">
                                                    <a href="#" onClick={() => this.handleSwitch(exhibitor)}>
                                                        <i title={translate(langConfig.app.LoginWithExhibitor)} className="fa fa-user-secret" />
                                                    </a>&nbsp;&nbsp;
                                                    <a onClick={() => this.setState({ onEdit: exhibitor })} className="ajax-modal-btn" style={{ cursor: 'pointer' }}>
                                                        <i title={translate(langConfig.app.Edit)} className="fa fa-edit" />
                                                    </a>&nbsp;&nbsp;
                                                    <a onClick={() => this.handleDelete(exhibitor)} className="ajax-modal-btn" style={{ cursor: 'pointer' }}>
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
                <AddExhibitor onAdd={onAdd} handleClose={this.handleOpenForm} onAdded={this.gotoPage} />
                <UpdateExhibitor onEdit={onEdit} handleClose={() => this.setState({ onEdit: null })} />
            </section>
        )
    }
}

export default connect(({ admin: { exhibitor: { data: exhibitors, page, total } } }) => ({ exhibitors, page, total }))(Exhibitor)
