"use client";

import { useState } from "react";
import { LinkTime, TabelaJogos } from "@/components/futebol/comuns";
import { Mercados, type Mercado } from "@/components/futebol/Mercados";
import { Cartao, Pilula } from "@/components/ui/Cartao";
import { Seletor } from "@/components/ui/Campos";
import { Consulta, vazioSeLista } from "@/components/ui/Estado";
import { Escudo } from "@/components/ui/Escudo";
import { Tabela, type Coluna } from "@/components/ui/Tabela";
import { usePreferencias } from "@/contexts/Preferencias";
import { useApi } from "@/hooks/useApi";
import { formatarData, posicao } from "@/lib/formatar";
import type {
  Escalacao,
  Evento,
  EstatisticasTime,
  Jogo,
  JogadoresDoTime,
  Lesao,
  Odd,
  OddAoVivo,
  Previsao,
} from "@/types/apiFootball";

const ICONES: Record<string, string> = { Goal: "⚽", Card: "🟨", subst: "🔁", Var: "📺" };

function iconeEvento(e: Evento): string {
  if (e.type === "Card") return e.detail.includes("Red") ? "🟥" : "🟨";
  return ICONES[e.type] ?? "•";
}

export function AbaEventos({ id }: { id: string }) {
  const q = useApi<Evento[]>("fixtures/events", { fixture: id }, { staleTime: 60_000 });
  const colunas: Coluna<Evento>[] = [
    {
      titulo: "Minuto",
      render: (e) => (
        <span className="tabular">
          {e.time.elapsed}
          {e.time.extra ? `+${e.time.extra}` : ""}&apos;
        </span>
      ),
      ordenar: (e) => e.time.elapsed + (e.time.extra ?? 0) / 100,
    },
    { titulo: "Time", render: (e) => <LinkTime time={e.team} tamanho={20} /> },
    {
      titulo: "Evento",
      render: (e) => (
        <span>
          <span aria-hidden>{iconeEvento(e)} </span>
          {e.detail}
        </span>
      ),
    },
    {
      titulo: "Jogador",
      render: (e) => (
        <span>
          {e.player.name ?? "-"}
          {e.assist.name && <span className="text-muted"> (assist. {e.assist.name})</span>}
        </span>
      ),
    },
  ];
  return (
    <Cartao semPadding>
      <Consulta q={q} vazio={vazioSeLista("Sem eventos registrados para este jogo.")}>
        {(eventos) => (
          <Tabela
            rotulo="Eventos do jogo"
            colunas={colunas}
            linhas={eventos}
            chave={(_, i) => i}
            tamanhoInicial={20}
          />
        )}
      </Consulta>
    </Cartao>
  );
}

const paraNumero = (v: number | string | null): number => {
  if (v === null) return 0;
  const n = typeof v === "number" ? v : parseFloat(v.replace("%", ""));
  return Number.isFinite(n) ? n : 0;
};

const ESTATISTICAS_PT: Record<string, string> = {
  "Shots on Goal": "Chutes no gol",
  "Shots off Goal": "Chutes para fora",
  "Total Shots": "Finalizações",
  "Blocked Shots": "Chutes bloqueados",
  "Shots insidebox": "Chutes dentro da área",
  "Shots outsidebox": "Chutes fora da área",
  Fouls: "Faltas",
  "Corner Kicks": "Escanteios",
  Offsides: "Impedimentos",
  "Ball Possession": "Posse de bola",
  "Yellow Cards": "Cartões amarelos",
  "Red Cards": "Cartões vermelhos",
  "Goalkeeper Saves": "Defesas do goleiro",
  "Total passes": "Passes",
  "Passes accurate": "Passes certos",
  "Passes %": "Precisão dos passes",
  expected_goals: "Gols esperados (xG)",
};

