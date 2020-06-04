import React, { useContext, useState } from "react";
import RedirectToLogin from "components/RedirectToLogin";
import {
	Segment,
	Label,
	Grid,
	IconProps,
	StatisticProps,
	Divider,
} from "semantic-ui-react";
import { gql } from "apollo-boost";
import { useQuery } from "react-apollo";
import { TokenContext } from "contexts/tokenContext";
import StatisticCard from "./StatisticCard";
import useAuth from "hooks/useAuth";

interface totalDataProps {
	label: string;
	icon: IconProps["name"];
	color: StatisticProps["color"];
	total: number;
}

const Q_GET_ALL_TOTAL = gql`
	query counter {
		countWorkingAlumni
		countNotWorkingAlumni
		countTotalAlumni
		countLinkedin
		countAlumniManual
	}
`;

const Dashboard: React.FunctionComponent = () => {
	const { token, isTokenValid } = useAuth();
	const [totalData, setTotalData] = useState<totalDataProps[]>([
		{ label: "", total: 0, icon: undefined, color: undefined },
	]);
	const [sourceData, setSourceData] = useState<totalDataProps[]>([
		{ label: "", total: 0, icon: undefined, color: undefined },
	]);
	const { error } = useQuery(Q_GET_ALL_TOTAL, {
		context: {
			headers: {
				authorization: `bearer ${token}`,
			},
		},
		onCompleted: (data) => {
			setTotalData([
				{
					label: "Alumni Terdaftar",
					icon: "graduation",
					color: "blue",
					total: data.countTotalAlumni,
				},
				{
					label: "Sudah Bekerja",
					icon: "suitcase",
					color: "green",
					total: data.countWorkingAlumni,
				},
				{
					label: "Belum Bekerja",
					icon: "group",
					color: "red",
					total: data.countNotWorkingAlumni,
				},
			]);

			setSourceData([
				{
					label: "Linkedin",
					icon: "linkedin",
					color: "orange",
					total: data.countLinkedin,
				},
				{
					label: "Input Manual",
					icon: "edit",
					color: "orange",
					total: data.countAlumniManual,
				},
			]);
		},
	});

	if (error) return <Label color="red">{error.message}</Label>;
	return (
		<>
			{isTokenValid()}
			<h1>Data Alumni</h1>
			<Segment basic>
				<Grid stackable textAlign="center">
					<Grid.Row>
						{totalData.map((value, index) => {
							return (
								<Grid.Column width="4" textAlign="center">
									<StatisticCard {...value} />
								</Grid.Column>
							);
						})}
					</Grid.Row>
				</Grid>
			</Segment>
			<Divider />

			<h1>Sumber Data</h1>
			<Segment basic>
				<Grid stackable textAlign="center">
					<Grid.Row>
						{sourceData.map((value, index) => {
							return (
								<Grid.Column width="5" textAlign="center">
									<StatisticCard
										color={value.color}
										icon={value.icon}
										total={value.total}
										label={value.label}
									/>
								</Grid.Column>
							);
						})}
					</Grid.Row>
				</Grid>
			</Segment>
		</>
	);
};

export default Dashboard;
