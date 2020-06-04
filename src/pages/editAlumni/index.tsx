import React, { useState, useEffect, useContext } from "react";
import { useFormik } from "formik";
import { Segment, Button } from "semantic-ui-react";
import axios from "axios";
import CustomInputForm from "../../components/CustomInputForm";
import CustomDropdownForm from "../../components/CustomDropdownForm";
import alumniInterface from "../../interfaces/alumniInterface";
import { useHistory, useLocation } from "react-router";
import AlumniSchema from "./editAlumniValidation";
import { gql } from "apollo-boost";
import { useQuery, useMutation } from "react-apollo";
import { TokenContext } from "contexts/tokenContext";

interface inputAlumni extends alumniInterface {
	data_source: string;
}

interface major {
	text: string;
	value: string;
}

const Q_GET_ALUMNI_DATA = gql`
	query getAlumniData($id: String!) {
		alumniDetail(id: $id) {
			name
			major
			entry_year
			graduate_year
			email
			work_at
			work_position
			data_source
		}

		majorWithPagination {
			majors {
				name
			}
		}
	}
`;

const M_UPDATE_ALUMNI = gql`
	mutation updateAlumni(
		$id: String!
		$name: String!
		$major: String!
		$entry_year: Int!
		$graduate_year: Int!
		$email: String!
		$work_at: String!
		$work_position: String!
		$data_source: String!
	) {
		updateAlumni(
			id: $id
			data: {
				name: $name
				major: $major
				entry_year: $entry_year
				graduate_year: $graduate_year
				email: $email
				work_at: $work_at
				work_position: $work_position
				data_source: $data_source
			}
		) {
			_id
		}
	}
`;
const EditAlumni: React.FunctionComponent = () => {
	const { token } = useContext(TokenContext);
	const location: any = useLocation();
	const history = useHistory();
	const [alumni, setAlumni] = useState<inputAlumni>({
		name: "",
		major: "",
		entry_year: 0,
		graduate_year: 0,
		email: "",
		work_at: "",
		work_position: "",
		data_source: "",
	});
	const [majors, setMajors] = useState<major[]>([{ text: "", value: "" }]);
	const [isDisabled, setIsDisabled] = useState(false);

	const { loading, error } = useQuery(Q_GET_ALUMNI_DATA, {
		context: {
			headers: { authorization: `bearer ${token}` },
		},
		variables: {
			id: location.state,
		},
		onCompleted: (data) => {
			let majorData: major[] = [];
			data.majorWithPagination.majors.map(
				(major: { name: string }, index: number) => {
					const newMajor = {
						text: major.name,
						value: major.name,
					};
					majorData.push(newMajor);
				}
			);
			setMajors(majorData);
			setAlumni(data.alumniDetail);
		},
	});

	const [updateAlumni, { loading: mLoading, error: mError }] = useMutation(
		M_UPDATE_ALUMNI,
		{
			context: {
				headers: { authorization: `bearer ${token}` },
			},
			onCompleted: () => {
				history.push("/alumni");
			},
		}
	);

	const formik = useFormik({
		enableReinitialize: true,
		initialValues: alumni,
		onSubmit: (values: inputAlumni) => {
			updateAlumni({
				variables: {
					id: location.state,
					name: values.name,
					major: values.major,
					entry_year: parseInt(values.entry_year as string),
					graduate_year: parseInt(values.graduate_year as string),
					email: values.email,
					work_at: values.work_at,
					work_position: values.work_position,
					data_source: values.data_source,
				},
			});
		},
		validationSchema: AlumniSchema,
	});

	if (loading) return <h1>loading...</h1>;
	return (
		<Segment basic disabled={mLoading}>
			<h1>Edit data Alumni</h1>
			<form onSubmit={formik.handleSubmit}>
				<CustomInputForm
					label="Nama"
					name="name"
					onChange={formik.handleChange}
					value={formik.values.name}
					touched={formik.touched.name}
					error={formik.errors.name}
				/>
				<CustomInputForm
					label="Tahun Mulai Kuliah"
					name="entry_year"
					onChange={formik.handleChange}
					value={formik.values.entry_year.toString()}
					touched={formik.touched.entry_year}
					error={formik.errors.entry_year}
				/>
				<CustomInputForm
					label="Tahun Lulus"
					name="graduate_year"
					onChange={formik.handleChange}
					value={formik.values.graduate_year.toString()}
					touched={formik.touched.graduate_year}
					error={formik.errors.graduate_year}
				/>
				<CustomDropdownForm
					label="Jurusan"
					placeholder="Pilih Jurusan"
					value={formik.values.major}
					onChange={(event, data) =>
						formik.setFieldValue("major", data.value)
					}
					options={majors}
					touched={formik.touched.major}
					error={formik.errors.major}
				/>

				<CustomInputForm
					label="Nama Tempat Kerja/Perusahaan"
					name="work_at"
					onChange={formik.handleChange}
					value={formik.values.work_at}
					touched={formik.touched.work_at}
					error={formik.errors.work_at}
				/>
				<CustomInputForm
					label="jabatan"
					name="work_position"
					onChange={formik.handleChange}
					value={formik.values.work_position}
					touched={formik.touched.work_position}
					error={formik.errors.work_position}
				/>
				<CustomInputForm
					label="Email"
					name="email"
					onChange={formik.handleChange}
					value={formik.values.email}
					touched={formik.touched.email}
					error={formik.errors.email}
				/>
				<br />
				<Segment textAlign="right" basic>
					<Button type="submit" color="blue" disabled={isDisabled}>
						Simpan Data Alumni
					</Button>
					<Button onClick={() => history.push("/listAlumni")}>
						Batal
					</Button>
				</Segment>
			</form>
		</Segment>
	);
};

export default EditAlumni;
