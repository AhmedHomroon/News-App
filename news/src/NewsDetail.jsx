import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link,useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card, Button, Spinner, Alert } from 'react-bootstrap';
import { format, parseISO, isValid } from 'date-fns';

import { useAuth } from './AuthContext.jsx';
function NewsDetail() {
    const [news, setNews] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { id } = useParams();
    const [rating, setRating] = useState(null); 
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [ratingError, setRatingError] = useState(null);
    const [hasRated, setHasRated] = useState(false);
    const { token, isAuthenticated,userId  } = useAuth(); 
    const navigate = useNavigate(); 
    const [userRating, setUserRating] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [selectedRating, setSelectedRating] = useState('');
    const ratingOptions = {
        '1': 'Strongly Disagree',
        '2': 'Somewhat Disagree',
        '3': 'Neither Agree Nor Disagree',
        '4': 'Somewhat Agree',
        '5': 'Strongly Agree'
    };
    const [showConfirmation, setShowConfirmation] = useState(false); 

    useEffect(() => {
        const getNewsDetail = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/news/${id}/`);
                setNews(response.data);
                setLoading(false);
                if (isAuthenticated) {
                    const userRate = response.data.rates.find(rate => rate.user === userId);
                if (userRate) {
                    setUserRating(userRate);
                    setHasRated(true);
                }
            }
          

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        getNewsDetail();

        return () => {
        };
    }, [id,isAuthenticated, userId]);
    const handleUpdateRating = async () => {
        setIsSubmitting(true);
        try {
            console.log("00",import.meta.env.VITE_BASE_ROUTE +`${id}/rate/`)
            await axios.put(`http://localhost:8000/news/${id}/rate/`,
                { rate: selectedRating },
                { headers: { Authorization: `Token ${token}` } }
            );
            const response = await axios.get(`http://localhost:8000/news/${id}/`);
            setNews(response.data);
            setEditMode(false);
        } catch (error) {
            setRatingError("Failed to update rating");
        } finally {
            setIsSubmitting(false);
        }
    };
    const handleDeleteRating = async () => {
        setIsSubmitting(true);
        try {
            await axios.delete(`http://localhost:8000/news/${id}/rate/`,
                { headers: { Authorization: `Token ${token}` } }
            );
            const response = await axios.get(`http://localhost:8000/news/${id}/`);
            setNews(response.data);
            setUserRating(null);
            setHasRated(false);
        } catch (error) {
            setRatingError("Failed to delete rating");
        } finally {
            setIsSubmitting(false);
        }
    };





    const isOwner = isAuthenticated && news && userId && news.user === userId; 
    const handleEdit = () => {
        navigate(`/news/${id}/edit`); 
    };
    const handleDelete = () => {
        setShowConfirmation(true);
    };
    const confirmDelete = async () => {
        try {
            await axios.delete(`http://localhost:8000/news/${id}/update-delete/`, {
                headers: { Authorization: `Token ${token}` }
            });
            navigate('/news');
        } catch (err) {
            setError(err.message);
        } finally {
            setShowConfirmation(false);
        }
    };

    const submitRating = async (ratingValue) => {
        setIsSubmitting(true);
        setRatingError(null);  
        try {
            const response = await axios.post(`http://localhost:8000/news/${id}/rate/`,
                { rate: ratingValue },
                {
                    headers: {
                        Authorization: `Token ${token}`, 
                    },
                }
            );

            setRating(ratingValue);
            setHasRated(true);
        } catch (error) {
            if (error.response && error.response.status === 409) {
                setRatingError("You have already rated this news item.");
            }else if (error.response && error.response.status === 401) {
                setRatingError("Authentication required to rate.");
            } 
            else {
                setRatingError("Failed to submit rating. Please try again.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="container mt-4 d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mt-4">
                <Alert variant="danger">
                    Error: {error}
                </Alert>
            </div>
        );
    }

    if (!news) {
        return <div className="container mt-4">No news found</div>;
    }

    console.log("Ownership Check:", {
        isAuthenticated,
        userId,
        newsUserId: news?.user,
        isOwner
    });



    return (
        <div className="container mt-4">
            <Card className="shadow-lg">
                <Card.Img
                    variant="top"
                    src={news.image_url || "https://via.placeholder.com/400x200"}
                    alt={news.title}
                    className="card-img-top"
                    style={{ objectFit: 'cover', maxHeight: '400px' }}
                />
                <Card.Body>
                    <Card.Title className="display-4">{news.title}</Card.Title>
                    <Card.Text className="lead">{news.content}</Card.Text>
                    <Card.Text>
                        Source: <span className="font-weight-bold"><a href={news.source}>{news.source}</a></span>
                    </Card.Text>
                    <Card.Text>
                        Created At:{" "}
                        <span className="text-muted">
                            {news.created_at ? format(parseISO(news.created_at), "PPPppp") : "N/A"}
                        </span>
                    </Card.Text>
                    <Card.Text>
                        Category: <span className="font-weight-bold">{news.category}</span>
                    </Card.Text>

                    <Card.Text as="div">
  <strong>Ratings:</strong>
  {news && news.rates && news.rates.length > 0 ? (
    <ul>
      {news.rates.map((rate, index) => (
        <li key={index}>
          {rate.user && <span>User: {rate.user}, </span>}
          Rating: {ratingOptions[rate.rate] || 'N/A'}
        </li>
      ))}
    </ul>
  ) : (
    <p>No ratings yet</p>
  )}
</Card.Text>
{hasRated && userRating && (
        <div className="mt-3">
            <h5>Rating:</h5>
            <div className="d-flex align-items-center">
                {!editMode ? (
                    <>
                        <span className="me-2">
                            {ratingOptions[userRating.rate]} 
                        </span>
                        <Button 
                            variant="outline-secondary" 
                            size="sm" 
                            onClick={() => setEditMode(true)}
                        >
                            Edit
                        </Button>
                        <Button 
                            variant="outline-danger" 
                            size="sm" 
                            onClick={handleDeleteRating}
                            className="ms-2"
                        >
                            Delete
                        </Button>
                    </>
                ) : (
                    <>
                        <select 
                            className="form-select me-2"
                            value={selectedRating}
                            onChange={(e) => setSelectedRating(e.target.value)}
                        >
                            {Object.entries(ratingOptions).map(([key, value]) => (
                                <option key={key} value={key}>
                                    {value}
                                </option>
                            ))}
                        </select>
                        <Button 
                            variant="primary" 
                            size="sm"
                            onClick={handleUpdateRating}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Saving...' : 'Save'}
                        </Button>
                        <Button 
                            variant="secondary" 
                            size="sm" 
                            className="ms-2"
                            onClick={() => setEditMode(false)}
                        >
                            Cancel
                        </Button>
                    </>
                )}
            </div>
            {ratingError && <Alert variant="danger" className="mt-2">{ratingError}</Alert>}
        </div>
    )}

                    {!hasRated ? (
                        <div>
                            <p>Rate this news:</p>
                            {Object.entries(ratingOptions).map(([key, value]) => (
                                <Button
                                    key={key}
                                    variant="outline-primary"
                                    className="me-2 mb-2"
                                    onClick={() => submitRating(key)}
                                    disabled={isSubmitting}
                                >
                                    {value}
                                </Button>
                            ))}
                            {isSubmitting && <Spinner animation="border" size="sm" className="ms-2" />}
                        </div>
                    ) : (
                        <Alert variant="success">You have already rated this news.</Alert>
                    )}

                    {ratingError && <Alert variant="danger">{ratingError}</Alert>}
        
 {isOwner && (
                        <div>
                            <Button variant="primary" onClick={handleEdit} className="me-2">
                                Edit
                            </Button>
                            <Button variant="danger" onClick={handleDelete}>
                                Delete
                            </Button>
                        </div>
                    )}

                    {showConfirmation && (
                        <Alert variant="danger" className="mt-3">
                            <p>Are you sure you want to delete this news?</p>
                            <Button onClick={confirmDelete} className="me-2">Yes, Delete</Button>
                            <Button onClick={() => setShowConfirmation(false)}>No, Cancel</Button>
                        </Alert>
                    )}
   


                </Card.Body>
            </Card>
        </div>
    );
}

export default NewsDetail;