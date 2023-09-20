import { combineReducers, configureStore } from '@reduxjs/toolkit'

//importação para o redux saga
// import createSagaMiddleware from 'redux-saga'

//importação do sagas para altenticação firebase
// import sagaAltenticationGoogle from './AltenticationSaga'

//importação do SLICE de altenticação, onde contem actions e reducer de Altenticação
import sliceAltentication from "./sliceAltentication"

import { persistReducer, persistStore } from 'redux-persist';

import storage from 'redux-persist/lib/storage';



// import sliceUser from './user/sliceUser';
// import sagaUser from './user/UserSaga';



// importações sagar para combinação de sagas
// import { all } from 'redux-saga/effects';
// import { combineWatchers } from 'redux-saga-combine-watchers';
import thunk from 'redux-thunk';


const rootReducer = combineReducers({ 
  altentication: sliceAltentication,
    //   user:sliceUser,
})

// function* rootSaga() {
//   yield all([sagaAltenticationGoogle(),sagaUser()]);
// }

// function* rootSaga() {
//   yield all(combineWatchers(sagaAltenticationGoogleWatcher, sagaUser))
// }

const persistConfig = {
  key: 'root',
  storage,
}
const persistedReducer = persistReducer(persistConfig, rootReducer)

// const saga = createSagaMiddleware()

export const store = configureStore({
  // reducer: {
  //   altentication: sliceAltentication
  // },
  reducer: persistedReducer,
  middleware: [thunk],
  // middleware: [saga],
})

// saga.run(rootSaga)


export const persistor = persistStore(store)

// export default store;

