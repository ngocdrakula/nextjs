import React, { Component } from 'react';
import { connect } from 'react-redux';
import Header from './Header';
import SideBar from './SideBar';
import Visitor from './Visitor';
import Exhibitor from './Exhibitor';
import Overview from './Overview';
import Industry from './Industry';
import Contact from './Contact';
import Setting from './Setting';
import Chat from '../Chat';
import Trade from '../Trade';
import AdminInfo from './AdminInfo';


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
                <Header
                    handleToggle={this.handleToggle}
                    handleActiveMessage={() => this.handleActive(5)}
                    handleActiveVisitor={() => this.handleActive(2)}
                    handleActiveUser={() => this.handleActive(8)}
                    toggle={toggle} />
                <SideBar handleActive={this.handleActive} active={active} />
                <div className="content-wrapper" >
                    <Overview active={active === 0} />
                    <Exhibitor active={active === 1} />
                    <Visitor active={active === 2} />
                    <Industry active={active === 3} />
                    <Contact active={active === 4} />
                    <Chat active={active === 5} />
                    <Setting active={active === 6} />
                    <Trade active={active === 7} />
                    <AdminInfo active={active === 8} />
                </div>
                <footer className="main-footer">
                </footer>
            </div>
        )
    }
}

export default connect(({ }) => ({}))(Admin);