import React, { Component } from 'react';
import { connect } from 'react-redux';
import types from '../../redux/types';
import Header from './Header';
import SideBar from './SideBar';
import Visitor from './Visitor';
import Exhibitor from './Exhibitor';
import Overview from './Overview';
import Industry from './Industry';


class Admin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            active: 0
        }
    }
    handleToggle = () => this.setState({ toggle: !this.state.toggle })
    handleActive = (index) => this.setState({ active: index })

    render() {
        const { toggle, active } = this.state;
        return (
            <div className={"wrapper " + (toggle ? "skin-purple sidebar-mini sidebar-collapse" : "skin-purple sidebar-mini")}>
                <Header handleToggle={this.handleToggle} toggle={toggle} />
                <SideBar handleActive={this.handleActive} active={active} />
                <div className="content-wrapper" style={{ minHeight: '100vh' }}>
                    <Overview active={active === 0} />
                    <Exhibitor active={active === 1} />
                    <Visitor active={active === 2} />
                    <Industry active={active === 3} />
                </div>
                <footer className="main-footer">
                </footer>
                <aside className="control-sidebar control-sidebar-dark">
                    <ul className="nav nav-tabs nav-justified control-sidebar-tabs">
                        <li className="active">
                            <a href="/admin/vendor/shop#control-sidebar-home-tab" data-toggle="tab">
                                <i className="fa fa-home" />
                            </a>
                        </li>
                        <li>
                            <a href="/admin/vendor/shop#control-sidebar-settings-tab" data-toggle="tab">
                                <i className="fa fa-gears" />
                            </a>
                        </li>
                    </ul>
                    <div className="tab-content">
                        <div className="tab-pane active" id="control-sidebar-home-tab">
                            <h3 className="control-sidebar-heading">Recent Activity</h3>
                            <ul className="control-sidebar-menu">
                                <li>
                                    <a href="#">
                                        <i className="menu-icon fa fa-birthday-cake bg-red" />
                                        <div className="menu-info">
                                            <h4 className="control-sidebar-subheading">Langdon's Birthday</h4>
                                            <p>Will be 23 on April 24th</p>
                                        </div>
                                    </a>
                                </li>
                            </ul>
                            <h3 className="control-sidebar-heading">Tasks Progress</h3>
                            <ul className="control-sidebar-menu">
                                <li>
                                    <a href="#">
                                        <h4 className="control-sidebar-subheading">
                                            Custom Template Design
                                            <span className="label label-danger pull-right">70%</span>
                                        </h4>
                                        <div className="progress progress-xxs">
                                            <div className="progress-bar progress-bar-danger" style={{ width: '70%' }} />
                                        </div>
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div className="tab-pane" id="control-sidebar-stats-tab">Stats Tab Content</div>
                        <div className="tab-pane" id="control-sidebar-settings-tab">
                            <form method="post">
                                <h3 className="control-sidebar-heading">General Settings</h3>
                                <div className="form-group">
                                    <label className="control-sidebar-subheading">
                                        Report panel usage
                                        <input type="checkbox" className="pull-right" defaultChecked />
                                    </label>
                                    <p>
                                        Some information about this general settings option
                                    </p>
                                </div>
                            </form>
                        </div>
                    </div>
                </aside>
                <div className="control-sidebar-bg" style={{ position: 'fixed', height: 'auto' }} />
            </div>
        )
    }
}

export default connect(({ }) => ({}))(Admin);