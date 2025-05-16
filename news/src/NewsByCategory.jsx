
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Card from 'react-bootstrap/Card';

function NewsByCategory() {
    const { categoryId } = useParams();
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/news/category/'+categoryId);
                setNews(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, [categoryId]);

    if (loading) return <div>Loading news...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="container mt-4">
            <h2>News in Category</h2>
            <div className="row">
                {news.map(item => (
                    <div key={item.id} className="col-md-4 mb-4">
                        <Card>
                            <Card.Body>
                                <Card.Title>{item.title}</Card.Title>
                                <Card.Text>{item.content}</Card.Text>
                                <Card.Footer>
                                    <small className="text-muted">
                                        {new Date(item.created_at).toLocaleDateString()}
                                    </small>
                                </Card.Footer>
                            </Card.Body>
                        </Card>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default NewsByCategory;