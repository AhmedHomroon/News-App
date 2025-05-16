import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Form, Button, Alert } from 'react-bootstrap';
import { useAuth } from './AuthContext.jsx'; 

function EditNews() {
    const { id } = useParams();
    const { token } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        source: '',
        category: '',  
        image_url: '',
        image_name: '' 
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/news/${id}/`, {
                    headers: {
                        Authorization: `Token ${token}`,
                    }
                });
                setFormData({
                    ...response.data,
                    category: response.data.category.id  
                });
            } catch (err) {
                setError(err.response?.data || err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchNews();
    }, [id, token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(
                `http://localhost:8000/news/${id}/update-delete/`,
                formData,
                {
                    headers: {
                        Authorization: `Token ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            navigate(`/news/${id}`);
        } catch (err) {
            setError(err.response?.data || 'Update failed');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="container mt-4">
            <h2>Edit News</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Content</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Source</Form.Label>
                    <Form.Control
                        type="text"
                        value={formData.source}
                        onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Category</Form.Label>
                    <Form.Control
                        type="text"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Image URL</Form.Label>
                    <Form.Control
                        type="text"
                        value={formData.image_url}
                        onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Image Name</Form.Label>
                    <Form.Control
                        type="text"
                        value={formData.image_name}
                        onChange={(e) => setFormData({ ...formData, image_name: e.target.value })}
                    />
                </Form.Group>

                <Button variant="primary" type="submit">
                    Save Changes
                </Button>
            </Form>
        </div>
    );
}

export default EditNews;