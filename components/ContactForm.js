import React, { Component } from 'react';
import { connect } from 'react-redux';
import langConfig from '../lang.config';
import types from '../redux/types';
import { translate } from '../utils/language';

class ContactForm extends Component {
    constructor(props) {
        super(props);
        this.initState = { email: '', name: '', title: '', message: '' }
        this.state = {
            ...this.initState
        };
    }

    handleChange = e => this.setState({ [e.target.name]: e.target.value });
    handleSubmit = e => {
        e.preventDefault();
        const { email, name, title, message } = this.state;
        if (email && name && title && message) {
            const { dispatch } = this.props;
            dispatch({
                type: types.SEND_CONTACT,
                payload: { email, name, title, message },
                callback: res => {
                    if (res?.success) {
                        this.setState({ ...this.initState, success: true })
                    }
                }
            })
        }
    }
    render() {
        const { email, name, title, message, success } = this.state;
        return (
            <div className="form contact-form">
                <div className="form-group">
                    <input type="text" className="form-control" name="name" placeholder={translate(langConfig.app.FullName)} value={name} onChange={this.handleChange} />
                </div>
                <div className="form-group">
                    <input type="email" className="form-control" name="email" placeholder={translate(langConfig.app.Email)} value={email} onChange={this.handleChange} />
                </div>
                <div className="form-group">
                    <input type="text" className="form-control" name="title" placeholder={translate(langConfig.app.Subject)} value={title} onChange={this.handleChange} />
                </div>
                <div className="form-group">
                    <textarea className="form-control" name="message" placeholder={translate(langConfig.app.Messages)} rows={5} value={message} onChange={this.handleChange} />
                </div>
                {success ?
                    <p>{translate(langConfig.app.SendMessageSuccess)}!</p>
                    : ""}
                <input className={email && name && title && message ? "" : "disabled-btn"} type="submit" value={translate(langConfig.app.Send)} onClick={this.handleSubmit} />
            </div>
        )
    }
}




export default connect(({ admin: { setting } }) => ({ setting }))(ContactForm)
