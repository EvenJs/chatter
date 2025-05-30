import { useEffect, useState } from "react";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ChatListItem from "./ChatListItem";
import ChatListHeader from "./ChatListHeader";
import { Stack } from "@mui/material";
import ChatListAdd from "./ChatListAdd";
import { useGetChats } from "../../hooks/useGetChats";
import { usePath } from "../../hooks/usePath";

const ChatList = () => {
  const [chatListAddVisible, setChatListAddVisible] = useState(false);
  const [selectedChatId, setSelectedChatId] = useState("");
  const { data } = useGetChats();
  const { path } = usePath();

  useEffect(() => {
    const pathSplit = path.split("chats/");
    if (pathSplit.length === 2) {
      setSelectedChatId(pathSplit[1]);
    }
  }, [path]);

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
            <ChatListItem chat={chat} selected={chat._id === selectedChatId} />
          ))}
        </List>
      </Stack>
    </>
  );
};

export default ChatList;
