import {combineReducers, configureStore} from '@reduxjs/toolkit';
import libraryReducer from '../features/library/librarySlice';
import authReducer from '../features/auth/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistStore, persistReducer, purgeStoredState } from 'redux-persist'


const libraryPersistConfig = {
    key: 'library',
    storage: AsyncStorage,
    blacklist: ['isRefreshing', 'modalVisible', 'selectedBook', 'selectedBookAudios', 'isAddingBook', 'currentlyPlaying']
};

const authPresistConfig = {
    key: 'auth',
    storage: AsyncStorage,
};

// purgeStoredState(libraryPersistConfig);
// purgeStoredState(authPresistConfig);

const persistedLibraryReducer = persistReducer(libraryPersistConfig, libraryReducer);

const persistedAuthReducer = persistReducer(authPresistConfig, authReducer);

const persistentReducer = combineReducers({
    library: persistedLibraryReducer,
    auth: persistedAuthReducer
})

export const store = configureStore({
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
      }),
    reducer: persistentReducer
});

export const persistor = persistStore(store);