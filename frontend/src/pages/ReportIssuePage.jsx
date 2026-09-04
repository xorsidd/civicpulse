import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { ImageUploader } from '../components/ImageUploader';
import { MapView } from '../components/MapView';
import { PriorityBadge } from '../components/Badges';
import { LoadingSpinner } from '../components/UIElements';
import {
  Upload,
  MapPin,
  FileText,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  ThumbsUp,
  Layers,
  ShieldCheck,
  Search
} from 'lucide-react';

export const ReportIssuePage = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1: Photo, 2: Location, 3: Details & Submit, 4: AI & Duplicate Results
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [latitude, setLatitude] = useState(22.3225);
  const [longitude, setLongitude] = useState(73.187);
  const [address, setAddress] = useState('Main Road, Vadodara');
  const [description, setDescription] = useState('');
  const [locationDetecting, setLocationDetecting] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [reportResult, setReportResult] = useState(null);
  const [error, setError] = useState('');

  const handleImageSelected = (file) => {
    setSelectedFile(file);
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl('');
    }
  };

  const handleDetectLocation = () => {
    setLocationDetecting(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLatitude(pos.coords.latitude);
          setLongitude(pos.coords.longitude);
          setAddress(`GPS Lat: ${pos.coords.latitude.toFixed(4)}, Lng: ${pos.coords.longitude.toFixed(4)}`);
          setLocationDetecting(false);
        },
        () => {
          setLocationDetecting(false);
        }
      );
    } else {
      setLocationDetecting(false);
    }
  };

  useEffect(() => {
    handleDetectLocation();
  }, []);

  const handleSubmitReport = async () => {
    if (!selectedFile) {
      setError('Please upload or snap a photo of the civic problem.');
      setStep(1);
      return;
    }

    setSubmitting(true);
    setError('');

    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('latitude', latitude.toString());
    formData.append('longitude', longitude.toString());
    if (description) formData.append('description', description);
    if (address) formData.append('address', address);

    try {
      const res = await API.post('/reports', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.success && res.data) {
        setReportResult(res.data);
        setStep(4);
      }
    } catch (err) {
      setError(err.message || 'Report submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSupportExisting = async (clusterId) => {
    try {
      await API.post(`/issues/${clusterId}/support`);
      navigate(`/citizen/issues/${clusterId}`);
    } catch (err) {
      alert(err.message || 'Support action failed');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>4-Step AI Civic Intelligence Reporting</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white font-['Outfit']">
          Report a Public Civic Issue
        </h1>
        <p className="text-xs text-slate-400">
          Upload a photo — Our Vision AI will detect the problem, check for duplicate reports, & assess priority score.
        </p>
      </div>

      {/* STEP PROGRESS BAR */}
      <div className="grid grid-cols-4 gap-2 text-center text-xs font-bold">
        {[
          { num: 1, label: '1. Photo' },
          { num: 2, label: '2. Location GPS' },
          { num: 3, label: '3. Details' },
          { num: 4, label: '4. AI Analysis' },
        ].map((s) => (
          <div
            key={s.num}
            className={`p-2.5 rounded-xl border transition-all ${
              step === s.num
                ? 'bg-cyan-600 text-white border-cyan-400 shadow-lg shadow-cyan-950'
                : step > s.num
                ? 'bg-slate-900 text-emerald-400 border-emerald-600/50'
                : 'bg-slate-900/60 text-slate-500 border-slate-800'
            }`}
          >
            {s.label}
          </div>
        ))}
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-950/80 border border-rose-700/50 text-rose-300 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* STEP 1: PHOTO UPLOAD */}
      {step === 1 && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6 animate-fadeIn">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2 font-['Outfit']">
              <Upload className="w-5 h-5 text-cyan-400" /> Step 1: Upload or Snap Photo of Infrastructure Issue
            </h3>
            <p className="text-xs text-slate-400">
              Clear photo of pothole, garbage, streetlight, water leak, or open drain.
            </p>
          </div>

          <ImageUploader
            onImageSelected={handleImageSelected}
            selectedFile={selectedFile}
            previewUrl={previewUrl}
          />

          <div className="flex justify-end pt-2">
            <button
              onClick={() => {
                if (!selectedFile) {
                  setError('Please select or upload an image file first.');
                  return;
                }
                setError('');
                setStep(2);
              }}
              className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-950 transition-all"
            >
              Continue to Location GPS <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: GPS LOCATION */}
      {step === 2 && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2 font-['Outfit']">
                <MapPin className="w-5 h-5 text-rose-400" /> Step 2: Confirm Location & GPS Coordinates
              </h3>
              <p className="text-xs text-slate-400">
                Browser GPS auto-detected. Drag marker pin on map if location needs adjustment.
              </p>
            </div>
            <button
              onClick={handleDetectLocation}
              disabled={locationDetecting}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-semibold border border-slate-700 flex items-center gap-1.5 shrink-0"
            >
              <MapPin className="w-4 h-4" /> {locationDetecting ? 'Detecting GPS...' : 'Re-Detect GPS'}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-slate-400 text-[10px] font-mono">LATITUDE</span>
              <div className="text-sm font-bold text-cyan-300 font-mono">{latitude.toFixed(6)}</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-slate-400 text-[10px] font-mono">LONGITUDE</span>
              <div className="text-sm font-bold text-cyan-300 font-mono">{longitude.toFixed(6)}</div>
            </div>
          </div>

          <MapView
            interactivePin={true}
            pinPosition={[latitude, longitude]}
            onPinDragEnd={([lat, lng]) => {
              setLatitude(lat);
              setLongitude(lng);
              setAddress(`Manual Pin: Lat ${lat.toFixed(4)}, Lng ${lng.toFixed(4)}`);
            }}
            height="320px"
          />

          <div className="flex justify-between pt-2">
            <button
              onClick={() => setStep(1)}
              className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Photo
            </button>
            <button
              onClick={() => setStep(3)}
              className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-950 transition-all"
            >
              Continue to Details <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: DETAILS & SUBMIT */}
      {step === 3 && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6 animate-fadeIn">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2 font-['Outfit']">
              <FileText className="w-5 h-5 text-amber-400" /> Step 3: Add Description (Optional)
            </h3>
            <p className="text-xs text-slate-400">
              Description is NOT mandatory because Vision AI will analyze the photo automatically.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Street Address / Landmark</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. Near University Gate, Main Station Road"
                className="w-full px-4 py-2.5 rounded-xl glass-input text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Description / Context (Optional)</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Large deep pothole near main gate causing traffic hazard"
                className="w-full px-4 py-2.5 rounded-xl glass-input text-xs"
              />
            </div>
          </div>

          <div className="flex justify-between pt-2">
            <button
              onClick={() => setStep(2)}
              className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Location
            </button>

            <button
              onClick={handleSubmitReport}
              disabled={submitting}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-white font-extrabold text-xs shadow-xl shadow-cyan-950 flex items-center gap-2 transition-all disabled:opacity-50"
            >
              {submitting ? 'Running Vision AI & Duplicate Check...' : 'Submit Report for AI Scan'}
              <Sparkles className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: AI ANALYSIS & DUPLICATE DETECTION RESULTS */}
      {step === 4 && reportResult && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* AI VISION CARD */}
          <div className="glass-panel p-6 rounded-2xl border border-cyan-500/40 bg-gradient-to-br from-slate-900 via-[#131F37] to-cyan-950/30 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> AI Vision Analysis Result
              </span>
              <span className="text-xs font-mono bg-emerald-950 text-emerald-300 border border-emerald-500/40 px-2.5 py-0.5 rounded-full font-semibold">
                ✓ Civic Issue Detected
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="text-slate-400 text-[10px]">CATEGORY</div>
                <div className="font-bold text-slate-100 text-sm">{reportResult.aiAnalysis?.category}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="text-slate-400 text-[10px]">CONFIDENCE</div>
                <div className="font-bold text-cyan-400 text-sm">
                  {Math.round((reportResult.aiAnalysis?.confidence || 0.95) * 100)}%
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="text-slate-400 text-[10px]">SEVERITY</div>
                <div className="font-bold text-amber-400 text-sm">{reportResult.aiAnalysis?.severity}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="text-slate-400 text-[10px]">VISIBLE HAZARD</div>
                <div className="font-bold text-rose-400 text-sm">
                  {reportResult.aiAnalysis?.visibleHazard ? 'YES' : 'NO'}
                </div>
              </div>
            </div>
          </div>

          {/* DUPLICATE CHECK RESULT */}
          {reportResult.duplicateCheck?.duplicateDetected ? (
            <div className="glass-panel p-6 rounded-2xl border border-amber-500/50 bg-amber-950/20 space-y-4">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                <span>Similar Issue Already Reported Near This Location</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2 text-xs">
                <div className="font-bold text-slate-100 text-sm">
                  {reportResult.duplicateCheck.existingClusterTitle}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-slate-300 font-mono text-[11px]">
                  <div>Distance: <span className="text-cyan-400 font-bold">{reportResult.duplicateCheck.distanceMeters}m</span></div>
                  <div>Similarity: <span className="text-emerald-400 font-bold">{reportResult.duplicateCheck.overallSimilarityScore}%</span></div>
                  <div>Geo Match: <span className="text-slate-200">{reportResult.duplicateCheck.geographicSimilarity}%</span></div>
                  <div>Category: <span className="text-slate-200">{reportResult.duplicateCheck.categorySimilarity}%</span></div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => handleSupportExisting(reportResult.duplicateCheck.existingClusterId)}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs shadow-lg flex items-center justify-center gap-2"
                >
                  <ThumbsUp className="w-4 h-4" /> SUPPORT EXISTING ISSUE (+1 Vote)
                </button>
                <button
                  onClick={() => navigate(`/citizen/issues`)}
                  className="px-6 py-3 rounded-xl glass-panel hover:bg-slate-800 text-slate-300 font-semibold text-xs border border-slate-700"
                >
                  View My Reports
                </button>
              </div>
            </div>
          ) : (
            <div className="glass-panel p-6 rounded-2xl border border-emerald-500/40 bg-emerald-950/20 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-950 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white font-['Outfit']">New Civic Issue Cluster Created!</h3>
                <p className="text-xs text-slate-300 mt-1 max-w-md mx-auto">
                  Your report has been analyzed and routed to the responsible department in the priority queue.
                </p>
              </div>

              <div className="pt-2 flex justify-center gap-3">
                <button
                  onClick={() => navigate(`/citizen/issues/${reportResult.clusterId}`)}
                  className="px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-lg shadow-cyan-950 flex items-center gap-2"
                >
                  View Issue Intelligence <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => navigate('/citizen/dashboard')}
                  className="px-6 py-3 rounded-xl glass-panel hover:bg-slate-800 text-slate-300 font-semibold text-xs border border-slate-700"
                >
                  Go to Dashboard
                </button>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
