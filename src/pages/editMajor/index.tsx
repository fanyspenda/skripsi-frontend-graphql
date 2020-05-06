import React, { useContext, useState } from "react";
import { useFormik } from "formik";
import { gql } from "apollo-boost";
import { useMutation, useQuery } from "react-apollo";
import { Segment, Form, Label, Button } from "semantic-ui-react";
import CustomInputForm from "components/CustomInputForm";
import { editMajorValidationSchema } from "./editMajorValidation";
import { TokenContext } from "contexts/tokenContext";
import { useHistory, useLocation } from "react-router-dom";

const M_EDIT_MAJOR = gql`
	mutation updateMajor($id: String!, $name: String!) {
		updateMajor(id: $id, name: $name) {
			_id
		}
	}
`;

const Q_DETAIL_MAJOR = gql`
	query detailMajor($id: String!) {
		majorDetail(id: $id) {
			_id
			name
		}
	}
`;

const EditMajor: React.FunctionComponent = () => {
	const [major, setMajor] = useState({ id: "", degree: "", name: "" });
	const location = useLocation();
	const history = useHistory();
	const { token } = useContext(TokenContext);
	const { loading, error } = useQuery(Q_DETAIL_MAJOR, {
		variables: {
			id: location.state,
		},
		context: {
			headers: {
				authorization: `bearer ${token}`,
			},
		},
		onCompleted: (data) => {
			setMajor({
				id: data.majorDetail._id,
				name: data.majorDetail.name.replace(
					`${data.majorDetail.name.split(" ")[0]} `,
					""
				),
				degree: data.majorDetail.name.split(" ")[0],
			});
		},
		onError: () => {},
	});
	const [editMajor, { loading: mLoading, error: mError }] = useMutation(
		M_EDIT_MAJOR,
		{
			context: {
				headers: {
					authorization: `bearer ${token}`,
				},
			},
			onCompleted: () => {
				history.push("/majors");
			},
		}
	);
	const formik = useFormik({
		enableReinitialize: true,
		initialValues: major,
		onSubmit: (values) => {
			editMajor({
				variables: {
					id: values.id,
					name: `${values.degree} ${values.name}`,
				},
			});
		},
		validationSchema: editMajorValidationSchema,
	});

	if (loading) return <h1>loading...</h1>;
	if (error) return <Label color="red">{error.message}</Label>;
	return (
		<Segment basic>
			<h1>Edit Jurusan</h1>
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

export default EditMajor;
