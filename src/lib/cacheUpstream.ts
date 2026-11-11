// Cache em memória das respostas da API-Sports, compartilhado entre usuários (os dados são públicos).
// O plano gratuito tem ~100 requisições por dia, então reaproveitar respostas é o que mantém o app usável.
// Uma instância do servidor; com várias, o estado iria para o Redis.

export interface Entrada {
  corpo: unknown;
  expira: number;
}

export interface Cache {
  obter(chave: string): unknown | undefined;
  guardar(chave: string, corpo: unknown, ttlMs: number): void;
}

export function criarCache(maximo = 500, agora: () => number = Date.now): Cache {
  const itens = new Map<string, Entrada>();

  return {
    obter(chave) {
      const e = itens.get(chave);
      if (!e) return undefined;
      if (e.expira <= agora()) {
        itens.delete(chave);
        return undefined;
      }
      return e.corpo;
    },
    guardar(chave, corpo, ttlMs) {
      itens.delete(chave);
      itens.set(chave, { corpo, expira: agora() + ttlMs });
      // descarta as mais antigas (Map mantém a ordem de inserção)
      while (itens.size > maximo) itens.delete(itens.keys().next().value as string);
    },
  };
}
