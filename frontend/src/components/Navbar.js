import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { logout } from '../actions/userActions'
import { useHistory, useLocation } from "react-router-dom";
import logo from '../assets/logo.jpeg';

function NavBar() {

    let history = useHistory()
    const dispatch = useDispatch()

    // login reducer
    const userLoginReducer = useSelector(state => state.userLoginReducer)
    const { userInfo } = userLoginReducer

    // logout
    const logoutHandler = () => {
        dispatch(logout()) // action
        history.push("/login")
        window.location.reload()
    }

    const location = useLocation();
    const isExcludedPage = location.pathname === '/login' || location.pathname === '/register';

    return (
        <>
            {!userInfo && !isExcludedPage && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        color: 'white',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1050,
                    }}
                >
                    <h2>You must log in to use the system</h2>
                    <LinkContainer to="/login">
                        <button
                            style={{
                                marginTop: '20px',
                                padding: '10px 20px',
                                fontSize: '16px',
                                backgroundColor: '#007bff',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                            }}
                        >
                            Go to Login
                        </button>
                    </LinkContainer>
                </div>
            )}
            <header>
                <Navbar bg="light" variant="light" expand="lg" collapseOnSelect style={{ backgroundColor: 'white' }}>
                    <Container>
                        <LinkContainer to="/">
                            <Navbar.Brand>
                                <img
                                    src={logo}
                                    alt="Logo"
                                    style={{ width: '40px', height: '40px', marginRight: '10px' }}
                                />
                            </Navbar.Brand>
                        </LinkContainer>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="mr-auto">
                                <LinkContainer to="/help">
                                    <Nav.Link>Help</Nav.Link>
                                </LinkContainer>
                                <LinkContainer to="/about">
                                    <Nav.Link>About Us</Nav.Link>
                                </LinkContainer>

                                {/* New Product (Available to all authenticated users) */}
                                {userInfo && (
                                    <LinkContainer to="/new-product/">
                                        <Nav.Link>Add Product</Nav.Link>
                                    </LinkContainer>
                                )}

                                {/* Admin-only links (if user is admin) */}
                                {userInfo && userInfo.admin && (
                                    <LinkContainer to="/ad-approval">
                                        <Nav.Link>Approve Ads</Nav.Link>
                                    </LinkContainer>
                                )}
                            </Nav>

                            {/* login-logout condition here */}
                            {userInfo ? (
                                <div>
                                    <NavDropdown className="navbar-nav text-capitalize" title={userInfo.username} id='username'>
                                        <LinkContainer to="/account">
                                            <NavDropdown.Item>Account Settings</NavDropdown.Item>
                                        </LinkContainer>
                                        <LinkContainer to="/all-addresses/">
                                            <NavDropdown.Item>Address Settings</NavDropdown.Item>
                                        </LinkContainer>
                                        <LinkContainer to="/stripe-card-details/">
                                            <NavDropdown.Item>Card Settings</NavDropdown.Item>
                                        </LinkContainer>
                                        <LinkContainer to="/all-orders/">
                                            <NavDropdown.Item>All Orders</NavDropdown.Item>
                                        </LinkContainer>
                                        <NavDropdown.Item onClick={logoutHandler}>
                                            Logout
                                        </NavDropdown.Item>
                                    </NavDropdown>
                                </div>
                            ) : (
                                <LinkContainer to="/login">
                                    <Nav.Link><i className="fas fa-user"></i> Login</Nav.Link>
                                </LinkContainer>
                            )}
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
            </header>
        </>
    )
}

export default NavBar