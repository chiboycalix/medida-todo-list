"use client"
import TodoList from "@/components/TodoList";
import { useToast } from "@/components/ToastContainer";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const { addToast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOut(auth)
      router.push("/auth/login")
      addToast("Sign out was successful", 'success');
    } catch (error) {

    }
  }
  return (
    <div className="bg-[#e4e7f1] p-4 w-full min-h-screen">
      <div className="flex items-center justify-center mb-4">
        {/* <Button onClick={() => handleSignOut()}>Sign Out</Button> */}
      </div>
      <TodoList />
    </div>
  );
}
