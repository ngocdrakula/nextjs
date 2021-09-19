import React, { Component } from 'react'
import { Modal } from 'react-bootstrap';
import { connect } from 'react-redux'
import types from '../redux/types';
import { MODE } from '../utils/helper';


class LoginVisitor extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    handleChange = e => this.setState({ [e.target.name]: e.target.value, message: '' });
    handleSendCode = e => {
        const { email } = this.state;
        if (!email) this.setState({ field: 'email', message: 'Email không được để trống' });
        else {
            const { dispatch } = this.props;
            dispatch({
                type: types.RESET_PASSWORD,
                payload: { email },
                callback: res => {
                    if (res?.success) {
                        this.setState({
                            sendcode: true, successMessage: res.message
                        });
                    }
                    else {
                        this.setState({
                            field: res?.field, message: res?.message || "Tài khoản không tồn tại hoặc đã bị khóa"
                        });
                    }
                }
            });
        }
    }
    handleSubmit = e => {
        const { email, password, repassword, code } = this.state;
        if (!code) this.setState({ field: 'code', successMessage: '', message: 'Mã bảo mật không được để trống' });
        else if (!password) this.setState({ field: 'password', successMessage: '', message: 'Mật khẩu không được để trống' });
        else if (password.length < 8) this.setState({ field: 'password', successMessage: '', message: 'Mật khẩu phải trên 8 ký tự' });
        else if (password !== repassword) this.setState({ field: 'password', successMessage: '', message: 'Mật khẩu nhập lại không trùng khớp' });
        else {
            const { dispatch } = this.props;
            dispatch({
                type: types.RESET_PASSWORD,
                payload: { email, password, code },
                callback: res => {
                    if (!res?.success) {
                        this.setState({
                            field: res?.field, successMessage: '', message: res?.message || "Mã bảo mật không chính xác"
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
            <Modal show={openForm === 'reset'} id="exhibitorModal" className="login-modal register-vis" centered contentClassName="" onHide={this.handleClose}>
                <a href="/"><img src="images/logo.png" alt="" /></a>
                <label className="tk">
                    <span>Email</span>
                    <input value={email || ''} onChange={this.handleChange} type="text" name="email" placeholder="Nhập email của bạn" readOnly={sendcode} />
                </label>
                {sendcode ?
                    <>
                        <label className="tk">
                            <span>Mã bảo mật</span>
                            <input value={code || ''} onChange={this.handleChange} type="code" name="code" placeholder="Nhật mã bảo mật" />
                        </label>
                        <label className="mk">
                            <span>Mật khẩu</span>
                            <input value={password || ''} onChange={this.handleChange} type="password" name="password" placeholder="At least 8 characters" />
                        </label>
                        <label className="mk">
                            <span>Nhập lại</span>
                            <input value={repassword || ''} onChange={this.handleChange} type="password" name="repassword" placeholder="At least 8 characters" />
                        </label>
                    </>
                    : ""}
                {sendcode && successMessage ? <div className="success-form">{successMessage}</div> : ""}
                {message ? <div className="error-form">{message}</div> : ""}
                <input type="submit" onClick={sendcode ? this.handleSubmit : this.handleSendCode} value={sendcode ? "Đổi mật khẩu" : "Lấy mã bảo mật"} />
                <div className="suport-login">
                    <label className="fogot-mk">
                        <a href="#" className="txt-red" onClick={this.handleSendCode}>Gửi lại mã bảo mật</a>
                    </label>
                    <label>
                        <a href="#" onClick={this.handleSwitchLogin} className="txt-red">Quay lại trang đăng nhập</a>
                    </label>
                </div>
            </Modal>
        )
    }
}


export default connect(({ app: { openForm } }) => ({ openForm }))(LoginVisitor)
