import Clear from './Clear';
import ClearCallTraces from './ClearCallTraces';
import Stats from './Stats';
import UpdateKnowledgeBase from './UpdateKnowledgeBase';
import Upload from './Upload';

export default function FileUploadPage() {
  return (
    <div className="min-h-screen bg-white px-10 pt-30">
      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Upload File</h1>
      </div>

      {/* Stats */}
      <div className="pb-10">
        <Stats />
      </div>

      {/* Action Buttons Row */}
      <div className="mb-8 flex items-center justify-between gap-8">
        <div className="flex flex-1 justify-start">
          <UpdateKnowledgeBase />
        </div>
        <div className="flex flex-1 justify-end space-x-4">
          <Clear />
        </div>
        <div className="flex flex-1 justify-end">
          <ClearCallTraces />
        </div>
      </div>

      {/* Upload Area */}
      <Upload />
    </div>
  );
}
