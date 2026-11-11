import { notFound } from "next/navigation";
import Liga from "@/views/Liga";

export const metadata = { title: "Liga" };

export default function Page({ params }: { params: { id: string } }) {
  if (!/^\d{1,9}$/.test(params.id)) notFound();
  return <Liga id={params.id} />;
}
