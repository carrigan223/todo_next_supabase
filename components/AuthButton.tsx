import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function AuthButton() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userData = await supabase
    .from("user")
    .select("*")
    .eq("email", user?.email);
  console.log(userData);

  if (userData?.data?.length === 0) {
    const res = await supabase.from("user").insert([{ email: user?.email }]);
    console.log(res);
  }

  const signOut = async () => {
    "use server";

    const supabase = createClient();
    await supabase.auth.signOut();
    return redirect("/login");
  };

  return user ? (
    <div className="flex items-center gap-4">
      Hey, {user.email}!
      <form action={signOut}>
        <button className="px-4 py-2 no-underline rounded-md bg-btn-background hover:bg-btn-background-hover">
          Logout
        </button>
      </form>
    </div>
  ) : (
    <Link
      href="/login"
      className="flex px-3 py-2 no-underline rounded-md bg-btn-background hover:bg-btn-background-hover"
    >
      Login
    </Link>
  );
}
