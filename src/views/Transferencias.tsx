"use client";

import { useState } from "react";
import { TabelaTransferencias } from "@/components/futebol/Transferencias";
import { Cartao, PaginaTitulo } from "@/components/ui/Cartao";
import { CampoBusca } from "@/components/ui/Campos";
import { Consulta, Vazio, vazioSeLista } from "@/components/ui/Estado";
import { Escudo } from "@/components/ui/Escudo";
import { useApi } from "@/hooks/useApi";
import type { TimeApi, Transferencia } from "@/types/apiFootball";

export default function Transferencias() {
  const [busca, setBusca] = useState("");
  const [time, setTime] = useState<TimeApi["team"] | null>(null);
  const pronto = busca.length >= 3;

  const times = useApi<TimeApi[]>("teams", { search: busca }, { enabled: pronto });
  const q = useApi<Transferencia[]>("transfers", { team: time?.id }, { enabled: time !== null });

  return (
    <>
      <PaginaTitulo
        titulo="Transferências"
        descricao="Busque um time e veja as entradas e saídas de jogadores."
      />

      <Cartao className="mb-6">
        <CampoBusca
          valor={busca}
          onChange={setBusca}
          placeholder="Nome do time (mín. 3 letras)"
          rotulo="Buscar time"
        />
        {pronto && (
          <div className="mt-3 flex flex-wrap gap-2" aria-label="Times encontrados">
            {(times.data?.response ?? []).slice(0, 10).map((t) => (
              <button
                key={t.team.id}
                type="button"
                aria-pressed={time?.id === t.team.id}
                onClick={() => setTime(t.team)}
                className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm ${
                  time?.id === t.team.id
                    ? "border-brand bg-brand-soft text-brand"
                    : "border-line text-fg hover:bg-subtle"
                }`}
              >
                <Escudo src={t.team.logo} nome={t.team.name} tamanho={20} />
                {t.team.name}
              </button>
            ))}
            {times.isLoading && <span className="text-sm text-muted">Buscando...</span>}
            {times.data?.response.length === 0 && (
              <span className="text-sm text-muted">Nenhum time encontrado.</span>
            )}
          </div>
        )}
      </Cartao>

      <Cartao titulo={time ? `Transferências · ${time.name}` : undefined} semPadding>
        {!time ? (
          <Vazio>Busque e escolha um time acima.</Vazio>
        ) : (
          <Consulta q={q} vazio={vazioSeLista("Nenhuma transferência registrada.")} linhas={6}>
            {(ts) => <TabelaTransferencias transferencias={ts} timeId={time.id} />}
          </Consulta>
        )}
      </Cartao>
    </>
  );
}
