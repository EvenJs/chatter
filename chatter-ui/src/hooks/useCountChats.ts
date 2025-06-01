import { useCallback, useState } from "react"
import { snackVar } from "../constants/snack"
import { UNKNOWN_ERROR_SNACK_MESSAGE } from "../constants/error"

const useCountChats = () => {
  const [chatsCount, setChatsCount] = useState<number | undefined>()

  const countChats = useCallback(async () => {
    const res = await fetch('/api/chats/count')
    if (!res.ok) {
      snackVar(UNKNOWN_ERROR_SNACK_MESSAGE)
      return
    }
    setChatsCount(parseInt(await res.text()))
  }, [])

  return { chatsCount, countChats }
}

export { useCountChats }
