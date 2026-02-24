import {Container,Row,Col} from "react-bootstrap";
import {Link} from "react-router-dom";

const FooterComponent = () => {
  return (
    <div  className="footer py-5">
      <Container>
        <Row className="d-flex justify-content-between">
          <Col lg="5">
            <h3 className="fw-bold">Nevada Marsya</h3>
            <p className="desc">Lorem ipsum dolor sit amet consectetur adipisicing elit. 
            Dolores officia natus sit possimus sint sequi ab 
            suscipit vel voluptas veritatis quia id, similique est perspiciatis delectus minima atque odio. Eveniet.</p>
            <div className="no mb-1 mt-4">
              <Link className="text-decoration-none d-flex align-items-center">
               <i className="fa-brands fa-whatsapp me-2"></i>
               <p className="m-0">+62 123-4567-8912</p>
              </Link>
            </div>
            <div className="mail">
              <Link className="text-decoration-none">
               <i className="fa-regular fa-envelope"></i>
               <p className="m-0">person-email@gmail.com</p>
              </Link>
            </div>
          </Col>
          <Col className="d-flex flex-column col-lg-2 col mt-lg-0 mt-5">
          <h5 className="fw-bold">Menu</h5>
          <Link to="">Home</Link>
          <Link to="/kelas">Kelas</Link>
          <Link to="/testimonial">Testimonial</Link>
          <Link to="/faq">FAQ</Link>
          <Link to="/syaratketen">Syarat & Ketentuan</Link>
          </Col>
          <Col lg="4" className="mt-lg-0 mt-5">
          <h5 className="fw-bold mb-3">Subscribe untuk info menarik</h5>
          <div className="subscribe">
            <input type="text" placeholder="Subscribe..."/>
            <button className="btn btn-danger rounded-end rounded-0">Subscribe</button>
          </div>
          <div className="social mt-3">
            <i className="fa-brands fa-facebook me-3"></i>
            <i className="fa-brands fa-twitter me-3"></i>
            <i className="fa-brands fa-linkedin me-3"></i>
            <i className="fa-brands fa-youtube me-3"></i>
          </div>
          </Col>
        </Row>
        <Row className="mt-5">
          <Col>
            <hr/>
            <p className="text-center px-md-0 px-3">&copy; Copyright {new Date().getFullYear()} by <span className="fw-bold">Nevada Marsya</span>,
            All Right Reserved </p>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default FooterComponent