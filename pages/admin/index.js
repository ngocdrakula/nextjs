import React, { Component } from 'react';
import { Navbar, Container, Nav, Dropdown, Button } from "react-bootstrap";
import { connect } from 'react-redux';
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import AdminHead from '../../components/admin/AdminHead';
import Product from '../../components/admin/Product';
import Size from '../../components/admin/Size';
import Login from '../../components/admin/Login';
import types from '../../redux/types';
import Layout from '../../components/admin/Layout';
import Setting from '../../components/admin/Setting';

const menu = [
    { name: 'Sản phẩm', icon: 'nc-icon nc-layers-3', component: <Product /> },
    { name: 'Kích thước', icon: 'nc-icon nc-ruler-pencil', component: <Size /> },
    { name: 'Kiểu bố trí', icon: 'nc-icon nc-bank', component: <Layout /> },
    { name: 'Cài đặt trang', icon: 'nc-icon nc-settings-tool-66', component: <Setting /> },
    // { name: 'Thành viên', icon: 'nc-icon nc-circle-09', component: <div>User</div> },
];

class Admin extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({ type: types.ADMIN_GET_SETTING });
        dispatch({ type: types.ADMIN_LOGIN_LOCAL });
        dispatch({ type: types.ADMIN_GET_FRONTS });
        dispatch({ type: types.ADMIN_GET_SIZES });
        dispatch({ type: types.ADMIN_GET_ROOMS });
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

    render() {
        const { active = 0 } = this.state;
        const { user } = this.props;
        return (
            <>
                <AdminHead />
                {user && user.mode ?
                    < div className="wrapper" style={{ overflowX: 'hidden' }}>
                        <div className="sidebar" data-color={"black"}>
                            <div className="sidebar-background" />
                            <div className="sidebar-wrapper">
                                <div className="logo d-flex align-items-center justify-content-center" style={{ background: '#dddddd' }}>
                                    <a href="/" className="logo-mini mx-1">
                                        <div className="logo-img">
                                            {/* <img src={"/icons/logo.png"} style={{ maxWidth: '90%', height: 'auto' }} /> */}
                                        </div>
                                    </a>
                                </div>
                                {menu.map((item, index) => {
                                    return (
                                        <Nav key={index}>
                                            <li className={active === index ? "active" : ""}>
                                                <a href={"#"} className="nav-link" onClick={e => { e.preventDefault(); this.setState({ active: index }) }}>
                                                    <i className={item.icon} />
                                                    <p>{item.name}</p>
                                                </a>
                                            </li>
                                        </Nav>
                                    )
                                })}
                            </div>
                        </div>
                        <div className="main-panel">
                            <Navbar bg="light" expand="lg">
                                <Container fluid>
                                    <div className="d-flex justify-content-center align-items-center ml-2 ml-lg-0">
                                        <Button
                                            variant="dark"
                                            className="d-lg-none btn-fill d-flex justify-content-center align-items-center rounded-circle p-2"
                                            onClick={this.mobileSidebarToggle}
                                        >
                                            <i className="fas fa-ellipsis-v"></i>
                                        </Button>
                                        <Navbar.Brand
                                            href="/"
                                            onClick={(e) => e.preventDefault()}
                                            className="mr-2"
                                        >
                                            {process.env.TITLE}
                                        </Navbar.Brand>
                                    </div>
                                    <Navbar.Toggle aria-controls="basic-navbar-nav" className="mr-2">
                                        <span className="navbar-toggler-bar burger-lines"></span>
                                        <span className="navbar-toggler-bar burger-lines"></span>
                                        <span className="navbar-toggler-bar burger-lines"></span>
                                    </Navbar.Toggle>
                                    <Navbar.Collapse id="basic-navbar-nav">
                                        <Nav className="ml-auto" navbar>
                                            <Dropdown as={Nav.Item}>
                                                <Dropdown.Toggle
                                                    aria-expanded={false}
                                                    aria-haspopup={true}
                                                    as={Nav.Link}
                                                    data-toggle="dropdown"
                                                    id="navbarDropdownMenuLink"
                                                    variant="default"
                                                    className="m-0 mr-5"
                                                >
                                                    <span className="no-icon">Tài khoản</span>
                                                </Dropdown.Toggle>
                                                <Dropdown.Menu aria-labelledby="navbarDropdownMenuLink">
                                                    <Dropdown.Item href="#" onClick={this.handleLogout}>Đăng xuất</Dropdown.Item>
                                                    {/* <div className="divider"></div> 
                                                <Dropdown.Item href="#pablo" onClick={this.handleLogout}>Đăng xuất</Dropdown.Item> */}
                                                </Dropdown.Menu>
                                            </Dropdown>
                                        </Nav>
                                    </Navbar.Collapse>
                                </Container>
                            </Navbar>

                            <div className="content">
                                {menu.map((item, index) => {
                                    return (
                                        <div key={index} className="container-fluid container-xl" style={{ display: index === active ? 'block' : 'none' }}>
                                            {item.component}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                    : <Login />
                }
            </>
        )
    }
}

export default connect(({ admin: { user } }) => ({ user }))(Admin);