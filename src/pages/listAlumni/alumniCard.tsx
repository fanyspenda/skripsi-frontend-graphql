import React from "react";
import alumniInterface from "interfaces/alumniInterface";
import { Card, Label } from "semantic-ui-react";
import { useHistory } from "react-router";
import EditDeleteButton from "components/EditDeleteButton";
import { gql } from "apollo-boost";
import { useMutation } from "react-apollo";
import jwtDecoder from "jwt-decode";

interface alumniCardProps
	extends Omit<alumniInterface, "entry_year" | "graduate_year" | "major"> {
	_id: string;
}

interface alumniData {
	alumni: alumniCardProps;
	token: string;
}

interface token {
	name: string;
	level: number;
}
const M_DELETE_ALUMNI = gql`
	mutation deleteAlumni($id: String!) {
		deleteAlumni(id: $id) {
			_id
		}
	}
`;

const AlumniCard: React.FunctionComponent<alumniData> = ({ alumni, token }) => {
	const history = useHistory();
	const decoded: token = jwtDecoder(token);
	const [
		deleteAlumni,
		{ loading: deleteLoading, error: deleteError },
	] = useMutation(M_DELETE_ALUMNI, {
		context: {
			headers: {
				authorization: `bearer ${token}`,
			},
		},
		onCompleted: () => {
			window.location.reload(true);
		},
		onError: (error) => alert(error.message),
	});

	const handleCardClick = (_id: string, data_source: string) => {
		const data = {
			_id,
			data_source,
		};
		history.push("/detailAlumni", data);
	};
	const handleEditClick = (_id: string) => {
		history.push("/editAlumni", _id);
	};

	const handleDeleteClick = () => {
		deleteAlumni({
			variables: {
				id: alumni._id,
			},
		});
	};

	return (
		<Card centered link>
			{deleteLoading && <Label color="yellow">menghapus...</Label>}
			<Card.Content
				onClick={() => handleCardClick(alumni._id, alumni.data_source)}
			>
				<Card.Header>{alumni.name}</Card.Header>
				<Card.Meta>{alumni.work_at}</Card.Meta>
				<Card.Description>{`${alumni.work_position}`}</Card.Description>
				<Card.Description>{`${alumni.email}`}</Card.Description>
			</Card.Content>
			<Card.Content extra>
				{alumni.data_source == "manual" && decoded.level == 0 ? (
					<EditDeleteButton
						onEditClick={() => handleEditClick(alumni._id)}
						onDeleteClick={() => handleDeleteClick()}
					/>
				) : null}
			</Card.Content>
		</Card>
	);
};

export default AlumniCard;
