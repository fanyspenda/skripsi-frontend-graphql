import React, { useContext } from "react";
import { Menu, Dropdown, Segment } from "semantic-ui-react";
import { Router, Link, Route, Redirect, Switch } from "react-router-dom";
import { createBrowserHistory } from "history";
import AddAlumni from "./pages/addAlumni";
import ListAlumni from "./pages/listAlumni";
import DetailAlumni from "./pages/detailAlumni";
import EditAlumni from "./pages/editAlumni";
import TokenContextProvider, { TokenContext } from "contexts/tokenContext";
import Register from "pages/register";
import Login from "pages/login";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "@apollo/react-hooks";
import CustomMenu from "components/CustomMenu";
import Dashboard from "pages/dashboard";
import PageRouter from "PageRouter";

const App: React.FunctionComponent<{}> = () => {
	const client = new ApolloClient({
		uri: "http://localhost:4100/graphql",
	});

	const history = createBrowserHistory();
	return (
		<ApolloProvider client={client}>
			<TokenContextProvider>
				<Router history={history}>
					<Menu inverted color="blue" attached>
						<Menu.Item header>Alumni Tracker</Menu.Item>
						<TokenContext.Consumer>
							{(value) => <CustomMenu token={value.token} />}
						</TokenContext.Consumer>
					</Menu>
					<Segment basic>
						<PageRouter />
					</Segment>
				</Router>
			</TokenContextProvider>
		</ApolloProvider>
	);
};

export default App;
