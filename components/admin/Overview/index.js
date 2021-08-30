import React, { Component } from 'react'
import { connect } from 'react-redux';
import types from '../../../redux/types';

class Overview extends Component {
    constructor(props) {
        super(props);
        this.state = {}
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
        const { toggleMail, toggleNoti, toggleUser } = this.state;
        const { active } = this.props;
        if (!active) return null;
        return (
            <section className="content">
                <div className="row">
                    <div className="col-md-4 col-sm-6 col-xs-12 nopadding-right">
                        <div className="info-box">
                            <span className="info-box-icon bg-yellow"><i className="icon ion-md-people" /></span>
                            <div className="info-box-content">
                                <span className="info-box-text">VISITOR</span>
                                <span className="info-box-number">
                                    54
                                    <a href="https://online.vietnam-autoexpo.com/admin/admin/customer" className="pull-right small" data-toggle="tooltip" data-placement="left" title="Detail">
                                        <i className="icon ion-md-send" />
                                    </a>
                                </span>
                                <div className="progress" style={{ background: 'transparent' }} />
                                <span className="progress-description text-muted">
                                    <i className="icon ion-md-add" />
                                    4 Visitors in 30 days
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4 col-sm-6 col-xs-12 nopadding-right nopadding-left">
                        <div className="info-box">
                            <span className="info-box-icon bg-aqua"><i className="icon ion-md-contacts" /></span>
                            <div className="info-box-content">
                                <span className="info-box-text">EXHIBITOR</span>
                                <span className="info-box-number">
                                    5
                                    <a href="https://online.vietnam-autoexpo.com/admin/vendor/merchant" className="pull-right small" data-toggle="tooltip" data-placement="left" title="Detail">
                                        <i className="icon ion-md-send" />
                                    </a>
                                </span>
                                <div className="progress" style={{ background: 'transparent' }} />
                                <span className="progress-description text-muted">
                                    <i className="icon ion-md-add" />
                                    0 Exhibitors in 30 days
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
                                <span className="info-box-text">Visitors today</span>
                                <span className="info-box-number">
                                    8
                                    <a href="https://online.vietnam-autoexpo.com/admin/report/visitors" className="pull-right small" data-toggle="tooltip" data-placement="left" title="Detail">
                                        <i className="icon ion-md-send" />
                                    </a>
                                </span>
                                <div className="progress">
                                    <div className="progress-bar progress-bar-info" style={{ width: '82%' }} />
                                </div>
                                <span className="progress-description text-muted">
                                    <i className="icon ion-md-arrow-up" />
                                    82% Increase in 30 days
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
                                    <li className="active"><a href="#visitors_tab" data-toggle="tab">
                                        <i className="icon ion-md-pulse hidden-sm" />
                                        Visitors graph
                                    </a></li>
                                </ul>
                                <div className="tab-content">
                                    <div className="tab-pane active" id="visitors_tab">
                                        <div><div id="uhgtvodaelysxqpwjnbzfckir" style={{ height: '300px !important', overflow: 'hidden' }} data-highcharts-chart={0}><div id="highcharts-f1x3sp5-0" dir="ltr" className="highcharts-container " style={{ position: 'relative', overflow: 'hidden', width: 775, height: 300, textAlign: 'left', lineHeight: 'normal', zIndex: 0, WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)' }}><svg version="1.1" className="highcharts-root" style={{ fontFamily: '"Lucida Grande", "Lucida Sans Unicode", Arial, Helvetica, sans-serif', fontSize: 12 }} xmlns="http://www.w3.org/2000/svg" width={775} height={300} viewBox="0 0 775 300"><desc>Created with Highcharts 8.1.0</desc><defs><clipPath id="highcharts-f1x3sp5-1-"><rect x={0} y={0} width={719} height={220} fill="none" /></clipPath></defs><rect fill="#ffffff" className="highcharts-background" x={0} y={0} width={775} height={300} rx={0} ry={0} /><rect fill="none" className="highcharts-plot-background" x={46} y={43} width={719} height={220} /><g className="highcharts-grid highcharts-xaxis-grid" data-z-index={1}><path fill="none" data-z-index={1} className="highcharts-grid-line" d="M 125.5 43 L 125.5 263" opacity={1} /><path fill="none" data-z-index={1} className="highcharts-grid-line" d="M 205.5 43 L 205.5 263" opacity={1} /><path fill="none" data-z-index={1} className="highcharts-grid-line" d="M 285.5 43 L 285.5 263" opacity={1} /><path fill="none" data-z-index={1} className="highcharts-grid-line" d="M 365.5 43 L 365.5 263" opacity={1} /><path fill="none" data-z-index={1} className="highcharts-grid-line" d="M 444.5 43 L 444.5 263" opacity={1} /><path fill="none" data-z-index={1} className="highcharts-grid-line" d="M 524.5 43 L 524.5 263" opacity={1} /><path fill="none" data-z-index={1} className="highcharts-grid-line" d="M 604.5 43 L 604.5 263" opacity={1} /><path fill="none" data-z-index={1} className="highcharts-grid-line" d="M 684.5 43 L 684.5 263" opacity={1} /><path fill="none" data-z-index={1} className="highcharts-grid-line" d="M 764.5 43 L 764.5 263" opacity={1} /><path fill="none" data-z-index={1} className="highcharts-grid-line" d="M 45.5 43 L 45.5 263" opacity={1} /></g><g className="highcharts-grid highcharts-yaxis-grid" data-z-index={1}><path fill="none" stroke="#e6e6e6" strokeWidth={1} data-z-index={1} className="highcharts-grid-line" d="M 46 263.5 L 765 263.5" opacity={1} /><path fill="none" stroke="#e6e6e6" strokeWidth={1} data-z-index={1} className="highcharts-grid-line" d="M 46 208.5 L 765 208.5" opacity={1} /><path fill="none" stroke="#e6e6e6" strokeWidth={1} data-z-index={1} className="highcharts-grid-line" d="M 46 153.5 L 765 153.5" opacity={1} /><path fill="none" stroke="#e6e6e6" strokeWidth={1} data-z-index={1} className="highcharts-grid-line" d="M 46 98.5 L 765 98.5" opacity={1} /><path fill="none" stroke="#e6e6e6" strokeWidth={1} data-z-index={1} className="highcharts-grid-line" d="M 46 42.5 L 765 42.5" opacity={1} /></g><rect fill="none" className="highcharts-plot-border" data-z-index={1} x={46} y={43} width={719} height={220} /><g className="highcharts-axis highcharts-xaxis" data-z-index={2}><path fill="none" className="highcharts-axis-line" stroke="#ccd6eb" strokeWidth={1} data-z-index={7} d="M 46 263.5 L 765 263.5" /></g><g className="highcharts-axis highcharts-yaxis" data-z-index={2}><path fill="none" className="highcharts-axis-line" data-z-index={7} d="M 46 43 L 46 263" /></g><g className="highcharts-series-group" data-z-index={3}><g data-z-index="0.1" className="highcharts-series highcharts-series-0 highcharts-areaspline-series highcharts-color-0" transform="translate(46,43) scale(1 1)" clipPath="url(#highcharts-f1x3sp5-1-)"><path fill="rgba(124,181,236,0.75)" d="M 39.944444444444 220 C 39.944444444444 220 87.8777777777756 218.32579999999984 119.83333333333 212.641 C 151.788888888886 206.95619999999985 167.766666666664 205.41400000000002 199.72222222222 191.576 C 231.67777777777602 177.738 247.65555555555403 176.82940000000002 279.61111111111 143.45100000000002 C 311.56666666666604 110.0726 327.54444444444397 24.683999999999997 359.5 24.683999999999997 C 391.45555555555603 24.683999999999997 407.43333333333396 164.56 439.38888888889 191.4 C 471.34444444444597 218.24 487.322222222224 217.91000000000003 519.27777777778 218.24 C 551.233333333336 218.57 567.2111111111141 218.57 599.16666666667 218.57 C 631.122222222226 218.57 679.05555555556 218.053 679.05555555556 218.053 L 679.05555555556 220 C 679.05555555556 220 631.122222222226 220 599.16666666667 220 C 567.2111111111141 220 551.233333333336 220 519.27777777778 220 C 487.322222222224 220 471.34444444444597 220 439.38888888889 220 C 407.43333333333396 220 391.45555555555603 220 359.5 220 C 327.54444444444397 220 311.56666666666604 220 279.61111111111 220 C 247.65555555555403 220 231.67777777777602 220 199.72222222222 220 C 167.766666666664 220 151.788888888886 220 119.83333333333 220 C 87.8777777777756 220 39.944444444444 220 39.944444444444 220" className="highcharts-area" data-z-index={0} /><path fill="none" d="M 39.944444444444 220 C 39.944444444444 220 87.8777777777756 218.32579999999984 119.83333333333 212.641 C 151.788888888886 206.95619999999985 167.766666666664 205.41400000000002 199.72222222222 191.576 C 231.67777777777602 177.738 247.65555555555403 176.82940000000002 279.61111111111 143.45100000000002 C 311.56666666666604 110.0726 327.54444444444397 24.683999999999997 359.5 24.683999999999997 C 391.45555555555603 24.683999999999997 407.43333333333396 164.56 439.38888888889 191.4 C 471.34444444444597 218.24 487.322222222224 217.91000000000003 519.27777777778 218.24 C 551.233333333336 218.57 567.2111111111141 218.57 599.16666666667 218.57 C 631.122222222226 218.57 679.05555555556 218.053 679.05555555556 218.053" className="highcharts-graph" data-z-index={1} stroke="#7cb5ec" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" /><path fill="none" d="M 39.944444444444 220 C 39.944444444444 220 87.8777777777756 218.32579999999984 119.83333333333 212.641 C 151.788888888886 206.95619999999985 167.766666666664 205.41400000000002 199.72222222222 191.576 C 231.67777777777602 177.738 247.65555555555403 176.82940000000002 279.61111111111 143.45100000000002 C 311.56666666666604 110.0726 327.54444444444397 24.683999999999997 359.5 24.683999999999997 C 391.45555555555603 24.683999999999997 407.43333333333396 164.56 439.38888888889 191.4 C 471.34444444444597 218.24 487.322222222224 217.91000000000003 519.27777777778 218.24 C 551.233333333336 218.57 567.2111111111141 218.57 599.16666666667 218.57 C 631.122222222226 218.57 679.05555555556 218.053 679.05555555556 218.053" visibility="visible" data-z-index={2} className="highcharts-tracker-line" strokeLinecap="round" strokeLinejoin="round" stroke="rgba(192,192,192,0.0001)" strokeWidth={22} /></g><g data-z-index="0.1" className="highcharts-markers highcharts-series-0 highcharts-areaspline-series highcharts-color-0 highcharts-tracker" transform="translate(46,43) scale(1 1)"><path fill="#7cb5ec" visibility="hidden" d="M 39 220 A 0 0 0 1 1 39 220 Z" className="highcharts-halo highcharts-color-0" data-z-index={-1} fillOpacity="0.25" /><path fill="#7cb5ec" d="M 39 226 A 6 6 0 1 1 39.005999999000004 225.99999700000026 Z" stroke="#ffffff" strokeWidth={1} opacity={1} visibility="hidden" /></g><g data-z-index="0.1" className="highcharts-series highcharts-series-1 highcharts-areaspline-series highcharts-color-1" transform="translate(46,43) scale(1 1)" clipPath="url(#highcharts-f1x3sp5-1-)" opacity={1}><path fill="rgba(67,67,72,0.75)" d="M 39.944444444444 220 C 39.944444444444 220 87.8777777777756 220 119.83333333333 219.483 C 151.788888888886 218.966 167.766666666664 215.73640000000003 199.72222222222 213.257 C 231.67777777777602 210.7776 247.65555555555403 207.086 279.61111111111 207.086 C 311.56666666666604 207.086 327.54444444444397 207.46 359.5 207.46 C 391.45555555555603 207.46 407.43333333333396 201.63 439.38888888889 201.63 C 471.34444444444597 201.63 487.322222222224 218.548 519.27777777778 218.713 C 551.233333333336 218.878 567.2111111111141 218.713 599.16666666667 218.878 C 631.122222222226 219.04299999999998 679.05555555556 219.659 679.05555555556 219.659 L 679.05555555556 220 C 679.05555555556 220 631.122222222226 220 599.16666666667 220 C 567.2111111111141 220 551.233333333336 220 519.27777777778 220 C 487.322222222224 220 471.34444444444597 220 439.38888888889 220 C 407.43333333333396 220 391.45555555555603 220 359.5 220 C 327.54444444444397 220 311.56666666666604 220 279.61111111111 220 C 247.65555555555403 220 231.67777777777602 220 199.72222222222 220 C 167.766666666664 220 151.788888888886 220 119.83333333333 220 C 87.8777777777756 220 39.944444444444 220 39.944444444444 220" className="highcharts-area" data-z-index={0} /><path fill="none" d="M 39.944444444444 220 C 39.944444444444 220 87.8777777777756 220 119.83333333333 219.483 C 151.788888888886 218.966 167.766666666664 215.73640000000003 199.72222222222 213.257 C 231.67777777777602 210.7776 247.65555555555403 207.086 279.61111111111 207.086 C 311.56666666666604 207.086 327.54444444444397 207.46 359.5 207.46 C 391.45555555555603 207.46 407.43333333333396 201.63 439.38888888889 201.63 C 471.34444444444597 201.63 487.322222222224 218.548 519.27777777778 218.713 C 551.233333333336 218.878 567.2111111111141 218.713 599.16666666667 218.878 C 631.122222222226 219.04299999999998 679.05555555556 219.659 679.05555555556 219.659" className="highcharts-graph" data-z-index={1} stroke="#434348" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" /><path fill="none" d="M 39.944444444444 220 C 39.944444444444 220 87.8777777777756 220 119.83333333333 219.483 C 151.788888888886 218.966 167.766666666664 215.73640000000003 199.72222222222 213.257 C 231.67777777777602 210.7776 247.65555555555403 207.086 279.61111111111 207.086 C 311.56666666666604 207.086 327.54444444444397 207.46 359.5 207.46 C 391.45555555555603 207.46 407.43333333333396 201.63 439.38888888889 201.63 C 471.34444444444597 201.63 487.322222222224 218.548 519.27777777778 218.713 C 551.233333333336 218.878 567.2111111111141 218.713 599.16666666667 218.878 C 631.122222222226 219.04299999999998 679.05555555556 219.659 679.05555555556 219.659" visibility="visible" data-z-index={2} className="highcharts-tracker-line" strokeLinecap="round" strokeLinejoin="round" stroke="rgba(192,192,192,0.0001)" strokeWidth={22} /></g><g data-z-index="0.1" className="highcharts-markers highcharts-series-1 highcharts-areaspline-series highcharts-color-1 highcharts-tracker" transform="translate(46,43) scale(1 1)" opacity={1}><path fill="#434348" visibility="hidden" d="M 39 220 A 0 0 0 1 1 39 220 Z" className="highcharts-halo highcharts-color-1" data-z-index={-1} fillOpacity="0.25" /><path fill="#434348" d="M 39 214 L 45 220 L 39 226 L 33 220 Z" stroke="#ffffff" strokeWidth={1} opacity={1} visibility="hidden" /></g></g><g className="highcharts-exporting-group" data-z-index={3}><g className="highcharts-button highcharts-contextbutton" strokeLinecap="round" transform="translate(741,10)"><rect fill="#ffffff" className="highcharts-button-box" x="0.5" y="0.5" width={24} height={22} rx={2} ry={2} stroke="none" strokeWidth={1} /><title>Chart context menu</title><path fill="#666666" d="M 6 6.5 L 20 6.5 M 6 11.5 L 20 11.5 M 6 16.5 L 20 16.5" className="highcharts-button-symbol" data-z-index={1} stroke="#666666" strokeWidth={3} /><text x={0} data-z-index={1} style={{ color: '#333333', cursor: 'pointer', fontWeight: 'normal', fill: '#333333' }} y={12} /></g></g><text x={388} textAnchor="middle" className="highcharts-title" data-z-index={4} style={{ color: '#333333', fontSize: 18, fill: '#333333' }} y={24} /><text x={388} textAnchor="middle" className="highcharts-subtitle" data-z-index={4} style={{ color: '#666666', fill: '#666666' }} y={24}><tspan>27 Unique visitors per day.</tspan></text><text x={10} textAnchor="start" className="highcharts-caption" data-z-index={4} style={{ color: '#666666', fill: '#666666' }} y={297} /><g className="highcharts-legend" data-z-index={7} transform="translate(50,40)"><rect fill="#FFFFFF" className="highcharts-legend-box" rx={0} ry={0} x={0} y={0} width={114} height={47} visibility="visible" /><g data-z-index={1}><g><g className="highcharts-legend-item highcharts-areaspline-series highcharts-color-0 highcharts-series-0" data-z-index={1} transform="translate(8,3)"><text x={21} style={{ color: '#333333', cursor: 'pointer', fontSize: 12, fontWeight: 'bold', fill: '#333333' }} textAnchor="start" data-z-index={2} y={15}><tspan>Page views</tspan></text><rect x={2} y={4} width={12} height={12} fill="#7cb5ec" rx={6} ry={6} className="highcharts-point" data-z-index={3} /></g><g className="highcharts-legend-item highcharts-areaspline-series highcharts-color-1 highcharts-series-1" data-z-index={1} transform="translate(8,21)"><text x={21} y={15} style={{ color: '#333333', cursor: 'pointer', fontSize: 12, fontWeight: 'bold', fill: '#333333' }} textAnchor="start" data-z-index={2}><tspan>Unique visits</tspan></text><rect x={2} y={4} width={12} height={12} fill="#434348" rx={6} ry={6} className="highcharts-point" data-z-index={3} /></g></g></g></g><g className="highcharts-axis-labels highcharts-xaxis-labels" data-z-index={7}><text x="85.94444444444555" style={{ color: '#666666', cursor: 'default', fontSize: 11, fill: '#666666' }} textAnchor="middle" transform="translate(0,0)" y={282} opacity={1}>March</text><text x="165.83333333333553" style={{ color: '#666666', cursor: 'default', fontSize: 11, fill: '#666666' }} textAnchor="middle" transform="translate(0,0)" y={282} opacity={1}>April</text><text x="245.72222222222553" style={{ color: '#666666', cursor: 'default', fontSize: 11, fill: '#666666' }} textAnchor="middle" transform="translate(0,0)" y={282} opacity={1}>May</text><text x="325.6111111111155" style={{ color: '#666666', cursor: 'default', fontSize: 11, fill: '#666666' }} textAnchor="middle" transform="translate(0,0)" y={282} opacity={1}>June</text><text x="405.49999999999557" style={{ color: '#666666', cursor: 'default', fontSize: 11, fill: '#666666' }} textAnchor="middle" transform="translate(0,0)" y={282} opacity={1}>July</text><text x="485.3888888888855" style={{ color: '#666666', cursor: 'default', fontSize: 11, fill: '#666666' }} textAnchor="middle" transform="translate(0,0)" y={282} opacity={1}><tspan>This month</tspan></text><text x="565.2777777777756" style={{ color: '#666666', cursor: 'default', fontSize: 11, fill: '#666666' }} textAnchor="middle" transform="translate(0,0)" y={282} opacity={1}>Friday</text><text x="645.1666666666655" style={{ color: '#666666', cursor: 'default', fontSize: 11, fill: '#666666' }} textAnchor="middle" transform="translate(0,0)" y={282} opacity={1}>Saturday</text><text x="725.0555555555555" style={{ color: '#666666', cursor: 'default', fontSize: 11, fill: '#666666' }} textAnchor="middle" transform="translate(0,0)" y={282} opacity={1}>Today</text></g><g className="highcharts-axis-labels highcharts-yaxis-labels" data-z-index={7}><text x={31} style={{ color: '#666666', cursor: 'default', fontSize: 11, fill: '#666666' }} textAnchor="end" transform="translate(0,0)" y={267} opacity={1}>0</text><text x={31} style={{ color: '#666666', cursor: 'default', fontSize: 11, fill: '#666666' }} textAnchor="end" transform="translate(0,0)" y={212} opacity={1}>5k</text><text x={31} style={{ color: '#666666', cursor: 'default', fontSize: 11, fill: '#666666' }} textAnchor="end" transform="translate(0,0)" y={157} opacity={1}>10k</text><text x={31} style={{ color: '#666666', cursor: 'default', fontSize: 11, fill: '#666666' }} textAnchor="end" transform="translate(0,0)" y={102} opacity={1}>15k</text><text x={31} style={{ color: '#666666', cursor: 'default', fontSize: 11, fill: '#666666' }} textAnchor="end" transform="translate(0,0)" y={47} opacity={1}>20k</text></g><g className="highcharts-label highcharts-tooltip highcharts-color-0" style={{ whiteSpace: 'nowrap', pointerEvents: 'none' }} data-z-index={8} transform="translate(102,-9999)" opacity={0} visibility="hidden"><path fill="none" className="highcharts-label-box highcharts-tooltip-box highcharts-shadow" d="M 3.5 0.5 L 117.5 0.5 C 120.5 0.5 120.5 0.5 120.5 3.5 L 120.5 60.5 C 120.5 63.5 120.5 63.5 117.5 63.5 L 3.5 63.5 C 0.5 63.5 0.5 63.5 0.5 60.5 L 0.5 3.5 C 0.5 0.5 0.5 0.5 3.5 0.5" stroke="#000000" strokeOpacity="0.049999999999999996" strokeWidth={5} transform="translate(1, 1)" /><path fill="none" className="highcharts-label-box highcharts-tooltip-box highcharts-shadow" d="M 3.5 0.5 L 117.5 0.5 C 120.5 0.5 120.5 0.5 120.5 3.5 L 120.5 60.5 C 120.5 63.5 120.5 63.5 117.5 63.5 L 3.5 63.5 C 0.5 63.5 0.5 63.5 0.5 60.5 L 0.5 3.5 C 0.5 0.5 0.5 0.5 3.5 0.5" stroke="#000000" strokeOpacity="0.09999999999999999" strokeWidth={3} transform="translate(1, 1)" /><path fill="none" className="highcharts-label-box highcharts-tooltip-box highcharts-shadow" d="M 3.5 0.5 L 117.5 0.5 C 120.5 0.5 120.5 0.5 120.5 3.5 L 120.5 60.5 C 120.5 63.5 120.5 63.5 117.5 63.5 L 3.5 63.5 C 0.5 63.5 0.5 63.5 0.5 60.5 L 0.5 3.5 C 0.5 0.5 0.5 0.5 3.5 0.5" stroke="#000000" strokeOpacity="0.15" strokeWidth={1} transform="translate(1, 1)" /><path fill="rgba(247,247,247,0.85)" className="highcharts-label-box highcharts-tooltip-box" d="M 3.5 0.5 L 117.5 0.5 C 120.5 0.5 120.5 0.5 120.5 3.5 L 120.5 60.5 C 120.5 63.5 120.5 63.5 117.5 63.5 L 3.5 63.5 C 0.5 63.5 0.5 63.5 0.5 60.5 L 0.5 3.5 C 0.5 0.5 0.5 0.5 3.5 0.5" stroke="#7cb5ec" strokeWidth={1} /><text x={8} data-z-index={1} style={{ color: '#333333', cursor: 'default', fontSize: 12, fill: '#333333' }} y={20}><tspan style={{ fontSize: 10 }}>March</tspan><tspan style={{ fill: '#7cb5ec' }} x={8} dy={15}>●</tspan><tspan dx={0}> Page views: </tspan><tspan style={{ fontWeight: 'bold' }} dx={0}>0</tspan><tspan style={{ fill: '#434348' }} x={8} dy={15}>●</tspan><tspan dx={0}> Unique visits: </tspan><tspan style={{ fontWeight: 'bold' }} dx={0}>0</tspan></text></g></svg></div></div>
                                            <div id="uhgtvodaelysxqpwjnbzfckir_loader" style={{ display: 'none', justifyContent: 'center', opacity: 1, alignItems: 'center', height: 300 }}>
                                                <svg width={50} height={50} viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg">
                                                    <defs>
                                                        <linearGradient x1="8.042%" y1="0%" x2="65.682%" y2="23.865%" id="a">
                                                            <stop stopColor="#22292F" stopOpacity={0} offset="0%" />
                                                            <stop stopColor="#22292F" stopOpacity=".631" offset="63.146%" />
                                                            <stop stopColor="#22292F" offset="100%" />
                                                        </linearGradient>
                                                    </defs>
                                                    <g fill="none" fillRule="evenodd">
                                                        <g transform="translate(1 1)">
                                                            <path d="M36 18c0-9.94-8.06-18-18-18" id="Oval-2" stroke="url(#a)" strokeWidth={2}>
                                                                <animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="0.9s" repeatCount="indefinite" />
                                                            </path>
                                                            <circle fill="#22292F" cx={36} cy={18} r={1}>
                                                                <animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="0.9s" repeatCount="indefinite" />
                                                            </circle>
                                                        </g>
                                                    </g>
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4 col-sm-5 col-xs-12 nopadding-left">
                    </div>
                </div>
            </section>
        )
    }
}

export default connect(({ admin: { setting, user } }) => ({ setting, user }))(Overview)
