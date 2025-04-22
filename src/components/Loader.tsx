import { Clock12 } from 'lucide-react';

interface LoaderProps {
  text?: string;
}

export function Loader({ text = 'Loading' }: LoaderProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="animate-[spin_3s_linear_infinite] relative">
        <Clock12 size={32} className="text-blue-500" />
      </div>
      <p className="text-gray-400">{text}</p>
    </div>
  );
}
