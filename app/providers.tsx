"use client";

import { ChakraProvider, extendTheme, useColorMode } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { PreferenciasProvider } from "@/contexts/Preferencias";

// "system" segue o sistema até a pessoa escolher; a escolha fica no localStorage do Chakra
const theme = extendTheme({
  config: { initialColorMode: "system", useSystemColorMode: false },
  fonts: { body: "inherit", heading: "inherit" },
  styles: { global: { body: { bg: "transparent" } } },
  colors: {
    brand: {
      50: "#e0f5f0",
      100: "#b8e8dd",
      200: "#8ddbcb",
      300: "#5fcdb9",
      400: "#34bfa7",
      500: "#00816a",
      600: "#006f5b",
      700: "#005c4b",
      800: "#00493c",
      900: "#00362c",
    },
  },
});

// O Tailwind usa a classe `dark` no <html>; o Chakra é a fonte única do tema.
function ThemeSync() {
  const { colorMode } = useColorMode();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", colorMode === "dark");
  }, [colorMode]);

  return null;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({ defaultOptions: { queries: { retry: false } } }));

  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        <ThemeSync />
        <PreferenciasProvider>{children}</PreferenciasProvider>
      </ChakraProvider>
    </QueryClientProvider>
  );
}
