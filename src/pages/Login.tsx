import { useState } from "react";
import { auth } from "../firebaseConfig";
import { googleProvider } from "../firebaseConfig";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { signInWithPopup } from "firebase/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

interface LoginProps {
    onLogin: (email: string) => void;
}


const Login = ({ onLogin }: LoginProps) => {
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
            if (isSignUp) {
                await createUserWithEmailAndPassword(auth, email, password);
            } else {
                await signInWithEmailAndPassword(auth, email, password);
            }
        } catch (err: any) {
            setError(err.message);
        }
    };

    // const handleGoogleLogin = async () => {
    //     setError("");
    //     try {
    //         const result = await signInWithPopup(auth, googleProvider);
    //         onLogin(result.user.email || "");
    //     } catch (err: any) {
    //         setError(err.message);
    //     }
    // };

    return (
        <div className="flex flex-col min-h-screen items-center justify-center bg-[url('./assets/chatroombg.jpg')] bg-cover bg-center">
            <div className="absolute inset-0 bg-white/40 z-0"></div>
            <div className="relative z-10">
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

                <Card className="w-full max-w-sm mx-auto mt-10 p-4 border rounded-lg bg-white shadow-sm space-y-4">
                    <CardHeader>
                        <h2 className="text-xl text-gray-800 font-bold text-center">
                            {isSignUp ? "Sign Up" : "Login"}
                        </h2>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleLogin} className="flex flex-col gap-3">
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
                            <Button type="submit" className="w-full bg-blue-900">
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
                    </CardContent>
                    {/* <Button type="button" onClick={handleGoogleLogin} className="w-full bg-red-500">
                        Sign in with Google
                    </Button> */}
                </Card>
            </div>
        </div>
    )
}

export default Login