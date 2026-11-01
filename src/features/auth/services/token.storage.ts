import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';
const POLITICIAN_KEY = 'auth_politician';

// In-memory fallback for environments without SecureStore or web localStorage
let memoryStorage: Record<string, string> = {};

async function isSecureStoreAvailable(): Promise<boolean> {
  if (Platform.OS === 'web') return false;
  try {
    return await SecureStore.isAvailableAsync();
  } catch {
    return false;
  }
}

async function setItem(key: string, value: string): Promise<void> {
  try {
    const isSecure = await isSecureStoreAvailable();
    if (isSecure) {
      await SecureStore.setItemAsync(key, value);
      return;
    }
  } catch {
    // Fall back to localStorage / memory
  }

  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      window.localStorage.setItem(key, value);
      return;
    } catch {
      // Fallback to memory
    }
  }

  memoryStorage[key] = value;
}

async function getItem(key: string): Promise<string | null> {
  try {
    const isSecure = await isSecureStoreAvailable();
    if (isSecure) {
      return await SecureStore.getItemAsync(key);
    }
  } catch {
    // Fall back to localStorage / memory
  }

  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      return window.localStorage.getItem(key);
    } catch {
      // Fallback to memory
    }
  }

  return memoryStorage[key] ?? null;
}

async function deleteItem(key: string): Promise<void> {
  try {
    const isSecure = await isSecureStoreAvailable();
    if (isSecure) {
      await SecureStore.deleteItemAsync(key);
      return;
    }
  } catch {
    // Fall back to localStorage / memory
  }

  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      window.localStorage.removeItem(key);
      return;
    } catch {
      // Fallback to memory
    }
  }

  delete memoryStorage[key];
}

export const TokenStorage = {
  async saveToken(token: string): Promise<void> {
    await setItem(TOKEN_KEY, token);
  },

  async getToken(): Promise<string | null> {
    return await getItem(TOKEN_KEY);
  },

  async removeToken(): Promise<void> {
    await deleteItem(TOKEN_KEY);
  },

  async saveAuthMetadata(user: unknown, politician: unknown): Promise<void> {
    await setItem(USER_KEY, JSON.stringify(user));
    await setItem(POLITICIAN_KEY, JSON.stringify(politician));
  },

  async getAuthMetadata<U, P>(): Promise<{ user: U | null; politician: P | null }> {
    const userJson = await getItem(USER_KEY);
    const polJson = await getItem(POLITICIAN_KEY);
    return {
      user: userJson ? JSON.parse(userJson) : null,
      politician: polJson ? JSON.parse(polJson) : null,
    };
  },

  async clearAll(): Promise<void> {
    await deleteItem(TOKEN_KEY);
    await deleteItem(USER_KEY);
    await deleteItem(POLITICIAN_KEY);
  },
};

