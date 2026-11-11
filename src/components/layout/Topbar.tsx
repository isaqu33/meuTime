"use client";

import {
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  useColorMode,
  useDisclosure,
} from "@chakra-ui/react";
import { Gauge, Moon, SignOut, Sliders, Sun, UserCircle } from "phosphor-react";
import { signOut } from "next-auth/react";
import type { ReactNode } from "react";
import { Seletor } from "@/components/ui/Campos";
import { TEMPORADAS } from "@/data/ligas";
import { usePreferencias } from "@/contexts/Preferencias";
import { useApi, useConta } from "@/hooks/useApi";

const botaoIcone =
  "flex h-9 items-center gap-2 rounded-lg border border-line bg-surface px-2.5 text-sm text-fg hover:bg-subtle";

export function TemaToggle() {
  const { colorMode, toggleColorMode } = useColorMode();
  const escuro = colorMode === "dark";
  return (
    <button
      type="button"
      onClick={toggleColorMode}
      aria-label={escuro ? "Mudar para o tema claro" : "Mudar para o tema escuro"}
      className={`${botaoIcone} w-9 justify-center px-0`}
    >
      {escuro ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}

function Uso() {
  const { data } = useConta();
  if (!data || !data.limite) return null;
  const pct = Math.min(100, Math.round((data.usadas / data.limite) * 100));
  const tom = pct >= 90 ? "bg-danger" : pct >= 70 ? "bg-warn" : "bg-brand";
  return (
    <div
      className="hidden items-center gap-2 rounded-lg border border-line bg-surface px-2.5 py-1.5 text-xs text-muted md:flex"
      title={`Plano ${data.plano}: ${data.usadas} de ${data.limite} requisições hoje`}
    >
      <Gauge size={16} />
      <span className="tabular">
        {data.usadas}/{data.limite}
      </span>
      <span className="h-1.5 w-14 overflow-hidden rounded-full bg-subtle">
        <span className={`block h-full ${tom}`} style={{ width: `${pct}%` }} />
      </span>
    </div>
  );
}

function PreferenciasMenu() {
  const { temporada, fuso, alterar } = usePreferencias();
  const { isOpen, onOpen, onClose } = useDisclosure();
  // a lista de fusos só é buscada quando o menu abre
  const fusos = useApi<string[]>("timezone", {}, { enabled: isOpen, staleTime: 24 * 60 * 60_000 });
  const lista = fusos.data?.response ?? [fuso];

  return (
    <Popover isOpen={isOpen} onOpen={onOpen} onClose={onClose} placement="bottom-end">
      <PopoverTrigger>
        <button type="button" className={botaoIcone} aria-label="Preferências">
          <Sliders size={18} />
          <span className="tabular hidden sm:inline">Temporada {temporada}</span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="!border-line !bg-surface !text-fg" w="72">
        <PopoverBody className="space-y-3">
          <Seletor
            rotulo="Temporada"
            valor={temporada}
            onChange={(t) => alterar({ temporada: t })}
            opcoes={TEMPORADAS.map((t) => ({ valor: t, texto: String(t) }))}
          />
          <Seletor
            rotulo="Fuso dos horários"
            valor={fuso}
            onChange={(f) => alterar({ fuso: f })}
            opcoes={lista.map((f) => ({ valor: f, texto: f }))}
          />
          <p className="text-xs text-muted">
            O plano gratuito da API-Sports cobre as temporadas 2021 a 2023.
          </p>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}

function MenuUsuario({ nome, plano }: { nome: string; plano?: string }) {
  return (
    <Popover placement="bottom-end">
      <PopoverTrigger>
        <button type="button" aria-label="Menu do usuário" className={botaoIcone}>
          <UserCircle size={20} />
          <span className="hidden max-w-28 truncate sm:inline">{nome}</span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="!border-line !bg-surface !text-fg" w="56">
        <PopoverBody>
          <p className="text-sm font-semibold">{nome}</p>
          {plano && <p className="mb-3 text-xs text-muted">Plano {plano}</p>}
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-danger/10 px-3 py-2 text-sm font-medium text-danger hover:bg-danger/20"
          >
            <SignOut size={16} /> Sair
          </button>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}

export function Topbar({ nome, plano, menu }: { nome: string; plano?: string; menu: ReactNode }) {
  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between gap-3 border-b border-line bg-surface/90 px-4 backdrop-blur sm:px-6 lg:px-8">
      {menu}
      <div className="ml-auto flex items-center gap-2">
        <Uso />
        <PreferenciasMenu />
        <TemaToggle />
        <MenuUsuario nome={nome} plano={plano} />
      </div>
    </header>
  );
}
