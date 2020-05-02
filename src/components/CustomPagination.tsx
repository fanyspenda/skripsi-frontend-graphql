import { Label, Button, Header } from "semantic-ui-react";
import React from "react";
import { page } from "interfaces/pageInterface";

export interface CustomPaginationProps {
	data: any[];
	currentPage: number;
	totalPage: number;
	setCurrentPage: (page: number) => void;
}

const CustomPagination: React.FunctionComponent<CustomPaginationProps> = ({
	data,
	currentPage,
	setCurrentPage,
	totalPage,
}) => {
	return (
		<>
			{data.map((page: page, index: number) => {
				if (page.page === currentPage) {
					return (
						<Label color="grey" size="large">
							{page.page}
						</Label>
					);
				} else
					return (
						<Button
							color="teal"
							onClick={() => setCurrentPage(page.page)}
						>
							{page.page}
						</Button>
					);
			})}
			<Header as="h5">{`total page: ${totalPage}`}</Header>
		</>
	);
};

export default CustomPagination;
