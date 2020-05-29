import React from "react";
import { Segment, Button, Label } from "semantic-ui-react";
import UseLoading from "hooks/useLoading";
import useAuth from "hooks/useAuth";
import { useFormik } from "formik";
import CustomInputForm from "components/CustomInputForm";
import { useLocation, useHistory } from "react-router-dom";
import CustomDropdownForm from "components/CustomDropdownForm";
import EditUserValidationSchema from "./editUserValidation";
import Axios from "axios";
import { useMutation } from "react-apollo";
import { gql } from "apollo-boost";

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

const M_UPDATE_USER = gql`
	mutation updateUser(
		$id: String!
		$name: String!
		$email: String!
		$level: Int!
	) {
		updateUser(id: $id, data: { name: $name, email: $email, level: $level })
	}
`;

const EditUser: React.FunctionComponent = () => {
	const location = useLocation();
	const history = useHistory();
	const user: any = location.state;
	const { isLevelMatch, token, level } = useAuth();
	const [updateUser, { loading, error }] = useMutation(M_UPDATE_USER, {
		context: {
			headers: {
				authorization: `bearer ${token}`,
			},
		},
		onCompleted: () => {
			history.push("/users");
		},
	});
	const formik = useFormik({
		initialValues: {
			name: user.name as string,
			level: user.level as number,
			email: user.email as string,
		},
		validationSchema: EditUserValidationSchema,
		onSubmit: (values) => {
			updateUser({
				variables: {
					id: user._id,
					name: values.name,
					email: values.email,
					level: values.level,
				},
			});
		},
	});
	return (
		<Segment basic disabled={loading}>
			{isLevelMatch(level, 0)}
			<h1>Ubah Data Pengguna</h1>
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
					Ubah Data Pengguna
				</Button>
			</form>
		</Segment>
	);
};

export default EditUser;
