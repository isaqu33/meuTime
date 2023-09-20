import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

import { ChakraProvider } from "@chakra-ui/react";

//imports do react router dom
import { BrowserRouter, Routes, Route } from "react-router-dom";

//imports das pages para adicionar no 'link' do reactRouter

// importações para persist
import { PersistGate } from "redux-persist/integration/react";

//importações para o provaider do redux
import { Provider } from "react-redux";
import { store, persistor } from "./redux/store";

// imports do react aquery
import { QueryClient, QueryClientProvider } from "react-query";
import Login from "./pages/login.tsx";
import PrivateRoute from "./routes/PrivateRoute.tsx";
import Infoplayers from "./pages/Infoplayers.tsx";
import Home from "./pages/Home.tsx";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ChakraProvider>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <BrowserRouter>
              <Routes>
                <Route path="/login" element={<Login />} />

                <Route path="/" element={<PrivateRoute rout={<App />} />}>
                  <Route index element={<Home></Home>} />
                  <Route path="player/:id" element={<Infoplayers />} />
                  {/* <Route index element={<Links />}></Route> */}
                  {/* <Route path="appearance" element={<Appearance />} /> */}
                </Route>
              </Routes>
            </BrowserRouter>
          </PersistGate>
        </Provider>
      </QueryClientProvider>
    </ChakraProvider>
  </React.StrictMode>
);
