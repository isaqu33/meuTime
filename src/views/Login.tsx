"use client";

import { Eye, EyeSlash, SoccerBall } from "phosphor-react";
import { signIn } from "next-auth/react";
import { FormEvent, useState } from "react";
import { ArteLogin } from "@/components/layout/ArteLogin";
import { TemaToggle } from "@/components/layout/Topbar";
import { chaveValida } from "@/lib/chave";

const MENSAGENS: Record<string, string> = {
  limite: "Muitas tentativas. Aguarde alguns minutos e tente de novo.",
  indisponivel: "Não foi possível falar com a API de futebol agora. Tente novamente.",
};

export default function Login() {
  const [chave, setChave] = useState("");
  const [visivel, setVisivel] = useState(false);
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function entrar(evento: FormEvent) {
    evento.preventDefault();
    setErro("");
    if (!chaveValida(chave)) {
      setErro("Informe uma chave de acesso válida (letras e números, 16 a 64 caracteres).");
      return;
    }

    setEnviando(true);
    const resultado = await signIn("credentials", { apiKey: chave, redirect: false });
    if (resultado?.error) {
      setErro(MENSAGENS[resultado.code ?? ""] ?? "Chave inválida ou conta sem assinatura ativa.");
      setEnviando(false);
      return;
    }
    // navegação completa: o layout do painel valida a sessão no servidor
    window.location.assign("/");
  }

  return (
    <div className="grid min-h-screen bg-app lg:grid-cols-2">
      <section className="relative hidden flex-col justify-between overflow-hidden bg-brand p-10 text-brand-fg lg:flex">
        <div className="flex items-center gap-2 text-lg font-bold">
          <SoccerBall size={26} weight="fill" /> Soccer-Mania
        </div>
        <div>
          <ArteLogin className="mx-auto max-h-[28rem] w-full" />
          <h2 className="mt-8 text-3xl font-bold leading-tight">Todo o futebol em um só painel.</h2>
          <p className="mt-2 max-w-md text-sm opacity-80">
            Jogos ao vivo, classificações, estatísticas, escalações, transferências e odds, direto da
            API-Sports.
          </p>
        </div>
        <p className="text-xs opacity-70">Dados fornecidos pela API-Sports.</p>
      </section>

      <section className="relative flex items-center justify-center p-6">
        <div className="absolute right-4 top-4">
          <TemaToggle />
        </div>

        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-2 text-lg font-bold text-fg lg:hidden">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-brand-fg">
              <SoccerBall size={20} weight="fill" />
            </span>
            Soccer-Mania
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-fg">Bem-vindo!</h1>
          <p className="mt-1 text-sm text-muted">Entre com a sua chave de acesso da API-Sports.</p>

          <form onSubmit={entrar} className="mt-6 space-y-4" autoComplete="off" noValidate>
            <div>
              <label htmlFor="apiKey" className="mb-1.5 block text-sm font-medium text-fg">
                Chave de acesso
              </label>
              <div className="relative">
                <input
                  id="apiKey"
                  name="apiKey"
                  type={visivel ? "text" : "password"}
                  value={chave}
                  onChange={(e) => setChave(e.target.value)}
                  placeholder="Cole aqui a sua chave"
                  aria-invalid={Boolean(erro)}
                  aria-describedby={erro ? "erro-login" : undefined}
                  className="h-11 w-full rounded-lg border border-line bg-surface px-3 pr-11 text-sm text-fg placeholder:text-muted focus-visible:border-brand"
                />
                <button
                  type="button"
                  onClick={() => setVisivel((v) => !v)}
                  aria-label={visivel ? "Ocultar a chave" : "Mostrar a chave"}
                  className="absolute right-2 top-2.5 text-muted hover:text-fg"
                >
                  {visivel ? <EyeSlash size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {erro && (
                <p id="erro-login" role="alert" className="mt-2 text-sm text-danger">
                  {erro}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={enviando}
              className="h-11 w-full rounded-lg bg-brand text-sm font-semibold text-brand-fg transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {enviando ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <p className="mt-6 text-xs text-muted">
            Não tem uma chave? Crie uma conta gratuita na API-Sports e copie a chave do painel deles. Ela fica
            só no servidor, num cookie criptografado.
          </p>
        </div>
      </section>
    </div>
  );
}
