import Clear from './Clear';
import Stats from './Stats';
import Upload from './Upload';

export default function FileUploadPage() {
  return (
    <div className="min-h-screen bg-white px-10 pt-30">
      <div className="pb-10">
        <Stats />
      </div>
      <Upload />
      <div className="pt-10 text-center">
        <Clear />
      </div>
    </div>
  );
}
