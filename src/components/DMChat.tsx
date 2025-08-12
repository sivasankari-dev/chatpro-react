// import { useState, useEffect } from "react";
// import { db } from "../firebaseConfig";
// import {
//   collection,
//   addDoc,
//   onSnapshot,
//   orderBy,
//   query,
// } from "firebase/firestore";
// import type { DocumentData } from "firebase/firestore";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";

// interface DMChatProps {
//   currentUser: string;
//   recipient: string;
// }

// interface Message {
//   from: string;
//   to: string;
//   text: string;
//   timestamp: number;
// }

// export default function DMChat({ currentUser, recipient }: DMChatProps) {
//   const [text, setText] = useState("");
//   const [messages, setMessages] = useState<Message[]>([]);

//   useEffect(() => {
//     const q = query(collection(db, "messages"), orderBy("timestamp"));
//     const unsub = onSnapshot(q, (snapshot) => {
//       const data = snapshot.docs.map((doc) => doc.data() as DocumentData);
//       setMessages(data as Message[]);
//     });
//     return () => unsub();
//   }, []);

//   async function sendMessage() {
//     if (!text.trim()) return;
//     await addDoc(collection(db, "messages"), {
//       from: currentUser,
//       to: recipient,
//       text,
//       timestamp: Date.now()
//     });
//     setText("");
//   }

//   return (
//     <div className="flex justify-center mt-10">
//       <Card className="w-full max-w-md shadow-lg">
//         <CardHeader>
//           <h3 className="text-lg font-semibold">
//             Chat with <span className="text-blue-500">{recipient}</span>
//           </h3>
//         </CardHeader>

//         <CardContent>
//           <div className="h-80 overflow-y-auto space-y-2 p-2 border rounded-lg bg-gray-50">
//             {messages
//               .filter(
//                 (m) =>
//                   (m.from === currentUser && m.to === recipient) ||
//                   (m.from === recipient && m.to === currentUser)
//               )
//               .map((m, i) => (
//                 <div
//                   key={i}
//                   className={`p-2 rounded-lg text-sm max-w-[80%] ${
//                     m.from === currentUser
//                       ? "bg-blue-500 text-white self-end ml-auto"
//                       : "bg-gray-200 text-gray-900"
//                   }`}
//                 >
//                   <p className="font-semibold">{m.from}</p>
//                   <p>{m.text}</p>
//                 </div>
//               ))}
//           </div>
//         </CardContent>

//         <CardFooter className="flex gap-2">
//           <Input
//             value={text}
//             onChange={(e) => setText(e.target.value)}
//             placeholder="Type a message..."
//             className="flex-1"
//           />
//           <Button onClick={sendMessage}>Send</Button>
//         </CardFooter>
//       </Card>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { collection, query, getDocs, addDoc, orderBy, onSnapshot } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface DMChatProps {
    currentUser: string;  // sender
    selectedRecipient?: string; // optional, can set from dropdown
}

export default function DMChat({ currentUser, selectedRecipient }: DMChatProps) {
    const [recipient, setRecipient] = useState(selectedRecipient || "");
    const [users, setUsers] = useState<string[]>([]);
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState("");

    // Fetch all users except current
    useEffect(() => {
        const fetchUsers = async () => {
            //   const q = query(collection(db, "users"), where("email", "!=", currentUser), orderBy("email"));
            const q = query(collection(db, "users"));
            const snapshot = await getDocs(q);
            setUsers(snapshot.docs.map(doc => doc.data().email).filter(email => email !== currentUser));
            //   console.log(currentUser)

        };
        fetchUsers();
    }, [currentUser]);

    // Fetch chat messages when recipient changes
    useEffect(() => {
        console.log(currentUser)
        console.log(recipient)
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
        console.log(unsub)
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
        <div className="bg-white p-4 rounded-lg border-2 shadow max-w-lg mx-auto">
            {/* Recipient Selector
      <select
        className="w-full border rounded p-2 mb-4"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
      >
        <option value="">Select recipient</option>
        {users.map((u) => (
          <option key={u} value={u}>{u}</option>
        ))}
      </select> */}

            <Select value={recipient} onValueChange={setRecipient}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select recipient" />
                </SelectTrigger>
                <SelectContent>
                    {users.map((u) => (
                        <SelectItem key={u} value={u}>
                            {u}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

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
                <Button onClick={sendMessage}>Send</Button>
            </div>
        </div>
    );
}
