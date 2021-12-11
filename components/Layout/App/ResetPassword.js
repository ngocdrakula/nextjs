import React, { Component } from 'react'
import { Modal } from 'react-bootstrap';
import { connect } from 'react-redux'
import Link from 'next/link';
import types from '../../../redux/types';
import { MODE } from '../../../utils/helper';
import Logo from '../Logo';
import { translate } from '../../../utils/language';
import langConfig, { langConcat } from '../../../lang.config';


class LoginVisitor extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    handleChange = e => this.setState({ [e.target.name]: e.target.value, message: '' });
    handleSendCode = e => {
        const { email } = this.state;
        if (!email) this.setState({
            field: 'email', message: translate(langConcat(langConfig.app.Email, langConfig.message.error.validation.required))
        });
        else {
            const { dispatch } = this.props;
            dispatch({
                type: types.RESET_PASSWORD,
                payload: { email },
                callback: res => {
                    if (res?.success) {
                        this.setState({
                            sendcode: true, successMessage: translate(res.messages)
                        });
                    }
                    else {
                        this.setState({
                            field: res?.field, message: translate(langConcat(res?.messages || langConfig.app.AccountNotExistOrLocked))
                        });
                    }
                }
            });
        }
    }
    handleSubmit = e => {
        const { email, password, repassword, code } = this.state;
        if (!code) this.setState({ field: 'code', successMessage: '', message: translate(langConcat(langConfig.app.SecurityCode, langConfig.message.error.validation.required)) });
        else if (!password) this.setState({ field: 'password', successMessage: '', message: translate(langConcat(langConfig.app.Password, langConfig.message.error.validation.required)) });
        else if (password.length < 8) this.setState({ field: 'password', successMessage: '', message: translate(langConfig.app.PasswordMustBeOnMoreThan8Character) });
        else if (password !== repassword) this.setState({ field: 'password', successMessage: '', message: translate(langConcat(langConfig.app.ConfirmPassword, langConfig.message.error.validation.incorrect)) });
        else {
            const { dispatch } = this.props;
            dispatch({
                type: types.RESET_PASSWORD,
                payload: { email, password, code },
                callback: res => {
                    if (!res?.success) {
                        this.setState({
                            field: res?.field, successMessage: '', message: translate(res?.messages || translate(langConcat(langConfig.app.SecurityCode, langConfig.message.error.validation.incorrect)))
                        });
                    }
                }
            })
        }
    }
    handleClose = (e) => {
        const { dispatch } = this.props;
        dispatch({ type: types.OPENFORM, payload: null });
    }
    handleSwitchLogin = (e) => {
        e.preventDefault();
        const { dispatch } = this.props;
        dispatch({ type: types.OPENFORM, payload: MODE.visitor });
    }
    render() {
        const { message, successMessage, sendcode, email, password, repassword, code } = this.state;
        const { openForm } = this.props;
        return (
            <Modal bsPrefix={"user-page modal"} show={openForm === 'reset'} id="exhibitorModal" className="login-modal register-vis" centered contentClassName="" onHide={this.handleClose}>
                <Link href="/">
                    <a><Logo /></a>
                </Link>
                <label className="tk">
                    <span>{translate(langConfig.app.Email)}</span>
                    <input value={email || ''} onChange={this.handleChange} type="text" name="email" placeholder={translate(langConfig.app.EnterYourEmail)} readOnly={sendcode} />
                </label>
                {sendcode ?
                    <>
                        <label className="tk">
                            <span>{translate(langConfig.app.SecurityCode)}</span>
                            <input value={code || ''} onChange={this.handleChange} type="code" name="code" placeholder={translate(langConfig.app.EnterSecurityCode)} />
                        </label>
                        <label className="mk">
                            <span>{translate(langConfig.app.Password)}</span>
                            <input value={password || ''} onChange={this.handleChange} type="password" name="password" placeholder={translate(langConfig.app.AtLeast8Characters)} />
                        </label>
                        <label className="mk">
                            <span>{translate(langConfig.app.ConfirmPassword)}</span>
                            <input value={repassword || ''} onChange={this.handleChange} type="password" name="repassword" placeholder={translate(langConfig.app.AtLeast8Characters)} />
                        </label>
                    </>
                    : ""}
                {sendcode && successMessage ? <div className="success-form">{successMessage}</div> : ""}
                {message ? <div className="error-form">{message}</div> : ""}
                <button type="submit" className="log-submit" onClick={sendcode ? this.handleSubmit : this.handleSendCode}>
                    {translate(sendcode ? langConfig.app.ChangePassword : langConfig.app.GetSecurityCode)}
                </button>
                <div className="suport-login">
                    <label className="fogot-mk">
                        <a href="#" className="txt-red" onClick={this.handleSendCode}>{translate(langConfig.app.ResendSecurityCode)}</a>
                    </label>
                    <label>
                        <a href="#" onClick={this.handleSwitchLogin} className="txt-red">{translate(langConfig.app.BackToLoginPage)}</a>
                    </label>
                </div>
            </Modal>
        )
    }
}


export default connect(({ app: { openForm } }) => ({ openForm }))(LoginVisitor)
