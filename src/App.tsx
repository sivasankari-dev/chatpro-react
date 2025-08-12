// import Home from "./pages/Home"

// const App = () => {
//   return (
//    <div className="flex min-h-svh flex-col items-center justify-center">
//       <Home />
//     </div>
//   )
// }

// export default App

import { useState } from "react";
import DMChat from "./components/DMChat";
import { auth } from "./firebaseConfig";
import { Button } from "@/components/ui/button";
import { onAuthStateChanged, signOut, type User} from "firebase/auth";
import Login from "./pages/Login";
// import { Card, CardHeader, CardContent } from "@/components/ui/card";

export default function App() {
  // Replace these with your actual Firebase user IDs or emails
  // const userA = "sivaraj005@gmail.com";
  // const userB = "sivasankarisivaraj1@gmail.com";

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null); 

    // Listen to login state
  useState(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setUserEmail(user?.email ?? null)
    });
    return () => unsub();
  });

  if (!currentUser) return <Login onLogin={setUserEmail} />;

  return (
    <div className="min-h-screen bg-[url('./assets/chatroombg.jpg')] bg-cover bg-center p-4">
      <div className="absolute inset-0 bg-white/70 z-0"/>
      <div className="relative z-10">
      <div className="flex justify-around items-center mb-4 z-10">
        <h1 className="font-bold text-3xl">Chatpro</h1>
        <h2 className="font-bold text-lg"><span className="text-5xl font-bold text-green-500">.</span>{currentUser.email}</h2>
        <Button variant="destructive" onClick={() => signOut(auth)}>Logout</Button>
      </div>
      {userEmail && <DMChat currentUser={userEmail} />}
    </div>
    </div>
  );
}
