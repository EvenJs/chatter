import { Link } from "react-router-dom";
import { Link as MUILink } from "@mui/material";
import Auth from "./Auth";
import { useCreateUser } from "../../hooks/useCreateUser";

const Signup = () => {
  const [createUser] = useCreateUser();

  return (
    <Auth
      submitLabel="Signup"
      onSubmit={async ({ email, password }) => {
        await createUser({
          variables: {
            createUserInput: {
              email,
              password,
            },
          },
        });
      }}
    >
      <MUILink component={Link} to={"login"} sx={{ alignSelf: "center" }}>
        Login
      </MUILink>
    </Auth>
  );
};

export default Signup;
