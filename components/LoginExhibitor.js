import React, { Component } from 'react'
import { Modal } from 'react-bootstrap';
import { connect } from 'react-redux'
import types from '../redux/types';
import { MODE } from '../utils/helper';

class LoginExhibitor extends Component {
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
            payload: { email, password }
        })
    }
    handleClose = (e) => {
        const { dispatch } = this.props;
        dispatch({ type: types.OPENFORM, payload: null });
    }

    render() {
        const { message } = this.state;
        const { openForm } = this.props;
        return (
            <Modal show={openForm === MODE.exhibitor} id="exhibitorModal" className="login-modal" centered contentClassName="" onHide={this.handleClose}>
                <a href="/"><img src="images/logo.png" alt="" /></a>
                <label className="tk">
                    <span>Tài khoản</span>
                    <input onChange={this.handleChange} type="text" name="email" placeholder="Phone Number, Name or Email" />
                </label>
                <label className="mk">
                    <span>Mật khẩu</span>
                    <input onChange={this.handleChange} type="password" name="password" placeholder="At least 8 characters" />
                </label>
                <input type="submit" onClick={this.handleSubmit} defaultValue="Đăng nhập" />
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
            </Modal>
        );
    }
}


export default connect(({ app: { openForm } }) => ({ openForm }))(LoginExhibitor)
