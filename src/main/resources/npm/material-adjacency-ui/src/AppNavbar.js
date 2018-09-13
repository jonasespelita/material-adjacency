import React, { Fragment } from "react";
import { Navbar, NavbarBrand } from "reactstrap";
import FeatherIcon from "feather-icons-react";

const AppNavbar = () => (
  <Fragment>
    <Navbar
      color="dark"
      dark={true}
      className="sticky-top"
      style={{ zIndex: 150 }}
    >
      <NavbarBrand href="#"> <FeatherIcon icon="star" size={24} />5M Material Explorer</NavbarBrand>
    </Navbar>
  </Fragment>
);

export default AppNavbar;
