import React, { useContext, useState } from "react";
import { Segment, Grid, Table, Tab, Label, Button } from "semantic-ui-react";
import { gql } from "apollo-boost";
import { useQuery, useMutation } from "react-apollo";
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

const M_DELETE_MAJOR = gql`
	mutation deleteMajor($id: String!) {
		deleteMajor(id: $id) {
			_id
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
	const [deleteMajor, { loading: delLoading, error: delErr }] = useMutation(
		M_DELETE_MAJOR,
		{
			context: {
				headers: { authorization: `bearer ${token}` },
			},
			onCompleted: () => {
				window.location.reload(true);
			},
		}
	);

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
			<Table color="blue" structured columns={3} striped celled>
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
						/>
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
									<Button
										color="red"
										basic
										fluid
										onClick={() =>
											deleteMajor({
												variables: {
													id: major._id,
												},
											})
										}
									>
										HAPUS
									</Button>
								</Table.Cell>
							</Table.Row>
						)
					)}
				</Table.Body>
			</Table>
			<Segment basic textAlign="center">
				<CustomPagination
					currentPage={currentPage}
					handlePageClick={setCurrentPage}
					data={data.majorWithPagination.majorPage.pages}
				/>
			</Segment>
		</Segment>
	);
};

export default MajorPage;
