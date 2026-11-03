import { create } from 'zustand';

export type AlertType = 'success' | 'info' | 'warning' | 'error';

export interface AlertOptions {
  title: string;
  message?: string;
  type?: AlertType;
  duration?: number;
  actionText?: string;
  onAction?: () => void;
}

export interface AlertState {
  visible: boolean;
  title: string;
  message?: string;
  type: AlertType;
  duration: number;
  actionText?: string;
  onAction?: () => void;
  showAlert: (options: AlertOptions) => void;
  hideAlert: () => void;
}

export const useAlertStore = create<AlertState>((set) => ({
  visible: false,
  title: '',
  message: undefined,
  type: 'info',
  duration: 3500,
  actionText: undefined,
  onAction: undefined,

  showAlert: (options) =>
    set({
      visible: true,
      title: options.title,
      message: options.message,
      type: options.type || 'info',
      duration: options.duration !== undefined ? options.duration : 3500,
      actionText: options.actionText,
      onAction: options.onAction,
    }),

  hideAlert: () =>
    set({
      visible: false,
    }),
}));

/**
 * Universal alert triggers callable from anywhere (inside or outside React components)
 */
export const triggerAlert = {
  success: (title: string, message?: string, duration?: number) =>
    useAlertStore.getState().showAlert({ title, message, type: 'success', duration }),
  error: (title: string, message?: string, duration?: number) =>
    useAlertStore.getState().showAlert({ title, message, type: 'error', duration }),
  warning: (title: string, message?: string, duration?: number) =>
    useAlertStore.getState().showAlert({ title, message, type: 'warning', duration }),
  info: (title: string, message?: string, duration?: number) =>
    useAlertStore.getState().showAlert({ title, message, type: 'info', duration }),
};

