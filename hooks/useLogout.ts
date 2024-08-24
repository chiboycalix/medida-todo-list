import { useCallback } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";
import { deleteCookie } from "cookies-next";
import { useRouter } from "next/navigation";

export const useLogout = () => {
  const router = useRouter();

  const logout = useCallback(async () => {
    try {
      await signOut(auth);
      router.push("/auth/login");
      deleteCookie("authToken");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  }, [router]);

  return logout;
};
