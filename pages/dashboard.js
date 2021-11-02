import React, { Component } from 'react';
import { connect } from 'react-redux';
import { END } from 'redux-saga';
import Login from '../components/Layout/Admin/Login';
import types from '../redux/types';
import { MODE } from '../utils/helper';
import { wrapper } from '../redux/store';
import Admin from '../components/admin/Admin';
import Exhibitor from '../components/exhibitor/Exhibitor';
import SocketIO from '../utils/SocketIO';


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

        SocketIO.start();
    }
    render() {
        const { user, exUser } = this.props;
        return (
            exUser?._id || user?.mode === MODE.exhibitor ?
                <Exhibitor />
                : user?.mode === MODE.admin ?
                    <Admin />
                    : <Login />
        )
    }
}
export const getStaticProps = wrapper.getStaticProps(async ({ store }) => {
    //call all data for SSR 
    store.dispatch({ type: types.GET_SETTING }); 
    store.dispatch(END)
    await store.sagaTask.toPromise()
});

export default connect(({ admin: { user, exUser } }) => ({ user, exUser }))(Dashboard);