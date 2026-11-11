// Limitador de janela fixa, em memória (uma instância do servidor). Em produção com várias
// instâncias o estado teria de ir para o Redis; aqui é suficiente e está documentado no README.

export interface Limitador {
  tentar(chave: string): { permitido: boolean; retryAfterS: number };
}

export function criarLimitador(opcoes: {
  limite: number;
  janelaMs: number;
  agora?: () => number;
}): Limitador {
  const { limite, janelaMs, agora = Date.now } = opcoes;
  const contagens = new Map<string, { n: number; inicio: number }>();

  return {
    tentar(chave) {
      const t = agora();
      // evita crescer sem limite quando chegam muitas chaves diferentes
      if (contagens.size > 5000) {
        for (const [k, v] of contagens) if (t - v.inicio >= janelaMs) contagens.delete(k);
      }

      const atual = contagens.get(chave);
      if (!atual || t - atual.inicio >= janelaMs) {
        contagens.set(chave, { n: 1, inicio: t });
        return { permitido: true, retryAfterS: 0 };
      }
      if (atual.n >= limite) {
        return { permitido: false, retryAfterS: Math.ceil((atual.inicio + janelaMs - t) / 1000) };
      }
      atual.n += 1;
      return { permitido: true, retryAfterS: 0 };
    },
  };
}
