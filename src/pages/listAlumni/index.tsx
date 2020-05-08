import React, { useState, useContext } from "react";
import {
	Grid,
	Button,
	Label,
	Segment,
	Divider,
	Input,
	Icon,
	Form,
} from "semantic-ui-react";
import {
	Q_ALL_ALUMNI_WITH_PAGINATION,
	Q_ALUMNI_WITH_PAGINATION,
	Q_LINKEDIN_WITH_PAGINATION,
	Q_SEARCH_ALUMNI_WITH_PAGINATION,
} from "./alumniQuery";
import axios from "axios";
import { useQuery, useLazyQuery } from "@apollo/react-hooks";
import { TokenContext } from "contexts/tokenContext";
import AlumniList from "./alumniList";
import RedirectToLogin from "components/RedirectToLogin";
import { useFormik } from "formik";

interface alumniListInterface {
	_id: string;
	name: string;
	work_at: string;
	work_position: string;
	email: string;
	data_source: string;
}

const AlumniPage: React.FunctionComponent<{}> = () => {
	const { token } = useContext(TokenContext);
	const [search, setSearch] = useState("");
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
			fetchPolicy: "network-only",
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
			fetchPolicy: "network-only",
		}
	);

	const [searchAlumni, { loading: loadingS, error: errorS }] = useLazyQuery(
		Q_SEARCH_ALUMNI_WITH_PAGINATION,
		{
			context: {
				headers: { authorization: `bearer ${token}` },
			},
			fetchPolicy: "network-only",
			onCompleted: (data) => {
				setAlumniL(data.linkedinWithPagination.alumniLinkedin);
				setTotalDataL(data.linkedinWithPagination.totalData);
				setPaginationL(data.linkedinWithPagination.linkedinPage);
				setAlumni(data.alumniWithPagination.alumni);
				setTotalData(data.alumniWithPagination.totalData);
				setPagination(data.alumniWithPagination.alumniPage);
				setCurrentPage(1);
				setCurrentPageL(1);
			},
		}
	);

	const onPageClick = (pageClicked: number) => {
		setCurrentPage(pageClicked);
		getAlumni({ variables: { page: pageClicked, name: search } });
	};
	const onPageClickL = (pageClicked: number) => {
		setCurrentPageL(pageClicked);
		getAlumniL({ variables: { page: pageClicked, name: search } });
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

	const formik = useFormik({
		initialValues: { search: "" },
		onSubmit: (values) => {
			setSearch(values.search);
			searchAlumni({
				variables: {
					page: 1,
					name: values.search,
				},
			});
		},
	});

	if (loading) return <h1 style={{ textAlign: "center" }}>loading...</h1>;
	if (error) return <RedirectToLogin />;

	return (
		<>
			<Segment basic>
				<Form onSubmit={formik.handleSubmit}>
					<Grid stackable textAlign="center">
						<Grid.Row>
							<Grid.Column width="10">
								<Input
									name="search"
									onChange={formik.handleChange}
									values={formik.values.search}
									placeholder="cari alumni di sini..."
									fluid
								/>
							</Grid.Column>
							<Grid.Column width="2" textAlign="center">
								<Button fluid color="green" type="submit">
									<Icon name="search" />
									Cari
								</Button>
							</Grid.Column>
						</Grid.Row>
					</Grid>
				</Form>
			</Segment>
			<Segment basic disabled={loadingA}>
				<h1>Data Input Manual</h1>
				<Grid columns={4} stackable>
					<AlumniList
						alumni={alumni}
						currentPage={currentPage}
						onPageClick={onPageClick}
						pages={pagination.pages}
						totalPage={pagination.totalPage}
						totalData={totalData}
					/>
					{errorA && <Label color="red">{errorA.message}</Label>}
				</Grid>
			</Segment>
			<Divider />

			<Segment basic disabled={loadingL}>
				<Grid columns={4} stackable>
					<Grid.Row>
						<Grid.Column width={8} textAlign="left">
							<h1>Data Linkedin</h1>
						</Grid.Column>
						<Grid.Column width={8} textAlign="right">
							<Button
								onClick={() => handleLinkedinScrap()}
								color="orange"
							>
								Scraping Ulang
							</Button>
						</Grid.Column>
					</Grid.Row>
					<AlumniList
						alumni={alumniL}
						currentPage={currentPageL}
						onPageClick={onPageClickL}
						pages={paginationL.pages}
						totalData={totalDataL}
						totalPage={paginationL.totalPage}
					/>
					{errorL && <Label color="red">{errorL.message}</Label>}
				</Grid>
			</Segment>
			<Divider />
		</>
	);
};

export default AlumniPage;
