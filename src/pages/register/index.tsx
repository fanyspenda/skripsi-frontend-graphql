import React from "react";
import { Segment, Card, Button, Label } from "semantic-ui-react";
import { useFormik } from "formik";
import CustomInputForm from "components/CustomInputForm";
import RegisterSchema from "./registerValidation";
import axios from "axios";
import { useHistory, Redirect } from "react-router-dom";
import { useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { TokenContext } from "contexts/tokenContext";

const Register: React.FunctionComponent = () => {
	const history = useHistory();
	const M_REGISTER = gql`
		mutation register(
			$name: String!
			$email: String!
			$password: String!
			$level: Int!
		) {
			register(
				data: {
					name: $name
					email: $email
					password: $password
					level: $level
				}
			)
		}
	`;
	const [register, { loading, error }] = useMutation(M_REGISTER, {
		onCompleted: (data) => {
			history.push("/login");
		},
		onError: () => {},
	});

	const formik = useFormik({
		initialValues: {
			name: "",
			email: "",
			password: "",
			level: 1,
		},
		validationSchema: RegisterSchema,
		onSubmit: (values) => {
			register({
				variables: {
					name: values.name,
					email: values.email,
					password: values.password,
					level: values.level,
				},
			});
		},
	});
	return (
		<>
			<form onSubmit={formik.handleSubmit}>
				<Card centered>
					<Segment basic>
						<h1>REGISTER</h1>
						{loading && (
							<Label color="green">
								Proses menyimpan data...
							</Label>
						)}
						{error && <Label color="red">{error.message}</Label>}
						<CustomInputForm
							label="Name"
							name="name"
							value={formik.values.name}
							onChange={formik.handleChange}
							error={formik.errors.name}
							touched={formik.touched.name}
						/>
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
						DAFTAR
					</Button>
				</Card>
			</form>
		</>
	);
};

export default Register;
