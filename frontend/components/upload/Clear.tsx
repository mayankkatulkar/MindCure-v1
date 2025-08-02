import { TrashIcon } from '@phosphor-icons/react/dist/ssr';
import { Button } from '@/components/ui/button';

export default function Clear() {
  function handleClick() {
    const confirmed = window.confirm(
      'Are you sure you want to clear all files and delete vector databases? This action cannot be undone.'
    );
    if (confirmed) {
      // TODO: Add actual clear/delete logic here
      // For now, just show a placeholder alert
      alert('All files and vector databases have been cleared (placeholder).');
    }
  }

  return (
    <Button
      className="rounded-2xl border-2 border-red-500 bg-red-100 text-center font-bold text-black shadow-lg hover:bg-red-400"
      onClick={handleClick}
    >
      <TrashIcon className="mr-2 h-4 w-4" />
      Clear All Files & Delete Vector Databases
    </Button>
  );
}
