import { useState } from "react";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ChatListItem from "./ChatListItem";
import ChatListHeader from "./ChatListHeader";
import { Stack } from "@mui/material";
import ChatListAdd from "./ChatListAdd";
import { useGetChats } from "../../hooks/useGetChats";

const ChatList = () => {
  const [chatListAddVisible, setChatListAddVisible] = useState(false);
  const { data } = useGetChats();

  return (
    <>
      <ChatListAdd
        open={chatListAddVisible}
        handleClose={() => setChatListAddVisible(false)}
      />
      <Stack>
        <ChatListHeader handleAddChat={() => setChatListAddVisible(true)} />
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
          {data?.chats.map((chat) => (
            <ChatListItem chat={chat} />
          ))}
        </List>
      </Stack>
    </>
  );
};

export default ChatList;
