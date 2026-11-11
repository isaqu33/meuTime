import { redirect } from "next/navigation";
import { auth } from "../../auth";
import { Shell } from "@/components/layout/Shell";

// Guarda de rota no servidor: sem sessão válida nada do painel é renderizado.
export default async function PainelLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <Shell nome={session.user.name ?? "Jogador"} plano={session.user.plano}>
      {children}
    </Shell>
  );
}
