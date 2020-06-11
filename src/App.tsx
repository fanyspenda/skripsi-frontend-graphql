import React from "react";
import { Menu, Segment, Icon } from "semantic-ui-react";
import { Router, Link } from "react-router-dom";
import { createBrowserHistory } from "history";
import TokenContextProvider, { TokenContext } from "contexts/tokenContext";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "@apollo/react-hooks";
import CustomMenu from "components/CustomMenu";
import PageRouter from "PageRouter";

const App: React.FunctionComponent<{}> = () => {
	const client = new ApolloClient({
		uri: "https://sialumni-backend-graphql.herokuapp.com/graphql",
	});

	const history = createBrowserHistory();
	return (
		<ApolloProvider client={client}>
			<TokenContextProvider>
				<Router history={history}>
					<Menu inverted color="blue" attached stackable>
						<Menu.Item header as={Link} to="/" exact>
							<Icon name="graduation" />
							Alumni Tracker
						</Menu.Item>

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
