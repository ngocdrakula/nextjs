import React, { Component } from 'react';
import dynamic from 'next/dynamic';
import { connect } from 'react-redux'
import { END } from 'redux-saga'
import { wrapper } from '../../redux/store';
import types from '../../redux/types'

const Head = dynamic(() => import('../../components/Head'));
const Logo = dynamic(() => import('../../components/Logo'));
const BottomPanel = dynamic(() => import('../../components/BottomPanel'));
const CanvasContainer = dynamic(() => import('../../components/CanvasContainer'));
const TopPanel = dynamic(() => import('../../components/TopPanel'));
const Progress = dynamic(() => import('../../components/Progress'));


class Room2d extends Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({ type: types.GET_PRODUCTS, payload: { enabled: true } });
    }

    render() {
        return (
            <div className="modal-open">
                <Head />
                <Progress />
                <CanvasContainer />
                <Logo />
                <TopPanel />
                <BottomPanel />
            </div>
        );
    }
}

export const getStaticProps = wrapper.getStaticProps(async ({ store, params }) => {
    //call all data for SSR
    store.dispatch({ type: types.GET_FRONTS, payload: { page: 0, pageSize: 0, enabled: true } });
    store.dispatch({ type: types.GET_SIZES, payload: { page: 0, pageSize: 0, enabled: true } });
    store.dispatch({ type: types.GET_ROOMS, payload: { page: 0, pageSize: 0, enabled: true } });
    store.dispatch({ type: types.GET_LAYOUTS, payload: { page: 0, pageSize: 0, enabled: true, _id: params?._id } });

    store.dispatch(END)
    await store.sagaTask.toPromise();
});

export const getStaticPaths = async () => {
    return { paths: [], fallback: true }
}


export default connect(() => ({}))(Room2d)