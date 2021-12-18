import React, { Component } from 'react'
import { connect } from 'react-redux';
import langConfig, { langConcat } from '../../../lang.config';
import types from '../../../redux/types';
import { translate } from '../../../utils/language';


class Category extends Component {
    constructor(props) {
        super(props);
        this.defaultState = {
            nameVN: '',
            nameEN: '',
            index: 1,
            enabled: true,
            fieldError: null,
            message: ''
        }
        this.state = { ...this.defaultState };
    }
    componentDidUpdate(prevProps) {
        if (!prevProps.onAdd && this.props.onAdd) {
            this.setState({ ...this.defaultState, index: 1 })
        }
    }
    handleChange = e => this.setState({ [e.target.name]: e.target.value, fieldError: false })
    handleSubmit = e => {
        const { dispatch, onAdded, exUser } = this.props;
        e.preventDefault();
        const { nameVN, nameEN, enabled, index } = this.state;
        const data = { nameVN, nameEN, enabled, exhibitor: exUser?._id, index: Number(index) - 1 || 0 }
        const dataRequied = { nameVN, nameEN };
        const fieldError = Object.keys(dataRequied).find(field => !dataRequied[field]);

        if (fieldError) {
            this.setState({ fieldError, message: translate(langConfig.message.error.infomation) })
        }
        else {
            dispatch({
                type: types.ADMIN_ADD_CATEGORY,
                payload: data,
                callback: res => {
                    if (res?.success) {
                        dispatch({
                            type: types.SET_TOOLTIP,
                            payload: {
                                type: 'success',
                                title: translate(langConfig.message.success.created),
                                message: translate(langConfig.app.AddAnotherCategory),
                                confirm: translate(langConfig.app.Add),
                                cancel: translate(langConfig.app.Close),
                                handleConfirm: () => { this.setState({ ...this.defaultState });; onAdded(); },
                                handleCancel: () => { onAdded(); this.props.handleClose(); }
                            },
                        });
                    }
                    else if (res?.data) {
                        this.setState({
                            fieldError: res.data.field,
                            message: translate(res.data.messages || langConfig.message.error.infomation)
                        })
                    }
                }
            });
        }
    }
    handleDropdown = () => this.setState({ dropActive: !this.state.dropActive })
    handleSelectEnable = () => this.setState({ enabled: true, dropActive: false })
    handleSelectDisable = () => this.setState({ enabled: false, dropActive: false })


    render() {
        const { onAdd, handleClose, total } = this.props;
        const { dropActive, nameVN, nameEN, enabled, fieldError, message, index } = this.state;
        return (
            <div id="add-vis-myDynamicModal" className={"modal-create modal fade" + (onAdd ? " in" : "")} style={{ display: onAdd ? 'block' : 'none' }}>
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <form method="POST" action="/" id="add-vis-form" onSubmit={this.handleSubmit} >
                            <div className="modal-header">
                                <button type="button" className="close" onClick={handleClose}>×</button>
                                {translate(langConfig.app.AddCategory)}
                            </div>
                            <div className="modal-body">
                                <div className="row">
                                    <div className="col-md-6 nopadding-right">
                                        <div className={"form-group" + (fieldError === 'nameVN' ? " has-error" : "")}>
                                            <label htmlFor="add-vis-nameVN">{translate(langConfig.resources.categoryName)}*</label>
                                            <input
                                                className="form-control"
                                                placeholder={translate(langConcat(langConfig.app.Enter, langConfig.resources.categoryName))}
                                                required
                                                value={nameVN}
                                                id="add-vis-nameVN"
                                                name="nameVN"
                                                type="text"
                                                onChange={this.handleChange}
                                            />
                                            <div className="help-block with-errors">
                                                {fieldError === 'nameVN' && message ?
                                                    <ul className="list-unstyled">
                                                        <li>{message}.</li>
                                                    </ul>
                                                    : ""}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6 nopadding-left">
                                        <div className={"form-group" + (fieldError === 'nameEN' ? " has-error" : "")}>
                                            <label htmlFor="add-vis-nameEN">{translate(langConfig.resources.categoryName)}*</label>
                                            <input
                                                className="form-control"
                                                placeholder={translate(langConcat(langConfig.app.Enter, langConfig.resources.categoryName))}
                                                required
                                                value={nameEN}
                                                id="add-vis-nameEN"
                                                name="nameEN"
                                                type="text"
                                                onChange={this.handleChange}
                                            />
                                            <div className="help-block with-errors">
                                                {fieldError === 'nameEN' && message ?
                                                    <ul className="list-unstyled">
                                                        <li>{message}.</li>
                                                    </ul>
                                                    : ""}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6 nopadding-right">
                                        <div className={"form-group" + (fieldError === 'enabled' ? " has-error" : "")}>
                                            <label htmlFor="active">{translate(langConfig.app.Status)}*</label>
                                            <span className={"select2 select2-container select2-container--default" + (dropActive ? " select2-container--open" : "")} style={{ width: '100%' }}>
                                                <span className="selection" onClick={this.handleDropdown}>
                                                    <span className="select2-selection select2-selection--single"  >
                                                        <span className="select2-selection__rendered" id="add-vis-select2-active-container" title={translate(enabled ? langConfig.app.Active : langConfig.app.Inactive)}>
                                                            {translate(enabled ? langConfig.app.Active : langConfig.app.Inactive)}
                                                        </span>
                                                        <span className="select2-selection__arrow" role="presentation">
                                                            <b role="presentation" />
                                                        </span>
                                                    </span>
                                                </span>
                                                <div className={"dropdown-select" + (dropActive ? " active" : "")}>
                                                    <div
                                                        className={"select-option-active" + (enabled ? " active" : "")}
                                                        onClick={this.handleSelectEnable}
                                                    >{translate(langConfig.app.Active)}</div>
                                                    <div
                                                        className={"select-option-active" + (!enabled ? " active" : "")}
                                                        onClick={this.handleSelectDisable}
                                                    >{translate(langConfig.app.Inactive)}</div>
                                                </div>
                                            </span>
                                            <div className="help-block with-errors" >
                                                {fieldError === 'enabled' && message ?
                                                    <ul className="list-unstyled">
                                                        <li>{message}.</li>
                                                    </ul>
                                                    : ""}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6 nopadding-left">
                                        <div className={"form-group" + (fieldError === 'index' ? " has-error" : "")}>
                                            <label htmlFor="add-vis-index">{translate(langConfig.app.Index)}*</label>
                                            <input
                                                className="form-control"
                                                placeholder={translate(langConcat(langConfig.app.Enter, langConfig.app.Index))}
                                                required
                                                value={index}
                                                id="add-vis-index"
                                                name="index"
                                                type="number"
                                                min={1}
                                                max={(total || 0) + 1}
                                                onChange={this.handleChange}
                                            />
                                            <div className="help-block with-errors">
                                                {fieldError === 'index' && message ?
                                                    <ul className="list-unstyled">
                                                        <li>{message}.</li>
                                                    </ul>
                                                    : ""}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div><div className="modal-footer">
                                <input className="btn btn-flat btn-new" type="submit" value={translate(langConfig.app.Add)} />
                            </div>
                        </form>
                    </div>
                </div>
            </div >
        )
    }
}

export default connect(({ admin: { industries, exUser } }) => ({ industries, exUser }))(Category)
