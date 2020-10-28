import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/cjs/NavDropdown";

import "bootstrap/dist/css/bootstrap.min.css";
// import logo from './logo.svg';
import './App.css';

import CheckinView from "./views/CheckinView";
import FacilityView from "./views/FacilityView";
import GuestView from "./views/GuestView";
import HomeView from "./views/HomeView";
import TemplateView from "./views/TemplateView";

function App() {

  return (

          <BrowserRouter>

              <Navbar
                  bg="info"
                  className="mb-3"
                  expand="lg"
                  sticky="top"
                  variant="dark"
              >

                  <Navbar.Brand>
                      <img
                          alt="CityTeam Logo"
                          height={66}
                          src="./CityTeamDarkBlue.png"
                          width={160}
                      />
                  </Navbar.Brand>

                  <Navbar.Toggle aria-controls="basic-navbar-nav"/>

                  <Navbar.Collapse id="basic-navbar-nav">

                      <Nav className="mr-auto">

                          <Nav.Link href="/">Home</Nav.Link>
                          <Nav.Link href="/facilities">Facilities</Nav.Link>
                          <Nav.Link href="/guests">Guests</Nav.Link>
                          <Nav.Link href="/templates">Templates</Nav.Link>

                          <NavDropdown id="reports" title="Reports">
                              <NavDropdown.Item href="/reports-DailySummary">
                                  Daily Summary
                              </NavDropdown.Item>
                              <NavDropdown.Divider/>
                              <NavDropdown.Item href="/reports-GuestHistory">
                                  Guest History
                              </NavDropdown.Item>
                              <NavDropdown.Item href="/reports-MonthlySummary">
                                  Monthly Summary
                              </NavDropdown.Item>
                          </NavDropdown>

                          <Nav.Link href="/checkins">Checkins</Nav.Link>

                      </Nav>

                      <Navbar.Text>FacilitySelector goes here</Navbar.Text>

                  </Navbar.Collapse>

              </Navbar>

              <Switch>
                  <Route exact path={["/", "/home"]} component={HomeView}/>
                  <Route exact path="/checkins" component={CheckinView}/>
                  <Route exact path="/facilities" component={FacilityView}/>
                  <Route exact path="/guests" component={GuestView}/>
                  <Route exact path="/templates" component={TemplateView}/>
              </Switch>

          </BrowserRouter>

    );

}

export default App;
