import React, { useState, useContext } from "react";
import { Grid, Button, Label, Segment, Header } from "semantic-ui-react";
import { gql } from "apollo-boost";
import axios from "axios";
import AlumniCard from "./alumniCard";
import { useQuery } from "@apollo/react-hooks";
import { TokenContext } from "contexts/tokenContext";
import jwtDecoder from "jwt-decode";
import CustomPagination from "components/CustomPagination";

interface alumniListInterface {
	_id: string;
	name: string;
	work_at: string;
	work_position: string;
	email: string;
	data_source: string;
}

const Q_ALUMNI_WITH_PAGINATION = gql`
	query alumniWithPagination($page: Int!) {
		alumniWithPagination(page: $page, limit: 2) {
			alumni {
				_id
				name
				work_at
				work_position
				email
				data_source
			}
			alumniPage {
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
const Q_LINKEDIN_WITH_PAGINATION = gql`
	query linkedinWithPagination($page: Int!) {
		linkedinWithPagination(page: $page, limit: 40) {
			alumniLinkedin {
				_id
				name
				work_at
				work_position
				email
				data_source
			}
			linkedinPage {
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

const ListAlumni: React.FunctionComponent<{}> = () => {
	const { token } = useContext(TokenContext);
	const [currentPageL, setCurrentPageL] = useState(1);
	const [currentPage, setCurrentPage] = useState(1);
	const { loading, data, error } = useQuery(Q_ALUMNI_WITH_PAGINATION, {
		variables: {
			page: currentPage,
		},
		context: {
			headers: {
				authorization: `bearer ${token}`,
			},
		},
		fetchPolicy: "cache-and-network",
	});
	const { loading: loadingL, data: dataL, error: errorL } = useQuery(
		Q_LINKEDIN_WITH_PAGINATION,
		{
			variables: {
				page: currentPageL,
			},
			context: {
				headers: {
					authorization: `bearer ${token}`,
				},
			},
		}
	);

	if (loading || loadingL)
		return <h1 style={{ textAlign: "center" }}>loading...</h1>;

	if (error || errorL)
		return <Label color="red">{error?.message || errorL?.message}</Label>;
	const handleLinkedinScrap = () => {
		axios
			.get("http://localhost:5000/scraper")
			.then((res) => {
				alert("Selesai Men-scrape data dari linkedIn!");
			})
			.catch((err) => {
				alert(`terjadi kesalahan dalam scraper: ${err}`);
			});
	};

	return (
		<>
			<Segment basic disabled={loading || loadingL}>
				<h1>Data Input Manual</h1>
				<Grid columns={4} stackable>
					<Grid.Row>
						<Grid.Column>
							<Header as="h4">{`total data: ${data.alumniWithPagination.totalData}`}</Header>
						</Grid.Column>
					</Grid.Row>
					{data.alumniWithPagination.alumni.map(
						(alumni: alumniListInterface, index: number) => (
							<Grid.Column key={alumni._id}>
								<AlumniCard alumni={alumni} token={token} />
							</Grid.Column>
						)
					)}
					<Grid.Row>
						<Grid.Column width={16} textAlign="center">
							<CustomPagination
								currentPage={currentPage}
								totalPage={
									data.alumniWithPagination.alumniPage
										.totalPage
								}
								setCurrentPage={setCurrentPage}
								data={
									data.alumniWithPagination.alumniPage.pages
								}
							/>
						</Grid.Column>
					</Grid.Row>
				</Grid>
			</Segment>
			<Segment basic>
				<Grid columns={4} stackable>
					<Grid.Row>
						<Grid.Column width={8} textAlign="left">
							<h1>Data Linkedin</h1>
						</Grid.Column>
						<Grid.Column width={8} textAlign="right">
							<Button
								onClick={() => handleLinkedinScrap()}
								color="green"
							>
								Scrap From LinkedIn
							</Button>
						</Grid.Column>
					</Grid.Row>
					<Grid.Row>
						<Grid.Column>
							<Header as="h4">{`total data: ${dataL.linkedinWithPagination.totalData}`}</Header>
						</Grid.Column>
					</Grid.Row>
					{dataL.linkedinWithPagination.alumniLinkedin.map(
						(alumni: alumniListInterface, index: number) => (
							<Grid.Column key={alumni._id}>
								<AlumniCard alumni={alumni} token={token} />
							</Grid.Column>
						)
					)}

					<Grid.Row>
						<Grid.Column width={16} textAlign="center">
							<CustomPagination
								currentPage={currentPageL}
								setCurrentPage={setCurrentPageL}
								totalPage={
									dataL.linkedinWithPagination.linkedinPage
										.totalPage
								}
								data={
									dataL.linkedinWithPagination.linkedinPage
										.pages
								}
							/>
						</Grid.Column>
					</Grid.Row>
				</Grid>
			</Segment>
		</>
	);
};

export default ListAlumni;
