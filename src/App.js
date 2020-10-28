import React from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/cjs/NavDropdown";
import NavItem from "react-bootstrap/NavItem";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";

import "bootstrap/dist/css/bootstrap.min.css";
import './App.css';

import FacilitySelector from "./components/FacilitySelector";
import { FacilityContextProvider } from "./contexts/FacilityContext";
import DailySummaryReport from "./reports/DailySummaryReport";
import GuestHistoryReport from "./reports/GuestHistoryReport";
import MonthlySummaryReport from "./reports/MonthlySummaryReport";
import CheckinView from "./views/CheckinView";
import FacilityView from "./views/FacilityView";
import GuestView from "./views/GuestView";
import HomeView from "./views/HomeView";
import TemplateView from "./views/TemplateView";

// Application ---------------------------------------------------------------

// Overall application component.

// Navigation Bar ideas from:
//   https://serverless-stack.com/chapters/handle-routes-with-react-router.html
// (and subsequent pages)
// Critical issues:
// - Use <LinkContainer> to provide linkage to router
// - Use <NavItem> with no href to avoid creating real links
// - Use "nav-link" to do the styling like <Nav.Link> from react-bootstrap would
// - Get "active" state updates (even in dropdowns) for free :-)

// Component Details ---------------------------------------------------------

function App() {

    return (

        <FacilityContextProvider>

            <Router>

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

                            <LinkContainer to="/home">
                                <NavItem className="nav-link">Home</NavItem>
                            </LinkContainer>
                            <LinkContainer to="/facilities">
                                <NavItem className="nav-link">Facilities</NavItem>
                            </LinkContainer>
                            <LinkContainer to="/guests">
                                <NavItem className="nav-link">Guests</NavItem>
                            </LinkContainer>
                            <LinkContainer to="/templates">
                                <NavItem className="nav-link">Templates</NavItem>
                            </LinkContainer>

                            <NavDropdown id="reports" title="Reports">
                                <LinkContainer to="/dailySummaryReport">
                                    <NavDropdown.Item>Daily Summary</NavDropdown.Item>
                                </LinkContainer>
                                <NavDropdown.Divider/>
                                <LinkContainer to="/guestHistoryReport">
                                    <NavDropdown.Item>Guest History</NavDropdown.Item>
                                </LinkContainer>
                                <LinkContainer to="/monthlySummaryReport">
                                    <NavDropdown.Item>Monthly Summary</NavDropdown.Item>
                                </LinkContainer>
                            </NavDropdown>

                            <LinkContainer to="/checkins">
                                <NavItem className="nav-link">Checkins</NavItem>
                            </LinkContainer>

                        </Nav>

                        <FacilitySelector
                            elementClassName="col-5"
                            fieldClassName="col-6"
                            labelClassName="col-6 text-right text-light"
                        />

                    </Navbar.Collapse>

                </Navbar>

                <Switch>

                    <Route exact path="/checkins">
                        <CheckinView/>
                    </Route>
                    <Route exact path="/dailySummaryReport">
                        <DailySummaryReport/>
                    </Route>
                    <Route exact path="/facilities">
                        <FacilityView/>
                    </Route>
                    <Route exact path="/guestHistoryReport">
                        <GuestHistoryReport/>
                    </Route>
                    <Route exact path="/guests">
                        <GuestView/>
                    </Route>
                    <Route exact path="/monthlySummaryReport">
                        <MonthlySummaryReport/>
                    </Route>
                    <Route exact path="/templates">
                        <TemplateView/>
                    </Route>

                    <Route path="/">
                        <HomeView/>
                    </Route>

                </Switch>

            </Router>

        </FacilityContextProvider>

    );

}

export default App;
