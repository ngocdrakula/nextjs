import React, { Component } from 'react'
import { connect } from 'react-redux';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import types from '../../../redux/types';
import { formatTime } from '../../../utils/helper';

const pageSize = 10;
const numMonth = 4;
const numDate = 3;

class Overview extends Component {
    constructor(props) {
        super(props);
        this.state = {
            labels: []
        }
    }
    componentDidMount() {
        const { dispatch } = this.props;
        const counts = [];
        const labels = [];
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();
        const date = now.getDate();

        const lastYear = formatTime(new Date(year - 1, 1, 1), "YYYY-01-01");
        const thisYear = formatTime(now, "YYYY-01-01");
        counts.push(`${lastYear}.${thisYear}`);
        labels.push(`Năm ${year - 1}`);
        const nextYear = formatTime(new Date(year + 1, 1, 1), "YYYY-01-01");
        counts.push(`${thisYear}.${nextYear}`);
        labels.push(`Năm ${year}`);

        new Array(month).fill(0).map((item, index) => {
            if (index > month - numMonth - 1) {
                const thisMonth = formatTime(new Date(year, index + 2), "YYYY-MM-01");
                const lastMonth = formatTime(new Date(year, index + 1), "YYYY-MM-01");
                counts.push(`${lastMonth}.${thisMonth}`);
                labels.push(`Tháng ${index + 2}`);
            }
        });
        new Array(3).fill(0).map((item, index) => {
            const thisDay = formatTime(new Date(year, month, date + index - numDate + 2), "YYYY-MM-DD");
            const lastDay = formatTime(new Date(year, month, date + index - numDate + 1), "YYYY-MM-DD");
            counts.push(`${lastDay}.${thisDay}`);
            labels.push(formatTime(new Date(year, month, date + index - numDate + 1), "Week"));
        });
        labels[labels.length - 1] = "Hôm nay";
        this.setState({ counts, labels });
        dispatch({
            type: types.ADMIN_GET_VISITS,
            payload: { page: 0, pageSize, counts: counts.join(',') }
        });
    }

    handleLogout = e => {
        e.preventDefault();
        const { dispatch } = this.props;
        dispatch({ type: types.ADMIN_LOGOUT });
    }
    handleToggleMail = () => this.setState({ toggleMail: !this.state.toggleMail })
    handleToggleNoti = () => this.setState({ toggleNoti: !this.state.toggleNoti })
    handleToggleUser = () => this.setState({ toggleUser: !this.state.toggleUser })


    render() {
        const { active, totalExhibitor, exhibitorNew, totalVisitor, visitorNew, countList } = this.props;
        const { labels } = this.state;
        if (!active) return null;
        const views = [];
        const hits = [];
        countList.map(c => {
            views.push(c.visit.view);
            hits.push(c.visit.hit);
        })
        const todayView = views[views.length - 1] || 0;
        const yesterdayView = views[views.length - 2];
        const rate = (todayView - yesterdayView) / (yesterdayView || 1) || 0;
        const percent = Math.abs(Math.floor(rate * 100));
        console.log(rate)

        const options = {
            chart: { type: 'areaspline' },
            title: { text: '' },
            legend: {
                layout: 'vertical',
                align: 'left',
                verticalAlign: 'top',
                x: 50,
                y: 40,
                floating: true,
                backgroundColor: '#FFFFFF'
            },
            xAxis: { categories: labels },
            yAxis: { title: { text: 'Lượt truy cập' } },
            tooltip: { shared: true, valueSuffix: ' lượt ' },
            credits: { enabled: false },
            plotOptions: { areaspline: { fillOpacity: 0.5 } },
            series: [{
                name: 'Lượt xem trang',
                data: views
            }, {
                name: 'Lượt tải trang',
                data: hits
            }]
        };
        return (
            <section className="content" >
                <div className="row">
                    <div className="col-md-4 col-sm-6 col-xs-12 nopadding-right">
                        <div className="info-box">
                            <span className="info-box-icon bg-yellow"><i className="icon ion-md-people" /></span>
                            <div className="info-box-content">
                                <span className="info-box-text">Khách thăm quan</span>
                                <span className="info-box-number">{totalVisitor}</span>
                                <div className="progress" style={{ background: 'transparent' }} />
                                <span className="progress-description text-muted">
                                    <i className="icon ion-md-add" /> {visitorNew} Khách thăm quan trong 30 ngày
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4 col-sm-6 col-xs-12 nopadding-right nopadding-left">
                        <div className="info-box">
                            <span className="info-box-icon bg-aqua"><i className="icon ion-md-contacts" /></span>
                            <div className="info-box-content">
                                <span className="info-box-text">Nhà trưng bày</span>
                                <span className="info-box-number">{totalExhibitor}</span>
                                <div className="progress" style={{ background: 'transparent' }} />
                                <span className="progress-description text-muted">
                                    <i className="icon ion-md-add" /> {exhibitorNew} Nhà trưng bày trong 30 ngày
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="clearfix visible-sm-block" />
                    <div className="col-md-4 col-sm-6 col-xs-12 nopadding-left">
                        <div className="info-box">
                            <span className="info-box-icon bg-red">
                                <i className="icon ion-md-heart" />
                            </span>
                            <div className="info-box-content">
                                <span className="info-box-text">Truy cập hôm nay</span>
                                <span className="info-box-number">{todayView}</span>
                                <div className="progress">
                                    <div className="progress-bar progress-bar-info" style={{ width: `${percent}%` }} />
                                </div>
                                <span className="progress-description text-muted">
                                    <i className={"icon ion-md-arrow-" + (rate >= 0 ? "up" : "down")} />
                                    {rate >= 0 ? "  Tăng" : " Giảm"} {percent}% so với hôm qua
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12 col-sm-12 col-xs-12">
                        <div className="box">
                            <div className="nav-tabs-custom">
                                <ul className="nav nav-tabs nav-justified">
                                    <li className="active">
                                        <a><i className="icon ion-md-pulse hidden-sm" />  Biểu đồ khách</a>
                                    </li>
                                </ul>
                                <div className="tab-content">
                                    <div className="tab-pane active" id="visitors_tab">
                                        <div>
                                            <HighchartsReact highcharts={Highcharts} options={options} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section >
        )
    }
}

const mStP = ({ admin: { exhibitor, visitor, countList } }) => {
    return ({
        totalExhibitor: exhibitor.total,
        exhibitorNew: exhibitor.totalNew,
        totalVisitor: visitor.total,
        visitorNew: visitor.totalNew,
        countList
    })
}

export default connect(mStP)(Overview)
