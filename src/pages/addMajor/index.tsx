import React, { useContext } from "react";
import { useFormik } from "formik";
import { gql } from "apollo-boost";
import { useMutation } from "react-apollo";
import { Segment, Form, Label, Button } from "semantic-ui-react";
import CustomInputForm from "components/CustomInputForm";
import { addMajorValidationScehma } from "./addMajorValidation";
import { TokenContext } from "contexts/tokenContext";

const initialValues = {
	degree: "",
	name: "",
};

const M_ADD_MAJOR = gql`
	mutation addMajor($name: String!) {
		addMajor(name: $name) {
			_id
		}
	}
`;

const AddMajor: React.FunctionComponent = () => {
	const { token } = useContext(TokenContext);
	const [addMajor, { loading, error }] = useMutation(M_ADD_MAJOR, {
		context: {
			headers: {
				authorization: `bearer ${token}`,
			},
		},
	});
	const formik = useFormik({
		initialValues,
		onSubmit: (values) => {
			addMajor({
				variables: {
					name: `${values.degree} ${values.name}`,
				},
			});
		},
		validationSchema: addMajorValidationScehma,
	});

	return (
		<Segment basic>
			<h1>Tambah Jurusan</h1>
			<Form onSubmit={formik.handleSubmit}>
				<Form.Group inline>
					<div className="field">
						<Label>Gelar</Label>
					</div>

					<div className="field">
						<div className="ui radio checkbox">
							<input
								name="degree"
								type="radio"
								value="D-III"
								checked={formik.values.degree === "D-III"}
								onChange={formik.handleChange}
							/>
							<label>D-III</label>
						</div>
					</div>
					<div className="field">
						<div className="ui radio checkbox">
							<input
								name="degree"
								type="radio"
								value="D-IV"
								checked={formik.values.degree === "D-IV"}
								onChange={formik.handleChange}
							/>
							<label>D-IV</label>
						</div>
					</div>
				</Form.Group>

				{formik.errors.degree && formik.touched.degree && (
					<>
						<Label color="red" pointing="above">
							{formik.errors.degree}
						</Label>

						<br />
						<br />
					</>
				)}
				<CustomInputForm
					error={formik.errors.name}
					touched={formik.touched.name}
					label="Nama Jurusan"
					name="name"
					onChange={formik.handleChange}
					value={formik.values.name}
				/>
				<Button type="submit">Tambah Jurusan</Button>
			</Form>
		</Segment>
	);
};

export default AddMajor;
