import React, { Component } from 'react';
import { connect } from 'react-redux'
import langConfig, { langConcat } from '../../lang.config';
import types from '../../redux/types'
import { createFormData, MODE } from '../../utils/helper';
import { translate } from '../../utils/language';


class ProfileInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            password: '',
            newpassword: '',
            repassword: '',
            fieldError: null,
            message: '',
        };
    }
    handleChange = e => this.setState({ [e.target.name]: e.target.value, fieldError: null })
    handleSubmit = e => {
        e.preventDefault();
        const { dispatch, user } = this.props;
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
            this.setState({ loading: true })
            dispatch({
                type: types.UPDATE_USER,
                payload: { _id: user._id, formData },
                callback: res => {
                    if (res?.success) {
                        this.setState({
                            password: '',
                            newpassword: '',
                            repassword: '',
                            success: true,
                            loading: false
                        });
                        this.timeout = setTimeout(() => {
                            this.setState({ success: false })
                        }, 5000);
                    }
                    else {
                        this.setState({
                            fieldError: res?.data?.field || 'passsword',
                            message: translate(res?.data?.messages || langConfig.message.error.infomation),
                            loading: false
                        })
                    }
                }
            });
        }
    }
    render() {
        const { active } = this.props;
        const { fieldError, message, password, newpassword, repassword, success, loading } = this.state;
        return (
            <div className="profile-content" style={{ display: active ? 'block' : 'none' }}>
                <form className="profile-update form-horizontal" onSubmit={this.handleSubmit}>
                    <div className="form-group row">
                        <label className="col-sm-3 col-form-label" htmlFor="representative">{translate(langConfig.app.OldPassword)}: </label>
                        <div className="col-sm-9">
                            <input
                                type="password"
                                className="form-control"
                                id="password"
                                placeholder={translate(langConfig.app.EnterOldPassword)}
                                onChange={this.handleChange}
                                name="password"
                                value={password}
                            />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-3 col-form-label" htmlFor="newpassword">{translate(langConfig.app.NewPassword)}: </label>
                        <div className="col-sm-9">
                            <input
                                type="password"
                                className="form-control"
                                id="newpassword"
                                placeholder={translate(langConfig.app.EnterNewPassword)}
                                onChange={this.handleChange}
                                name="newpassword"
                                value={newpassword}
                            />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-3 col-form-label" htmlFor="repassword">{translate(langConfig.app.ConfirmPassword)}: </label>
                        <div className="col-sm-9">
                            <input
                                type="password"
                                className="form-control"
                                id="repassword"
                                placeholder={translate(langConfig.app.EnterConfirmPassword)}
                                onChange={this.handleChange}
                                name="repassword"
                                value={repassword}
                            />
                        </div>
                    </div>
                    <div className="form-group row">
                        <div className="offset-sm-3 col-sm-9">
                            <div>
                                {fieldError ? <div className="fieldError">{message}</div>
                                    : success ?
                                        <div className="fieldError success-message" style={{ color: 'green' }}>{translate(langConfig.app.Updated)}</div>
                                        : ""
                                }
                                <button type="submit" className="btn btn-primary" disabled={loading}>{translate(langConfig.app.Accept)}</button>
                            </div>
                        </div>
                    </div>
                </form >
            </div >
        )
    }
}

export default connect(({ app: { user, industries } }) => ({ user, industries }))(ProfileInfo)

