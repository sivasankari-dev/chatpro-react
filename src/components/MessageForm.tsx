import { Textarea } from "./ui/textarea"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { useState } from "react"

const MessageForm = () => {

  const [message, setMessage] = useState<string>("");
  const [delay, setDelay] = useState<number>(0);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [timerId, setTimerId] = useState<NodeJS.Timeout | null>(null);
  const [sentMessage, setSentMessage] = useState<string>("");

  const sendMessage = () => {
    setIsSending(true);
    const id = setTimeout(() => {
      setSentMessage(message)
      setMessage("")
      setIsSending(false)
    }, delay * 1000)

    setTimerId(id)
  }

  const cancelMessage = () => {
    if(timerId) clearTimeout(timerId)
      setIsSending(false)
  }

  return (
    <div className="max-w-md max-auto mt-20 p-6 border rounded-lg shadow-sm bg-white space-y-4">
      <h2 className="text-2xl font-bold text-center text-gray-800">DM with delay</h2>

      <Textarea
        placeholder="Type your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <Input
        type="number"
        placeholder="Delay in seconds..."
        value={delay}
        onChange={(e) => setDelay(Number(e.target.value))}
      />

      {!isSending ? (
        <Button className="w-full bg-sky-800 hover:bg-sky-900 cursor-pointer"
          onClick={sendMessage}>
          Send with delay
        </Button>
      ) : (
        <Button variant='destructive' className="w-full cursor-pointer"
          onClick={cancelMessage}>
          Cancel Sending
        </Button>
      )}

    { sentMessage &&
      <div className="max-auto bg-green-200 border rounded-lg p-2 ">
        <p className="font-semibold text-green-600 text-center">Message sent : {sentMessage}</p>
      </div>
    }


    </div>
  )
}

export default MessageForm