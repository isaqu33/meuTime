import { notFound } from "next/navigation";
import Tecnico from "@/views/Tecnico";

export const metadata = { title: "Técnico" };

export default function Page({ params }: { params: { id: string } }) {
  if (!/^\d{1,9}$/.test(params.id)) notFound();
  return <Tecnico id={params.id} />;
}
