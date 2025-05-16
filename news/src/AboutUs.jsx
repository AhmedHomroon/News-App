import React from 'react';
import { Github, Facebook, Twitter } from 'react-bootstrap-icons';
import { Container, Row, Col, Card } from 'react-bootstrap';

const AboutUs = () => {
  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          <Card className="shadow-lg border-0 rounded-4 p-4" style={{ backgroundColor: '#f9f9fb' }}>
            <Card.Body>
              <h2 className="mb-4 text-center text-primary fw-bold">About Us</h2>
              <p className="fs-5 text-muted">
                <strong>News</strong> is more than just a news app — it's your window to the world. We’re passionate about delivering fast, accurate, and relevant news
                that keeps you informed and ahead of the curve.
              </p>
              <p className="fs-6 text-secondary">
                From breaking headlines to deep-dive investigations, our editorial team curates stories that matter — locally and globally. With categories
                spanning <span className="text-dark fw-semibold">Politics</span>, <span className="text-dark fw-semibold">Technology</span>,
                <span className="text-dark fw-semibold">Entertainment</span>, <span className="text-dark fw-semibold">Business</span>, and more, our App
                ensures there's something for every reader.
              </p>
              <p className="fs-6 text-secondary">
                We blend journalistic integrity with smart technology to personalize your feed, minimize noise, and maximize impact. Whether you're a
                casual browser or a news junkie, our App is built to fit your lifestyle.
              </p>
              <p className="fs-6 text-secondary">
                Join thousands of readers who trust us daily. Because in a world full of noise, clarity is power.
              </p>
              {/* <p>Tweet icons created by Freepik - Flaticon</p> */}
              <div style={{ display: 'flex', gap: '16px', justifyContent:'center' }}>
                  <a href='https://git.generalassemb.ly/AhmedHomroon/news-frontend'><Github size={30} /></a>
                  <Facebook size={30} />
                  {/* <FaTwitter size={30} /> */}
                </div>
                  {/* <MDBBtn style={{ backgroundColor: '#55acee' }} href='#'>
                <MDBIcon className='me-2' fab icon='twitter' /> Twitter
              </MDBBtn>
              <FontAwesomeIcon icon="fa-brands fa-react" /> */}
            </Card.Body>

            
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AboutUs;
