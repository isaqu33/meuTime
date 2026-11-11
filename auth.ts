import { createHash } from "node:crypto";
import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { validarChave } from "@/lib/apiFootball";
import { chaveValida, normalizarChave } from "@/lib/chave";
import { limitadorLogin } from "@/lib/limitadores";

class LoginLimitado extends CredentialsSignin {
  code = "limite";
}
class ApiIndisponivel extends CredentialsSignin {
  code = "indisponivel";
}

declare module "next-auth" {
  interface Session {
    user: { id?: string; name?: string | null; plano?: string };
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 },
  pages: { signIn: "/login" },
  providers: [
    Credentials({
      credentials: { apiKey: {} },
      authorize: async (credentials, request) => {
        const chave = normalizarChave(credentials?.apiKey);

        const ip = request?.headers?.get("x-forwarded-for")?.split(",")[0].trim() || "local";
        if (!limitadorLogin.tentar(ip).permitido) throw new LoginLimitado();

        if (!chaveValida(chave)) return null;

        const resultado = await validarChave(chave);
        if (!resultado.ok) {
          if (resultado.motivo === "indisponivel") throw new ApiIndisponivel();
          return null;
        }

        // `apiKey` vai no JWT da sessão, que o Auth.js criptografa no cookie httpOnly;
        // o navegador nunca a lê de volta.
        return {
          id: createHash("sha256").update(chave).digest("hex").slice(0, 16),
          name: resultado.nome,
          plano: resultado.plano,
          apiKey: chave,
        } as never;
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.apiKey = (user as { apiKey?: string }).apiKey;
        token.plano = (user as { plano?: string }).plano;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.sub as string;
      session.user.plano = token.plano as string | undefined;
      return session;
    },
  },
});
