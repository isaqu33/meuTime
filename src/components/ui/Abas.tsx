"use client";

import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import type { ReactNode } from "react";

/** Abas com conteúdo preguiçoso: a aba só consulta a API (e gasta cota) quando é aberta. */
export function Abas({ itens }: { itens: { rotulo: string; conteudo: () => ReactNode }[] }) {
  return (
    <Tabs isLazy lazyBehavior="keepMounted" variant="unstyled">
      <TabList className="mb-4 flex gap-1 overflow-x-auto border-b border-line">
        {itens.map((i) => (
          <Tab
            key={i.rotulo}
            className="-mb-px whitespace-nowrap border-b-2 border-transparent px-3 py-2 text-sm font-medium text-muted transition-colors hover:text-fg aria-selected:border-brand aria-selected:text-brand"
          >
            {i.rotulo}
          </Tab>
        ))}
      </TabList>
      <TabPanels>
        {itens.map((i) => (
          <TabPanel key={i.rotulo} p={0}>
            {i.conteudo()}
          </TabPanel>
        ))}
      </TabPanels>
    </Tabs>
  );
}
