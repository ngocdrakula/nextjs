import React, { Component } from 'react'
import { Modal } from 'react-bootstrap';
import { connect } from 'react-redux'
import Link from 'next/link';
import types from '../../../redux/types';
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login';
import { MODE } from '../../../utils/helper';
import Logo from '../Logo';

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
                        field: res?.field, message: res?.message || "Đăng nhập không thành công",
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
                            field: res?.field, message: res?.message || "Đăng nhập không thành công",
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
                alert("Vui lòng cho phép cookie bên thứ ba và thử lại")
            }
            else {
                this.setState({
                    message: "Đăng nhập không thành công",
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
                            field: res?.field, message: res?.message || "Đăng nhập không thành công",
                            loading: false
                        });
                    }
                }
            });
        } else {
            this.setState({
                message: "Đăng nhập không thành công",
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
            <Modal bsPrefix={"user-page modal"} show={openForm === MODE.visitor} id="guestModal" className="login-modal" centered contentClassName="" onHide={this.handleClose}>
                <Link href="/">
                    <a><Logo /></a>
                </Link>
                <label className="tk">
                    <span>Tài khoản</span>
                    <input onChange={this.handleChange} type="text" name="email" placeholder="Phone Number, Name or Email" />
                </label>
                <label className="mk">
                    <span>Mật khẩu</span>
                    <input onChange={this.handleChange} type="password" name="password" placeholder="At least 8 characters" />
                </label>
                {message ? <div className="error-form">{message}</div> : ""}
                <button type="submit" className="log-submit" disabled={loading} onClick={this.handleSubmit}>Đăng nhập</button>
                <div className="suport-login">
                    <label className="remember-login label-cb">
                        <input type="checkbox" name="remember" />
                        <span className="checkbox-checkmark" />
                        Nhớ đăng nhập
                    </label>
                    <label className="fogot-mk">
                        Quên mật khẩu? <a href="#" className="txt-red" onClick={this.handleResetPassword}>Nhấn vào đây</a>
                    </label>
                </div>
                <p className="other-login">Hoặc</p>
                <FacebookLogin
                    appId={FACEBOOK_CLIENT_ID}
                    autoLoad={false}
                    fields="name,email,picture"
                    callback={this.handleLoginFacebook}
                    onFailure={this.handleLoginFacebook}
                    tag="a"
                    cssClass="with-fb"
                    textButton="Đăng nhập bằng Facebook"
                    isDisabled={loading}
                />
                <GoogleLogin
                    clientId={GOOGLE_CLIENT_ID}
                    render={({ onClick, disabled }) => (
                        <a href="#" onClick={onClick} disabled={disabled} className="with-gg">Đăng nhập bằng Google</a>
                    )}
                    buttonText="Đăng nhập bằng Google"
                    onSuccess={this.handleLoginGoogle}
                    onFailure={this.handleLoginGoogle}
                    cookiePolicy={'single_host_origin'}
                    disabled={loading}
                />
                <label>
                    Thành viên mới? <a href="#" onClick={this.handleSwitchRegister} className="txt-red">Đăng ký ngay</a>
                </label>
            </Modal>
        )
    }
}


export default connect(({ app: { openForm } }) => ({ openForm }))(LoginVisitor)
