"use client";
import toast from "react-hot-toast";
import { useSession } from "./context/sessionContext";
import Link from "next/link";

export default function Home() {
  const { session, isLoading, signIn, signOut, refreshToken } = useSession();

  if (isLoading) {
    // toast.loading("Loading...");
    return (
      <div className="w-full h-screen grid place-items-center">
        <p className="text-2xl">Loading ...</p>
      </div>
    );
  }
  return (
    <main className="  min-h-screen  p-4 ">
      <nav className="w-full bg-slate-200 flex items-center justify-between p-4">
        <p>Auth</p>{" "}
        <button
          className="border bg-yellow-600 p-4"
          onClick={() => refreshToken()}
        >
          Refresh
        </button>
        {session && session?.user ? (
          <button className="border bg-red-600 p-4" onClick={() => signOut()}>
            Sign Out
          </button>
        ) : (
          <Link href="/login" className="border bg-green-600 p-4">
            Log In
          </Link>
        )}
      </nav>
      {/*  */}
      <br />

      <div className="grid place-items-center h-full border min-h-96">
        {session && session?.user ? (
          <p>Hello {session.user?.name}, welcome back!</p>
        ) : (
          <p>You are not logged in</p>
        )}
      </div>
    </main>
  );
}