export function AbaEstatisticas({ id }: { id: string }) {
  const q = useApi<EstatisticasTime[]>("fixtures/statistics", { fixture: id }, { staleTime: 60_000 });
  return (
    <Cartao>
      <Consulta q={q} vazio={vazioSeLista("Estatísticas indisponíveis para este jogo.")}>
        {([casa, fora]) => (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm font-semibold">
              <LinkTime time={casa.team} />
              <LinkTime time={fora.team} />
            </div>
            {casa.statistics.map((s, i) => {
              const a = paraNumero(s.value);
              const b = paraNumero(fora.statistics[i]?.value ?? null);
              const total = a + b || 1;
              return (
                <div key={s.type}>
                  <div className="tabular mb-1 flex justify-between text-sm">
                    <span className="font-semibold">{s.value ?? 0}</span>
                    <span className="text-muted">{ESTATISTICAS_PT[s.type] ?? s.type}</span>
                    <span className="font-semibold">{fora.statistics[i]?.value ?? 0}</span>
                  </div>
                  <div className="flex h-1.5 gap-0.5 overflow-hidden rounded-full bg-subtle">
                    <div className="bg-brand" style={{ width: `${(a / total) * 100}%` }} />
                    <div className="ml-auto bg-muted/60" style={{ width: `${(b / total) * 100}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Consulta>
    </Cartao>
  );
}

export function AbaEscalacoes({ id }: { id: string }) {
  const q = useApi<Escalacao[]>("fixtures/lineups", { fixture: id }, { staleTime: 60_000 });
  return (
    <Consulta q={q} vazio={vazioSeLista("Escalações ainda não divulgadas.")}>
      {(times) => (
        <div className="grid gap-6 md:grid-cols-2">
          {times.map((t) => (
            <Cartao
              key={t.team.id}
              titulo={<LinkTime time={t.team} />}
              descricao={`Esquema ${t.formation ?? "-"} · Técnico: ${t.coach.name ?? "-"}`}
              semPadding
            >
              <ListaEscalacao titulo="Titulares" itens={t.startXI} />
              <ListaEscalacao titulo="Reservas" itens={t.substitutes} />
            </Cartao>
          ))}
        </div>
      )}
    </Consulta>
  );
}

function ListaEscalacao({ titulo, itens }: { titulo: string; itens: Escalacao["startXI"] }) {
  return (
    <div>
      <p className="bg-subtle px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-muted">
        {titulo}
      </p>
      <ul className="divide-y divide-line">
        {itens.map(({ player }) => (
          <li key={player.id} className="flex items-center gap-3 px-4 py-2 text-sm">
            <span className="tabular w-6 text-center text-muted">{player.number}</span>
            <a href={`/jogadores/${player.id}`} className="font-medium hover:text-brand hover:underline">
              {player.name}
            </a>
            <span className="ml-auto text-xs text-muted">{posicao(player.pos)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function AbaJogadores({ id }: { id: string }) {
  const q = useApi<JogadoresDoTime[]>("fixtures/players", { fixture: id }, { staleTime: 60_000 });
  type Linha = JogadoresDoTime["players"][number];
  const colunas: Coluna<Linha>[] = [
    {
      titulo: "Jogador",
      render: (l) => (
        <span className="inline-flex items-center gap-2">
          <Escudo src={l.player.photo} nome={l.player.name} tamanho={24} redondo />
          {l.player.name}
        </span>
      ),
      ordenar: (l) => l.player.name,
    },
    { titulo: "Pos.", render: (l) => posicao(l.statistics[0]?.games.position) },
    {
      titulo: "Min",
      alinhar: "right",
      render: (l) => <span className="tabular">{l.statistics[0]?.games.minutes ?? "-"}</span>,
      ordenar: (l) => l.statistics[0]?.games.minutes ?? 0,
    },
    {
      titulo: "Nota",
      alinhar: "right",
      render: (l) => <b className="tabular">{l.statistics[0]?.games.rating ?? "-"}</b>,
      ordenar: (l) => parseFloat(l.statistics[0]?.games.rating ?? "0"),
    },
    {
      titulo: "Gols",
      alinhar: "right",
      render: (l) => <span className="tabular">{l.statistics[0]?.goals.total ?? 0}</span>,
      ordenar: (l) => l.statistics[0]?.goals.total ?? 0,
    },
    {
      titulo: "Assist.",
      alinhar: "right",
      render: (l) => <span className="tabular">{l.statistics[0]?.goals.assists ?? 0}</span>,
      ordenar: (l) => l.statistics[0]?.goals.assists ?? 0,
    },
    {
      titulo: "Chutes",
      alinhar: "right",
      render: (l) => <span className="tabular">{l.statistics[0]?.shots.total ?? 0}</span>,
    },
    {
      titulo: "Passes",
      alinhar: "right",
      render: (l) => <span className="tabular">{l.statistics[0]?.passes.total ?? 0}</span>,
    },
    {
      titulo: "Cartões",
      alinhar: "right",
      render: (l) => (
        <span className="tabular">
          🟨{l.statistics[0]?.cards.yellow ?? 0} 🟥{l.statistics[0]?.cards.red ?? 0}
        </span>
      ),
    },
  ];
  return (
    <Consulta q={q} vazio={vazioSeLista("Estatísticas dos jogadores indisponíveis.")}>
      {(times) => (
        <div className="space-y-6">
          {times.map((t) => (
            <Cartao key={t.team.id} titulo={<LinkTime time={t.team} />} semPadding>
              <Tabela
                rotulo={`Jogadores de ${t.team.name}`}
                colunas={colunas}
                linhas={t.players}
                chave={(l) => l.player.id}
                href={(l) => `/jogadores/${l.player.id}`}
                tamanhoInicial={10}
              />
            </Cartao>
          ))}
        </div>
      )}
    </Consulta>
  );
}

export function AbaConfronto({ jogo }: { jogo: Jogo }) {
  const { fuso } = usePreferencias();
  const q = useApi<Jogo[]>("fixtures/headtohead", {
    h2h: `${jogo.teams.home.id}-${jogo.teams.away.id}`,
    last: 20,
    timezone: fuso,
  });
  return (
    <Cartao titulo="Últimos confrontos diretos" semPadding>
      <Consulta q={q} vazio={vazioSeLista("Esses times ainda não se enfrentaram.")}>
        {(jogos) => <TabelaJogos jogos={jogos} mostrarLiga />}
      </Consulta>
    </Cartao>
  );
}

function Barra({ rotulo, valor, tom = "bg-brand" }: { rotulo: string; valor: string; tom?: string }) {
  const pct = Math.max(0, Math.min(100, parseFloat(valor) || 0));
  return (
    <div>
      <div className="tabular mb-1 flex justify-between text-sm">
        <span className="text-muted">{rotulo}</span>
        <b>{valor}</b>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-subtle">
        <div className={`h-full ${tom}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

const COMPARACAO_PT: Record<string, string> = {
  form: "Forma",
  att: "Ataque",
  def: "Defesa",
  poisson_distribution: "Distribuição de Poisson",
  h2h: "Confronto direto",
  goals: "Gols",
  total: "Total",
};

export function AbaPrevisoes({ id }: { id: string }) {
  const q = useApi<Previsao[]>("predictions", { fixture: id });
  return (
    <Consulta q={q} vazio={vazioSeLista("Sem previsão para este jogo.")}>
      {([p]) => (
        <div className="grid gap-6 lg:grid-cols-2">
          <Cartao titulo="Quem vence?">
            <div className="space-y-3">
              <Barra rotulo="Mandante" valor={p.predictions.percent.home} />
              <Barra rotulo="Empate" valor={p.predictions.percent.draw} tom="bg-muted" />
              <Barra rotulo="Visitante" valor={p.predictions.percent.away} tom="bg-warn" />
            </div>
            {p.predictions.advice && (
              <p className="mt-4 rounded-lg bg-brand-soft px-3 py-2 text-sm text-brand">
                <b>Conselho:</b> {p.predictions.advice}
              </p>
            )}
            <p className="mt-3 text-sm text-muted">
              Gols previstos: {p.predictions.goals.home ?? "-"} (mandante) · {p.predictions.goals.away ?? "-"}{" "}
              (visitante)
              {p.predictions.under_over ? ` · Total ${p.predictions.under_over}` : ""}
            </p>
          </Cartao>
          <Cartao titulo="Comparação entre os times">
            <div className="space-y-3">
              {Object.entries(p.comparison).map(([k, v]) => (
                <Barra key={k} rotulo={`${COMPARACAO_PT[k] ?? k} · visitante ${v.away}`} valor={v.home} />
              ))}
            </div>
          </Cartao>
        </div>
      )}
    </Consulta>
  );
}

export function AbaOdds({ id, aoVivo }: { id: string; aoVivo: boolean }) {
  const [casa, setCasa] = useState(0);
  const pre = useApi<Odd[]>("odds", { fixture: id });
  const vivo = useApi<OddAoVivo[]>("odds/live", { fixture: id }, { enabled: aoVivo, staleTime: 30_000 });

  return (
    <div className="space-y-6">
      {aoVivo && (
        <Cartao titulo="Odds ao vivo" descricao="Atualizadas a cada 30 segundos" semPadding>
          <Consulta q={vivo} vazio={vazioSeLista("Sem odds ao vivo para este jogo.")}>
            {([o]) => <Mercados mercados={o.odds} />}
          </Consulta>
        </Cartao>
      )}
      <Cartao titulo="Odds pré-jogo" semPadding>
        <Consulta q={pre} vazio={vazioSeLista("Sem odds pré-jogo para este jogo.")}>
          {([o]) => {
            const casas = o.bookmakers;
            const atual = casas[Math.min(casa, casas.length - 1)];
            return (
              <div>
                <div className="border-b border-line p-4">
                  <Seletor
                    rotulo="Casa de apostas"
                    valor={casa}
                    onChange={setCasa}
                    opcoes={casas.map((c, i) => ({ valor: i, texto: c.name }))}
                    className="w-64"
                  />
                </div>
                <Mercados mercados={atual?.bets ?? []} />
              </div>
            );
          }}
        </Consulta>
      </Cartao>
    </div>
  );
}

export function AbaLesoes({ id }: { id: string }) {
  const q = useApi<Lesao[]>("injuries", { fixture: id });
  return (
    <Cartao semPadding>
      <Consulta q={q} vazio={vazioSeLista("Nenhuma lesão ou suspensão informada para este jogo.")}>
        {(lesoes) => <TabelaLesoes lesoes={lesoes} />}
      </Consulta>
    </Cartao>
  );
}

export function TabelaLesoes({ lesoes, mostrarJogo = false }: { lesoes: Lesao[]; mostrarJogo?: boolean }) {
  const colunas: Coluna<Lesao>[] = [
    {
      titulo: "Jogador",
      render: (l) => (
        <span className="inline-flex items-center gap-2">
          <Escudo src={l.player.photo} nome={l.player.name} tamanho={26} redondo />
          {l.player.name}
        </span>
      ),
      ordenar: (l) => l.player.name,
    },
    { titulo: "Time", render: (l) => <LinkTime time={l.team} tamanho={20} />, ordenar: (l) => l.team.name },
    {
      titulo: "Tipo",
      render: (l) => (
        <Pilula tom={l.player.type.includes("Missing") ? "perigo" : "aviso"}>{l.player.type}</Pilula>
      ),
    },
    { titulo: "Motivo", render: (l) => l.player.reason },
    ...(mostrarJogo
      ? [
          {
            titulo: "Jogo",
            render: (l: Lesao) => (
              <a href={`/jogos/${l.fixture.id}`} className="text-brand hover:underline">
                {formatarData(l.fixture.date)}
              </a>
            ),
            ordenar: (l: Lesao) => l.fixture.date,
          },
        ]
      : []),
  ];
  return (
    <Tabela
      rotulo="Lesões e suspensões"
      colunas={colunas}
      linhas={lesoes}
      chave={(l, i) => `${l.player.id}-${l.fixture.id}-${i}`}
      href={(l) => `/jogadores/${l.player.id}`}
      buscavel={(l) => `${l.player.name} ${l.team.name} ${l.player.reason}`}
      tamanhoInicial={10}
    />
  );
}
