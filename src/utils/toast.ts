import toast from "react-hot-toast";

export const toastSuccess = (message: string) => {
  toast.success(message);
};

export const toastError = (message: string) => {
  toast.error(message);
};

export const toastLoading = (message: string) => {
  return toast.loading(message);
};

export const toastUpdateSuccess = (id: string, message: string) => {
  toast.success(message, { id });
};

export const toastUpdateError = (id: string, message: string) => {
  toast.error(message, { id });
};
