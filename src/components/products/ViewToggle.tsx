import { LayoutGrid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ViewToggleProps {
  view: 'grid' | 'table';
  onViewChange: (view: 'grid' | 'table') => void;
}

export function ViewToggle({ view, onViewChange }: ViewToggleProps) {
  return (
    <div className="flex items-center gap-1 bg-[#150f24] rounded-lg p-1 border border-white/10">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onViewChange('grid')}
        className={`flex items-center gap-2 ${
          view === 'grid'
            ? 'bg-gradient-to-r from-[#9a02d0] to-[#44f80c] text-white hover:opacity-90'
            : 'text-gray-400 hover:text-white hover:bg-white/5'
        }`}
      >
        <LayoutGrid className="w-4 h-4" />
        <span className="hidden sm:inline">Grid</span>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onViewChange('table')}
        className={`flex items-center gap-2 ${
          view === 'table'
            ? 'bg-gradient-to-r from-[#9a02d0] to-[#44f80c] text-white hover:opacity-90'
            : 'text-gray-400 hover:text-white hover:bg-white/5'
        }`}
      >
        <List className="w-4 h-4" />
        <span className="hidden sm:inline">Table</span>
      </Button>
    </div>
  );
}
