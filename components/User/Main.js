import React, { Component } from 'react'
import { connect } from 'react-redux'
import types from '../../redux/types';

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({ type: types.USER_GET_DESIGN });
    }


    handleChange = e => this.setState({ [e.target.name]: e.target.value, message: '', field: '' });
    handleSubmit = e => {
        e.preventDefault();
        const { name, email, password, repassword } = this.state;
        const { dispatch } = this.props;
        if (password?.length < 8) {
            this.setState({ field: 'password', message: 'Mật khẩu phải trên 8 kí tự' });
        }
        else if (password !== repassword) {
            this.setState({ field: 'repassword', message: 'Mật khẩu xác nhận sai' });
        }
        else {
            this.setState({ submited: true })
            dispatch({
                type: types.USER_REGISTER,
                payload: { username: email, password, name },
                callback: res => {
                    if (res?.success) {
                        this.setState({
                            message: res?.message || 'Địa chỉ email đã được sử dụng',
                            field: 'email',
                            submited: false
                        });
                    }
                }
            })
        }
    }

    render() {
        const { message, field, submited } = this.state;
        const { handleSelect } = this.props;
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-10 col-md-offset-1">
                        <div id="confirmDialog" role="dialog" className="modal fade">
                            <div className="modal-dialog">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <button type="button" data-dismiss="modal" className="close">×</button>
                                        <h4 id="confirmDialogHeader" className="modal-title">Confirm </h4>
                                    </div>
                                    <div className="modal-body">
                                        <p id="confirmDialogText">Please confirm.</p>
                                    </div>
                                    <div className="modal-footer">
                                        <button id="confirmDialogSubmit" type="submit" onclick="window.$('#savedRoomsForm').submit();" className="btn btn-primary">Confirm</button>
                                        <button type="button" data-dismiss="modal" className="btn btn-default">Cancel</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="panel panel-default">
                            <div className="dropdown pull-right">
                                <button type="button" data-toggle="dropdown" className="btn btn-default btn-sm dropdown-toggle">With seleted<span className="caret" />
                                </button>
                                <ul className="dropdown-menu">
                                    <li>
                                        <a href="#" onclick="HomePage.deleteSelectedSavedRooms();">Remove</a>
                                    </li>
                                </ul>
                            </div>
                            <h3 className="panel-heading">Saved rooms list</h3>
                            <div className="panel-body">
                                <table className="table table-striped table-hover">
                                    <thead>
                                        <tr>
                                            <th colSpan={2}>Room</th>
                                            <th colSpan={2}>Url</th>
                                            <th>Note</th>
                                            <th colSpan={3}>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="table-text">Ngoài trời 2</td>
                                            <td className="table-text">
                                                <img src=" /storage/savedrooms/979d472a84804b9f647bc185a877a8b5.png " alt style={{ maxWidth: 128, maxHeight: 100 }} />
                                            </td>
                                            <td className="table-text">
                                                <a href="/room/url/979d472a84804b9f647bc185a877a8b5" title="/room/url/979d472a84804b9f647bc185a877a8b5">
                                                    <img src="/img/icons/2d.png" alt width={32} />
                                                </a>
                                            </td>
                                            <td className="table-text">
                                                <a href="/room/url/979d472a84804b9f647bc185a877a8b5">979d472a84804b9f647bc185a877a8b5</a>
                                            </td>
                                            <td className="table-text" />
                                            <td className="table-text">
                                                <input type="checkbox" name defaultValue={213} onchange="HomePage.addCheckedSavedRoom(this.value, this.checked);" />
                                            </td>
                                            <td className="table-text">
                                                <button type="button" onclick="HomePage.deleteSavedRoom(213)" title="Remove Room" className="close">×</button>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="table-text">Ngoài trời 2</td>
                                            <td className="table-text">
                                                <img src=" /storage/savedrooms/ca46c1b9512a7a8315fa3c5a946e8265.png " alt style={{ maxWidth: 128, maxHeight: 100 }} />
                                            </td>
                                            <td className="table-text">
                                                <a href="/room/url/ca46c1b9512a7a8315fa3c5a946e8265" title="/room/url/ca46c1b9512a7a8315fa3c5a946e8265">
                                                    <img src="/img/icons/2d.png" alt width={32} />
                                                </a>
                                            </td>
                                            <td className="table-text">
                                                <a href="/room/url/ca46c1b9512a7a8315fa3c5a946e8265">ca46c1b9512a7a8315fa3c5a946e8265</a>
                                            </td>
                                            <td className="table-text" />
                                            <td className="table-text">
                                                <input type="checkbox" name defaultValue={214} onchange="HomePage.addCheckedSavedRoom(this.value, this.checked);" />
                                            </td>
                                            <td className="table-text">
                                                <button type="button" onclick="HomePage.deleteSavedRoom(214)" title="Remove Room" className="close">×</button>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="table-text">Phòng khách 1</td>
                                            <td className="table-text">
                                                <img src=" /storage/savedrooms/060ad92489947d410d897474079c1477.png " alt style={{ maxWidth: 128, maxHeight: 100 }} />
                                            </td>
                                            <td className="table-text">
                                                <a href="/room/url/060ad92489947d410d897474079c1477" title="/room/url/060ad92489947d410d897474079c1477">
                                                    <img src="/img/icons/2d.png" alt width={32} />
                                                </a>
                                            </td>
                                            <td className="table-text">
                                                <a href="/room/url/060ad92489947d410d897474079c1477">060ad92489947d410d897474079c1477</a>
                                            </td>
                                            <td className="table-text" />
                                            <td className="table-text">
                                                <input type="checkbox" name defaultValue={221} onchange="HomePage.addCheckedSavedRoom(this.value, this.checked);" />
                                            </td>
                                            <td className="table-text">
                                                <button type="button" onclick="HomePage.deleteSavedRoom(221)" title="Remove Room" className="close">×</button>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="table-text">Phòng khách 10</td>
                                            <td className="table-text">
                                                <img src=" /storage/savedrooms/bcbe3365e6ac95ea2c0343a2395834dd.png " alt style={{ maxWidth: 128, maxHeight: 100 }} />
                                            </td>
                                            <td className="table-text">
                                                <a href="/room/url/bcbe3365e6ac95ea2c0343a2395834dd" title="/room/url/bcbe3365e6ac95ea2c0343a2395834dd">
                                                    <img src="/img/icons/2d.png" alt width={32} />
                                                </a>
                                            </td>
                                            <td className="table-text">
                                                <a href="/room/url/bcbe3365e6ac95ea2c0343a2395834dd">bcbe3365e6ac95ea2c0343a2395834dd</a>
                                            </td>
                                            <td className="table-text" />
                                            <td className="table-text">
                                                <input type="checkbox" name defaultValue={222} onchange="HomePage.addCheckedSavedRoom(this.value, this.checked);" />
                                            </td>
                                            <td className="table-text">
                                                <button type="button" onclick="HomePage.deleteSavedRoom(222)" title="Remove Room" className="close">×</button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div className="page-links" style={{ textAlign: 'center' }} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        );
    }
}

export default connect(({ app: { user } }) => ({ user }))(Main)
