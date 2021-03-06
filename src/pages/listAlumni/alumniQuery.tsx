import { gql } from "apollo-boost";

export const Q_ALUMNI_WITH_PAGINATION = gql`
	query alumniWithPagination($page: Int!, $name: String) {
		alumniWithPagination(page: $page, limit: 40, name: $name) {
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
export const Q_LINKEDIN_WITH_PAGINATION = gql`
	query linkedinWithPagination($page: Int!, $name: String) {
		linkedinWithPagination(page: $page, limit: 40, name: $name) {
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
export const Q_ALL_ALUMNI_WITH_PAGINATION = gql`
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

export const Q_SEARCH_ALUMNI_WITH_PAGINATION = gql`
	query allAlumni($name: String) {
		alumniWithPagination(page: 1, limit: 40, name: $name) {
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
		linkedinWithPagination(page: 1, limit: 40, name: $name) {
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
