import React, { Fragment } from "react";
import { Navbar, NavbarBrand } from "reactstrap";

const AppNavbar = () => (
  <Fragment>
    <Navbar
      color="dark"
      dark={true}
      className="sticky-top"
      style={{ zIndex: 150 }}
    >
      <NavbarBrand href="#">Material Explorer</NavbarBrand>
    </Navbar>
  </Fragment>
);

export default AppNavbar;
