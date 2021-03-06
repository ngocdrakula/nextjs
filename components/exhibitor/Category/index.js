import React, { Component } from 'react'
import { connect } from 'react-redux';
import langConfig, { langConcat } from '../../../lang.config';
import types from '../../../redux/types';
import PaginationAdmin from '../../pagination/PaginationAdmin';
import { translate } from '../../../utils/language';
import AddCategory from './AddCategory';
import UpdateCategory from './UpdateCategory';
import CautionAdmin from '../../Layout/Admin/CautionAdmin';

const pageSize = 100;

class Category extends Component {
    constructor(props) {
        super(props);
        this.state = {
            onAdd: false,
            selecteds: [],
            name: '',
            currentIndex: 0
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
                title: translate(category.enabled ? langConfig.app.ConfirmDisableCategory : langConfig.app.ConfirmEnableCategory),
                message: translate(category.enabled ? langConfig.app.AreYouSureDisableCategory : langConfig.app.AreYouSureEnableCategory),
                confirm: translate(category.enabled ? langConfig.app.DisableCategory : langConfig.app.EnableCategory),
                cancel: translate(langConfig.app.Cancel),
                handleConfirm: () => this.handleConfirm(category),
            }
        })
    }
    handleDelete = (category) => {
        const { dispatch } = this.props;
        dispatch({
            type: types.SET_TOOLTIP,
            payload: {
                title: translate(langConfig.app.ConfirmDeleteCategory),
                message: translate(langConfig.app.AreYouSureDeleteCategory),
                confirm: translate(langConfig.app.DeleteCategory),
                cancel: translate(langConfig.app.Cancel),
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
            }
        })
    }

    handleDeleteAll = () => {
        const { dispatch } = this.props;
        const { selecteds } = this.state;
        dispatch({
            type: types.SET_TOOLTIP,
            payload: {
                title: translate(langConfig.app.ConfirmDeleteMultiCategory),
                message: `${translate(langConfig.app.AreYouSureDelete)} ${selecteds.length} ${translate(langConfig.resources.category)}?`,
                confirm: translate(langConfig.app.DeleteCategory),
                cancel: translate(langConfig.app.Cancel),
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
    handleDrag = (_id) => {
        this.dataTransfer = _id;
    }
    handleDragOver = (e, _id, index) => {
        e.preventDefault();
        if (this.target !== _id) {
            document.getElementById(this.target)?.classList?.remove?.("drag-over");
            this.target = _id;
            document.getElementById(this.target)?.classList?.add?.("drag-over");
            this.index = index;
        }
    }
    handleDrop = (_id) => {
        document.getElementById(this.target)?.classList?.remove?.("drag-over");
        if (this.dataTransfer !== this.target) {
            this.handleUpdateIndex();
        }
    }
    handleUpdateIndex = () => {
        const { dispatch } = this.props;
        dispatch({
            type: types.ADMIN_UPDATE_CATEGORY,
            payload: { _id: this.dataTransfer, index: this.index },
            callback: this.gotoPage
        })
    }
    render() {
        const { active, categories } = this.props;
        const { onAdd, onEdit, selecteds, name, currentIndex } = this.state;
        if (!active) return null;
        return (
            <section className="content">
                <CautionAdmin />
                <div className="box">
                    <div className="box-header with-border">
                        <h3 className="box-title">{translate(langConfig.resources.categoryList)}</h3>
                        <div className="box-tools pull-right">
                            <a onClick={this.handleOpenForm} className="ajax-modal-btn btn btn-new btn-flat" style={{ cursor: 'pointer' }}>
                                {translate(langConcat(langConfig.app.Add, langConfig.resources.category))}
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
                                        <th className="sorting_disabled" rowSpan={1} colSpan={1} style={{ width: '10%' }}>{translate(langConfig.app.Index)}</th>
                                        <th className="sorting_disabled" rowSpan={1} colSpan={1} style={{ width: '25%' }}>{translate(langConfig.resources.categoryName)} (VN)</th>
                                        <th className="sorting_disabled" rowSpan={1} colSpan={1} style={{ width: '25%' }}>{translate(langConfig.resources.categoryName)} (EN)</th>
                                        <th className="sorting_disabled" rowSpan={1} colSpan={1} style={{ width: '15%' }}>{translate(langConfig.app.Status)}</th>
                                        <th className="sorting_disabled" rowSpan={1} colSpan={1} style={{ width: '15%' }} >
                                            {translate(langConfig.app.Actions)}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody id="massSelectArea">
                                    {categories.map((category, index) => {
                                        const checked = (selecteds.indexOf(category._id) + 1) ? "checked" : "";
                                        return (
                                            <tr
                                                id={category._id}
                                                key={category._id}
                                                className={index % 2 ? "odd" : "even"}
                                                role="row"
                                                draggable={true}
                                                onDragStart={e => this.handleDrag(category._id)}
                                                onDragOver={e => this.handleDragOver(e, category._id, index)}
                                                onDrop={e => this.handleDrop(category._id)}
                                                className="allow-drag"
                                            >
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
                                                <td title={category.names?.vn || category.name}>
                                                    {category.names?.vn || category.name}
                                                </td>
                                                <td title={category.names?.en || ""}>
                                                    {category.names?.en || ""}
                                                    <a href="#" type="button" className="toggle-widget toggle-confirm pull-right" onClick={e => { e.preventDefault(); this.handleDisable(category) }}>
                                                        <i className={"fa fa-heart" + (category.enabled ? "-o" : "")} title={translate(category.enabled ? langConfig.app.EnableCategory : langConfig.app.DisableCategory)} />
                                                    </a>
                                                </td>
                                                <td>{translate(category.enabled ? langConfig.app.Active : langConfig.app.Inactive)}</td>
                                                <td className="row-options">
                                                    <a onClick={() => this.setState({ onEdit: category, currentIndex: index })} className="ajax-modal-btn" style={{ cursor: 'pointer' }}>
                                                        <i title={translate(langConfig.app.Edit)} className="fa fa-edit" />
                                                    </a>&nbsp;&nbsp;
                                                    <a onClick={() => this.handleDelete(category)} className="ajax-modal-btn" style={{ cursor: 'pointer' }}>
                                                        <i className="fa fa-trash-o" title={translate(langConfig.app.Delete)} />
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
                <AddCategory onAdd={onAdd} handleClose={this.handleOpenForm} onAdded={this.gotoPage} total={categories.length} />
                <UpdateCategory onEdit={onEdit} handleClose={() => this.setState({ onEdit: null })} onRefresh={this.gotoPage} index={currentIndex + 1} total={categories.length} />
            </section >
        )
    }
}

export default connect(({ admin: { categories, exUser } }) => ({ categories, exUser }))(Category)
