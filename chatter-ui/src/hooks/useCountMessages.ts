import { useCallback, useState } from "react"
import { snackVar } from "../constants/snack"
import { UNKNOWN_ERROR_SNACK_MESSAGE } from "../constants/error"

const useCountMessages = (chatId: string) => {
  const [messagesCount, setMessagesCount] = useState<number | undefined>()

  const countMessages = useCallback(async () => {
    const res = await fetch(`/api/messages/count?chatId=${chatId}`)
    if (!res.ok) {
      snackVar(UNKNOWN_ERROR_SNACK_MESSAGE)
      return
    }

    const { messages } = await res.json()
    setMessagesCount(messages)
  }, [chatId])

  return { messagesCount, countMessages }
}

export { useCountMessages }
