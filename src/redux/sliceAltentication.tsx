//conjunto de logicas de (actions e reducers) que vamos utilizar para gerenciar nosso redux

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

//interface state inicial
interface AltenticationPayload {
  mensage?: any;
  uid?: string;
  accessToken?: string;
}

interface AtenticationState {
  data: AltenticationPayload;
  isLogged: boolean;
}

const initialState: AtenticationState = {
  data: {},
  isLogged: false,
};

const sliceAltentication = createSlice({
  name: "altentication",
  initialState,

  //função que vãõ receber um parametro state e action
  reducers: {
    //editaltentication() já é nossa propria action
    request_Altentication: (state): AtenticationState => {
      return state;
    },
    sucess_Altentication: (
      state,
      { payload }: PayloadAction<AltenticationPayload>
    ): AtenticationState => {
      return {
        data: {
          ...payload,
        },
        isLogged: true,
      };
    },
    error_Altentication: (
      state,
      { payload }: PayloadAction<AltenticationPayload>
    ): AtenticationState => {
      return {
        data: {
          ...payload,
        },
        isLogged: false,
      };
    },
  },
});

//aqui estampos exportando o reducer
export default sliceAltentication.reducer;

//aqui estamos exportando a action
export const {
  request_Altentication,
  sucess_Altentication,
  error_Altentication,
} = sliceAltentication.actions;

//o seletor que vai ser consumido pedo useSelector
export const userAltentication = (state: any): AtenticationState => {
  return state.altentication;
};
