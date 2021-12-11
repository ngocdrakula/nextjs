import React, { Component } from 'react'
import { Modal } from 'react-bootstrap';
import { connect } from 'react-redux'
import Link from 'next/link';
import types from '../../../redux/types';
import { MODE } from '../../../utils/helper';
import Logo from '../Logo';
import langConfig from '../../../lang.config';
import { translate } from '../../../utils/language';

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
            payload: { email, password, mode: MODE.exhibitor },
            callback: res => {
                if (!res?.success) {
                    this.setState({
                        field: res?.field, message: translate(res?.messages || langConfig.app.LoginFailed)
                    });
                }
            }
        })
    }
    handleClose = (e) => {
        const { dispatch } = this.props;
        dispatch({ type: types.OPENFORM, payload: null });
    }
    handleResetPassword = (e) => {
        e.preventDefault();
        const { dispatch } = this.props;
        dispatch({ type: types.OPENFORM, payload: 'reset' });
    }

    render() {
        const { message } = this.state;
        const { openForm } = this.props;
        return (
            <Modal bsPrefix={"user-page modal"} show={openForm === MODE.exhibitor} id="exhibitorModal" className="login-modal" centered contentClassName="" onHide={this.handleClose}>
                <Link href="/">
                    <a><Logo /></a>
                </Link>
                <label className="tk">
                    <span>{translate(langConfig.app.Account)}</span>
                    <input onChange={this.handleChange} type="text" name="email" placeholder={translate(langConfig.app.EmailAddress)} />
                </label>
                <label className="mk">
                    <span>{translate(langConfig.app.Password)}</span>
                    <input onChange={this.handleChange} type="password" name="password" placeholder={translate(langConfig.app.Password)} />
                </label>
                {message ? <div className="error-form">{message}</div> : ""}
                <button type="submit" className="log-submit" onClick={this.handleSubmit}>Đăng nhập</button>
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
            </Modal>
        );
    }
}


export default connect(({ app: { openForm } }) => ({ openForm }))(LoginExhibitor)
