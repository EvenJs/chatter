import { Link } from "react-router-dom";
import { Link as MUILink } from "@mui/material";
import Auth from "./Auth";
import { useLogin } from "../../hooks/useLogin";

const Login = () => {
  const { login, error } = useLogin();

  return (
    <Auth
      submitLabel="Login"
      onSubmit={async (request) => login(request)}
      error={error}
    >
      <MUILink component={Link} to={"/signup"} style={{ alignSelf: "center" }}>
        Signup
      </MUILink>
    </Auth>
  );
};

export default Login;
