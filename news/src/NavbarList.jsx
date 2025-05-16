

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Container,
    Nav,
    Navbar,
    NavDropdown,
    Button
} from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from './AuthContext';

const CATEGORY_NAME_MAP = {
    "GE": "General",
    "BU": "Business",
    "PO": "Political",
    "SP": "Sports",
    "SC": "Science",
    "TE": "Technology",
    "HE": "Health",
    "AR": "Art"
};

function NavbarList() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { isAuthenticated, logout } = useAuth(); 

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://localhost:8000/news/category/');
                setCategories(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    const handleLogout = () => {
        logout(); 
        navigate('/');
    };

    return (
        <Navbar expand="lg" className="bg-body-tertiary" collapseOnSelect>
            <Container>
                <Navbar.Brand as={Link} to="/"><img src='https://img.icons8.com/ios-glyphs/60/news.png'/></Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/">Home</Nav.Link>
                        <Nav.Link as={Link} to="/news">News</Nav.Link>
                        <NavDropdown title="Categories" id="categories-dropdown" className="me-2">
                            {loading ? <NavDropdown.Item disabled>Loading...</NavDropdown.Item> : error ? <NavDropdown.Item disabled>Error loading categories</NavDropdown.Item> : categories.length > 0 ? categories.map(cat => (
                                <NavDropdown.Item key={cat.id} as={Link} to={`/category/${cat.id}`}>{CATEGORY_NAME_MAP[cat.category] || 'Unknown'}</NavDropdown.Item>
                            )) : <NavDropdown.Item disabled>No categories found</NavDropdown.Item>}
                        </NavDropdown>
                        <NavDropdown title="More" id="more-dropdown">
                            {isAuthenticated ? (
                                <NavDropdown.Item as={Link} to="/news/create">
                                    Create News
                                </NavDropdown.Item>
                            ) : (
                                <NavDropdown.Item disabled>Create News,Please login  </NavDropdown.Item>
                            )}
                            <NavDropdown.Item as={Link} to="/about">About Us</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/archives">
                                My News
                            </NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item as={Link} to="/contact">Contact</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                    <Nav>
                        <div className="input-group me-3" style={{ maxWidth: '300px' }}>
                            <input type="search" className="form-control" placeholder="Search" aria-label="Search" />
                            <Button variant="outline-secondary"><i className="fas fa-search"></i></Button>
                        </div>
                        <div className="d-flex align-items-center">
                            {!isAuthenticated ? (
                                <>
                                    <Nav.Link as={Link} to="/signin" className="me-3 text-nowrap"><i className="fas fa-sign-in-alt me-1"></i>Log In</Nav.Link>
                                    <Button as={Link} to="/signup" variant="outline-primary" className="text-nowrap">Sign Up</Button>
                                </>
                            ) : (
                                <Button variant="danger" onClick={handleLogout} className="text-nowrap">Log Out</Button>
                            )}
                        </div>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavbarList;