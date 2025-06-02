import { Avatar, Button, Stack, Typography } from "@mui/material";
import { UploadFile } from "@mui/icons-material";
import { useGetMe } from "../../hooks/useGetMe";
import { snackVar } from "../../constants/snack";

const Profile = () => {
  const me = useGetMe();

  const handleFileUpload = async (event: any) => {
    console.log(1, event.target.files[0]);
    try {
      const formData = new FormData();
      formData.append("file", event.target.files[0]);
      const res = await fetch(`api/users/image`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Image upload failed.");
      }

      snackVar({ message: "Image uploaded.", type: "success" });
    } catch (error) {
      console.log(error);
      snackVar({ message: "Error uploading filed", type: "error" });
    }
  };

  return (
    <Stack
      spacing={6}
      sx={{
        marginTop: "2.5rem",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Typography variant="h1">{me?.data?.me.username}</Typography>
      <Avatar sx={{ width: 256, height: 256 }} src={me.data?.me.imageUrl} />
      <Button
        component="label"
        variant="contained"
        size="large"
        startIcon={<UploadFile />}
      >
        Upload Image
        <input type="file" hidden onChange={handleFileUpload} />
      </Button>
    </Stack>
  );
};

export default Profile;
