import React, { Component } from 'react'
import { connect } from 'react-redux';
import langConfig, { langConcat } from '../../../lang.config';
import { translate } from '../../../utils/language';
import types from '../../../redux/types';
import { createFormData } from '../../../utils/helper';

class AdminInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            name: '',
            nameEN: '',
            fieldError: null,
            message: '',
        }
    }
    componentDidMount() {
        const { dispatch, user } = this.props;
        dispatch({
            type: types.ADMIN_GET_USER,
            payload: user._id,
            callback: res => {
                if (res?.success) {
                    const { name, email, names } = res.data;
                    this.setState({ name, email, nameEN: names.en })
                }
            }
        });
    }

    handleChange = e => this.setState({ [e.target.name]: e.target.value, fieldError: null })
    handleSubmit = e => {
        e.preventDefault();
        const { dispatch, user } = this.props;
        const { email, name, nameEN, filesAvatar } = this.state;
        const dataRequied = { email, name, nameEN }
        const fieldError = Object.keys(dataRequied).find(field => !dataRequied[field]);

        if (fieldError) {
            this.setState({ fieldError, message: translate(langConfig.message.error.infomation) })
        }
        else {
            const data = { email, name, nameEN }
            const filesTotal = [];
            if (filesAvatar?.length) {
                data.avatar = true;
                filesTotal.push(filesAvatar[0])
            }
            if (filesTotal.length) data.files = filesTotal;
            const formData = createFormData(data);

            dispatch({
                type: types.ADMIN_UPDATE_USER,
                payload: { _id: user._id, formData },
                callback: res => {
                    if (res?.success) {
                        dispatch({
                            type: types.SET_TOOLTIP,
                            payload: {
                                type: 'success',
                                title: translate(langConfig.message.success.updated),
                                message: translate(langConfig.app.Updated),
                                confirm: translate(langConfig.app.Accept),
                                cancel: translate(langConfig.app.Close),
                                handleConfirm: this.handleCancel,
                                handleCancel: this.handleCancel
                            },
                        });
                    }
                    else if (res?.data) {
                        this.setState({
                            fieldError: res.data.field,
                            message: translate(res.data.messages || langConfig.message.error.infomation)
                        })
                    }
                }
            });
        }
    }
    handleCancel = () => this.setState({
        email: this.props.user.email,
        name: this.props.user.name,
        nameEN: this.props.user.names.en,
        files: null,
        filesAvatar: null,
        fieldError: null,
        message: '',
        onEdit: false,
    })

    handleChooseFilesAvatar = e => {
        this.setState({ filesAvatar: e.target.files })
    }
    render() {
        const { active, user } = this.props;
        const { email, name, nameEN, fieldError, message, onEdit, filesAvatar } = this.state;
        if (!active) return null;
        return (
            <section className="content">
                <div className="row" style={{ padding: '0 20px 20px 20px' }}>
                    <div className="col-md-3">
                        <div className="card card-primary card-outline">
                            <div className="card-body box-profile">
                                <div className="text-center">
                                    <div className="pic">
                                        <div className="afta-logo-user">
                                            {user?.avatar ?
                                                <img className="profile-user-img img-fluid img-circle" src={"/api/images/" + user.avatar} alt="Store Logo" />
                                                :
                                                <img className="profile-user-img img-fluid img-circle" src="/images/no-avatar.png" alt="Store Logo" />
                                            }
                                        </div>
                                    </div>
                                </div>
                                <h3 className="profile-username text-center">{user?.name}</h3>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-9">
                        <div className="card">
                            <div className="card-header p-2">
                                <ul className="nav nav-pills">
                                </ul>
                            </div>
                            <div className="card-body">
                                <div className="tab-content">
                                    <div className="active tab-pane" id="InfoCompany">
                                        <form className="form-horizontal" method="post" action="/" onSubmit={this.handleSubmit}>
                                            <div className="form-group row">
                                                <label htmlFor="admin-name" className="col-sm-3 col-form-label">{translate(langConfig.app.Name)} (VN):</label>
                                                <div className="col-sm-9">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="admin-name"
                                                        placeholder={translate(langConcat(langConfig.app.Enter, langConfig.app.Name))}
                                                        value={name}
                                                        onChange={this.handleChange}
                                                        name="name"
                                                        readOnly={!onEdit}
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label htmlFor="admin-nameEN" className="col-sm-3 col-form-label">{translate(langConfig.app.Name)} (EN):</label>
                                                <div className="col-sm-9">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="admin-nameEN"
                                                        placeholder={translate(langConcat(langConfig.app.Enter, langConfig.app.Name))}
                                                        value={nameEN}
                                                        onChange={this.handleChange}
                                                        name="nameEN"
                                                        readOnly={!onEdit}
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label htmlFor="admin-email" className="col-sm-3 col-form-label">{translate(langConfig.app.Email)}:</label>
                                                <div className="col-sm-9">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="admin-email"
                                                        placeholder={translate(langConcat(langConfig.app.Enter, langConfig.app.Email))}
                                                        value={email}
                                                        onChange={this.handleChange}
                                                        name="email"
                                                        readOnly={!onEdit}
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-group row" style={{ display: 'flex' }}>
                                                <label htmlFor="inputName" className="col-sm-3 col-form-label">{translate(langConfig.app.Avatar)}</label>
                                                <div className="col-sm-9" style={{ marginLeft: 8, maxWidth: '81%' }}>
                                                    {user.avatar ?
                                                        <img src={"/api/images/" + user.avatar} style={{ width: 'auto', height: 'auto', maxWidth: 100, maxHeight: 100 }} />
                                                        : <p>{translate(langConfig.app.NoAvatar)}</p>
                                                    }
                                                </div>
                                            </div>
                                            <div className="form-group row" id="editLogo" style={{ display: onEdit ? 'flex' : 'none' }}>
                                                <label htmlFor="inputName" className="col-sm-3 col-form-label">{translate(langConfig.app.UploadAvatar)}</label>
                                                <div className="col-sm-9" style={{ marginLeft: 8, maxWidth: '81%' }}>
                                                    <input type="file" className="custom-file-input" id="avatar" name="avatar" onChange={this.handleChooseFilesAvatar} />
                                                    <label className="custom-file-label" htmlFor="avatar">
                                                        {filesAvatar?.length ?
                                                            translate(langConfig.app.OneFileSelected)
                                                            :
                                                            translate(langConfig.app.ChooseAvatar)}
                                                    </label>
                                                </div>
                                                <span style={{ fontSize: 10, color: 'blue' }}>{translate(langConfig.app.Type)}: .jpg, .png<br />Size: 2MB</span>
                                            </div>
                                            {fieldError ? <div style={{ color: 'red', padding: '10px 0px' }}>{message}</div> : ""}
                                            {onEdit ?
                                                <div style={{ display: 'flex' }}>
                                                    <div className="form-group" id="btnSubmitData">
                                                        <div className="offset-sm-3 col-sm-9">
                                                            <button type="submit" className="btn btn-primary">{translate(langConfig.app.Save)}</button>
                                                        </div>
                                                    </div>
                                                    <div className="form-group" id="btnCancel" style={{ marginLeft: 10 }}>
                                                        <div className="offset-sm-3 col-sm-10">
                                                            <button type="button" className="btn btn-danger" onClick={this.handleCancel}>{translate(langConfig.app.Cancel)}</button>
                                                        </div>
                                                    </div>
                                                </div>
                                                :
                                                <div className="form-group row" id="btnEditData">
                                                    <div className="offset-sm-3 col-sm-9">
                                                        <button type="button" className="btn btn-primary" onClick={() => this.setState({ onEdit: true })}>{translate(langConfig.app.Edit)}</button>
                                                    </div>
                                                </div>
                                            }
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        )
    }
}

export default connect(({ admin: { user, industries } }) => ({ user, industries }))(AdminInfo)
