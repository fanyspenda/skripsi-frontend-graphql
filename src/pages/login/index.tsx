import React, { useContext } from "react";
import { Segment, Card, Button, Label } from "semantic-ui-react";
import { useFormik } from "formik";
import CustomInputForm from "components/CustomInputForm";
import LoginSchema from "./loginValidation";
import axios from "axios";
import { TokenContext } from "contexts/tokenContext";
import { useHistory } from "react-router";
import { useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";

const Login: React.FunctionComponent = () => {
	const history = useHistory();
	const { dispatch } = useContext(TokenContext);
	const M_LOGIN = gql`
		mutation login($id: String!, $password: String!) {
			login(email: $id, password: $password) {
				token
			}
		}
	`;
	const [login, { data, loading, error }] = useMutation(M_LOGIN, {
		onCompleted: (data) => {
			localStorage.setItem("token", data.login.token);
			history.push("/listAlumni");
		},
		onError: (error) => {},
	});
	const formik = useFormik({
		initialValues: {
			name: "",
			email: "",
			password: "",
		},
		validationSchema: LoginSchema,
		onSubmit: async (values) => {
			login({
				variables: {
					id: values.email,
					password: values.password,
				},
			});
		},
	});
	return (
		<form onSubmit={formik.handleSubmit}>
			<Card centered>
				<Segment basic>
					<h1>LOGIN</h1>

					{loading && (
						<Label color="green">Mendapatkan Token...</Label>
					)}
					{error && <Label color="red">{error.message}</Label>}
					<br />
					<CustomInputForm
						label="Email"
						name="email"
						value={formik.values.email}
						onChange={formik.handleChange}
						error={formik.errors.email}
						touched={formik.touched.email}
					/>
					<CustomInputForm
						label="Password"
						name="password"
						type="password"
						value={formik.values.password}
						onChange={formik.handleChange}
						error={formik.errors.password}
						touched={formik.touched.password}
					/>
				</Segment>
				<Button type="submit" color="blue" fluid size="huge">
					MASUK
				</Button>
			</Card>
		</form>
	);
};

export default Login;
