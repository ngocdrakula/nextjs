import React, { Component } from 'react';
import { connect } from 'react-redux'
import types from '../../redux/types'
import { formatTime } from '../../utils/helper';
import Pagination from '../pagination/Pagination'; 
import { translate } from '../../utils/language';
import langConfig, { langConcat } from '../../lang.config';


const pageSize = 10;

class ProfileTrade extends Component {
    constructor(props) {
        super(props);
        this.state = {
            trades: [],
            currentPage: 0,
            pageSize: 0
        };
    }
    componentDidMount() {
        this.gotoPage();
    }
    gotoPage = (page = 0) => {
        const { dispatch } = this.props;
        dispatch({
            type: types.GET_TRADES,
            payload: { pageSize, page },
            callback: res => {
                if (res?.success) {
                    const { data, page, total } = res;
                    this.setState({
                        trades: data,
                        currentPage: page,
                        total,
                        loaded: true
                    })
                }
            }
        });
    }

    handleDelete = (_id) => {
        const { dispatch } = this.props;
        dispatch({
            type: types.DELETE_TRADE,
            payload: _id,
            callback: res => {
                if (res?.success) {
                    const { page } = this.state;
                    this.gotoPage(page);
                }
            }
        });
    }
    render() {
        const { active, user } = this.props;
        const { trades, currentPage, total, loaded } = this.state;
        return (
            <div className="profile-trade" style={{ display: active ? 'block' : 'none' }}>
                <div className="profile-trade-header">
                    <h3 className="profile-trade-title">Lịch Giao Thương</h3>
                </div>
                <div className="profile-trade-body">
                    <table id="example2" className="table table-bordered table-hover dataTable no-footer">
                        <thead>
                            <tr>
                                <th className="text-center" style={{ width: '25%' }}>{translate(langConfig.app.PartnerName)}</th>
                                <th className="text-center" style={{ width: '20%' }}>{translate(langConfig.app.Time)}</th>
                                <th className="text-center" style={{ width: '20%' }}>{translate(langConfig.app.Content)}</th>
                                <th className="text-center" style={{ width: '20%' }}>{translate(langConfig.app.RegisterDate)}</th>
                                <th className="text-center" style={{ width: '15%' }}>{translate(langConfig.app.Action)}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {trades.map(trade => {
                                const to = trade.leader._id === user._id ? trade.member : trade.leader;
                                const tradeTime = formatTime(trade.deadline, "YYYY-MM-DD HH:II:SS");
                                const createTime = formatTime(trade.createdAt, "YYYY-MM-DD HH:II:SS")
                                return (
                                    <tr key={trade._id}>
                                        <td>{to.name} - {to.email}</td>
                                        <td>{tradeTime}</td>
                                        <td>{trade.content}</td>
                                        <td>{createTime}</td>
                                        <td>
                                            <div className="trade-action">
                                                <span className="btnActionEdit" title={translate(langConfig.app.Delete)} onClick={() => this.handleDelete(trade._id)}>
                                                    {translate(langConfig.app.Delete)}
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    {!trades.length && loaded ? <h4>{translate(langConfig.app.ListEmpty)}</h4> : ""}
                    <Pagination gotoPage={this.gotoPage} {...{ currentPage, pageSize, total }} />
                </div>
            </div>

        )
    }
}

export default connect(({ app: { user } }) => ({ user }))(ProfileTrade)

