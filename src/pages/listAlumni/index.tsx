import React, { useState, useContext } from "react";
import { Grid, Button, Label, Segment, Header } from "semantic-ui-react";
import { gql } from "apollo-boost";
import axios from "axios";
import AlumniCard from "./alumniCard";
import { useQuery, useLazyQuery } from "@apollo/react-hooks";
import { TokenContext } from "contexts/tokenContext";
import jwtDecoder from "jwt-decode";
import CustomPagination from "components/CustomPagination";
import { number } from "yup";

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
		alumniWithPagination(page: $page, limit: 40) {
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
const Q_ALL_ALUMNI_WITH_PAGINATION = gql`
	query allAlumni {
		alumniWithPagination(page: 1, limit: 40) {
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
		linkedinWithPagination(page: 1, limit: 40) {
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
	const [alumniL, setAlumniL] = useState<alumniListInterface[]>([
		{
			_id: "",
			name: "",
			work_at: "",
			work_position: "",
			email: "",
			data_source: "",
		},
	]);
	const [totalDataL, setTotalDataL] = useState(0);
	const [paginationL, setPaginationL] = useState({
		totalPage: 0,
		pages: [
			{
				page: 1,
				skip: 0,
			},
		],
	});
	const [alumni, setAlumni] = useState<alumniListInterface[]>([
		{
			_id: "",
			name: "",
			work_at: "",
			work_position: "",
			email: "",
			data_source: "",
		},
	]);
	const [totalData, setTotalData] = useState(0);
	const [pagination, setPagination] = useState({
		totalPage: 0,
		pages: [
			{
				page: 1,
				skip: 0,
			},
		],
	});
	const { token } = useContext(TokenContext);
	const [currentPageL, setCurrentPageL] = useState(1);
	const [currentPage, setCurrentPage] = useState(1);
	const { loading, error } = useQuery(Q_ALL_ALUMNI_WITH_PAGINATION, {
		context: {
			headers: {
				authorization: `bearer ${token}`,
			},
		},
		fetchPolicy: "cache-and-network",
		onCompleted: (data) => {
			setAlumniL(data.linkedinWithPagination.alumniLinkedin);
			setTotalDataL(data.linkedinWithPagination.totalData);
			setPaginationL(data.linkedinWithPagination.linkedinPage);
			setAlumni(data.alumniWithPagination.alumni);
			setTotalData(data.alumniWithPagination.totalData);
			setPagination(data.alumniWithPagination.alumniPage);
		},
		onError: (error) => {},
	});

	const [getAlumni, { loading: loadingA, error: errorA }] = useLazyQuery(
		Q_ALUMNI_WITH_PAGINATION,
		{
			context: {
				headers: { authorization: `bearer ${token}` },
			},
			onCompleted: (data) => {
				setAlumni(data.alumniWithPagination.alumni);
				setPagination(data.alumniWithPagination.alumniPage);
			},
		}
	);

	const [getAlumniL, { loading: loadingL, error: errorL }] = useLazyQuery(
		Q_LINKEDIN_WITH_PAGINATION,
		{
			context: {
				headers: { authorization: `bearer ${token}` },
			},
			onCompleted: (data) => {
				setAlumniL(data.linkedinWithPagination.alumniLinkedin);
				setPaginationL(data.linkedinWithPagination.linkedinPage);
			},
		}
	);

	const onPageClick = (pageClicked: number) => {
		setCurrentPage(pageClicked);
		getAlumni({ variables: { page: 3 } });
	};
	const onPageClickL = (pageClicked: number) => {
		setCurrentPageL(pageClicked);
		getAlumniL({ variables: { page: pageClicked } });
	};
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

	if (loading) return <h1 style={{ textAlign: "center" }}>loading...</h1>;
	if (error) return <Label color="red">{error?.message}</Label>;

	return (
		<>
			<Segment basic disabled={loadingA}>
				<h1>Data Input Manual</h1>
				<Grid columns={4} stackable>
					<Grid.Row>
						<Grid.Column>
							<Label color="olive">{`jumlah alumni: ${totalData}`}</Label>
							<Label color="olive">{`jumlah halaman: ${pagination.totalPage}`}</Label>
							{errorA && (
								<Label color="red">{errorA.message}</Label>
							)}
						</Grid.Column>
					</Grid.Row>
					{alumni.map(
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
								handlePageClick={onPageClick}
								data={pagination.pages}
							/>
						</Grid.Column>
					</Grid.Row>
				</Grid>
			</Segment>
			<Segment basic disabled={loadingL}>
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
								Scraping Ulang
							</Button>
						</Grid.Column>
					</Grid.Row>
					<Grid.Row>
						<Grid.Column>
							<Label color="olive">{`Jumlah Alumni: ${totalDataL}`}</Label>
							<Label color="olive">{`Jumlah halaman: ${paginationL.totalPage}`}</Label>
							{errorL && (
								<Label color="red">{errorL.message}</Label>
							)}
						</Grid.Column>
					</Grid.Row>
					{alumniL.map(
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
								handlePageClick={onPageClickL}
								data={paginationL.pages}
							/>
						</Grid.Column>
					</Grid.Row>
				</Grid>
			</Segment>
		</>
	);
};

export default ListAlumni;
