import Clear from './Clear';
import Stats from './Stats';
import UpdateKnowledgeBase from './UpdateKnowledgeBase';
import Upload from './Upload';

export default function FileUploadPage() {
  return (
    <div className="min-h-screen bg-white px-10 pt-30">
      <div className="pb-10">
        <Stats />
      </div>

      {/* Action Buttons Row */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex-1">
          <UpdateKnowledgeBase />
        </div>
        <div className="flex-1 text-center">
          {/* This space is intentionally left empty to center the upload area */}
        </div>
        <div className="flex-1 text-right">
          <Clear />
        </div>
      </div>

      {/* Upload Area */}
      <Upload />
    </div>
  );
}
