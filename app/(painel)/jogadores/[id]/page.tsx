import { notFound } from "next/navigation";
import Jogador from "@/views/Jogador";

export const metadata = { title: "Jogador" };

export default function Page({ params }: { params: { id: string } }) {
  if (!/^\d{1,9}$/.test(params.id)) notFound();
  return <Jogador id={params.id} />;
}
