import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 p-6 text-center">
      <p className="text-5xl font-bold text-brand">404</p>
      <h1 className="text-xl font-semibold text-fg">Página não encontrada</h1>
      <p className="text-sm text-muted">O endereço não existe ou o identificador é inválido.</p>
      <Link href="/" className="mt-2 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-brand-fg">
        Voltar ao início
      </Link>
    </div>
  );
}
