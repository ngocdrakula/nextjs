import React, { Component } from 'react'
import { Modal } from 'react-bootstrap';
import { connect } from 'react-redux'
import Link from 'next/link';
import types from '../../../redux/types';
import { MODE } from '../../../utils/helper';
import Logo from '../Logo';
import langConfig, { langConcat } from '../../../lang.config';
import { translate } from '../../../utils/language';

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
            this.setState({ field: 'representative', message: translate(langConcat(langConfig.app.Representative, langConfig.message.error.validation.required)) })
        } else if (!name) {
            this.setState({ field: 'name', message: translate(langConcat(langConfig.app.CompanyName, langConfig.message.error.validation.required)) })
        } else if (!email) {
            this.setState({ field: 'email', message: translate(langConcat(langConfig.app.Email, langConfig.message.error.validation.required)) })
        } else if (!password) {
            this.setState({ field: 'password', message: translate(langConcat(langConfig.app.Password, langConfig.message.error.validation.required)) })
        } else if (password.length < 8) {
            this.setState({ field: 'password', message: translate(langConfig.app.PasswordMustBeOnMoreThan8Character) })
        } else if (password !== repassword) {
            this.setState({ field: 'password', message: translate(langConcat(langConfig.app.ConfirmPassword, langConfig.message.error.validation.incorrect)) })
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
                            field: res?.field, message: translate(res?.message) || translate(langConfig.app.RegisterFailed)
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
            <Modal bsPrefix={"user-page modal"} show={openForm === 'reg'} id="guestModal" className="login-modal register-vis" centered contentClassName="" onHide={this.handleClose}>
                <Link href="/">
                    <a><Logo /></a>
                </Link>
                <label className="tk">
                    <span>{translate(langConfig.app.FullName)}</span>
                    <input onChange={this.handleChange} type="text" required name="representative" placeholder={translate(langConfig.app.EnterYourName)} />
                </label>
                <label className="tk">
                    <span>{translate(langConfig.app.Company)}</span>
                    <input onChange={this.handleChange} type="text" required name="name" placeholder={translate(langConfig.app.EnterCompanyName)} />
                </label>
                <label className="tk">
                    <span>{translate(langConfig.app.Address)}</span>
                    <input onChange={this.handleChange} type="text" name="address" placeholder={translate(langConfig.app.EnterCompanyAddress)} />
                </label>
                <label className="tk">
                    <span>{translate(langConfig.app.Phone)}</span>
                    <input onChange={this.handleChange} type="text" name="phone" placeholder={translate(langConfig.app.EnterCompanyHotline)} />
                </label>
                <label className="tk">
                    <span>{translate(langConfig.app.Mobile)}</span>
                    <input onChange={this.handleChange} type="text" name="mobile" placeholder={translate(langConfig.app.EnterYourMobile)} />
                </label>
                <label className="tk">
                    <span>{translate(langConfig.app.Website)}</span>
                    <input onChange={this.handleChange} type="text" name="website" placeholder={translate(langConfig.app.EnterCompanyWebsite)} />
                </label>
                <label className="tk">
                    <span>{translate(langConfig.app.Position)}</span>
                    <input onChange={this.handleChange} type="text" name="position" placeholder={translate(langConfig.app.EnterYourPosition)} />
                </label>
                <label className="tk">
                    <span>{translate(langConfig.app.Product)}</span>
                    <input onChange={this.handleChange} type="text" name="product" placeholder={translate(langConfig.app.EnterProductBuy)} />
                </label>
                <label className="tk">
                    <span>{translate(langConfig.app.Email)}</span>
                    <input onChange={this.handleChange} type="text" required name="email" placeholder={translate(langConfig.app.EnterCompanyEmail)} />
                </label>
                <label className="mk">
                    <span>{translate(langConfig.app.Password)}</span>
                    <input onChange={this.handleChange} type="password" required name="password" placeholder={translate(langConfig.app.EnterPassword)} />
                </label>
                <label className="mk">
                    <span>{translate(langConfig.app.ConfirmPassword)}</span>
                    <input onChange={this.handleChange} type="password" required name="repassword" placeholder={translate(langConfig.app.ReEnterPassword)} />
                </label>
                <div className="error-form">{message}</div>
                <button type="submit" className="log-submit" onClick={this.handleSubmit}>{translate(langConfig.app.Register)}</button>
                <label>
                    {translate(langConfig.app.HaveAccount)}? <a href="#" onClick={this.handleSwitchLogin} className="txt-red"> {translate(langConfig.app.LoginNow)}</a>
                </label>
            </Modal>
        )
    }
}


export default connect(({ app: { openForm } }) => ({ openForm }))(RegisterVisitor)
