import React, { Component } from 'react'
import { connect } from 'react-redux';
import types from '../../redux/types';
import Pagination from '../Pagination';

const pageSize = 6;

class Livestream extends Component {
    constructor(props) {
        super(props);
        this.state = {
            livestreams: [],
            currentPage: 0,
            total: 0
        }
    }
    componentDidMount() {
        this.gotoPage();
    }
    gotoPage = (page = 0) => {
        const { exhibitor, dispatch } = this.props;
        if (exhibitor?._id) {
            dispatch({
                type: types.GET_LIVESTREAM,
                payload: { page, pageSize, author: exhibitor._id, enabled: true },
                callback: res => {
                    if (res?.success) {
                        const { data, total } = res;
                        this.setState({
                            currentPage: page,
                            livestreams: data,
                            total
                        })
                    }
                }
            });
        };
    }
    render() {
        const { active } = this.props;
        const { currentPage, total, livestreams } = this.state;
        const firstLive = livestreams[0];

        return (
            <div className="livestream-content bg-body" style={{ display: active ? 'block' : 'none' }}>
                <div className="container">
                    {firstLive ?
                        <div className="livestream-head">
                            <div className="livestream-video" dangerouslySetInnerHTML={{
                                __html:
                                    `<iframe
                                        src="${firstLive.link}"
                                        width="100%"
                                        height="600"
                                        style="border:none;overflow:hidden"
                                        scrolling="no"
                                        frameborder="0"
                                        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                                        allowfullScreen={true}
                                    ></iframe>`
                            }} />
                            <div className="row">
                                <div className="col-lg-12">
                                    <p className="ft-semibold">{firstLive.description}</p>
                                </div>
                            </div>
                        </div>
                        : ""}
                    <div className="livestream-list">
                        <div className="row">
                            {livestreams.map(livestream => {
                                return (
                                    <div key={livestream._id} className="col-sm-6">
                                        <div className="livestream-item">
                                            <div className="row">
                                                <div className="col-lg-5">
                                                    <div className="livestream-video" dangerouslySetInnerHTML={{
                                                        __html:
                                                            `<iframe
                                                                src="${livestream.link}"
                                                                width="100%"
                                                                height="150"
                                                                style="border:none;overflow:hidden"
                                                                scrolling="no"
                                                                frameborder="0"
                                                                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                                                                allowfullScreen={true}
                                                            ></iframe>`
                                                    }} />
                                                </div>
                                                <div className="col-lg-7">
                                                    <h6>{livestream.title}</h6>
                                                    <p>{livestream.description}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            {!livestreams.length ? <h5>Danh sách livestream trống</h5> : ""}
                        </div>
                        <Pagination gotoPage={this.gotoPage} {...{ currentPage, pageSize, total }} />
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(({ }) => ({}))(Livestream)
