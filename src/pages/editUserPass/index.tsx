import React, { useEffect } from "react";
import { Card, Segment, Button, Label } from "semantic-ui-react";
import CustomInputForm from "components/CustomInputForm";
import { useFormik } from "formik";
import UserPassSchema from "./changePassValidation";
import { useLocation, useHistory } from "react-router-dom";
import useAuth from "hooks/useAuth";
import { useMutation } from "react-apollo";
import { gql } from "apollo-boost";

const M_RESET_PASSWORD = gql`
	mutation resetPassword($id: String!, $password: String!) {
		resetPass(id: $id, password: $password)
	}
`;

const EditUserPass: React.FunctionComponent = () => {
	const user: any = useLocation().state;
	const history = useHistory();
	const { isLevelMatch, level, token } = useAuth();
	const [resetPass, { loading, error }] = useMutation(M_RESET_PASSWORD, {
		context: {
			headers: {
				authorization: `bearer ${token}`,
			},
		},
		onCompleted: () => history.push("/users"),
	});
	const formik = useFormik({
		initialValues: { password: "", retypePassword: "" },
		validationSchema: UserPassSchema,
		onSubmit: (values) => {
			resetPass({
				variables: {
					id: user.id,
					password: values.password,
				},
			});
		},
	});

	useEffect(() => {
		isLevelMatch(level, 0);
		if (!user.id) history.replace("/users");
	}, []);

	return (
		<form onSubmit={formik.handleSubmit}>
			<Card centered>
				<Segment basic disabled={loading}>
					<h1>RESET PASSWORD</h1>
					<Segment textAlign="center" basic>
						<Label color="yellow">
							anda akan mengubah password milik <br />
							{user.name}
						</Label>
					</Segment>
					<CustomInputForm
						label="Password"
						name="password"
						type="password"
						value={formik.values.password}
						onChange={formik.handleChange}
						error={formik.errors.password}
						touched={formik.touched.password}
					/>
					<CustomInputForm
						label="Password"
						name="retypePassword"
						type="password"
						value={formik.values.retypePassword}
						onChange={formik.handleChange}
						error={formik.errors.retypePassword}
						touched={formik.touched.retypePassword}
					/>
				</Segment>
				<Button type="submit" color="blue" fluid size="huge">
					UBAH PASSWORD
				</Button>
			</Card>
		</form>
	);
};

export default EditUserPass;
