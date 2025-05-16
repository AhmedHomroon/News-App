import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import { Card, Button, InputGroup, Form,Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { format, parseISO } from 'date-fns';

function formatDateWithFallback(dateString) {
    if (!dateString) {
        return '';
    }
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            throw new Error("Invalid Date");
        }
        return format(date, 'PPPppp');
    } catch (e) {
        console.error("Error formatting date:", e);
        return '';
    }
}

function News() {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const location = useLocation();
    const baseurl=import.meta.env.VITE_BASE_ROUTE
    useEffect(() => {
        const fetchNews = async () => {
            try {
                const query = new URLSearchParams(location.search).get('q') || '';
                setSearchQuery(query);

                let url = baseurl;
                if (query) {
                    url = `http://localhost:8000/news/search/?q=${query}`;
                }

                const response = await axios.get(url);
                setNews(response.data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchNews();
    }, [location.search]);

    return (
        <div className="container mt-4">
            <InputGroup className="mb-3">
                <Form.Control
                    placeholder="Search News..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button variant="outline-secondary">
                    <FontAwesomeIcon icon={faSearch} />
                </Button>
            </InputGroup>

            {loading ? (
                <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </div>
            ) : error ? (
                <Alert variant="danger">{error}</Alert>
            ) : news.length > 0 ? (
                <div className="row">
                    {news.map(item => {

                        return (
                            <div key={item.id} className="col-md-4 mb-4">
                                <Card>
                                    {item.image_url && <Card.Img variant="top" src={item.image_url} alt={item.title} />}
                                    <Card.Body>
                                        <Card.Title>
                                            <Link to={`/news/${item.id}`}>{item.title}</Link>
                                        </Card.Title>
                                        <Card.Text>{item.content.substring(0, 100)}...</Card.Text>
                                        <Card.Text>
                                            Category: {item.category}
                                        </Card.Text>
                                        <Card.Text>
                                            Date: {formatDateWithFallback(item.created_at)}
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <p>No matches found for "{searchQuery}"</p>
            )}
        </div>
    );
}

export default News;