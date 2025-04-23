import { Loader2 } from 'lucide-react';

interface LoaderProps {
  text?: string;
}

export function Loader({ text = 'Loading' }: LoaderProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="relative animate-spin">
        <Loader2 size={32} className="text-blue-500" strokeWidth={2.5} />
      </div>
      <p className="text-gray-400 font-medium text-sm">{text}</p>
    </div>
  );
}
