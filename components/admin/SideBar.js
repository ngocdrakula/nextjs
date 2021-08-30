import React, { Component } from 'react'
import { connect } from 'react-redux';
import types from '../../redux/types';

class SideBar extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    handleShowCatalog = e => {
        e.preventDefault();
        this.setState({ cataLog: !this.state.cataLog, support: false });
    }
    handleShowCategories = e => {
        e.preventDefault();
        this.setState({ cate: !this.state.cate })
    }
    handleShowSupport = e => {
        e.preventDefault();
        this.setState({ cataLog: false, support: !this.state.support })
    }
    handleActive = (index) => {
        if (index === 4 || index === 5) {
            this.setState({ cateLog: true, cate: true, support: false })
        }
        else if (index === 6 || index === 7) {
            this.setState({ cateLog: false, cate: false, support: true })
        }
        else {
            this.setState({ cateLog: false, cate: false, support: false })
        }
        this.props.handleActive(index)
    }

    render() {
        const { active } = this.props;
        const { cataLog, cate, support } = this.state;
        return (
            <aside className="main-sidebar">
                <section className="sidebar">
                    <ul className="sidebar-menu">
                        <li className={active === 0 ? "active" : ""}>
                            <a href="#" onClick={() => this.handleActive(0)}>
                                <i className="fa fa-dashboard" /> <span>Tổng quan</span>
                            </a>
                        </li>
                        <li className={active === 1 ? "active" : ""}>
                            <a href="#" onClick={() => this.handleActive(1)}>
                                <i className="fa fa-map-marker" />
                                <span> Danh sách nhà trưng bày</span>
                            </a>
                        </li>
                        <li className={active === 2 ? "active" : ""}>
                            <a href="#" onClick={() => this.handleActive(2)}>
                                <i className="fa fa-user-secret" /> <span>Danh sách khách tham quan</span>
                            </a>
                        </li>
                        <li className={active === 3 ? "active" : ""}>
                            <a href="#" onClick={() => this.handleActive(3)}>
                                <i className="fa fa-meetup" /> <span>Lịch giao thương</span>
                            </a>
                        </li>
                        <li className={"treeview" + (cataLog ? " active" : "")}>
                            <a href="#" onClick={this.handleShowCatalog}>
                                <i className="fa fa-tags" />
                                <span>Catalog</span>
                                <i className="fa fa-angle-left pull-right" />
                            </a>
                            <ul className={"treeview-menu" + (cataLog ? " menu-open" : "")} style={{ display: cataLog ? 'block' : 'none' }}>
                                <li>
                                    <a href="#" onClick={this.handleShowCategories}>
                                        <i className="fa fa-angle-double-right" />
                                        Categories
                                        <i className="fa fa-angle-left pull-right" />
                                    </a>
                                    <ul className={"treeview-menu" + (cate ? " menu-open" : "")} style={{ display: cate ? 'block' : 'none' }}>
                                        <li className={active === 4 ? "active" : ""}>
                                            <a href="#" onClick={() => this.handleActive(4)}>
                                                <i className="fa fa-angle-right" />Danh sách danh mục
                                            </a>
                                        </li>
                                        <li className={active === 5 ? "active" : ""}>
                                            <a href="#" onClick={() => this.handleActive(5)}>
                                                <i className="fa fa-angle-right" />Thêm NTB vào danh mục
                                            </a>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </li>
                        <li className={"treeview" + (support ? " active" : "")}>
                            <a href="#" onClick={this.handleShowSupport}>
                                <i className="fa fa-support" />
                                <span>Chăm sóc khách hàng</span>
                                <i className="fa fa-angle-left pull-right" />
                            </a>
                            <ul className={"treeview-menu" + (support ? " menu-open" : "")} style={{ display: support ? 'block' : 'none' }}>
                                <li className={active === 6 ? "active" : ""}>
                                    <a href="#" onClick={() => this.handleActive(6)}>
                                        <i className="fa fa-angle-double-right" /> Mail
                                    </a>
                                </li>
                                <li className={active === 7 ? "active" : ""}>
                                    <a href="#" onClick={() => this.handleActive(7)}>
                                        <i className="fa fa-angle-double-right" /> Mail Template
                                    </a>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </section>
            </aside>
        )
    }
}

export default connect(({ admin: { setting, user } }) => ({ setting, user }))(SideBar)
