import { useState } from "react";
import {
  Box,
  Button,
  FormControlLabel,
  FormGroup,
  IconButton,
  InputBase,
  Modal,
  Paper,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useCreateChat } from "../../hooks/useCreateChat";
import { UNKNOWN_ERROR_MESSAGE } from "../../constants/error";

interface ChatListAddProps {
  open: boolean;
  handleClose: () => void;
}

const ChatListAdd = ({ open, handleClose }: ChatListAddProps) => {
  const [isPrivate, setIsPrivate] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [createdChat] = useCreateChat();

  const onClose = () => {
    setError("");
    setName("");
    setIsPrivate(false);
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
          <FormGroup>
            <FormControlLabel
              style={{ width: 0 }}
              control={
                <Switch
                  defaultChecked={isPrivate}
                  value={isPrivate}
                  onChange={(event) => setIsPrivate(event.target.checked)}
                />
              }
              label="Private"
            />
          </FormGroup>
          {isPrivate ? (
            <Paper sx={{ p: "2px 4px", display: "flex", alignItems: "center" }}>
              <InputBase sx={{ ml: 1, flex: 1 }} placeholder="Search Users" />
              <IconButton sx={{ p: "10px" }}>
                <SearchIcon />
              </IconButton>
            </Paper>
          ) : (
            <TextField
              label="name"
              error={!!error}
              helperText={error}
              onChange={(e) => setName(e.target.value)}
            />
          )}
          <Button
            variant="outlined"
            onClick={async () => {
              if (!name.length) {
                setError("Chat Name is required.");
                return;
              }
              try {
                await createdChat({
                  variables: {
                    createChatInput: { isPrivate, name: name || undefined },
                  },
                });
                onClose();
              } catch (error) {
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
