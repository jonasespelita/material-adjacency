import React from "react";
import { Navbar, Nav, NavItem, NavLink } from "reactstrap";
import "./Sidebar.css";

import FeatherIcon from "feather-icons-react";

const Sidebar = () => (
  <Navbar color="light" className="col-md-1 d-none d-md-block sidebar">
    <div className="sidebar-sticky">
      <Nav vertical>
        <NavItem>
          <NavLink href="#">
            <FeatherIcon icon="settings" />
            Machine
          </NavLink>
          <NavLink href="#">
            <FeatherIcon icon="grid" />
            Material
          </NavLink>
          <NavLink href="#" disabled>
            <FeatherIcon icon="users" /> Man
          </NavLink>
          <NavLink href="#" disabled>
            <FeatherIcon icon="refresh-cw" />
            Method
          </NavLink>
        </NavItem>
      </Nav>
    </div>
  </Navbar>
);

export default Sidebar;
