"use client";

import { Drawer, DrawerBody, DrawerContent, DrawerOverlay, useDisclosure } from "@chakra-ui/react";
import { List, SoccerBall } from "phosphor-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { ativo, GRUPOS_NAV } from "./navegacao";
import { Topbar } from "./Topbar";

function Menu({ aoNavegar }: { aoNavegar?: () => void }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Principal" className="space-y-5 px-3 pb-6">
      {GRUPOS_NAV.map((grupo) => (
        <div key={grupo.titulo}>
          <p className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted">
            {grupo.titulo}
          </p>
          <ul className="space-y-0.5">
            {grupo.itens.map(({ href, rotulo, icone: Icone }) => {
              const atual = ativo(href, pathname);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={aoNavegar}
                    aria-current={atual ? "page" : undefined}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      atual ? "bg-brand-soft text-brand" : "text-muted hover:bg-subtle hover:text-fg"
                    }`}
                  >
                    <Icone size={18} weight={atual ? "fill" : "regular"} />
                    {rotulo}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

function Marca() {
  return (
    <Link href="/" className="flex items-center gap-2 px-6 py-5 text-lg font-bold tracking-tight text-fg">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-brand-fg">
        <SoccerBall size={20} weight="fill" />
      </span>
      Soccer-Mania
    </Link>
  );
}

export function Shell({
  nome,
  plano,
  children,
}: {
  nome: string;
  plano?: string;
  children: React.ReactNode;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const pathname = usePathname();

  // fecha o menu móvel ao trocar de página
  useEffect(onClose, [pathname, onClose]);

  return (
    <div className="min-h-screen bg-app lg:pl-64">
      <aside className="fixed inset-y-0 left-0 hidden w-64 overflow-y-auto border-r border-line bg-surface lg:block">
        <Marca />
        <Menu />
      </aside>

      <Drawer isOpen={isOpen} onClose={onClose} placement="left">
        <DrawerOverlay />
        <DrawerContent maxW="16rem" className="!bg-surface !text-fg">
          <DrawerBody p={0}>
            <Marca />
            <Menu aoNavegar={onClose} />
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      <div className="flex min-h-screen flex-col">
        <Topbar
          nome={nome}
          plano={plano}
          menu={
            <button
              type="button"
              aria-label="Abrir menu"
              onClick={onOpen}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-line text-fg lg:hidden"
            >
              <List size={20} />
            </button>
          }
        />
        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
