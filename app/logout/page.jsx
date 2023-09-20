"use client";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

export default function Logout() {
  const router = useRouter();
  const { data: session } = useSession();

  async function logout() {
    await signOut();
  }

  function goBack() {
    router.push("/");
  }

  if (!session) {
    return (
      <main className=" bg-white h-screen flex items-center">
        <div className=" text-center w-full">
          <button
            onClick={() => signIn()}
            className="bg-blue-900 text-white p-2 px-4 rounded-lg"
          >
            Login with Google
          </button>
          <div>
            <h1>
              Make sure you have admin privileges before signing in. Only Admins
              can login. For admin privileges contact shafishahuldq@gmail.com
            </h1>
          </div>
        </div>
      </main>
    );
  }
  return (
    <div className="mt-5">
      <h1 className=" text-center">Are you sure want to logout?</h1>
      <div className="flex gap-2 justify-center">
        <button type="button" onClick={() => logout()} className="btn-primary">
          YES
        </button>
        <button type="button" onClick={() => goBack()} className="btn-default">
          No
        </button>
      </div>
    </div>
  );
}
