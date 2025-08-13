import { useState } from "react";
import { db, auth } from "../firebaseConfig";
import { googleProvider } from "../firebaseConfig";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { signInWithPopup } from "firebase/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { doc, getDoc, setDoc } from "firebase/firestore"

interface LoginProps {
    onLogin: (user : {email: string; displayName: string; uid: string}) => void;
}


const Login = ({ onLogin }: LoginProps) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSignUp, setIsSignUp] = useState(false);
    const [error, setError] = useState("");

    //   async function handleLogin() {
    //     try {
    //       const userCredential = await signInWithEmailAndPassword(auth, email, password);
    //       onLogin(userCredential.user.email || "");
    //     } catch (err: any) {
    //       setError(err.message);
    //     }
    //   }

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            let user;
            let result;

            if (isSignUp) {
                result = await createUserWithEmailAndPassword(auth, email, password);
                // Update Firebase Auth profile with displayName
                await updateProfile(result.user, {
                    displayName: name, // name comes from your form input
                });
            } else {
                result = await signInWithEmailAndPassword(auth, email, password);

            }
            user = result.user;
            const userRef = doc(db, "users", user.uid);
            const userSnap = await getDoc(userRef);

            if (!userSnap.exists()) {
                // Create new user document
                await setDoc(userRef, {
                    uid: user.uid,
                    displayName: user.displayName  || "",
                    email: user.email || "",
                });
            }

            onLogin({
      uid: user.uid,
      email: user.email || "",
      displayName: user.displayName || "",
    });
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleGoogleLogin = async () => {
        console.log("Google login clicked");
        setError("");
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            // Check if user already exists in Firestore
            const userRef = doc(db, "users", user.uid);
            const userSnap = await getDoc(userRef);

            if (!userSnap.exists()) {
                // Create new user document
                await setDoc(userRef, {
                    uid: user.uid,
                    displayName: user.displayName || "",
                    email: user.email || "",
                });
            }

            onLogin({
      uid: user.uid,
      email: user.email || "",
      displayName: user.displayName || "",
    });
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="flex flex-col min-h-screen items-center justify-center bg-[url('./assets/chatroombg.jpg')] bg-cover bg-center">
            <div className="absolute inset-0 bg-white/40 z-0"></div>
            <div className="relative z-10 mb-24">
                <div className="text-center font-bold"><h2 className="text-4xl">Chatpro</h2><p className="text-sm">Send DMs to your friends</p></div>
                {/* <div className="relative max-w-md w-full mx-auto mt-10 p-6 border rounded-lg bg-white shadow-sm space-y-6 text-center">
        <h3 className="font-bold text-gray-800 text-2xl">Enter the chatroom</h3>

        <Input className="display-block"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}/>

        <Input className="display-block"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}/>

        <Button className="w-full bg-blue-900" onClick={handleLogin}>Login</Button>
        {error && <p className="text-red-300">{error}</p>}
    </div> */}

                <Card className="w-full max-w-sm mx-auto mt-10 py-4 px-2 border rounded-lg bg-white shadow-sm ">
                    <CardHeader>
                        <h2 className="text-xl text-gray-800 font-bold text-center">
                            {isSignUp ? "Sign Up" : "Login"}
                        </h2>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleLogin} className="flex flex-col gap-4">
                            {isSignUp &&
                                <Input
                                    type="name"
                                    placeholder="Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            }
                            <Input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <Input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            {error && <p className="text-red-500 text-sm">{error}</p>}
                            <Button type="submit" className="w-full bg-blue-900 hover:bg-blue-800 rounded-full">
                                {isSignUp ? "Create Account" : "Login"}
                            </Button>
                            <Button
                                type="button"
                                variant="link"
                                onClick={() => setIsSignUp(!isSignUp)}
                                className="cursor-pointer"
                            >
                                {isSignUp
                                    ? "Already have an account? Login"
                                    : "Don't have an account? Sign Up"}
                            </Button>
                        </form>
                        {/* <p className="text-gray-300">----------------- OR -----------------</p> */}
                    </CardContent>

                    <Button type="button" onClick={handleGoogleLogin} className="w-auto mx-4 rounded-full bg-white border text-black hover:bg-gray-200">
                        <img src="./assets/googlelogo.png" alt="Google Logo" className="w-5 h-5"></img>
                        Sign in with Google
                    </Button>
                </Card>
            </div>
        </div>
    )
}

export default Login