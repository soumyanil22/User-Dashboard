import { useToastStore } from './store/toastStore';

const Toast = () => {
  const { toast, hide } = useToastStore();

  if (!toast.isOpen) return null;

  return (
    <div className="fixed bottom-0 left-1/2 tranform -translate-x-1/2 m-4 p-4 bg-gray-800 text-white rounded-md shadow-lg z-50">
      <button onClick={hide} className="float-right font-bold ml-10">
        X
      </button>
      <span>{toast.message}</span>
    </div>
  );
};

export default Toast;
