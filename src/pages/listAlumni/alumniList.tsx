import React, { useContext } from "react";
import { Grid, Label } from "semantic-ui-react";
import AlumniCard from "./alumniCard";
import CustomPagination from "components/CustomPagination";
import { page } from "interfaces/pageInterface";
import { TokenContext } from "contexts/tokenContext";

interface alumniListInterface {
	_id: string;
	name: string;
	work_at: string;
	work_position: string;
	email: string;
	data_source: string;
}

interface AlumniListProps {
	totalData: number;
	totalPage: number;
	alumni: alumniListInterface[];
	currentPage: number;
	onPageClick: (pageClicked: number) => void;
	pages: page[];
}

const AlumniList: React.FunctionComponent<AlumniListProps> = ({
	totalData,
	totalPage,
	alumni,
	currentPage,
	onPageClick,
	pages,
}) => {
	const { token } = useContext(TokenContext);

	return (
		<>
			<Grid.Row>
				<Grid.Column>
					<Label color="olive">{`jumlah alumni: ${totalData}`}</Label>
					<Label color="olive">{`jumlah halaman: ${totalPage}`}</Label>
				</Grid.Column>
			</Grid.Row>
			{alumni.map((alumni: alumniListInterface, index: number) => (
				<Grid.Column key={alumni._id}>
					<AlumniCard alumni={alumni} token={token} />
				</Grid.Column>
			))}
			<Grid.Row>
				<Grid.Column width={16} textAlign="center">
					<CustomPagination
						currentPage={currentPage}
						handlePageClick={onPageClick}
						data={pages}
					/>
				</Grid.Column>
			</Grid.Row>
		</>
	);
};

export default AlumniList;
