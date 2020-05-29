import React, { useEffect } from "react";
import { Segment, Button, Label } from "semantic-ui-react";
import CustomInputForm from "components/CustomInputForm";
import { useFormik } from "formik";
import CustomDropdownForm from "components/CustomDropdownForm";
import AddUserValidationSchema from "./addUserValidationSchema";
import UseLoading from "hooks/useLoading";
import useAuth from "hooks/useAuth";
import Axios from "axios";
import { useHistory } from "react-router-dom";
import { gql } from "apollo-boost";
import { useMutation } from "react-apollo";

const role = [
	{
		text: "admin",
		value: 0,
	},
	{
		text: "user",
		value: 1,
	},
];

const M_ADD_USER = gql`
	mutation addUser(
		$name: String!
		$email: String!
		$password: String!
		$level: Int!
	) {
		addUser(
			data: {
				name: $name
				email: $email
				password: $password
				level: $level
			}
		)
	}
`;
const AddUser: React.FunctionComponent = () => {
	const history = useHistory();
	const { token, isLevelMatch, level } = useAuth();
	const [addUser, { loading, error }] = useMutation(M_ADD_USER, {
		context: {
			headers: {
				authorization: `bearer ${token}`,
			},
		},
		onCompleted: () => history.push("/users"),
		onError: () => {},
	});
	const formik = useFormik({
		initialValues: { name: "", level: 0, email: "", password: "" },
		validationSchema: AddUserValidationSchema,
		onSubmit: ({ email, name, password, level }) => {
			addUser({
				variables: {
					name,
					email,
					password,
					level,
				},
			});
		},
	});

	isLevelMatch(level, 0);

	return (
		<Segment basic disabled={loading}>
			<h1>Tambah Pengguna</h1>
			<form onSubmit={formik.handleSubmit}>
				{error && <Label color="red">{error.message}</Label>}
				<CustomInputForm
					label="Nama"
					name="name"
					onChange={formik.handleChange}
					value={formik.values.name}
					error={formik.errors.name}
					touched={formik.touched.name}
				/>
				<CustomInputForm
					label="Email"
					name="email"
					onChange={formik.handleChange}
					value={formik.values.email}
					error={formik.errors.email}
					touched={formik.touched.email}
				/>
				<CustomInputForm
					label="Password"
					name="password"
					onChange={formik.handleChange}
					value={formik.values.password}
					error={formik.errors.password}
					touched={formik.touched.password}
					type="password"
				/>
				<CustomDropdownForm
					label="Role"
					value={formik.values.level}
					onChange={(event, data) =>
						formik.setFieldValue("level", data.value)
					}
					options={role}
					placeholder="Pilih rolemu..."
					error={formik.errors.level}
					touched={formik.touched.level}
				/>

				<Button floated="right" type="submit" color="blue">
					Tambah Pengguna
				</Button>
			</form>
		</Segment>
	);
};

export default AddUser;
