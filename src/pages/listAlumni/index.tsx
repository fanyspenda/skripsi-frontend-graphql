import React, { useEffect, useState } from "react";
import { Card, Grid, Button, Label, Segment, Header } from "semantic-ui-react";
import { gql } from "apollo-boost";
import axios from "axios";
import AlumniCard from "./alumniCard";
import { page } from "interfaces/pageInterface";
import { useQuery, useLazyQuery } from "@apollo/react-hooks";

interface alumniListInterface {
	_id: string;
	name: string;
	work_at: string;
	work_position: string;
	email: string;
	data_source: string;
}

const ListAlumni: React.FunctionComponent<{}> = () => {
	const [currentPageL, setCurrentPageL] = useState(1);
	const [currentPage, setCurrentPage] = useState(1);
	const Q_ALUMNI_WITH_PAGINATION = gql`
	{
		alumniWithPagination(page: ${currentPage}, limit: 1) {
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

	{
		linkedinWithPagination(page: ${currentPageL}, limit: 40) {
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

	const { loading, data, error } = useQuery(Q_ALUMNI_WITH_PAGINATION);
	const { loading: loadingL, data: dataL, error: errorL } = useQuery(
		Q_LINKEDIN_WITH_PAGINATION
	);

	if (loading || loadingL)
		return <h1 style={{ textAlign: "center" }}>loading...</h1>;
	// const [
	// 	getLinkedin,
	// 	{ loading: loadingL, data: dataL, error: errorL },
	// ] = useLazyQuery(Q_LINKEDIN_WITH_PAGINATION);
	// const [getAlumni, { loading, data, error }] = useLazyQuery(
	// 	Q_ALUMNI_WITH_PAGINATION
	// );
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
								<AlumniCard alumni={alumni} />
							</Grid.Column>
						)
					)}

					<Grid.Row>
						<Grid.Column width={16} textAlign="center">
							{data.alumniWithPagination.alumniPage.pages.map(
								(page: page, index: number) =>
									page.page === currentPage ? (
										<Label color="grey" size="large">
											{page.page}
										</Label>
									) : (
										<Button
											color="teal"
											onClick={() =>
												setCurrentPage(page.page)
											}
										>
											{page.page}
										</Button>
									)
							)}
							<Header as="h5">{`total page: ${data.alumniWithPagination.alumniPage.totalPage}`}</Header>
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
								<AlumniCard alumni={alumni} />
							</Grid.Column>
						)
					)}

					<Grid.Row>
						<Grid.Column width={16} textAlign="center">
							{dataL.linkedinWithPagination.linkedinPage.pages.map(
								(page: page, index: number) =>
									page.page === currentPageL ? (
										<Label color="grey" size="large">
											{page.page}
										</Label>
									) : (
										<Button
											color="teal"
											onClick={() =>
												setCurrentPageL(page.page)
											}
										>
											{page.page}
										</Button>
									)
							)}
							<Header as="h5">{`total page ${dataL.linkedinWithPagination.linkedinPage.totalPage}`}</Header>
						</Grid.Column>
					</Grid.Row>
				</Grid>
			</Segment>
		</>
	);
};

export default ListAlumni;
