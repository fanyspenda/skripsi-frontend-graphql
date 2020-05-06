import React from "react";
import { Input, Label } from "semantic-ui-react";

interface InputProps {
	label: string;
	name: string;
	onChange(eventOrPath: React.ChangeEvent<any>): void;
	value: string;
	touched: boolean | undefined;
	error: string | undefined;
	type?: string;
}

const CustomInputForm: React.FunctionComponent<InputProps> = (props) => {
	const { touched, error, label, ...rest } = props;
	return (
		<>
			<Label>{label}</Label>
			<Input fluid {...rest} />
			{touched && error && (
				<>
					<Label color="red" pointing="above">
						{error}
					</Label>
					<br />
					<br />
				</>
			)}
			<br />
		</>
	);
};

export default CustomInputForm;
