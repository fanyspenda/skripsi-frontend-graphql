import React from "react";
import { Card, Grid, Button, Label } from "semantic-ui-react";
import { gql } from "apollo-boost";
import axios from "axios";
import AlumniCard from "./alumniCard";
import { page } from "interfaces/pageInterface";
import { useQuery } from "@apollo/react-hooks";

interface alumniListInterface {
	_id: string;
	name: string;
	work_at: string;
	work_position: string;
	email: string;
	data_source: string;
}

const getLinkedinAndPagination = gql`
	{
		queryLinkedin(page: 1, limit: 40) {
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
		}
	}
`;

const ListAlumni: React.FunctionComponent<{}> = () => {
	const { loading, error, data } = useQuery(getLinkedinAndPagination);
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

	if (loading) return <h1>loading...</h1>;
	if (error) return <p>{"Error getting Data: " + error.message}</p>;

	return (
		<>
			<h1>Data Input Manual</h1>
			{/* <Grid columns={4} stackable>
				{data.alumnis.map((alumni, index) => (
					<Grid.Column key={alumni._id}>
						<AlumniCard alumni={alumni} />
					</Grid.Column>
				))}
			</Grid> */}
			<br />
			<br />
			<br />
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
				{data.queryLinkedin.alumniLinkedin.map(
					(alumni: alumniListInterface, index: number) => (
						<Grid.Column key={alumni._id}>
							<AlumniCard alumni={alumni} />
						</Grid.Column>
					)
				)}
				<Grid.Row>
					<Grid.Column width={16} textAlign="center">
						{data.queryLinkedin.linkedinPage.pages.map(
							(page: page, index: number) => (
								// page.number === currentPageLinkedin ? (
								// 	<Label color="grey" size="large">
								// 		{page.number}
								// 	</Label>
								// ) : (
								<Button
									color="instagram"
									onClick={() => {
										alert(
											` ${page.page} will skip ${page.skip} `
										);
										console.log(getLinkedinAndPagination);
									}}
								>
									{page.page}
								</Button>
							)
							// )
						)}
					</Grid.Column>
				</Grid.Row>
			</Grid>
		</>
	);
};

export default ListAlumni;
