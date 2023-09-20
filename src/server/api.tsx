import axios from "axios";
import { useSelector } from "react-redux";
import { userAltentication } from "../redux/sliceAltentication";

// console.log(dadosAutentication.data.uid?.uid);

function useApi() {
  const dadosAutentication = useSelector(userAltentication);

  // console.log(dadosAutentication.data.accessToken);

  const api = axios.create({ baseURL: "https://v3.football.api-sports.io/" });

  // const dadosAutentication = useSelector(userAltentication);

  const login = async (keyapi?: any) => {
    try {
      const sucesso = await api.get("status", {
        headers: {
          "x-rapidapi-key": keyapi,
          "x-rapidapi-host": "v3.football.api-sports.io",
        },
      });

      console.log(sucesso);

      if (sucesso.data.response.subscription.active == true) {
        return keyapi;
      } else throw new Error("user inesistente ou  não ativo na conta");
    } catch (error) {
      throw "erro na conecção com a api";
    }
  };

  const GetTimesHome = async () => {
    try {
      const sucesso = await api.get("teams", {
        headers: {
          "x-rapidapi-key": dadosAutentication.data.accessToken,
          "x-rapidapi-host": "v3.football.api-sports.io",
        },
        params: {
          search: "Brazil",
          // results: 10,
        },
      });

      // console.log(sucesso)

      const newArray = await sucesso.data.response.slice(1, 22);

      // console.log(newArray);

      return newArray;
    } catch (error) {
      throw "erro na conecção com a api";
    }
  };

  const GetPlayersHome = async () => {
    try {
      const sucesso = await api.get("players", {
        headers: {
          "x-rapidapi-key": dadosAutentication.data.accessToken,
          "x-rapidapi-host": "v3.football.api-sports.io",
        },
        // qs :  { id :  '276' , season :  '2019' } ,
        params: { season: "2022", league: "2" },
      });

      // console.log(sucesso);

      const newArray = await sucesso.data.response.slice(1, 22);

      // console.log(newArray);

      return newArray;
    } catch (error) {
      throw "erro na conecção com a api";
    }
  };

  const GetPlayersAlive = async () => {
    try {
      const sucesso = await api.get("fixtures", {
        headers: {
          "x-rapidapi-key": dadosAutentication.data.accessToken,
          "x-rapidapi-host": "v3.football.api-sports.io",
        },
        // qs :  { id :  '276' , season :  '2019' } ,
        params: { live: "all" },
      });

      // console.log(sucesso);

      // const newArray = await sucesso.data.response.slice(0, 20);

      // console.log(sucesso.data.response);

      return sucesso.data.response;
    } catch (error) {
      throw "erro na conecção com a api";
    }
  };

  const GetPlayerById = async (id: string) => {
    try {
      const sucesso = await api.get("players", {
        headers: {
          "x-rapidapi-key": dadosAutentication.data.accessToken,
          "x-rapidapi-host": "v3.football.api-sports.io",
        },
        // qs :  { id :  '276' , season :  '2019' } ,
        params: { season: "2022", id: id },
      });

      // console.log(sucesso);

      // const newArray = await sucesso.data.response.slice(0, 20);

      // console.log(sucesso.data.response);

      return sucesso.data.response;
    } catch (error) {
      throw "erro na conecção com a api";
    }
  };

  return {
    login,
    GetTimesHome,
    GetPlayersHome,
    GetPlayersAlive,
    GetPlayerById
  };
}

export default useApi;
