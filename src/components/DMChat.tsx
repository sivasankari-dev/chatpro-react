import { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { collection, query, getDocs, addDoc, where, orderBy, onSnapshot } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface DMChatProps {
    currentUser: string;  // sender
    selectedRecipient?: string; // optional, can set from dropdown
}

interface UserInfo {
  displayName: string;
  email: string;
}

export default function DMChat({ currentUser, selectedRecipient }: DMChatProps) {
    const [recipient, setRecipient] = useState(selectedRecipient || "");
    const [users, setUsers] = useState<UserInfo[]>([]);
    // const [users, setUsers] = useState<{email:string, name:string} | null>(null);
    // const [name, setName] = useState<string[]>([]);
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState("");

    // Fetch all users except current
    useEffect(() => {
        const fetchUsers = async () => {
              const q = query(collection(db, "users"), where("email", "!=", currentUser), orderBy("email"));
            // const q = query(collection(db, "users"));
            const snapshot = await getDocs(q);
            // setUsers(snapshot.docs.map(doc => doc.data().email).filter(email => email !== currentUser));
       
            setUsers(snapshot.docs.map(doc => ({
                displayName :doc.data().displayName,
               email: doc.data().email
        })))
           
            // setUsers(snapshot.docs.map(doc => doc.data().email));
            // setName(snapshot.docs.map(doc => doc.data().displayName));
            //   console.log(currentUser)

        };
        fetchUsers();
    }, [currentUser]);

    // Fetch chat messages when recipient changes
    useEffect(() => {
        // console.log(currentUser)
        // console.log(recipient)
        if (!recipient) return;
        const chatId = [currentUser, recipient].sort().join("_");
        // const q = query(
        //   collection(db, "messages"),
        //   where ("from", "==", currentUser), 
        //   where("to", "==", recipient),
        //   orderBy("timestamp", "asc")
        const q = query(
            collection(db, "messages", chatId, "chats"),
            //   where ("from", "==", currentUser), 
            //   where("to", "==", recipient),
            orderBy("timestamp", "asc")
        );
        const unsub = onSnapshot(q, (snapshot) => {
            setMessages(snapshot.docs.map(doc => doc.data()));
        });
        // console.log(unsub)
        return () => unsub();
    }, [currentUser, recipient]);

    const sendMessage = async () => {
        if (!recipient || !newMessage.trim()) return;
        const chatId = [currentUser, recipient].sort().join("_");
        await addDoc(collection(db, "messages", chatId, "chats"), {
            from: currentUser,
            to: recipient,
            text: newMessage,
            timestamp: new Date()
        });
        setNewMessage("");
    };

    return (
        <div className="flex bg-white p-2 rounded-lg border-2 shadow max-w-2xl mx-auto justify-between">
            <div className="bg-blue-200 w-sm hidden md:block">
                
                {users.map((u) => (
                    <button 
                    className="flex p-2 w-full hover:bg-cyan-400 focus:bg-cyan-400 text-md font-semibold font-sans"
                    type = "button"
                    onClick={() =>setRecipient(u.email)}
                    key={u.email}>{u.displayName}
                    </button>
                ))}
            </div>
                <div className="mx-4 w-3xl">
                    <div className="md:hidden">
            <Select value={recipient} onValueChange={setRecipient}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select recipient" />
                </SelectTrigger>
                <SelectContent>
                    {users.map((u) => (
                        <SelectItem key={u.email} value={u.email}>
                            {u.displayName}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            </div>

            {/* Messages */}
            <div className="h-64 overflow-y-auto border rounded p-2 mb-4 bg-gray-50">
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`flex ${msg.from === currentUser ? "justify-end" : "justify-start"}`}
                    >
                        <div
                            className={`p-2 my-1 rounded ${msg.from === currentUser
                                    ? "bg-blue-500 text-white self-end ml-auto"
                                    : "bg-gray-200 text-black"
                                }`}
                        >
                            {msg.text}
                        </div>
                    </div>
                ))}
            </div>

            {/* Input */}
            <div className="flex gap-2">
                <Input
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                />
                <Button className="cursor-pointer" onClick={sendMessage}>Send</Button>
            </div>
        </div>
         {/* <div className="bg-cyan-400 p-6 w-sm">
                <p className="w-full text-center">{recipient}</p>
            </div> */}
        </div>
    );
}
