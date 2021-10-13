import React, { Component } from 'react'
import { Modal } from 'react-bootstrap';
import { connect } from 'react-redux'
import types from '../redux/types';
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login';
import { MODE } from '../utils/helper';
import { translate } from '../utils/language';
import langConfig from '../lang.config';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const FACEBOOK_CLIENT_ID = process.env.FACEBOOK_CLIENT_ID;


class LoginVisitor extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    handleChange = e => this.setState({ [e.target.name]: e.target.value, message: '' });
    handleSubmit = e => {
        const { email, password } = this.state;
        const { dispatch } = this.props;
        this.setState({ loading: true });
        dispatch({
            type: types.USER_LOGIN,
            payload: { email, password, mode: MODE.visitor },
            callback: res => {
                if (!res?.success) {
                    this.setState({
                        field: res?.field, message: translate(res?.messages || langConfig.app.LoginFailed),
                        loading: false
                    });
                }
            }
        })
    }
    handleClose = (e) => {
        const { dispatch } = this.props;
        dispatch({ type: types.OPENFORM, payload: null });
    }
    handleSwitchRegister = (e) => {
        e.preventDefault();
        const { dispatch } = this.props;
        dispatch({ type: types.OPENFORM, payload: 'reg' });
    }
    handleLoginGoogle = res => {
        console.log(res)
        if (res?.accessToken) {
            this.setState({ loading: true });
            const { dispatch } = this.props;
            dispatch({
                type: types.USER_LOGIN_GOOGLE,
                payload: { accessToken: res.accessToken },
                callback: res => {
                    if (!res?.success) {
                        this.setState({
                            field: res?.field, message: translate(res?.messages || langConfig.app.LoginFailed),
                            loading: false
                        });
                    }
                }
            });
        }
        else if (res?.details === "Cookies are not enabled in current environment.") {
            this.notAcceptCookie = true;
        }
        else if (res?.error === 'popup_closed_by_user') {
            if (this.notAcceptCookie) {
                alert(translate(langConfig.app.PleaseAcceptCookie))
            }
            else {
                this.setState({
                    message: translate(langConfig.app.LoginFailed)
                });
            }
        }
        else {
            this.notAcceptCookie = false;
        }
    }

    handleLoginFacebook = res => {
        if (res?.accessToken) {
            this.setState({ loading: true })
            const { dispatch } = this.props;
            dispatch({
                type: types.USER_LOGIN_FACEBOOK,
                payload: {
                    accessToken: res.accessToken,
                    image: res.picture?.data?.url
                },
                callback: res => {
                    if (!res?.success) {
                        this.setState({
                            field: res?.field, message: translate(res?.messages || langConfig.app.LoginFailed),
                            loading: false
                        });
                    }
                }
            });
        } else {
            this.setState({
                message: translate(langConfig.app.LoginFailed),
            });
        }
    }
    handleResetPassword = (e) => {
        e.preventDefault();
        const { dispatch } = this.props;
        dispatch({ type: types.OPENFORM, payload: 'reset' });
    }
    render() {
        const { message, loading } = this.state;
        const { openForm } = this.props;
        return (
            <Modal show={openForm === MODE.visitor} id="guestModal" className="login-modal" centered contentClassName="" onHide={this.handleClose}>
                <a href="/"><img src="images/logo.png" alt="" /></a>
                <label className="tk">
                    <span>{translate(langConfig.app.Account)}</span>
                    <input onChange={this.handleChange} type="text" name="email" placeholder={translate(langConfig.app.Email)} />
                </label>
                <label className="mk">
                    <span>{translate(langConfig.app.Password)}</span>
                    <input onChange={this.handleChange} type="password" name="password" placeholder={translate(langConfig.app.Password)} />
                </label>
                {message ? <div className="error-form">{message}</div> : ""}
                <input type="submit" onClick={this.handleSubmit} value={translate(langConfig.app.Login)} disabled={loading} />
                <div className="suport-login">
                    <label className="remember-login label-cb">
                        <input type="checkbox" name="remember" />
                        <span className="checkbox-checkmark" />
                        {translate(langConfig.app.RememberMe)}
                    </label>
                    <label className="fogot-mk">
                        {translate(langConfig.app.ForgetPassword)}? <a href="#" className="txt-red" onClick={this.handleResetPassword}>{translate(langConfig.app.ClickHere)}</a>
                    </label>
                </div>
                <p className="other-login">{translate(langConfig.app.Or)}</p>
                <FacebookLogin
                    appId={FACEBOOK_CLIENT_ID}
                    autoLoad={false}
                    fields="name,email,picture"
                    callback={this.handleLoginFacebook}
                    onFailure={this.handleLoginFacebook}
                    tag="a"
                    cssClass="with-fb"
                    textButton={translate(langConfig.app.LoginWithFacebook)}
                    isDisabled={loading}
                />
                <GoogleLogin
                    clientId={GOOGLE_CLIENT_ID}
                    render={({ onClick, disabled }) => (
                        <a href="#" onClick={onClick} disabled={disabled} className="with-gg">{translate(langConfig.app.LoginWithGoogle)}</a>
                    )}
                    buttonText={translate(langConfig.app.LoginWithGoogle)}
                    onSuccess={this.handleLoginGoogle}
                    onFailure={this.handleLoginGoogle}
                    cookiePolicy={'single_host_origin'}
                    disabled={loading}
                />
                <label>
                    {translate(langConfig.app.NewMember)}? <a href="#" onClick={this.handleSwitchRegister} className="txt-red">{translate(langConfig.app.RegisterNow)}</a>
                </label>
            </Modal>
        )
    }
}


export default connect(({ app: { openForm } }) => ({ openForm }))(LoginVisitor)
