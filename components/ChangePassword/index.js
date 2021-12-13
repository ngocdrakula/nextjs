import React, { Component } from 'react'
import { connect } from 'react-redux';
import langConfig from '../../lang.config';
import types from '../../redux/types';
import { createFormData } from '../../utils/helper';
import { translate } from '../../utils/language';
import CautionAdmin from '../Layout/Admin/CautionAdmin';

class ChangePassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            password: '',
            newpassword: '',
            repassword: '',
            fieldError: null,
            message: '',
        }
    }
    handleChange = e => this.setState({ [e.target.name]: e.target.value, fieldError: null })
    handleSubmit = e => {
        e.preventDefault();
        const { dispatch, exUser, user } = this.props;
        const { password, newpassword, repassword } = this.state;
        if (!password) { this.setState({ fieldError: 'password', message: translate(langConfig.app.PleaseEnterOldPassword) }) }
        else if (!newpassword) { this.setState({ fieldError: 'newpassword', message: translate(langConfig.app.PleaseEnterNewPassword) }) }
        else if (newpassword.length < 8) { this.setState({ fieldError: 'newpassword', message: translate(langConfig.app.NewPasswordMustBeOnMoreThan8Character) }) }
        else if (!repassword) { this.setState({ fieldError: 'repassword', message: translate(langConfig.app.PleaseEnterConfirmPassword) }) }
        else if (newpassword !== repassword) { this.setState({ fieldError: 'repassword', message: translate(langConfig.app.WrongConfirmationPassword) }) }
        else if (newpassword === password) { this.setState({ fieldError: 'repassword', message: translate(langConfig.app.NewPasswordMustBeDifferentFromOldPassword) }) }
        else {
            const data = { password, newpassword };
            const formData = createFormData(data);
            dispatch({
                type: types.ADMIN_UPDATE_USER,
                payload: { _id: exUser?._id || user._id, formData },
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
                                handleConfirm: this.handleCancel,
                                handleCancel: this.handleCancel
                            },
                        });
                        this.setState({
                            password: '',
                            newpassword: '',
                            repassword: '',
                        })
                    }
                    else {
                        this.setState({
                            fieldError: res?.data?.field || 'passsword',
                            message: translate(res?.data?.messages || langConfig.message.error.infomation)
                        })
                    }
                }
            });
        }
    }

    render() {
        const { active } = this.props;
        const { fieldError, message, password, newpassword, repassword } = this.state;
        if (!active) return null;
        return (
            <section className="content">
                <CautionAdmin />
                <div className="row" style={{ padding: '0 20px 20px 20px' }}>
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header p-2">
                                <ul className="nav nav-pills">
                                </ul>
                            </div>
                            <div className="card-body">
                                <div className="tab-content">
                                    <div className="active tab-pane" id="InfoCompany">
                                        <form className="form-horizontal" method="post" action="/" onSubmit={this.handleSubmit}>
                                            <div className="form-group row">
                                                <label htmlFor="ex-up-password" className="col-sm-3 col-form-label">{translate(langConfig.app.OldPassword)}:</label>
                                                <div className="col-sm-9">
                                                    <input
                                                        type="password"
                                                        className="form-control"
                                                        id="ex-up-password"
                                                        placeholder={translate(langConfig.app.EnterOldPassword)}
                                                        onChange={this.handleChange}
                                                        name="password"
                                                        value={password}
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label htmlFor="ex-up-newpassword" className="col-sm-3 col-form-label">{translate(langConfig.app.NewPassword)}:</label>
                                                <div className="col-sm-9">
                                                    <input
                                                        type="password"
                                                        className="form-control"
                                                        id="ex-up-newpassword"
                                                        placeholder={translate(langConfig.app.EnterNewPassword)}
                                                        onChange={this.handleChange}
                                                        name="newpassword"
                                                        value={newpassword}
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label htmlFor="ex-up-repassword" className="col-sm-3 col-form-label">{translate(langConfig.app.ConfirmPassword)}:</label>
                                                <div className="col-sm-9">
                                                    <input
                                                        type="password"
                                                        className="form-control"
                                                        id="ex-up-repassword"
                                                        placeholder={translate(langConfig.app.EnterConfirmPassword)}
                                                        onChange={this.handleChange}
                                                        name="repassword"
                                                        value={repassword}
                                                    />
                                                </div>
                                            </div>
                                            {fieldError ?
                                                <div className="form-group row">
                                                    <div className="offset-sm-3 col-sm-9">
                                                        <div style={{ color: 'red', padding: '10px 0px' }}>{message}</div>
                                                    </div>
                                                </div> : ""}
                                            <div className="row">
                                                <div className="offset-sm-3 col-sm-9" style={{ display: 'flex' }}>
                                                    <div className="col d-flex">
                                                        <div className="form-group" id="btnSubmitData" style={{ marginRight: 10 }}>
                                                            <button type="submit" className="btn btn-primary">{translate(langConfig.app.Save)}</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        )
    }
}

export default connect(({ admin: { exUser, user } }) => ({ exUser, user }))(ChangePassword)
