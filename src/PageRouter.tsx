import React from "react";
import { Route } from "react-router-dom";
import AddAlumni from "pages/addAlumni";
import DetailAlumni from "pages/detailAlumni";
import EditAlumni from "pages/editAlumni";
import Register from "pages/register";
import Login from "pages/login";
import Dashboard from "pages/dashboard";
import AlumniPage from "pages/listAlumni";
import MajorPage from "pages/listMajors";
import AddMajor from "pages/addMajor";
import EditMajor from "pages/editMajor";
import UserPage from "pages/listUser";
import EditUser from "pages/editUser";
import EditUserPass from "pages/editUserPass";

const PageRouter: React.FunctionComponent = () => {
	return (
		<>
			<Route exact path="/" component={Dashboard} />
			<Route exact path="/majors" component={MajorPage} />
			<Route exact path="/users" component={UserPage} />
			<Route exact path="/editUser" component={EditUser} />
			<Route exact path="/editUserPass" component={EditUserPass} />
			<Route exact path="/alumni" component={AlumniPage} />
			<Route exact path="/register" component={Register} />
			<Route exact path="/login" component={Login} />
			<Route exact path="/addAlumni" component={AddAlumni} />
			<Route exact path="/addMajor" component={AddMajor} />
			<Route exact path="/editAlumni" component={EditAlumni} />
			<Route exact path="/editMajor" component={EditMajor} />
			<Route exact path="/detailAlumni" component={DetailAlumni} />
		</>
	);
};

export default PageRouter;
