import { Label, Button, Header } from "semantic-ui-react";
import React from "react";
import { page } from "interfaces/pageInterface";

export interface CustomPaginationProps {
	data: any[];
	currentPage: number;
	handlePageClick: (page: number) => void;
}

const CustomPagination: React.FunctionComponent<CustomPaginationProps> = ({
	data,
	currentPage,
	handlePageClick,
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
							onClick={() => handlePageClick(page.page)}
						>
							{page.page}
						</Button>
					);
			})}
		</>
	);
};

export default CustomPagination;
