import React from "react";
import RedirectToLogin from "components/RedirectToLogin";

export interface DashboardProps {}

const Dashboard: React.SFC<DashboardProps> = () => {
	return (
		<>
			<RedirectToLogin />
			<h1>This is Dashboard</h1>
		</>
	);
};

export default Dashboard;
