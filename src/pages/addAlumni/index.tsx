import React, { useState, useContext } from "react";
import { useFormik } from "formik";
import { Segment, Button, Label } from "semantic-ui-react";
import axios from "axios";
import CustomInputForm from "../../components/CustomInputForm";
import CustomDropdownForm from "../../components/CustomDropdownForm";
import alumniInterface from "../../interfaces/alumniInterface";
import { useHistory } from "react-router";
import addAlumniValidationSchema from "./addAlumniValidation";
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

const initialValueAlumni: inputAlumni = {
	name: "",
	entry_year: 1986,
	graduate_year: new Date().getFullYear(),
	major: "",
	work_at: "",
	work_position: "",
	email: "",
	data_source: "manual",
};

const Q_GET_MAJORS = gql`
	query majorWithPagination {
		majorWithPagination {
			majors {
				name
			}
		}
	}
`;

const M_ADD_ALUMNI = gql`
	mutation addAlumni(
		$name: String!
		$entry_year: Int!
		$graduate_year: Int!
		$major: String!
		$work_at: String!
		$work_position: String!
		$email: String!
		$data_source: String!
	) {
		addAlumni(
			data: {
				name: $name
				entry_year: $entry_year
				graduate_year: $graduate_year
				major: $major
				work_at: $work_at
				work_position: $work_position
				email: $email
				data_source: $data_source
			}
		) {
			_id
		}
	}
`;

const AddAlumni: React.FunctionComponent = () => {
	const { token } = useContext(TokenContext);
	const [majors, setMajors] = useState<major[]>([{ text: "", value: "" }]);
	const history = useHistory();
	const formik = useFormik({
		initialValues: initialValueAlumni,
		onSubmit: async (values) => {
			await addAlumni({
				variables: {
					name: values.name,
					entry_year: parseInt(values.entry_year as string),
					graduate_year: parseInt(values.graduate_year as string),
					major: values.major,
					work_at: values.work_at,
					work_position: values.work_position,
					email: values.email,
					data_source: values.data_source,
				},
			});
		},
		validationSchema: addAlumniValidationSchema,
	});
	const { loading, error } = useQuery(Q_GET_MAJORS, {
		context: {
			headers: {
				authorization: `bearer ${token}`,
			},
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
		},
		onError: (error) => {},
	});

	const [
		addAlumni,
		{ loading: submitLoading, error: submitError },
	] = useMutation(M_ADD_ALUMNI, {
		onCompleted: () => {
			history.push("/alumni");
		},
		context: {
			headers: {
				authorization: `bearer ${token}`,
			},
		},
	});

	if (loading) return <h1>loading...</h1>;
	if (error || submitError)
		return (
			<Label color="red">{error?.message || submitError?.message}</Label>
		);
	return (
		<Segment basic>
			<h1>Tambah data Alumni</h1>
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
					<Button type="submit" color="blue" disabled={submitLoading}>
						Simpan Data Alumni
					</Button>
					<Button onClick={() => history.push("/alumni")}>
						Batal
					</Button>
				</Segment>
			</form>
		</Segment>
	);
};

export default AddAlumni;
