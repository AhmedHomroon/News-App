import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { format, parseISO } from 'date-fns';
import { Link } from 'react-router-dom';  

function Home() {
    const [latestNews, setLatestNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLatestNews = async () => {
            try {
                const response = await axios.get('http://localhost:8000/news/');
                const sortedNews = response.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                const top3News = sortedNews.slice(0, 3); 
                setLatestNews(top3News);
                setLoading(false);

            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchLatestNews();
    }, []);


    const formatDate = (dateString) => {
        try {
            return dateString ? format(parseISO(dateString), "PPP") : 'N/A';
        } catch (error) {
            console.error("Error formatting date:", error);
            return 'N/A';
        }
    };


    if (loading) {
        return <div className="text-center">Loading latest news...</div>;  
    }

    if (error) {
        return <div className="text-center text-danger">Error fetching news: {error}</div>;
    }


    return (
        <div>
            <section
                className="hero-section d-flex align-items-center justify-content-center text-white"
                style={{
                    background: "url(https://media.gettyimages.com/id/139090673/photo/arvada-papers-stacked-randomly.jpg?s=612x612&w=0&k=20&c=8pzJhtIybr4AX94xySbAH9Lf5BVc7KToKNhpxEmU9Xc=) no-repeat  center/cover",
                        // filter:' blur(8px)',
                        // -webkit-filter: "blur(8px)",
                    height: "80vh",
                    textShadow: "2px 2px 4px rgba(12, 12, 12, 0.8)"
                }}
            >
                <div className="hero-text text-center bg-dark bg-opacity-75 p-4 rounded">
                    <h1 className="display-4 fw-bold">Stay Informed, Stay Ahead</h1>
                    <p className="lead">Get the latest headlines and updates from around the world</p>
                    <p>
                        <strong>{import.meta.env.VITE_ABC}</strong>
                    At OUR website, we bring you the latest headlines,
                     breaking news, and in-depth stories from around the globe—all in real time. Whether you're catching up on politics, technology, sports, entertainment, or world affairs, our app is designed to keep you informed with personalized 
                    content and an easy-to-use interface. Join a growing community of 
                    readers who value clarity, speed, and trusted reporting. This is your news, the way it should be.
                    </p>
                </div>
            </section>


            <section id="news" className="py-5 bg-light">
                <div className="container">
                    <h2 className="mb-4 text-center">Latest News</h2>
                    <div className="row g-4">
                        {latestNews.map(newsItem => (
        <div className="col-md-4" key={newsItem.id}>
            <div className="card">
                <img
                    src={newsItem.image_url || "https://via.placeholder.com/350x200"}
                    className="card-img-top"
                    alt={newsItem.title}
                    style={{ height: "200px", objectFit: "cover" }}
                />
                <div className="card-body">
                    <h5 className="card-title">{newsItem.title}</h5>
                    <p className="card-text">{newsItem.content.substring(0, 100)}...</p>
                    <p className="card-text">
                        <small className="text-muted">
                            Created At: {formatDate(newsItem.created_at)}
                        </small>
                    </p>
                    <Link to={`/news/${newsItem.id}`} className="btn">ReadMore . . .</Link>
                </div>
                </div>
        </div>
                      
                      
                          
                      ))}
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Home;