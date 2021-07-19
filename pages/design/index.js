import React, { Component } from 'react';
import dynamic from 'next/dynamic';
import { connect } from 'react-redux';
import { END } from 'redux-saga';
import Router from 'next/router';
import { wrapper } from '../../redux/store';
import types from '../../redux/types';
import DefaultErrorPage from 'next/error';
import { getQuery } from '../../utils/helper';

const Head = dynamic(() => import('../../components/Head'));
const Body = dynamic(() => import('../../components/Body'));
const Logo = dynamic(() => import('../../components/Logo'));
const BottomPanel = dynamic(() => import('../../components/BottomPanel'));
const CanvasContainer = dynamic(() => import('../../components/CanvasContainer'));
const TopPanel = dynamic(() => import('../../components/TopPanel'));
const Progress = dynamic(() => import('../../components/Progress'));
const Footer = dynamic(() => import('../../components/Footer'));


class Design extends Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({ type: types.GET_PRODUCTS, payload: { enabled: true } });
        dispatch({ type: types.USER_LOGIN_LOCAL });
        const query = getQuery(Router?.router?.asPath)
        dispatch({ type: types.USER_GET_DESIGN, payload: query.id });
    }

    render() {
        if (this.props.error) return (<DefaultErrorPage statusCode={404} />)
        return (
            <div className="modal-open">
                <Head />
                <Body />
                <Progress />
                <CanvasContainer />
                <Logo />
                <TopPanel />
                <BottomPanel />
                <Footer />
            </div>
        );
    }
}

export const getStaticProps = wrapper.getStaticProps(async ({ store, params }) => {
    //call all data for SSR
    store.dispatch({ type: types.ADMIN_GET_SETTING, });
    store.dispatch({ type: types.GET_FRONTS, payload: { page: 0, pageSize: 0, enabled: true } });
    store.dispatch({ type: types.GET_SIZES, payload: { page: 0, pageSize: 0, enabled: true } });
    store.dispatch({ type: types.GET_ROOMS, payload: { page: 0, pageSize: 0, enabled: true } });
    store.dispatch({ type: types.GET_LAYOUTS, payload: { page: 0, pageSize: 0, enabled: true } });

    store.dispatch(END)
    await store.sagaTask.toPromise();
});

export const getStaticPaths = async () => {
    return { paths: [], fallback: true }
}


export default connect(({ user: { error } }) => ({ error }))(Design)