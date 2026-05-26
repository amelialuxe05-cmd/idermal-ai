import { Scan as ScanIcon, Droplets, Shield, Activity, Loader2, Camera, CameraOff, RefreshCw } from 'lucide-react';
import { useSkinAnalysis } from '../hooks/useAppData';
import { useEffect, useState, useRef, useCallback } from 'react';

export function ScanTab() {
  const { analysis, isScanning, scanProgress, startScan } = useSkinAnalysis();
  const [animatingScores, setAnimatingScores] = useState({
    hydration: 0,
    clarity: 0,
    barrier: 0,
    elasticity: 0,
  });

  // Camera state
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isStartingCamera, setIsStartingCamera] = useState(false);
  const [cameraRequested, setCameraRequested] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [hasActiveStream, setHasActiveStream] = useState(false);

  // Effect to attach stream to video element when both are ready
  useEffect(() => {
    if (hasActiveStream && streamRef.current && videoRef.current) {
      videoRef.current.srcObject = streamRef.current;
      // Ensure video plays
      videoRef.current.play().catch(err => {
        console.error('Video play error:', err);
      });
    }
  }, [hasActiveStream]);

  // Request camera permission and start stream
  const requestCamera = useCallback(async () => {
    setIsStartingCamera(true);
    setCameraError(null);
    setCameraRequested(true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
        audio: false,
      });

      console.log('Camera stream obtained:', stream.getVideoTracks()[0]?.label);
      streamRef.current = stream;
      setHasActiveStream(true);

      // Attach stream to video element immediately if it exists
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        try {
          await videoRef.current.play();
          console.log('Video playing successfully');
        } catch (playErr) {
          console.error('Video play error:', playErr);
        }
      }
    } catch (err) {
      console.error('Camera error:', err);
      setHasActiveStream(false);
      setCameraRequested(false);
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError') {
          setCameraError('Camera permission denied. Please allow camera access in your browser settings.');
        } else if (err.name === 'NotFoundError') {
          setCameraError('No camera found. Please connect a camera and try again.');
        } else {
          setCameraError(`Camera error: ${err.message}`);
        }
      }
    } finally {
      setIsStartingCamera(false);
    }
  }, []);

  // Stop camera stream
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        console.log('Stopping track:', track.label);
        track.stop();
      });
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
      videoRef.current.pause();
    }
    setHasActiveStream(false);
    setCameraRequested(false);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Handle scan start with camera
  const handleStartScan = useCallback(() => {
    if (!hasActiveStream) {
      requestCamera();
    }
    startScan();
  }, [hasActiveStream, requestCamera, startScan]);

  // Randomly fluctuate scores during scanning
  useEffect(() => {
    if (isScanning) {
      const interval = setInterval(() => {
        setAnimatingScores({
          hydration: Math.floor(75 + Math.random() * 20),
          clarity: Math.floor(80 + Math.random() * 15),
          barrier: Math.floor(80 + Math.random() * 18),
          elasticity: Math.floor(75 + Math.random() * 20),
        });
      }, 150);
      return () => clearInterval(interval);
    } else if (analysis) {
      setAnimatingScores({
        hydration: analysis.hydration_score,
        clarity: analysis.clarity_score,
        barrier: analysis.barrier_score,
        elasticity: analysis.elasticity_score,
      });
    }
  }, [isScanning, analysis]);

  return (
    <div className="min-h-screen pb-24 bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-500 pt-12 pb-8 px-6">
        <div className="max-w-lg mx-auto">
          <h1 className="text-white text-2xl font-semibold">Skin Analysis</h1>
          <p className="text-teal-100 text-sm mt-1">AI-powered skin health scanner</p>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-6 -mt-4">
        {/* Scanner Interface */}
        <div className="bg-white rounded-3xl shadow-lg shadow-slate-200/50 overflow-hidden">
          {/* Camera View Area */}
          <div className="relative aspect-[4/3] bg-slate-900 flex items-center justify-center overflow-hidden">
            {/* Live Camera Feed - Always render video element when camera is requested */}
            {cameraRequested && !cameraError && (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="absolute inset-0 w-full h-full object-cover scale-x-[-1]"
                style={{ opacity: hasActiveStream ? 1 : 0 }}
              />
            )}

            {/* Scanning Overlay */}
            {isScanning && hasActiveStream && (
              <>
                {/* Dark overlay with scanning effect */}
                <div className="absolute inset-0 bg-black/20" />

                {/* Scanning line animation */}
                <div
                  className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-teal-400 to-transparent"
                  style={{
                    boxShadow: '0 0 20px rgba(20, 184, 166, 0.5)',
                    animation: 'scan-line 2s ease-in-out infinite'
                  }}
                />

                {/* Corner brackets */}
                <div className="absolute top-4 left-4 w-12 h-12 border-l-4 border-t-4 border-teal-400 rounded-tl-xl" />
                <div className="absolute top-4 right-4 w-12 h-12 border-r-4 border-t-4 border-teal-400 rounded-tr-xl" />
                <div className="absolute bottom-4 left-4 w-12 h-12 border-l-4 border-b-4 border-teal-400 rounded-bl-xl" />
                <div className="absolute bottom-4 right-4 w-12 h-12 border-r-4 border-b-4 border-teal-400 rounded-br-xl" />

                {/* Center scanning circle */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full border-2 border-teal-400/50" />
                    <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-teal-400 animate-spin" />
                    <div className="absolute inset-2 rounded-full border-2 border-transparent border-b-teal-400 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
                  </div>
                </div>

                {/* Scanning status overlay */}
                <div className="absolute bottom-4 left-0 right-0 flex flex-col items-center">
                  <div className="flex items-center gap-2 px-4 py-2 bg-black/60 backdrop-blur-sm rounded-full">
                    <Loader2 className="w-4 h-4 text-teal-400 animate-spin" />
                    <span className="text-white text-sm font-medium">
                      {scanProgress < 30 && 'Detecting face...'}
                      {scanProgress >= 30 && scanProgress < 60 && 'Analyzing skin texture...'}
                      {scanProgress >= 60 && scanProgress < 90 && 'Processing metrics...'}
                      {scanProgress >= 90 && 'Finalizing results...'}
                    </span>
                  </div>
                  <div className="mt-2 w-48">
                    <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-teal-400 transition-all duration-200"
                        style={{ width: `${scanProgress}%` }}
                      />
                    </div>
                    <p className="text-white/80 text-xs text-center mt-1">{Math.round(scanProgress)}%</p>
                  </div>
                </div>
              </>
            )}

            {/* Camera Permission Prompt / Error State */}
            {!hasActiveStream && !isScanning && !cameraRequested && (
              <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center z-10">
                <div className="w-24 h-24 rounded-full bg-teal-500/10 flex items-center justify-center mb-4">
                  <Camera className="w-12 h-12 text-teal-400" />
                </div>
                <p className="text-white text-lg font-medium">Ready to Scan</p>
                <p className="text-slate-400 text-sm mt-2 max-w-xs">
                  Click the button below to start your AI-powered skin analysis
                </p>
              </div>
            )}

            {/* Loading state while requesting camera */}
            {isStartingCamera && (
              <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center z-10 bg-slate-900">
                <Loader2 className="w-12 h-12 text-teal-400 animate-spin" />
                <p className="text-white text-lg font-medium mt-4">Requesting camera access...</p>
                <p className="text-slate-400 text-sm mt-2">Please allow camera permission</p>
              </div>
            )}

            {/* Error state */}
            {cameraError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center z-10">
                <div className="w-20 h-20 rounded-full bg-rose-500/10 flex items-center justify-center mb-4">
                  <CameraOff className="w-10 h-10 text-rose-400" />
                </div>
                <p className="text-white text-lg font-medium">Camera Unavailable</p>
                <p className="text-slate-400 text-sm mt-2 max-w-xs">{cameraError}</p>
                <button
                  onClick={requestCamera}
                  className="mt-4 flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Retry Camera Access
                </button>
              </div>
            )}

            {/* Idle camera view with feed */}
            {hasActiveStream && !isScanning && !cameraError && (
              <>
                {/* Subtle frame overlay */}
                <div className="absolute inset-4 border-2 border-white/20 rounded-2xl pointer-events-none z-10" />

                {/* Face guide oval */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                  <div className="w-48 h-64 border-2 border-dashed border-teal-400/50 rounded-[50%]" />
                </div>

                {/* Ready indicator */}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center z-10">
                  <div className="flex items-center gap-2 px-4 py-2 bg-black/40 backdrop-blur-sm rounded-full">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-white text-sm">Camera ready - Position your face</span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Scan Button */}
          <div className="p-6">
            <button
              onClick={handleStartScan}
              disabled={isScanning || isStartingCamera}
              className={`w-full py-4 rounded-xl font-medium flex items-center justify-center gap-2 transition-all ${
                isScanning || isStartingCamera
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-teal-600 to-teal-500 text-white shadow-lg shadow-teal-200 hover:from-teal-700 hover:to-teal-600'
              }`}
            >
              {isStartingCamera ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Requesting Camera...
                </>
              ) : isScanning ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Scanning...
                </>
              ) : (
                <>
                  <ScanIcon className="w-5 h-5" />
                  Start Skin Analysis
                </>
              )}
            </button>

            {/* Camera toggle */}
            {hasActiveStream && !isScanning && (
              <button
                onClick={stopCamera}
                className="w-full mt-3 py-3 rounded-xl font-medium flex items-center justify-center gap-2 text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <CameraOff className="w-4 h-4" />
                Turn Off Camera
              </button>
            )}
          </div>
        </div>

        {/* Results Section */}
        {(analysis || isScanning) && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">
              {isScanning ? 'Live Analysis' : 'Analysis Results'}
            </h2>

            <div className="grid grid-cols-2 gap-3">
              {/* Hydration */}
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 rounded-lg bg-blue-50">
                    <Droplets className="w-5 h-5 text-blue-500" />
                  </div>
                  <span className="text-sm font-medium text-slate-600">Hydration</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className={`text-3xl font-bold ${isScanning ? 'text-blue-400 animate-pulse' : 'text-slate-800'}`}>
                    {isScanning ? animatingScores.hydration : analysis?.hydration_score}
                  </span>
                  <span className="text-slate-400">%</span>
                </div>
                <div className="mt-3 h-2 bg-blue-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-blue-500 rounded-full transition-all ${isScanning ? 'duration-150' : 'duration-500'}`}
                    style={{ width: `${isScanning ? animatingScores.hydration : analysis?.hydration_score}%` }}
                  />
                </div>
              </div>

              {/* Skin Clarity */}
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 rounded-lg bg-cyan-50">
                    <Activity className="w-5 h-5 text-cyan-500" />
                  </div>
                  <span className="text-sm font-medium text-slate-600">Skin Clarity</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className={`text-3xl font-bold ${isScanning ? 'text-cyan-400 animate-pulse' : 'text-slate-800'}`}>
                    {isScanning ? animatingScores.clarity : analysis?.clarity_score}
                  </span>
                  <span className="text-slate-400">%</span>
                </div>
                <div className="mt-3 h-2 bg-cyan-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-cyan-500 rounded-full transition-all ${isScanning ? 'duration-150' : 'duration-500'}`}
                    style={{ width: `${isScanning ? animatingScores.clarity : analysis?.clarity_score}%` }}
                  />
                </div>
              </div>

              {/* Barrier */}
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 rounded-lg bg-emerald-50">
                    <Shield className="w-5 h-5 text-emerald-500" />
                  </div>
                  <span className="text-sm font-medium text-slate-600">Skin Barrier</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className={`text-3xl font-bold ${isScanning ? 'text-emerald-400 animate-pulse' : 'text-slate-800'}`}>
                    {isScanning ? animatingScores.barrier : analysis?.barrier_score}
                  </span>
                  <span className="text-slate-400">%</span>
                </div>
                <div className="mt-3 h-2 bg-emerald-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-emerald-500 rounded-full transition-all ${isScanning ? 'duration-150' : 'duration-500'}`}
                    style={{ width: `${isScanning ? animatingScores.barrier : analysis?.barrier_score}%` }}
                  />
                </div>
              </div>

              {/* Elasticity */}
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 rounded-lg bg-amber-50">
                    <Activity className="w-5 h-5 text-amber-500" />
                  </div>
                  <span className="text-sm font-medium text-slate-600">Elasticity</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className={`text-3xl font-bold ${isScanning ? 'text-amber-400 animate-pulse' : 'text-slate-800'}`}>
                    {isScanning ? animatingScores.elasticity : analysis?.elasticity_score}
                  </span>
                  <span className="text-slate-400">%</span>
                </div>
                <div className="mt-3 h-2 bg-amber-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-amber-500 rounded-full transition-all ${isScanning ? 'duration-150' : 'duration-500'}`}
                    style={{ width: `${isScanning ? animatingScores.elasticity : analysis?.elasticity_score}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Additional Info */}
            {analysis && !isScanning && (
              <div className="mt-4 bg-teal-50 rounded-2xl p-4">
                <h3 className="font-medium text-teal-800 mb-2">Analysis Summary</h3>
                <div className="space-y-2 text-sm text-teal-700">
                  <p>Oiliness Level: <span className="font-medium capitalize">{analysis.oiliness_level}</span></p>
                  <p>Pore Visibility: <span className="font-medium capitalize">{analysis.pore_visibility}</span></p>
                  <p className="text-teal-600 mt-3">
                    Scan completed on {new Date(analysis.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Scan line animation style */}
      <style>{`
        @keyframes scan-line {
          0% { top: 10%; }
          50% { top: 90%; }
          100% { top: 10%; }
        }
      `}</style>
    </div>
  );
}
