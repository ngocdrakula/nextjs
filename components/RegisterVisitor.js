import React, { Component } from 'react'
import { Modal } from 'react-bootstrap';
import { connect } from 'react-redux'
import Link from 'next/link';
import types from '../redux/types';
import { MODE } from '../utils/helper';
import Logo from './Logo';

class RegisterVisitor extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    handleChange = e => this.setState({ [e.target.name]: e.target.value, field: null, message: '' });
    handleSubmit = e => {
        const { email, password, repassword, name, phone, address,
            representative, position, mobile, website, product
        } = this.state;
        if (!representative) {
            this.setState({ field: 'representative', message: 'Họ tên không được để trống' })
        } else if (!name) {
            this.setState({ field: 'name', message: 'Tên công ty không được để trống' })
        } else if (!email) {
            this.setState({ field: 'email', message: 'Email không được để trống' })
        } else if (!password) {
            this.setState({ field: 'password', message: 'Mật khẩu không được để trống' })
        } else if (password.length < 8) {
            this.setState({ field: 'password', message: 'Mật khẩu phải trên 8 ký tự' })
        } else if (password !== repassword) {
            this.setState({ field: 'password', message: 'Mật khẩu nhập lại không trùng khớp' })
        } else {
            const { dispatch } = this.props;
            dispatch({
                type: types.USER_REGISTER,
                payload: {
                    email, password, name, phone, address,
                    representative, position, mobile, website, product
                },
                callback: res => {
                    if (!res?.success) {
                        this.setState({
                            field: res?.field, message: res?.message || "Đăng ky không thành công"
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
        const { message } = this.state;
        const { openForm } = this.props;
        return (
            <Modal show={openForm === 'reg'} id="guestModal" className="login-modal register-vis" centered contentClassName="" onHide={this.handleClose}>
                <Link href="/">
                    <a><Logo /></a>
                </Link>
                <label className="tk">
                    <span>Họ và Tên</span>
                    <input onChange={this.handleChange} type="text" required name="representative" placeholder="Nhập tên bạn" />
                </label>
                <label className="tk">
                    <span>Tên công ty</span>
                    <input onChange={this.handleChange} type="text" required name="name" placeholder="Nhập tên công ty" />
                </label>
                <label className="tk">
                    <span>Địa chỉ</span>
                    <input onChange={this.handleChange} type="text" name="address" placeholder="Nhập địa chỉ công ty" />
                </label>
                <label className="tk">
                    <span>Điện thoại</span>
                    <input onChange={this.handleChange} type="text" name="phone" placeholder="Nhập số điện thoại công ty" />
                </label>
                <label className="tk">
                    <span>Di động</span>
                    <input onChange={this.handleChange} type="text" name="mobile" placeholder="Nhập số điện thoại cá nhân" />
                </label>
                <label className="tk">
                    <span>Website</span>
                    <input onChange={this.handleChange} type="text" name="website" placeholder="Nhập website công ty" />
                </label>
                <label className="tk">
                    <span>Chức vụ</span>
                    <input onChange={this.handleChange} type="text" name="position" placeholder="Nhập chức vụ của bạn trong công ty" />
                </label>
                <label className="tk">
                    <span>Sản phẩm</span>
                    <input onChange={this.handleChange} type="text" name="product" placeholder="Nhập sản phẩm mà bạn muốn mua (nếu có)" />
                </label>
                <label className="tk">
                    <span>Email</span>
                    <input onChange={this.handleChange} type="text" required name="email" placeholder="Nhập email công ty" />
                </label>
                <label className="mk">
                    <span>Mật khẩu</span>
                    <input onChange={this.handleChange} type="password" required name="password" placeholder="Nhập mật khẩu" />
                </label>
                <label className="mk">
                    <span>Nhập lại</span>
                    <input onChange={this.handleChange} type="password" required name="repassword" placeholder="Nhập lại mật khẩu" />
                </label>
                <div className="error-form">{message}</div>
                <button type="submit" className="log-submit" onClick={this.handleSubmit}>Đăng ký</button>
                <label>
                    Bạn đã có tài khoản? <a href="#" onClick={this.handleSwitchLogin} className="txt-red"> Đăng nhập ngay</a>
                </label>
            </Modal>
        )
    }
}


export default connect(({ app: { openForm } }) => ({ openForm }))(RegisterVisitor)
