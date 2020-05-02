import * as yup from "yup";

const LoginSchema = yup.object().shape({
	password: yup.string().required("Password Belum Diisi"),
	email: yup
		.string()
		.email("Email Tidak Valid")
		.required("Email harus diisi"),
});

export default LoginSchema;
