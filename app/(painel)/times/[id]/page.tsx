import { notFound } from "next/navigation";
import Time from "@/views/Time";

export const metadata = { title: "Time" };

export default function Page({ params }: { params: { id: string } }) {
  if (!/^\d{1,9}$/.test(params.id)) notFound();
  return <Time id={params.id} />;
}
