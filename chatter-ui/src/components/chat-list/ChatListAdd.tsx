import { useState } from "react";
import {
  Box,
  Button,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useCreateChat } from "../../hooks/useCreateChat";
import { UNKNOWN_ERROR_MESSAGE } from "../../constants/error";
import router from "../Routes";

interface ChatListAddProps {
  open: boolean;
  handleClose: () => void;
}

const ChatListAdd = ({ open, handleClose }: ChatListAddProps) => {
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [createdChat] = useCreateChat();

  const onClose = () => {
    setError("");
    setName("");
    handleClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          width: 400,
          bgcolor: "background.paper",
          border: "2xp solid #000",
          boxShadow: 24,
          p: 4,
        }}
      >
        <Stack spacing={2}>
          <Typography variant="h6" component="h2">
            Add chat
          </Typography>

          <TextField
            label="name"
            error={!!error}
            helperText={error}
            onChange={(e) => setName(e.target.value)}
          />
          <Button
            variant="outlined"
            onClick={async () => {
              if (!name.length) {
                setError("Chat Name is required.");
                return;
              }
              try {
                const chat = await createdChat({
                  variables: {
                    createChatInput: { name },
                  },
                });
                onClose();
                router.navigate(`/chats/${chat.data?.createChat._id}`);
              } catch (error) {
                console.log(error);
                setError(UNKNOWN_ERROR_MESSAGE);
              }
            }}
          >
            Save
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};

export default ChatListAdd;
