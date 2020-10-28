import React from "react";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
// import NavDropdown from "react-bootstrap/cjs/NavDropdown";

import "bootstrap/dist/css/bootstrap.min.css";
// import logo from './logo.svg';
import './App.css';

import FacilityView from "./views/FacilityView";
import GuestView from "./views/GuestView";
import HomeView from "./views/HomeView";
import TemplateView from "./views/TemplateView";

function App() {

  return (

      <>

        <Navbar
          bg="info"
          className="mb-3"
          expand={true}
          fixed="top"
          sticky="top"
          variant="dark"
        >

          <Navbar.Brand>
            The Brand
            {/*// TODO -The Brand Image*/}
          </Navbar.Brand>

          <Nav className="mr-auto">

            <Nav.Link href="/home">Home</Nav.Link>
            <Nav.Link href="/facilities">Facilities</Nav.Link>
            <Nav.Link href="/guests">Guests</Nav.Link>
            <Nav.Link href="/templates">Templates</Nav.Link>

            {/*// TODO - FacilitySelector*/}

          </Nav>

        </Navbar>

          <Router>
              <Switch>
                  <Route exact path={["/", "/home"]}><HomeView/></Route>
                  <Route exact path="/facilities"><FacilityView/></Route>
                  <Route exact path="/guests"><GuestView/></Route>
                  <Route exact path="/templates"><TemplateView/></Route>
              </Switch>
          </Router>

      </>

  );

}

export default App;
