import React, { Component } from 'react'
import { connect } from 'react-redux';
import langConfig from '../../lang.config';
import types from '../../redux/types';
import { MODE } from '../../utils/helper';
import { translate } from '../../utils/language';


class AddTrade extends Component {
    constructor(props) {
        super(props);
        this.defaultState = {
            content: '',
            deadline: '',
            enabled: true,
            fieldError: null,
            message: ''
        }
        this.state = { ...this.defaultState };
    }
    componentDidUpdate(prevProps) {
        if (!prevProps.onAdd && this.props.onAdd) {
            this.setState({ ...this.defaultState })
        }
    }
    handleChange = e => this.setState({ [e.target.name]: e.target.value, fieldError: false })
    handleSubmit = e => {
        e.preventDefault();
        const { content, deadline, enabled, approved } = this.state;
        const data = { content, deadline, enabled, approved }
        const dataRequied = { content, deadline }
        const fieldError = Object.keys(dataRequied).find(field => !dataRequied[field]);

        if (fieldError) {
            this.setState({ fieldError, message: translate(langConfig.message.error.infomation) })
        }
        else {
            const { dispatch, onAdded } = this.props;
            dispatch({
                type: types.ADMIN_ADD_TRADE,
                payload: data,
                callback: res => {
                    if (res?.success) {
                        dispatch({
                            type: types.SET_TOOLTIP,
                            payload: {
                                type: 'success',
                                title: translate(langConfig.message.success.created),
                                message: translate(langConfig.app.AddAnotherTrade),
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

    handleDropdownApproved = () => this.setState({ dropApproved: !this.state.dropApproved })
    handleSelectApproved = () => this.setState({ approved: true, dropApproved: false })
    handleSelectNotApproved = () => this.setState({ approved: false, dropApproved: false })

    render() {
        const { onAdd, handleClose, user, exUser } = this.props;
        const { dropActive, dropApproved, content, deadline, approved, enabled, fieldError, message } = this.state;
        return (
            <div id="add-trade-myDynamicModal" className={"modal-create modal fade" + (onAdd ? " in" : "")} style={{ display: onAdd ? 'block' : 'none' }}>
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <form method="POST" action="/" id="add-trade-form" onSubmit={this.handleSubmit} >
                            <div className="modal-header">
                                <button type="button" className="close" onClick={handleClose}>??</button>
                                Th??m l???ch giao th????ng
                            </div>
                            <div className="modal-body">
                                <div className="row">
                                    <div className="col-md-6 nopadding-right">
                                        <div className={"form-group" + (fieldError === 'content' ? " has-error" : "")}>
                                            <label htmlFor="add-trade-content">T??n l???ch giao th????ng*</label>
                                            <input className="form-control" placeholder="Nh???p t??n l???ch giao th????ng" required value={name} id="add-trade-name" name="name" type="text" onChange={this.handleChange} />
                                            <div className="help-block with-errors">
                                                {fieldError === 'content' && message ?
                                                    <ul className="list-unstyled">
                                                        <li>{message}.</li>
                                                    </ul>
                                                    : ""}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6 nopadding-right">
                                        <div className={"form-group" + (fieldError === 'content' ? " has-error" : "")}>
                                            <label htmlFor="add-trade-content">T??n l???ch giao th????ng*</label>
                                            <input className="form-control" placeholder="Nh???p t??n l???ch giao th????ng" required value={name} id="add-trade-name" name="name" type="text" onChange={this.handleChange} />
                                            <div className="help-block with-errors">
                                                {fieldError === 'content' && message ?
                                                    <ul className="list-unstyled">
                                                        <li>{message}.</li>
                                                    </ul>
                                                    : ""}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-4 nopadding-left">
                                        <div className={"form-group" + (fieldError === 'enabled' ? " has-error" : "")}>
                                            <label htmlFor="add-trade-active">Tr???ng th??i*</label>
                                            <span className={"select2 select2-container select2-container--default" + (dropActive ? " select2-container--open" : "")} style={{ width: '100%' }}>
                                                <span className="selection" onClick={this.handleDropdown}>
                                                    <span className="select2-selection select2-selection--single"  >
                                                        <span className="select2-selection__rendered" id="add-trade-select2-active-container" title={enabled ? "Ho???t ?????ng" : "Kh??ng ho???t ?????ng"}>{enabled ? "Ho???t ?????ng" : "Kh??ng ho???t ?????ng"}</span>
                                                        <span className="select2-selection__arrow" role="presentation">
                                                            <b role="presentation" />
                                                        </span>
                                                    </span>
                                                </span>
                                                <div className={"dropdown-select" + (dropActive ? " active" : "")}>
                                                    <div
                                                        className={"select-option-active" + (enabled ? " active" : "")}
                                                        onClick={this.handleSelectEnable}
                                                    >Ho???t ?????ng</div>
                                                    <div
                                                        className={"select-option-active" + (!enabled ? " active" : "")}
                                                        onClick={this.handleSelectDisable}
                                                    >Kh??ng ho???t ?????ng</div>
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
                                    {user.mode === MODE.admin && !exUser ?
                                        <div className="col-md-4 nopadding-right">
                                            <div className={"form-group" + (fieldError === 'approved' ? " has-error" : "")}>
                                                <label htmlFor="add-trade-active">Tr???ng th??i duy???t*</label>
                                                <span className={"select2 select2-container select2-container--default" + (dropApproved ? " select2-container--open" : "")} style={{ width: '100%' }}>
                                                    <span className="selection" onClick={this.handleDropdownApproved}>
                                                        <span className="select2-selection select2-selection--single"  >
                                                            <span className="select2-selection__rendered" id="add-trade-select2-active-container" title={approved ? "???? duy???t" : "Ch??a duy???t"}>{approved ? "???? duy???t" : "Ch??a duy???t"}</span>
                                                            <span className="select2-selection__arrow" role="presentation">
                                                                <b role="presentation" />
                                                            </span>
                                                        </span>
                                                    </span>
                                                    <div className={"dropdown-select" + (dropApproved ? " active" : "")}>
                                                        <div
                                                            className={"select-option-active" + (approved ? " active" : "")}
                                                            onClick={this.handleSelectApproved}
                                                        >???? duy???t</div>
                                                        <div
                                                            className={"select-option-active" + (!approved ? " active" : "")}
                                                            onClick={this.handleSelectNotApproved}
                                                        >Ch??a duy???t</div>
                                                    </div>
                                                </span>
                                                <div className="help-block with-errors" >
                                                    {fieldError === 'approved' && message ?
                                                        <ul className="list-unstyled">
                                                            <li>{message}.</li>
                                                        </ul>
                                                        : ""}
                                                </div>
                                            </div>
                                        </div>
                                        : ""}
                                </div>
                            </div>
                            <div className="modal-footer">
                                <input className="btn btn-flat btn-new" type="submit" value="Th??m" />
                            </div>
                        </form>
                    </div>
                </div>
            </div >
        )
    }
}

export default connect(({ admin: { user, exUser } }) => ({ user, exUser }))(AddTrade)
