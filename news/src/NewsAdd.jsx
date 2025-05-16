import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Form, Spinner, Alert, Dropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import Cookies from 'js-cookie';

const CLOUD_NAME = import.meta.env.VITE_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_UPLOAD_PRESET;

const NewsAdd = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [source, setSource] = useState('');
    const [category, setCategory] = useState('');
    const [categoryId, setCategoryId] = useState(null);
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const [authUser, setAuthUser] = useState(null);
    const [formLoading, setFormLoading] = useState(true);
    
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://localhost:8000/news/category/');
                setCategories(response.data);
            } catch (error) {
                setError('Failed to load categories: ' + error.message);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                console.log('Token in fetchCurrentUser:', token);
                const response = await axios.get('http://localhost:8000/current_user/', {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                });
                setAuthUser(response.data);
                setFormLoading(false);
            } catch (error) {
                console.error("Error fetching current user:", error);
                setError("Failed to fetch user data.");
                setFormLoading(false);
            }
        };
        if (token) {
            fetchCurrentUser();
        } else {
            navigate('/signin');
        }
    }, [token, navigate]);
    const handleCategorySelect = (catName, catId) => {
        setCategory(catName);
        setCategoryId(catId);
    };

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
    
        try {
            let imageUrl = null;
            
            
            if (image) {
                const cloudinaryFormData = new FormData();
                cloudinaryFormData.append('file', image);
                cloudinaryFormData.append('upload_preset', UPLOAD_PRESET);
                
                const cloudinaryResponse = await axios.post(
                    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
                    cloudinaryFormData
                );
                imageUrl = cloudinaryResponse.data.secure_url;
            }
    

            const newsPayload = {
                title,
                content,
                source,
                category: categoryId,
                image_url: imageUrl 
            };
    
            const response = await axios.post('http://localhost:8000/news/',
                newsPayload,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Token ${token}`,
                    },
                }
            );
    
            console.log('News created:', response.data);
            navigate('/news');
        } catch (err) {
            console.error('Error:', err);
            let errorMessage = 'An error occurred';
            
            if (err.response?.data) {
                errorMessage = Object.entries(err.response.data)
                    .map(([key, value]) => 
                        `${key}: ${Array.isArray(value) ? value.join(', ') : value}`
                    )
                    .join(', ');
            }
            
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-4">
            <h2>Add News</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Content</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={5}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Source</Form.Label>
                    <Form.Control
                        type="text"
                        value={source}
                        onChange={(e) => setSource(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Category</Form.Label>
                    <Dropdown>
                        <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic">
                            {category || 'Select Category'}
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            {categories.map((cat) => (
                                <Dropdown.Item
                                    key={cat.id}
                                    onClick={() => handleCategorySelect(cat.category, cat.id)}
                                >
                                    {cat.category}
                                </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Image</Form.Label>
                    <Form.Control
                        type="file"
                        onChange={handleImageChange}
                        accept="image/*"
                        required
                    />
                    {image && <p>Selected File: {image.name}</p>}
                    {error && <Alert variant="danger" className="mt-2">{error}</Alert>}
                </Form.Group>

                <Button type="submit" disabled={loading} className="w-100">
                    {loading ? (
                        <>
                            <Spinner animation="border" size="sm" /> Creating...
                        </>
                    ) : (
                        'Create News'
                    )}
                </Button>
                {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
            </Form>
        </div>
    );

}
export default NewsAdd;