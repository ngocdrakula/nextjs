import React, { Component } from 'react'
import { connect } from 'react-redux';
import types from '../../../redux/types';
import Pagination from '../../pagination/PaginationAdmin';
import DetailContact from './DetailContact';
import UpdateContact from './UpdateContact';
import langConfig, { langConcat } from '../../../lang.config';
import { translate } from '../../../utils/language'

const pageSize = 10;

class Contact extends Component {
    constructor(props) {
        super(props);
        this.state = {
            onView: false,
            selecteds: [],
            name: ''
        }
    }
    componentDidMount() {
        this.gotoPage();
    }
    componentWillUnmount() {
        clearTimeout(this.timeout)
    }
    gotoPage = (page = 0) => {
        const { dispatch } = this.props;
        const { name, read } = this.state;
        dispatch({
            type: types.ADMIN_GET_CONTACTS,
            payload: { page, pageSize, name, read },
            callback: res => {
                this.setState({ selecteds: [] })
            }
        });
    }
    handleDisable = (contact) => {
        const { dispatch } = this.props;
        dispatch({
            type: types.SET_TOOLTIP,
            payload: {
                title: translate(langConfig.app.ConfirmMessageMove),
                message: `${translate(langConcat(langConfig.app.MoveMessageTo, contact.read ? langConfig.app.UnreadInbox : langConfig.app.ReadInbox))}?`,
                confirm: translate(langConfig.app.Move),
                cancel: translate(langConfig.app.Cancel),
                handleConfirm: () => this.handleConfirm(contact),
            }
        })
    }
    handleDelete = (contact) => {
        const { dispatch } = this.props;
        dispatch({
            type: types.SET_TOOLTIP,
            payload: {
                title: translate(langConfig.app.ConfirmDeleteMessage),
                message: `${translate(langConcat(langConfig.app.AreYouSureDelete, contact.read ? langConfig.app.ThisMessage : langConfig.app.UnreadMessages))}?`,
                confirm: translate(langConcat(langConfig.app.Delete, langConfig.resources.message)),
                cancel: translate(langConfig.app.Cancel),
                handleConfirm: () => {
                    dispatch({
                        type: types.ADMIN_DELETE_CONTACT,
                        payload: contact._id,
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
                title: translate(langConfig.app.ConfirmDeleteMultipleMessage),
                message: `${translate(langConfig.app.AreYouSureDelete)} ${selecteds.length} ${translate(langConfig.app.Messages)}?`,
                confirm: translate(langConcat(langConfig.app.Delete,langConfig.app.Messages)),
                handleConfirm: () => {
                    dispatch({
                        type: types.ADMIN_DELETE_MULTI_CONTACT,
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
    handleConfirm = (contact) => {
        const { dispatch } = this.props;
        dispatch({
            type: types.ADMIN_UPDATE_CONTACT,
            payload: { _id: contact._id, read: !contact.read }
        })
    }
    handleViewDetail = (contact, e) => {
        e?.preventDefault?.();
        this.setState({ onView: contact });
        if (!contact.read) {
            const { dispatch } = this.props;
            dispatch({
                type: types.ADMIN_UPDATE_CONTACT,
                payload: { _id: contact._id, read: true }
            })
        }
    }
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
        const { contacts } = this.props;
        if (selecteds.length < contacts.length) {
            this.setState({ selecteds: contacts.map(e => e._id) });
        }
        else {
            this.setState({ selecteds: [] })
        }
    }
    handleFilter = (read) => {
        this.setState({ read }, this.gotoPage)
    }
    handleChange = e => {
        this.setState({ name: e.target.value });
        clearTimeout(this.timeout);
        this.timeout = setTimeout(this.gotoPage, 1000);
    }
    handleDownload = (type) => {
        const { dispatch } = this.props;
        dispatch({
            type: types.ADMIN_CREATE_CONTACT_FILE,
            payload: { type },
            callback: res => {
                if (res?.success) {
                    const URL = process.env.HOST_NAME === "localhost" ? process.env.API_URL_LOCAL : process.env.API_URL;
                    var a = document.createElement("a");
                    a.href = `${URL}contact/download?fileName=${res.fileName}`;
                    a.setAttribute("download", res.fileName);
                    a.click();
                }
            }
        })
    }
    render() {
        const { active, contacts, page, total } = this.props;
        const { onView, onEdit, selecteds, read, name } = this.state;
        if (!active) return null;
        return (
            <section className="content">
                <div className="box">
                    <div className="box-header with-border">
                        <h3 className="box-title">{translate(langConfig.app.ContactList)}</h3>
                        <div className="box-tools pull-right">
                            <a onClick={e => this.handleFilter()} className={"ajax-modal-btn btn btn-new btn-flat contact-btn" + (read === undefined ? " active" : "")}>
                                {translate(langConfig.app.Inbox)}
                            </a>
                            <a onClick={e => this.handleFilter(false)} className={"ajax-modal-btn btn btn-new btn-flat contact-btn" + (read === false ? " active" : "")}>
                                {translate(langConfig.app.UnreadMessages)}
                            </a>
                            <a onClick={e => this.handleFilter(true)} className={"ajax-modal-btn btn btn-new btn-flat contact-btn" + (read === true ? " active" : "")}>
                                {translate(langConfig.app.MessagesRead)}
                            </a>
                        </div>
                    </div>
                    <div className="box-body">
                        <div id="DataTables_Table_1_wrapper" className="dataTables_wrapper form-inline dt-bootstrap no-footer">
                            <div className="dt-buttons btn-group">
                                {selecteds.length ?
                                    <>
                                        <button className="btn btn-default buttons-copy buttons-html5 btn-sm" onClick={this.handleDeleteAll}>
                                            <span>{translate(langConfig.app.Delete)} {selecteds.length} {translate(langConfig.app.selectedItem)}</span>
                                        </button>
                                        <button className="btn btn-default buttons-copy buttons-html5 btn-sm" disabled>
                                            <span>{'I'}</span>
                                        </button>
                                    </>
                                    : ""}
                                <button className="btn btn-default buttons-copy buttons-html5 btn-sm" onClick={() => this.handleDownload("csv")}>
                                    <span>{translate(langConfig.app.CSV)}</span>
                                </button>
                                <button className="btn btn-default buttons-copy buttons-html5 btn-sm" onClick={() => this.handleDownload("xls")}>
                                    <span>{translate(langConfig.app.EXCEL)}</span>
                                </button>
                            </div>
                            <div id="DataTables_Table_1_filter" className="dataTables_filter">
                                <label>
                                    <input type="search" className={"form-control input-sm" + (name ? " active" : "")} value={name} onChange={this.handleChange} placeholder={translate(langConfig.app.SearchNameEmailSubject)} />
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
                                        <th className="sorting_disabled" rowSpan={1} colSpan={1} style={{ width: '8%' }}>{translate(langConfig.app.Index)}</th>
                                        <th className="sorting_disabled" rowSpan={1} colSpan={1} style={{ width: '15%' }}>{translate(langConfig.app.Name)}</th>
                                        <th className="sorting_disabled" rowSpan={1} colSpan={1} style={{ width: '15%' }}>{translate(langConfig.app.Email)}</th>
                                        <th className="sorting_disabled" rowSpan={1} colSpan={1} style={{ width: '15%' }}>{translate(langConfig.app.Subject)}</th>
                                        <th className="sorting_disabled" rowSpan={1} colSpan={1} style={{ width: '20%' }}>{translate(langConfig.app.Content)}</th>
                                        <th className="sorting_disabled" rowSpan={1} colSpan={1} style={{ width: '10%' }}>{translate(langConfig.app.Status)}</th>
                                        <th className="sorting_disabled" rowSpan={1} colSpan={1} style={{ textAlign: 'center !important', width: '10%' }} >{translate(langConfig.app.Actions)}</th>
                                    </tr>
                                </thead>
                                <tbody id="massSelectArea">
                                    {contacts.map((contact, index) => {
                                        if (read !== undefined && contact.read !== read) return null;
                                        const checked = (selecteds.indexOf(contact._id) + 1) ? "checked" : "";
                                        return (
                                            <tr key={contact._id} className={(index % 2 ? "odd" : "even") + (contact.read ? "" : "contact-unread")} role="row">
                                                <td>
                                                    <div className={checked ? "icheckbox_minimal-blue checked" : "icheckbox_minimal-blue"} aria-checked="false" aria-disabled="false" style={{ position: 'relative' }}>
                                                        <ins
                                                            className="iCheck-helper"
                                                            style={{ position: 'absolute', top: '0%', left: '0%', display: 'block', width: '100%', height: '100%', margin: 0, padding: 0, background: 'rgb(255, 255, 255)', border: 0, opacity: 0 }}
                                                            onClick={() => this.handleSelect(contact._id)}
                                                        />
                                                    </div>
                                                </td>
                                                <td title={contact.name}>
                                                    {contact.name?.slice(0, 15)}{contact.name.length > 15 ? "..." : ""}{'  '}
                                                    <a href="#" type="button" className="toggle-widget toggle-confirm pull-right" onClick={e => { e.preventDefault(); this.handleDisable(contact) }}>
                                                        <i className={"fa fa-heart" + (contact.read ? "-o" : "")} title={contact.read ? translate(langConfig.app.MarkUnread) : translate(langConfig.app.MarkRead)} />
                                                    </a>
                                                </td>
                                                <td>
                                                    <a href={"mailto:" + contact.email} target="_blank" title={translate(langConfig.app.SendEmail)}>{contact.email}</a>
                                                </td>
                                                <td>{contact.title}</td>
                                                <td>{contact.message?.slice(0, 50)}{contact.message.length > 50 ? "..." : ""}</td>
                                                <td>{contact.read ? translate(langConfig.app.Read) : translate(langConfig.app.Unread)}</td>
                                                <td className="row-options">
                                                    <a onClick={() => this.handleViewDetail(contact)} className="ajax-modal-btn" style={{ cursor: 'pointer' }}>
                                                        <i title="Detail" className="fa fa-expand" />
                                                    </a>&nbsp;&nbsp;
                                                    <a onClick={() => this.setState({ onEdit: contact })} className="ajax-modal-btn" style={{ cursor: 'pointer' }}>
                                                        <i title="Chỉnh sửa" className="fa fa-edit" />
                                                    </a>&nbsp;&nbsp;
                                                    <a onClick={() => this.handleDelete(contact)} className="ajax-modal-btn" style={{ cursor: 'pointer' }}>
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
                <DetailContact onView={onView} handleClose={() => this.setState({ onView: null })} />
                <UpdateContact onEdit={onEdit} handleClose={() => this.setState({ onEdit: null })} />
            </section>
        )
    }
}

export default connect(({ admin: { contact: { data: contacts, page, total } } }) => ({ contacts, page, total }))(Contact)
