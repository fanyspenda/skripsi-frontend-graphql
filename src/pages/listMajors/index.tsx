import React, { useContext, useState } from "react";
import { Segment, Grid, Table, Tab, Label, Button } from "semantic-ui-react";
import { gql } from "apollo-boost";
import { useQuery } from "react-apollo";
import { TokenContext } from "contexts/tokenContext";
import { major } from "interfaces/majorInterface";
import CustomPagination from "components/CustomPagination";

const Q_GET_MAJORS = gql`
	query majorWithPagination($page: Int!) {
		majorWithPagination(page: $page, limit: 20) {
			majors {
				_id
				name
			}
			majorPage {
				totalPage
				pages {
					page
					skip
				}
			}
			totalData
		}
	}
`;

const MajorPage: React.SFC = () => {
	const { token } = useContext(TokenContext);
	const [currentPage, setCurrentPage] = useState(1);
	const { loading, data, error } = useQuery(Q_GET_MAJORS, {
		context: {
			headers: { authorization: `bearer ${token}` },
		},
		variables: {
			page: currentPage,
		},
	});

	if (loading) return <h1>Loading...</h1>;
	if (error) return <Label color="red">{error.message}</Label>;
	return (
		<Segment basic>
			<h1>Jurusan Terdaftar</h1>
			<Label color="olive">
				jumlah jurusan: {data.majorWithPagination.totalData}
			</Label>
			<Label color="olive">
				jumlah halaman: {data.majorWithPagination.majorPage.totalPage}
			</Label>
			<Table celled structured columns={3}>
				<Table.Header>
					<Table.Row>
						<Table.HeaderCell
							rowSpan="2"
							textAlign="center"
							width="11"
						>
							<h4>Nama Jurusan</h4>
						</Table.HeaderCell>
						<Table.HeaderCell
							colSpan="2"
							textAlign="center"
							width="4"
						>
							<h4>Aksi</h4>
						</Table.HeaderCell>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{data?.majorWithPagination.majors.map(
						(major: major, index: number) => (
							<Table.Row>
								<Table.Cell width="11">{major.name}</Table.Cell>
								<Table.Cell width="2">
									<Button color="yellow" basic fluid>
										EDIT
									</Button>
								</Table.Cell>
								<Table.Cell width="2">
									<Button color="red" basic fluid>
										HAPUS
									</Button>
								</Table.Cell>
							</Table.Row>
						)
					)}
				</Table.Body>
				<Table.Footer>
					<Table.Row>
						<Table.Cell>
							<CustomPagination
								currentPage={currentPage}
								handlePageClick={setCurrentPage}
								data={data.majorWithPagination.majorPage.pages}
							/>
						</Table.Cell>
					</Table.Row>
				</Table.Footer>
			</Table>
		</Segment>
	);
};

export default MajorPage;
