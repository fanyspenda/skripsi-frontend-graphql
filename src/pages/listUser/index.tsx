import React, { useState, useEffect } from "react";
import useAuth from "hooks/useAuth";
import { Segment, Label, Table, Button } from "semantic-ui-react";
import { userType } from "interfaces/userInterface";
import { useHistory } from "react-router-dom";
import { page } from "interfaces/pageInterface";
import CustomPagination from "components/CustomPagination";
import { useQuery, useMutation } from "react-apollo";
import { gql } from "apollo-boost";

type userNoPass = Omit<userType, "password">;

const Q_USERS_WITH_PAGINATION = gql`
	query usersWithPagination($page: Int!, $limit: Int!) {
		userWithPagination(page: $page, limit: $limit) {
			users {
				_id
				name
				email
				level
			}
			userPage {
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
const M_DELETE_USER = gql`
	mutation deleteUser($id: String!) {
		deleteUser(id: $id)
	}
`;

const UserPage: React.FunctionComponent = () => {
	const { isTokenValid, level, token } = useAuth();
	const history = useHistory();
	const [users, setUsers] = useState<userNoPass[]>([
		{
			_id: "",
			email: "Email Not Found",
			name: "Name Not Found",
			level: 0,
		},
	]);
	const [currentPage, setCurrentPage] = useState(1);
	const [pages, setPages] = useState<page[]>([
		{
			page: 0,
			skip: 0,
		},
	]);
	const [totalUser, setTotalUser] = useState(0);
	const [totalpage, setTotalPage] = useState(0);

	const { loading } = useQuery(Q_USERS_WITH_PAGINATION, {
		fetchPolicy: "cache-and-network",
		context: {
			headers: {
				authorization: `bearer ${token}`,
			},
		},
		variables: {
			limit: 2,
			page: currentPage,
		},
		onCompleted: (data) => {
			setUsers(data.userWithPagination.users);
			setPages(data.userWithPagination.userPage.pages);
			setTotalUser(data.userWithPagination.totalData);
			setTotalPage(data.userWithPagination.userPage.totalPage);
		},
		onError: (error) => {
			return <Label color="red">{error.message}</Label>;
		},
	});
	const [deleteUser, { loading: delLoading, error: delError }] = useMutation(
		M_DELETE_USER,
		{
			context: {
				headers: {
					authorization: `bearer ${token}`,
				},
			},
			onCompleted: () => window.location.reload(true),
		}
	);

	const handleDeleteClick = (id: string) => {
		deleteUser({
			variables: { id },
		});
	};

	const handleEditClick = (user: userNoPass) => {
		history.push("/editUser", user);
	};

	useEffect(() => {
		isTokenValid();
	}, []);

	if (loading) return <h1>Loading...</h1>;

	return (
		<>
			<Segment basic disabled={loading}>
				<h1>Daftar Akun Pengguna</h1>
				<Label color="olive">jumlah pengguna: {totalUser}</Label>
				<Label color="olive">jumlah halaman: {totalpage}</Label>
				<Table color="blue" columns={3} stackable>
					<Table.Header>
						<Table.Row>
							<Table.HeaderCell
								rowSpan="2"
								textAlign="center"
								width={level == 0 ? 4 : 6}
							>
								<h4>Nama</h4>
							</Table.HeaderCell>
							<Table.HeaderCell
								rowSpan="2"
								textAlign="center"
								width={level == 0 ? 4 : 5}
							>
								<h4>Email</h4>
							</Table.HeaderCell>
							<Table.HeaderCell
								rowSpan="2"
								textAlign="center"
								width={level == 0 ? 4 : 5}
							>
								<h4>Role</h4>
							</Table.HeaderCell>
							{level == 0 && (
								<Table.HeaderCell
									colSpan="2"
									textAlign="center"
									width="4"
								/>
							)}
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{users.map((user, index: number) => (
							<Table.Row warning={loading}>
								<Table.Cell width={level == 0 ? 4 : 6}>
									{user.name}
								</Table.Cell>
								<Table.Cell width={level == 0 ? 4 : 5}>
									{user.email}
								</Table.Cell>
								<Table.Cell width={level == 0 ? 4 : 5}>
									{user.level == 0 ? "admin" : "user"}
								</Table.Cell>
								{level == 0 && (
									<>
										<Table.Cell width="1">
											<Button
												color="yellow"
												basic
												fluid
												onClick={() =>
													handleEditClick(user)
												}
											>
												EDIT
											</Button>
										</Table.Cell>
										<Table.Cell width="1">
											<Button
												color="violet"
												basic
												fluid
												onClick={() =>
													history.push(
														"/editUserPass",
														{
															id: user._id,
															name: user.name,
														}
													)
												}
											>
												RESET PASSWORD
											</Button>
										</Table.Cell>
										<Table.Cell width="1">
											<Button
												color="red"
												basic
												fluid
												onClick={() =>
													handleDeleteClick(user._id)
												}
											>
												HAPUS
											</Button>
										</Table.Cell>
									</>
								)}
							</Table.Row>
						))}
					</Table.Body>
				</Table>
				<Segment basic textAlign="center">
					<CustomPagination
						currentPage={currentPage}
						handlePageClick={setCurrentPage}
						data={pages}
					/>
				</Segment>
			</Segment>
		</>
	);
};

export default UserPage;
