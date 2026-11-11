import { redirect } from "next/navigation";
import { auth } from "../../auth";
import Login from "@/views/Login";

export default async function LoginPage() {
  if (await auth()) redirect("/");
  return <Login />;
}
