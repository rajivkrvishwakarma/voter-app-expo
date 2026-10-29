/**
 * Environment configuration for the mobile client.
 *
 * Rules:
 * - Only EXPO_PUBLIC_* variables are available in the React Native client bundle.
 * - Never store private backend secrets, database credentials, or private API keys here.
 */

export type AppEnvironment = 'development' | 'staging' | 'production';

export interface EnvConfig {
  apiBaseUrl: string;
  appEnv: AppEnvironment;
  isDevelopment: boolean;
  isProduction: boolean;
}

const rawEnv = (process.env.EXPO_PUBLIC_APP_ENV || 'development') as AppEnvironment;
const validEnvs: AppEnvironment[] = ['development', 'staging', 'production'];
const appEnv: AppEnvironment = validEnvs.includes(rawEnv) ? rawEnv : 'development';

export const ENV: EnvConfig = {
  apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL || 'https://api.example.com/v1',
  appEnv,
  isDevelopment: appEnv === 'development',
  isProduction: appEnv === 'production',
};
