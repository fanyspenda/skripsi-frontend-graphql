import { Segment, Card, Label } from "semantic-ui-react";
import React, { useEffect, useState, useContext } from "react";
import { RouteComponentProps } from "react-router-dom";
import { useLocation } from "react-router";
import alumniInterface from "../../interfaces/alumniInterface";
import { useQuery } from "react-apollo";
import { gql } from "apollo-boost";
import { TokenContext } from "contexts/tokenContext";

interface DetailAlumniInterface extends alumniInterface {
	_id: string;
}

interface AlumniIdSource {
	_id: string;
	data_source: string;
}

const DetailAlumni: React.FunctionComponent<RouteComponentProps> = () => {
	const location = useLocation<AlumniIdSource>().state;
	const alumniSource = location.data_source;
	const { token } = useContext(TokenContext);
	const [alumni, setAlumni] = useState<DetailAlumniInterface>({
		_id: "",
		name: "",
		major: "",
		entry_year: 0,
		graduate_year: 0,
		email: "",
		work_at: "",
		work_position: "",
		data_source: "",
	});

	const Q_GET_ALUMNI_DETAIL = gql`
		query getAlumniDetail(
			$id: String!
			$alumniSkipped: Boolean!
			$linkedinSkipped: Boolean!
		) {
			alumniDetail(id: $id) @skip(if: $alumniSkipped) {
				_id
				name
				major
				entry_year
				graduate_year
				email
				work_at
				work_position
				data_source
			}

			linkedinDetail(id: $id) @skip(if: $linkedinSkipped) {
				_id
				name
				major
				entry_year
				graduate_year
				email
				work_at
				work_position
				data_source
			}
		}
	`;
	const { loading, data, error } = useQuery(Q_GET_ALUMNI_DETAIL, {
		variables: {
			id: location._id,
			alumniSkipped: alumniSource === "linkedin" ? true : false,
			linkedinSkipped: alumniSource !== "linkedin" ? true : false,
		},
		context: {
			headers: {
				authorization: `bearer ${token}`,
			},
		},
		fetchPolicy: "network-only",
		onCompleted: (data) => {
			setAlumni(data.alumniDetail || data.linkedinDetail);
		},
		onError: () => {},
	});

	const isWorkEmpty = (work_at: string, work_position: string) => {
		if (work_at == ``) {
			return `saat ini masih belum bekerja`;
		} else {
			return `saat ini bekerja di ${work_at} sebagai ${work_position}`;
		}
	};

	const isEmailEmpty = (email: string, name: string) => {
		if (email == "") {
			return `email tidak dapat ditemukan`;
		} else {
			return `anda dapat menghubungi ${name} dengan menghubungi email ${email}`;
		}
	};

	const {
		name,
		data_source,
		work_at,
		work_position,
		email,
		major,
		entry_year,
		graduate_year,
	} = alumni;

	if (error) return <Label color="red">{error?.message}</Label>;
	if (loading) return <h1>Loading...</h1>;
	return (
		<Segment basic>
			<Card centered fluid>
				<Card.Content>
					<Card.Header>{name}</Card.Header>
					<Card.Meta>{isWorkEmpty(work_at, work_position)}</Card.Meta>
					<Card.Description>{`mengambil Jurusan ${major}`}</Card.Description>
					<Card.Description>{`Mulai berkuliah tahun ${entry_year} dan lulus tahun ${graduate_year}`}</Card.Description>
					<Card.Description>{`data didapat dari ${data_source}`}</Card.Description>
					<br />
					<Card.Description>
						{isEmailEmpty(email, name)}
					</Card.Description>
				</Card.Content>
			</Card>
		</Segment>
	);
};

export default DetailAlumni;
