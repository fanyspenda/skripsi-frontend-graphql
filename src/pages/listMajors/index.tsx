import React, { useContext, useState } from "react";
import { Segment, Grid, Table, Tab, Label, Button } from "semantic-ui-react";
import { gql } from "apollo-boost";
import { useQuery, useMutation } from "react-apollo";
import { TokenContext } from "contexts/tokenContext";
import { major } from "interfaces/majorInterface";
import CustomPagination from "components/CustomPagination";
import { useHistory, useLocation } from "react-router-dom";
import useAuth from "hooks/useAuth";

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

const MajorPage: React.FunctionComponent = () => {
	const location: any = useLocation();
	const previousPage = (location.state?.page as number) || 1;
	const history = useHistory();
	const { token, level } = useAuth();
	const [currentPage, setCurrentPage] = useState(previousPage);
	const { loading, data, error } = useQuery(Q_GET_MAJORS, {
		context: {
			headers: { authorization: `bearer ${token}` },
		},
		variables: {
			page: currentPage,
		},
		fetchPolicy: "cache-and-network",
	});
	const [deleteMajor, { loading: delLoading, error: delErr }] = useMutation(
		M_DELETE_MAJOR,
		{
			context: {
				headers: { authorization: `bearer ${token}` },
			},
			onCompleted: () => {
				history.replace("/majors", { page: currentPage });
				window.location.reload(true);
			},
		}
	);

	if (loading) return <h1>Loading...</h1>;
	if (error) return <Label color="red">{error.message}</Label>;
	return (
		<Segment basic loading={delLoading}>
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
							width={level == 0 ? "11" : "16"}
						>
							<h4>Nama Jurusan</h4>
						</Table.HeaderCell>
						{level == 0 ? (
							<Table.HeaderCell
								colSpan="2"
								textAlign="center"
								width="4"
							/>
						) : null}
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{data?.majorWithPagination.majors.map(
						(major: major, index: number) => (
							<Table.Row warning={delLoading}>
								<Table.Cell width={level == 0 ? "11" : "16"}>
									{major.name}
								</Table.Cell>
								{level == 0 ? (
									<>
										<Table.Cell width="2">
											<Button
												color="yellow"
												basic
												fluid
												onClick={() =>
													history.push(
														"/editMajor",
														major._id
													)
												}
											>
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
									</>
								) : null}
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
