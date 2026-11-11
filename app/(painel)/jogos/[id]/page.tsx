import { notFound } from "next/navigation";
import Jogo from "@/views/jogo/Jogo";

export const metadata = { title: "Jogo" };

export default function Page({ params }: { params: { id: string } }) {
  // o id vira parâmetro do proxy: só dígitos, senão 404 antes de qualquer chamada
  if (!/^\d{1,9}$/.test(params.id)) notFound();
  return <Jogo id={params.id} />;
}
