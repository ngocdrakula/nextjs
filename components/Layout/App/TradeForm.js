import React, { Component } from 'react'
import { connect } from 'react-redux';
import types from '../../../redux/types';
import { translate } from '../../../utils/language';
import langConfig from '../../../lang.config';


class TradeForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            content: '',
            deadline: '',
            fromName: '',
            fromEmail: '',
            toName: '',
            toEmail: '',
            message: '',
            success: false
        }
    }
    componentDidUpdate(prevProps) {
        const { onCreate, user } = this.props;
        if (!prevProps.onCreate && this.props.onCreate) {
            this.setState({
                content: '',
                deadline: '',
                fromName: translate(user.names) || user.name,
                fromEmail: user.email,
                toName: onCreate.name,
                toEmail: onCreate.email,
                message: '',
                success: false
            })
        }
    }

    handleSubmit = e => {
        e.preventDefault();
        const { content, deadline, fromName, fromEmail, toName, toEmail } = this.state;
        const { dispatch, onCreate } = this.props;
        if (!fromName) this.setState({ message: 'Tên của bạn không được để trống' });
        if (!fromEmail) this.setState({ message: 'Email của bạn không được để trống' });
        if (!toName) this.setState({ message: 'Tên đối tác không được để trống' });
        if (!toEmail) this.setState({ message: 'Email đối tác không được để trống' });
        if (deadline && onCreate) {
            this.setState({ loading: true })
            dispatch({
                type: types.ADD_TRADE,
                payload: { content, deadline, to: onCreate._id, fromName, fromEmail, toName, toEmail },
                callback: res => {
                    if (!res?.success) {
                        this.setState({ message: res?.message || 'Vui lòng kiểm tra kết nối internet', loading: false })
                    }
                    else {
                        this.setState({ success: true, loading: false })
                    }
                }
            })
        }
    }
    handleClose = () => {
        const { dispatch } = this.props;
        dispatch({
            type: types.CREATE_TRADE,
            payload: null
        });
    }
    handleChange = e => this.setState({ [e.target.name]: e.target.value, message: '' })
    render() {
        const { onCreate } = this.props;
        const { content, deadline, message, success, loading, fromName, fromEmail, toName, toEmail } = this.state;
        return (
            <div className="container-DKGiaoThuong" style={{ display: onCreate ? 'block' : 'none' }}>
                <div className="overlay" />
                <div className="card" style={{ overflow: 'auto' }}>
                    <div className="form__name" style={{ marginBottom: 10 }}>
                        {translate(langConfig.app.CreateTrade)}
                        <div onClick={this.handleClose} style={{ float: 'right', cursor: 'pointer' }} className="btn-close-gt">X</div>
                    </div>
                    <div className="contact__container">
                        <div className="section">
                            <div className="box">1</div>
                            <span> {translate(langConfig.app.YourInfo)}</span>
                        </div>
                        <form className="form__contact">
                            <div className="cname">
                                <label>{translate(langConfig.app.Name)}</label> <input className="inputGT" name="nameCompany" type="text" name="fromName" value={fromName} onChange={this.handleChange} required disabled={success} />
                            </div>
                            <div className="cnum">
                                <label>{translate(langConfig.app.Email)}</label> <input className="inputGT" name="emailCompany" type="email" name="fromEmail" value={fromEmail} onChange={this.handleChange} required disabled={success} />
                            </div>
                        </form>
                    </div>
                    <div className="contact__container">
                        <div className="section">
                            <div className="box">2</div>
                            <span>{translate(langConfig.app.PartnerInfo)}</span>
                        </div>
                        <form className="form__contact">
                            <div className="cname">
                                <label>{translate(langConfig.app.Name)}</label> <input className="inputGT" name="nameCompany" type="text" name="toName" value={toName} onChange={this.handleChange} required disabled={success} />
                            </div>
                            <div className="cnum">
                                <label>{translate(langConfig.app.Email)}</label> <input className="inputGT" name="emailCompany" type="email" name="toEmail" value={toEmail} onChange={this.handleChange} required disabled={success} />
                            </div>
                        </form>
                    </div>
                    <div className="contact__container">
                        <div className="section">
                            <div className="box">3</div><span>{translate(langConfig.app.TimeAndContent)}</span>
                        </div>
                        <form className="form__contact" style={{ flexWrap: 'wrap' }} onSubmit={this.handleSubmit}>
                            <div className="email">
                                <label>{translate(langConfig.app.Time)}</label> <input className="inputGT" placeholder={translate(langConfig.app.SelectTradeTime)} name="deadline" type="datetime-local" value={deadline} required onChange={this.handleChange} disabled={success} />
                            </div>
                            <div className="email">
                                <label>{translate(langConfig.app.Content)}</label> <textarea rows={3} className="inputGT" placeholder={translate(langConfig.app.EnterTradeContent)} name="content" type="text" value={content} onChange={this.handleChange} disabled={success} />
                            </div>
                        </form>
                    </div>
                    {message ?
                        <div className="contact__container">
                            <div style={{ color: 'red' }}>{message}</div>
                        </div>
                        : ''}
                    {success ?
                        <div className="contact__container">
                            <div style={{ color: 'green' }}>{translate(langConfig.app.CreateTradeSuccess)}</div>
                        </div>
                        : ""}
                    <div className="form__confirmation">
                        {success ?
                            <button onClick={this.handleClose} className="btnSubmit-dkgt">{translate(langConfig.app.Close)}</button>
                            :
                            <button onClick={this.handleSubmit} disabled={loading} className="btnSubmit-dkgt">
                                {translate(loading ? langConfig.app.Creating : langConfig.app.CreateSubmit)}
                            </button>
                        }
                    </div>
                </div>
            </div>

        )
    }
}

export default connect(({ app: { onCreate, user } }) => ({ onCreate, user }))(TradeForm)
