import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ChatListItem from "./ChatListItem";
import ChatListHeader from "./ChatListHeader";
import { Stack } from "@mui/material";

const ChatList = () => {
  return (
    <Stack>
      <ChatListHeader />
      <Divider />
      <List
        sx={{
          width: "100%",
          maxWidth: 360,
          bgcolor: "background.paper",
          maxHeight: "80vh",
          overflowY: "scroll",
        }}
      >
        <ChatListItem />
        <ChatListItem />
        <ChatListItem />
        <ChatListItem />
        <ChatListItem />
        <ChatListItem />
        <ChatListItem />
        <ChatListItem />
        <ChatListItem />
        <ChatListItem />
        <ChatListItem />
        <ChatListItem />
        <ChatListItem />
        <ChatListItem />
        <ChatListItem />
        <ChatListItem />
        <ChatListItem />
        <ChatListItem />
      </List>
    </Stack>
  );
};

export default ChatList;
