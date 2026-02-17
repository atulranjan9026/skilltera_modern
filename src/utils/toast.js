import { toast as sonnerToast } from 'sonner';

export const toast = {
    success: (message, options = {}) => {
        return sonnerToast.success(message, options);
    },

    error: (message, options = {}) => {
        return sonnerToast.error(message, options);
    },

    info: (message, options = {}) => {
        return sonnerToast.info(message, options);
    },

    warning: (message, options = {}) => {
        return sonnerToast.warning(message, options);
    },

    promise: (promise, messages) => {
        return sonnerToast.promise(promise, messages);
    },

    loading: (message, options = {}) => {
        return sonnerToast.loading(message, options);
    },

    custom: (message, options = {}) => {
        return sonnerToast(message, options);
    },

    dismiss: (toastId) => {
        return sonnerToast.dismiss(toastId);
    },
};