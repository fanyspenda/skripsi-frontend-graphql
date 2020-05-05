import React, { useContext } from "react";
import { Dropdown, Menu } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { TokenContext } from "contexts/tokenContext";

interface customMenuProps {
	token: string | undefined;
}

const CustomMenu: React.FunctionComponent<customMenuProps> = ({ token }) => {
	const { dispatch } = useContext(TokenContext);
	const handleLogoutClick = () => {
		localStorage.removeItem("token");
		dispatch({ type: "REMOVE_TOKEN", token: "" });
	};
	if (token) {
		return (
			<>
				<Dropdown item text="Alumni">
					<Dropdown.Menu>
						<Dropdown.Item as={Link} to="/addAlumni">
							Tambah Alumni
						</Dropdown.Item>
						<Dropdown.Item as={Link} to="/listAlumni">
							Lihat Daftar Alumni
						</Dropdown.Item>
					</Dropdown.Menu>
				</Dropdown>
				<Dropdown item text="Jurusan">
					<Dropdown.Menu>
						<Dropdown.Item as={Link} to="/addAlumni">
							Tambah Jurusan
						</Dropdown.Item>
						<Dropdown.Item as={Link} to="/listAlumni">
							Lihat Daftar Jurusan
						</Dropdown.Item>
					</Dropdown.Menu>
				</Dropdown>
				<Menu.Menu position="right">
					<Menu.Item
						as={Link}
						to="/login"
						onClick={() => handleLogoutClick()}
					>
						Keluar
					</Menu.Item>
				</Menu.Menu>
			</>
		);
	} else {
		return (
			<Menu.Menu position="right">
				<Menu.Item as={Link} to="/login">
					Masuk
				</Menu.Item>
				<Menu.Item as={Link} to="/register">
					Daftar
				</Menu.Item>
			</Menu.Menu>
		);
	}
};

export default CustomMenu;
