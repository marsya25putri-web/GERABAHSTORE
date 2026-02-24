import { useState, useEffect } from "react";
import { Container, Navbar, Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";

import { navLinks } from "../data/index";

const NavbarComponent = () => {
  const [changeColor, setChangeColor] = useState(false);

  const changeBackgroundColor = () => {
    setChangeColor(window.scrollY > 10);
  };

  useEffect(() => {
    changeBackgroundColor();
    window.addEventListener("scroll", changeBackgroundColor);

    return () => {
      window.removeEventListener("scroll", changeBackgroundColor);
    };
  }, []);

  return (
    <Navbar expand="lg" className={changeColor ? "color-active" : ""}>
      <Container>
        <Navbar.Brand href="/" className="fs-3 fw-bold">
          Marsya Putri
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto text-center">
            {navLinks.map((link) => (
              <div className="nav-link" key={link.id}>
                <NavLink
                  to={link.path}
                  className={({ isActive }) =>
                    isActive ? "active" : ""
                  }
                  end
                >
                  {link.text}
                </NavLink>
              </div>
            ))}
          </Nav>

          <div className="text-center">
            <NavLink to="/login" className="btn btn-outline-danger rounded-2">
              Login
            </NavLink>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;
