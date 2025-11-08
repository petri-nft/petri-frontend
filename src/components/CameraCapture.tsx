import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, X, Check } from 'lucide-react';
import { getCameraStream, capturePhoto, stopCameraStream, compressImage } from '@/lib/utils/camera';
import { useToast } from '@/hooks/use-toast';

interface CameraCaptureProps {
  onCapture: (photoUrl: string) => void;
  onCancel: () => void;
}

export const CameraCapture = ({ onCapture, onCancel }: CameraCaptureProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    const initCamera = async () => {
      try {
        const mediaStream = await getCameraStream();
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Camera Error',
          description: error instanceof Error ? error.message : 'Unable to access camera',
        });
      }
    };
    
    initCamera();
    
    return () => {
      if (stream) {
        stopCameraStream(stream);
      }
    };
  }, []);
  
  const handleCapture = async () => {
    if (!videoRef.current) return;
    
    setIsProcessing(true);
    try {
      const photo = capturePhoto(videoRef.current);
      const compressed = await compressImage(photo);
      setCapturedPhoto(compressed);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Capture Error',
        description: 'Failed to capture photo',
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleConfirm = () => {
    if (capturedPhoto) {
      onCapture(capturedPhoto);
      if (stream) {
        stopCameraStream(stream);
      }
    }
  };
  
  const handleRetake = () => {
    setCapturedPhoto(null);
  };
  
  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-4">
        <div className="relative rounded-2xl overflow-hidden bg-black aspect-[4/3]">
          {!capturedPhoto ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          ) : (
            <img src={capturedPhoto} alt="Captured" className="w-full h-full object-cover" />
          )}
        </div>
        
        <div className="flex gap-3 justify-center">
          <Button
            variant="outline"
            size="lg"
            onClick={onCancel}
            className="px-8"
          >
            <X className="w-5 h-5 mr-2" />
            Cancel
          </Button>
          
          {!capturedPhoto ? (
            <Button
              size="lg"
              onClick={handleCapture}
              disabled={isProcessing}
              className="px-8 bg-primary hover:bg-primary/90"
            >
              <Camera className="w-5 h-5 mr-2" />
              {isProcessing ? 'Processing...' : 'Capture'}
            </Button>
          ) : (
            <>
              <Button variant="outline" size="lg" onClick={handleRetake} className="px-8">
                Retake
              </Button>
              <Button size="lg" onClick={handleConfirm} className="px-8 bg-primary hover:bg-primary/90">
                <Check className="w-5 h-5 mr-2" />
                Confirm
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
