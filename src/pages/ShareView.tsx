import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useToast } from '../lib/toast';
import { File, Image, Video, FileText, Music, Archive, Download, ExternalLink, Shield, Clock } from 'lucide-react';
import { useEffect } from 'react';

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

const FILE_ICONS: Record<string, any> = {
  image: Image, video: Video, document: FileText, audio: Music, archive: Archive, other: File,
};

export function ShareView() {
  const { toast } = useToast();
  const token = window.location.pathname.split('/share/')[1];

  const file = useQuery(
    api.mediaShares.queries.getByToken,
    token ? { token } : 'skip'
  );

  const incrementAccess = useMutation(api.mediaShares.mutations.incrementAccess);

  useEffect(() => {
    if (token && file) {
      incrementAccess({ token }).catch(() => {});
    }
  }, [token, file]);

  if (file === undefined) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="h-8 w-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (file === null) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="py-16 text-center">
            <Shield className="h-12 w-12 text-dark-600 mx-auto mb-4" />
            <h1 className="text-xl font-serif text-white mb-2">Link Unavailable</h1>
            <p className="text-sm text-dark-400">This share link is invalid, expired, or the file was deleted.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const Icon = FILE_ICONS[file.fileType] || File;

  const handleDownload = () => {
    if (file.displayUrl) {
      const a = document.createElement('a');
      a.href = file.displayUrl;
      a.download = file.name;
      a.click();
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center p-4">
      <Card className="max-w-lg w-full">
        <CardContent className="py-8 px-8 text-center">
          {/* File Preview */}
          <div className="mb-6">
            {file.fileType === 'image' && file.displayUrl ? (
              <img
                src={file.displayUrl}
                alt={file.name}
                className="w-full max-h-80 object-contain rounded-xl"
                referrerPolicy="no-referrer"
              />
            ) : file.fileType === 'video' && file.displayUrl ? (
              <video
                src={file.displayUrl}
                controls
                className="w-full max-h-80 rounded-xl"
              />
            ) : (
              <div className="h-32 rounded-xl bg-dark-800 flex items-center justify-center">
                <Icon className="h-16 w-16 text-dark-500" />
              </div>
            )}
          </div>

          {/* File Info */}
          <h1 className="text-lg font-serif text-white mb-1 truncate">{file.name}</h1>
          <p className="text-sm text-dark-400 mb-6">
            {formatBytes(file.fileSize)} · {file.fileType}
          </p>

          {/* Actions */}
          <div className="flex gap-3 justify-center">
            {file.allowDownload && file.displayUrl && (
              <Button onClick={handleDownload} className="flex items-center gap-2">
                <Download className="h-4 w-4" /> Download
              </Button>
            )}
            {file.displayUrl && (
              <Button
                variant="outline"
                onClick={() => window.open(file.displayUrl, '_blank')}
                className="flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" /> Open
              </Button>
            )}
          </div>

          {/* Share Info */}
          <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-center gap-4 text-[10px] text-dark-500">
            <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {file.shareAccessCount} views</span>
            {file.allowDownload && <span>Downloads enabled</span>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
