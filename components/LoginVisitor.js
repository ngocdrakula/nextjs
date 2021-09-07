import React, { Component } from 'react'
import { Modal } from 'react-bootstrap';
import { connect } from 'react-redux'
import types from '../redux/types';
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login';
// import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import { MODE } from '../utils/helper';

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
        dispatch({
            type: types.USER_LOGIN,
            payload: { email, password },
            callback: res => {
                if (!res?.success) {
                    this.setState({
                        field: res?.field, message: res?.message || "Đăng nhập không thành công"
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
        if (res?.accessToken) {
            const { dispatch } = this.props;
            dispatch({
                type: types.USER_LOGIN_GOOGLE,
                payload: { accessToken: res.accessToken }
            });
        }
    }

    handleLoginFacebook = res => {
        if (res?.accessToken) {
            const { dispatch } = this.props;
            dispatch({
                type: types.USER_LOGIN_FACEBOOK,
                payload: {
                    accessToken: res.accessToken,
                    image: res.picture?.data?.url
                }
            });
        }
    }
    render() {
        const { message } = this.state;
        const { openForm } = this.props;
        return (
            <Modal show={openForm === MODE.visitor} id="guestModal" className="login-modal" centered contentClassName="" onHide={this.handleClose}>
                <a href="/"><img src="images/logo.png" alt="" /></a>
                <label className="tk">
                    <span>Tài khoản</span>
                    <input onChange={this.handleChange} type="text" name="email" placeholder="Phone Number, Name or Email" />
                </label>
                <label className="mk">
                    <span>Mật khẩu</span>
                    <input onChange={this.handleChange} type="password" name="password" placeholder="At least 8 characters" />
                </label>
                {message ? <div className="error-form">{message}</div> : ""}
                <input type="submit" onClick={this.handleSubmit} value="Đăng nhập" />
                <div className="suport-login">
                    <label className="remember-login label-cb">
                        <input type="checkbox" name="remember" />
                        <span className="checkbox-checkmark" />
                        Nhớ đăng nhập
                    </label>
                    <label className="fogot-mk">
                        Quên mật khẩu? <a href="#" className="txt-red">Nhấn vào đây</a>
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
                />
                <label>
                    Thành viên mới? <a href="#" onClick={this.handleSwitchRegister} className="txt-red">Đăng ký ngay</a>
                </label>
            </Modal>
        )
    }
}


export default connect(({ app: { openForm } }) => ({ openForm }))(LoginVisitor)
