import {
  Calendar,
  CurrencyDollar,
  FirstAid,
  Flag,
  House,
  Medal,
  SoccerBall,
  Strategy,
  Swap,
  Trophy,
  UsersThree,
  type Icon,
} from "phosphor-react";

export interface ItemNav {
  href: string;
  rotulo: string;
  icone: Icon;
}

export const GRUPOS_NAV: { titulo: string; itens: ItemNav[] }[] = [
  { titulo: "Visão geral", itens: [{ href: "/", rotulo: "Início", icone: House }] },
  {
    titulo: "Futebol",
    itens: [
      { href: "/jogos", rotulo: "Jogos", icone: Calendar },
      { href: "/ligas", rotulo: "Ligas e copas", icone: Trophy },
      { href: "/times", rotulo: "Times", icone: UsersThree },
      { href: "/jogadores", rotulo: "Jogadores", icone: SoccerBall },
      { href: "/tecnicos", rotulo: "Técnicos", icone: Strategy },
    ],
  },
  {
    titulo: "Mercado e saúde",
    itens: [
      { href: "/transferencias", rotulo: "Transferências", icone: Swap },
      { href: "/lesoes", rotulo: "Lesões", icone: FirstAid },
      { href: "/odds", rotulo: "Odds", icone: CurrencyDollar },
    ],
  },
  {
    titulo: "Referência",
    itens: [
      { href: "/estadios", rotulo: "Estádios", icone: Medal },
      { href: "/paises", rotulo: "Países", icone: Flag },
    ],
  },
];

export function ativo(href: string, pathname: string): boolean {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}
