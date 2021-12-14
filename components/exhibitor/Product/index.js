import React, { Component } from 'react'
import { connect } from 'react-redux';
import langConfig, { langConcat } from '../../../lang.config';
import types from '../../../redux/types';
import { createFormData } from '../../../utils/helper';
import Pagination from '../../pagination/PaginationAdmin';
import { translate } from '../../../utils/language';
import AddProduct from './AddProduct';
import UpdateProduct from './UpdateProduct';
import CautionAdmin from '../../Layout/Admin/CautionAdmin';

const pageSize = 10;

class Product extends Component {
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
    gotoPage = (page = 0) => {
        const { dispatch, exUser } = this.props;
        const { name } = this.state;
        dispatch({
            type: types.ADMIN_GET_PRODUCTS,
            payload: { page, pageSize, name, exhibitorId: exUser?._id },
            callback: res => {
                this.setState({ selecteds: [] })
            }
        });
    }
    handleDisable = (product) => {
        const { dispatch } = this.props;
        dispatch({
            type: types.SET_TOOLTIP,
            payload: {
                title: translate(product.enabled ? langConfig.app.ConfirmDisableProduct : langConfig.app.ConfirmEnableProduct),
                message: translate(product.enabled ? langConfig.app.AreYouSureDisableProduct : langConfig.app.AreYouSureEnableProduct),
                confirm: translate(product.enabled ? langConfig.app.DisableProduct : langConfig.app.EnableProduct),
                cancel: translate(langConfig.app.Cancel),
                handleConfirm: () => this.handleConfirm(product),
            }
        })
    }
    handleDelete = (product) => {
        const { dispatch } = this.props;
        dispatch({
            type: types.SET_TOOLTIP,
            payload: {
                title: translate(langConfig.app.ConfirmDeleteProduct),
                message: translate(langConfig.app.AreYouSureDeleteProduct),
                confirm: translate(langConfig.app.DeleteProduct),
                cancel: translate(langConfig.app.Cancel),
                handleConfirm: () => {
                    dispatch({
                        type: types.ADMIN_DELETE_PRODUCT,
                        payload: product._id,
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
                title: translate(langConfig.app.ConfirmDeleteMultiProduct),
                message: `${translate(langConfig.app.AreYouSureDelete)} ${selecteds.length} ${translate(langConfig.app.Product)}?`,
                confirm: translate(langConfig.app.DeleteProduct),
                cancel: translate(langConfig.app.Cancel),
                handleConfirm: () => {
                    dispatch({
                        type: types.ADMIN_DELETE_MULTI_PRODUCT,
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
    handleConfirm = (product) => {
        const { dispatch } = this.props;
        const formData = createFormData({ enabled: !product.enabled });
        dispatch({
            type: types.ADMIN_UPDATE_PRODUCT,
            payload: { _id: product._id, formData }
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
        const { products } = this.props;
        if (selecteds.length < products?.length) {
            this.setState({ selecteds: products?.map(e => e._id) });
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
        const { active, products, page, total, categories } = this.props;
        const { onAdd, onEdit, selecteds, name } = this.state;
        if (!active) return null;
        return (
            <section className="content">
                <CautionAdmin />
                <div className="box">
                    <div className="box-header with-border">
                        <h3 className="box-title">{translate(langConfig.app.Product)}</h3>
                        <div className="box-tools pull-right">
                            <a onClick={this.handleOpenForm} className="ajax-modal-btn btn btn-new btn-flat" style={{ cursor: 'pointer' }}>
                                {translate(langConcat(langConfig.app.Add, langConfig.app.Product))}
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
                                                    <i className={selecteds.length ? "fa fa-check-square-o" : "fa fa-square-o"} title="Select all" />
                                                </button>
                                            </div>
                                        </th>
                                        <th className="sorting_disabled" rowSpan={1} colSpan={1} style={{ width: '20%', minWidth: 100 }}>{translate(langConfig.resources.productImage)}</th>
                                        <th className="sorting_disabled" rowSpan={1} colSpan={1} style={{ width: '30%' }}>{translate(langConfig.resources.productName)}</th>
                                        <th className="sorting_disabled" rowSpan={1} colSpan={1} style={{ width: '20%' }}>{translate(langConfig.resources.category)}</th>
                                        <th className="sorting_disabled" rowSpan={1} colSpan={1} style={{ width: '10%' }}>{translate(langConfig.app.Status)}</th>
                                        <th className="sorting_disabled" rowSpan={1} colSpan={1} style={{ textAlign: 'center !important', }}>
                                            {translate(langConfig.app.Actions)}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody id="massSelectArea">
                                    {products?.map((product, index) => {
                                        const checked = (selecteds.indexOf(product._id) + 1) ? "checked" : "";
                                        const category = categories.find(c => c._id === product.category) || {};
                                        return (
                                            <tr key={product._id} className={index % 2 ? "odd" : "even"} role="row">
                                                <td>
                                                    <div className={checked ? "icheckbox_minimal-blue checked" : "icheckbox_minimal-blue"} aria-checked="false" aria-disabled="false" style={{ position: 'relative' }}>
                                                        <ins
                                                            className="iCheck-helper"
                                                            style={{ position: 'absolute', top: '0%', left: '0%', display: 'block', width: '100%', height: '100%', margin: 0, padding: 0, background: 'rgb(255, 255, 255)', border: 0, opacity: 0 }}
                                                            onClick={() => this.handleSelect(product._id)}
                                                        />
                                                    </div>
                                                </td>
                                                <td>
                                                    {product.image ?
                                                        <img src={"/api/images/" + product.image} style={{ width: 'auto', maxWidth: 100, height: 'auto', maxHeight: 100 }} alt="Ảnh sản phẩm" />
                                                        :
                                                        <img src="/images/no-avatar.png" style={{ width: 'auto', maxWidth: 100, height: 'auto', maxHeight: 100 }} alt="Ảnh sản phẩm" />
                                                    }
                                                </td>
                                                <td title={product.name}>
                                                    {product.name?.split(0, 15)}
                                                    <a href="#" type="button" className="toggle-widget toggle-confirm pull-right" onClick={e => { e.preventDefault(); this.handleDisable(product) }}>
                                                        <i className={"fa fa-heart" + (product.enabled ? "-o" : "")} title={translate(product.enabled ? langConfig.app.EnableProduct : langConfig.app.DisableProduct)} />
                                                    </a>
                                                </td>
                                                <td>{category.name}</td>
                                                <td>{translate(product.enabled ? langConfig.app.Active : langConfig.app.Inactive)}</td>
                                                <td className="row-options">
                                                    <a onClick={() => this.setState({ onEdit: product })} className="ajax-modal-btn" style={{ cursor: 'pointer' }}>
                                                        <i title={translate(langConfig.app.Edit)} className="fa fa-edit" />
                                                    </a>&nbsp;&nbsp;
                                                    <a onClick={() => this.handleDelete(product)} className="ajax-modal-btn" style={{ cursor: 'pointer' }}>
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
                <AddProduct onAdd={onAdd} handleClose={this.handleOpenForm} onAdded={this.gotoPage} />
                <UpdateProduct onEdit={onEdit} handleClose={() => this.setState({ onEdit: null })} />
            </section >
        )
    }
}

export default connect(({ admin: { product: { data: products, page, total }, categories, user, exUser } }) => ({ products, page, total, categories, user, exUser }))(Product)
