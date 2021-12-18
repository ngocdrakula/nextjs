import React, { Component } from 'react'
import { connect } from 'react-redux';
import langConfig, { langConcat } from '../../../lang.config';
import types from '../../../redux/types';
import { translate } from '../../../utils/language';


class UpdateCategory extends Component {
    constructor(props) {
        super(props);
        this.defaultState = {
            nameVN: '',
            nameEN: '',
            index: 1,
            enabled: true,
        }
        this.state = { ...this.defaultState };
    }
    componentDidUpdate(prevProps) {
        if (!prevProps.onEdit && this.props.onEdit?._id) {
            this.setState({
                ...this.props.onEdit,
                nameVN: this.props.onEdit.names?.vn || this.props.onEdit.name,
                nameEN: this.props.onEdit.names?.en,
                index: this.props.index,
                fieldError: null,
                message: ''
            })
        }
    }
    handleChange = e => this.setState({ [e.target.name]: e.target.value, fieldError: false })
    handleSubmit = e => {
        e.preventDefault();
        const { _id, nameVN, nameEN, enabled, index } = this.state;
        const dataRequied = { nameVN, nameEN, index }
        const fieldError = Object.keys(dataRequied).find(field => !dataRequied[field]);

        if (fieldError) {
            this.setState({ fieldError, message: translate(langConfig.message.error.infomation) })
        }
        else {
            const { dispatch, handleClose, onRefresh } = this.props;
            const data = { _id, nameVN, nameEN, enabled };
            if (index !== this.props.index) data.index = Number(index) + (Math.sign(index - this.props.index) - 1) / 2;
            dispatch({
                type: types.ADMIN_UPDATE_CATEGORY,
                payload: data,
                callback: res => {
                    if (res?.success) {
                        dispatch({
                            type: types.SET_TOOLTIP,
                            payload: {
                                type: 'success',
                                title: translate(langConfig.message.success.updated),
                                message: translate(langConfig.app.Updated),
                                confirm: translate(langConfig.app.Accept),
                                cancel: translate(langConfig.app.Close),
                                handleConfirm: () => { if (index !== this.props.index) onRefresh(); handleClose(); },
                                handleCancel: () => { if (index !== this.props.index) onRefresh(); handleClose(); }
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
        const { onEdit, handleClose, total } = this.props;
        const { dropActive, nameVN, nameEN, enabled, fieldError, message, index } = this.state;
        return (
            <div id="vis-edit-myDynamicModal" className={"modal-create modal fade" + (onEdit ? " in" : "")} style={{ display: onEdit ? 'block' : 'none' }}>
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <form method="POST" action="/" id="vis-edit-form" onSubmit={this.handleSubmit} >
                            <div className="modal-header">
                                <button type="button" className="close" onClick={handleClose}>×</button>
                                {translate(langConcat(langConfig.app.Edit, langConfig.resources.category))}
                            </div>
                            <div className="modal-body">
                                <div className="row">
                                    <div className="col-md-6 nopadding-right">
                                        <div className={"form-group" + (fieldError === 'nameVN' ? " has-error" : "")}>
                                            <label htmlFor="vis-edit-nameVN">{translate(langConfig.resources.categoryName)} (VN)*</label>
                                            <input
                                                className="form-control"
                                                placeholder={translate(langConcat(langConfig.app.Enter, langConfig.resources.categoryName))}
                                                required
                                                value={nameVN}
                                                id="vis-edit-nameVN"
                                                name="nameVN"
                                                type="text"
                                                onChange={this.handleChange}
                                            />
                                            <div className="help-block with-errors">
                                                {fieldError === 'name' && message ?
                                                    <ul className="list-unstyled">
                                                        <li>{message}.</li>
                                                    </ul>
                                                    : ""}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6 nopadding-left">
                                        <div className={"form-group" + (fieldError === 'nameEN' ? " has-error" : "")}>
                                            <label htmlFor="vis-edit-nameEN">{translate(langConfig.resources.categoryName)} (EN)*</label>
                                            <input
                                                className="form-control"
                                                placeholder={translate(langConcat(langConfig.app.Enter, langConfig.resources.categoryName))}
                                                required
                                                value={nameEN}
                                                id="vis-edit-nameEN"
                                                name="nameEN"
                                                type="text"
                                                onChange={this.handleChange}
                                            />
                                            <div className="help-block with-errors">
                                                {fieldError === 'name' && message ?
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
                                            <label htmlFor="vis-edit-active">{translate(langConfig.app.Status)}*</label>
                                            <span className={"select2 select2-container select2-container--default" + (dropActive ? " select2-container--open" : "")} style={{ width: '100%' }}>
                                                <span className="selection" onClick={this.handleDropdown}>
                                                    <span className="select2-selection select2-selection--single"  >
                                                        <span className="select2-selection__rendered" id="vis-edit-select2-active-container" title={translate(enabled ? langConfig.app.Active : langConfig.app.Inactive)}>
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
                                            <label htmlFor="vis-edit-index">{translate(langConfig.app.Index)}*</label>
                                            <input
                                                className="form-control"
                                                placeholder={translate(langConcat(langConfig.app.Enter, langConfig.app.Index))}
                                                required
                                                value={index}
                                                id="vis-edit-index"
                                                name="index"
                                                type="number"
                                                min={1}
                                                max={(total || 1)}
                                                onChange={this.handleChange}
                                            />
                                            <div className="help-block with-errors">
                                                {fieldError === 'name' && message ?
                                                    <ul className="list-unstyled">
                                                        <li>{message}.</li>
                                                    </ul>
                                                    : ""}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <input className="btn btn-flat btn-new" type="submit" value={translate(langConfig.app.Save)} />
                            </div>
                        </form>
                    </div>
                </div>
            </div >
        )
    }
}

export default connect(({ }) => ({}))(UpdateCategory)
