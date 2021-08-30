import React, { Component } from 'react';
import { connect } from 'react-redux';
import AdminHead from '../../components/admin/AdminHead';
import Login from '../../components/admin/Login';
import types from '../../redux/types';
import { MODE } from '../../utils/helper';
import Header from '../../components/admin/Header';
import SideBar from '../../components/admin/SideBar';
import Exhibitor from '../../components/admin/Exhibitor';
import Visitor from '../../components/admin/Visitor';
import Overview from '../../components/admin/Overview';
import Tooltip from '../../components/admin/Tooltip';
import Industry from '../../components/admin/Industry';


class Admin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            active: 0
        }
    }
    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({ type: types.ADMIN_GET_SETTING });
        dispatch({ type: types.ADMIN_LOGIN_LOCAL });
        dispatch({ type: types.ADMIN_GET_INDUSTRIES });
    }

    mobileSidebarToggle = (e) => {
        e.preventDefault();
        document.documentElement.classList.toggle("nav-open");
        var node = document.createElement("div");
        node.id = "bodyClick";
        node.onclick = function () {
            this.parentElement.removeChild(this);
            document.documentElement.classList.toggle("nav-open");
        };
        document.body.appendChild(node);
    };
    handleLogout = () => {
        const { dispatch } = this.props;
        dispatch({ type: types.ADMIN_LOGOUT })
    }

    handleToggle = () => this.setState({ toggle: !this.state.toggle })
    handleActive = (index) => this.setState({ active: index })

    render() {
        const { toggle, active } = this.state;
        const { user } = this.props;
        return (
            <>
                <AdminHead />
                {user?.mode === MODE.admin ?
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
                        <Tooltip />
                    </div>
                    : <Login />
                }
            </>
        )
    }
}

export default connect(({ admin: { user } }) => ({ user }))(Admin);