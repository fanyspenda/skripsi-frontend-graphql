import React from "react";
import { Router, Link, Route, Redirect, Switch } from "react-router-dom";
import { createBrowserHistory } from "history";
import { TokenContext } from "contexts/tokenContext";
import AddAlumni from "pages/addAlumni";
import ListAlumni from "pages/listAlumni";
import DetailAlumni from "pages/detailAlumni";
import EditAlumni from "pages/editAlumni";
import Register from "pages/register";
import Login from "pages/login";
import Dashboard from "pages/dashboard";

export interface RoutesProps {}

const PageRouter: React.SFC<RoutesProps> = () => {
	// const history = createBrowserHistory();
	return (
		<>
			<Route exact path="/" component={Dashboard} />
			<Route exact path="/addAlumni" component={AddAlumni} />
			<Route exact path="/listAlumni" component={ListAlumni} />
			<Route exact path="/detailAlumni" component={DetailAlumni} />
			<Route exact path="/editAlumni" component={EditAlumni} />
			<Route exact path="/register" component={Register} />
			<Route exact path="/login" component={Login} />
		</>
	);
};

export default PageRouter;
