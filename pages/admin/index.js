import React, { Component } from 'react';
import { connect } from 'react-redux';
import AdminHead from '../../components/AdminHead';
import Login from '../../components/Login';
import types from '../../redux/types';
import { MODE } from '../../utils/helper';
import Admin from '../../components/admin/Admin';
import Exhibitor from '../../components/exhibitor/Exhibitor';
import Tooltip from '../../components/Tooltip';


class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            active: 0
        }
    }
    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({ type: types.ADMIN_LOGIN_LOCAL });
        dispatch({ type: types.ADMIN_GET_INDUSTRIES });
    }
    render() {
        const { user, exUser } = this.props;
        return (
            <>
                <AdminHead />
                {user?.mode === MODE.exhibitor || exUser?._id ?
                    <Exhibitor />
                    : user?.mode === MODE.admin ?
                        <Admin />
                        : <Login />
                }
                <Tooltip />
            </>
        )
    }
}

export default connect(({ admin: { user, exUser } }) => ({ user, exUser }))(Dashboard);