import React, { useState, useEffect } from 'react';
import type { FSMMachine } from '../../types/machine';
import { exportMachineToJSON, importMachineFromJSON } from '../../logic/machineSerializer';
import { Download, Upload, Copy, Check, X, FileText, AlertCircle } from 'lucide-react';

interface ImportExportModalProps {
  isOpen: boolean;
  mode: 'import' | 'export';
  machine: FSMMachine;
  onClose: () => void;
  onImportMachine: (imported: FSMMachine) => void;
}

export const ImportExportModal: React.FC<ImportExportModalProps> = ({
  isOpen,
  mode,
  machine,
  onClose,
  onImportMachine,
}) => {
  const [jsonText, setJsonText] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (mode === 'export') {
      setJsonText(exportMachineToJSON(machine));
      setErrorMsg(null);
    } else {
      setJsonText('{\n  "states": [],\n  "transitions": [],\n  "initialStateId": "",\n  "acceptingStateIds": []\n}');
      setErrorMsg(null);
    }
  }, [mode, machine, isOpen]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([jsonText], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `statesmith-fsm-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setJsonText(content);
      const { machine: imported, error } = importMachineFromJSON(content);
      if (error) {
        setErrorMsg(error);
      } else if (imported) {
        setErrorMsg(null);
      }
    };
    reader.readAsText(file);
  };

  const handleConfirmImport = () => {
    const { machine: imported, error } = importMachineFromJSON(jsonText);
    if (error) {
      setErrorMsg(error);
    } else if (imported) {
      onImportMachine(imported);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            {mode === 'export' ? <Download className="w-5 h-5" /> : <Upload className="w-5 h-5" />}
          </div>
          <div>
            <h2 className="text-base font-bold text-white m-0">
              {mode === 'export' ? 'Export FSM as JSON' : 'Import FSM from JSON'}
            </h2>
            <p className="text-xs text-slate-400 m-0">
              {mode === 'export'
                ? 'Save or share your machine structure in clean JSON format.'
                : 'Paste a JSON schema or upload a previously exported StateSmith JSON file.'}
            </p>
          </div>
        </div>

        {mode === 'import' && (
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs px-3 py-2 rounded-lg cursor-pointer transition-colors">
              <FileText className="w-4 h-4 text-sky-400" />
              <span>Choose JSON File</span>
              <input type="file" accept=".json,application/json" onChange={handleFileUpload} className="hidden" />
            </label>
            <span className="text-xs text-slate-500">or paste JSON below:</span>
          </div>
        )}

        <div className="space-y-1">
          <textarea
            value={jsonText}
            onChange={(e) => {
              setJsonText(e.target.value);
              setErrorMsg(null);
            }}
            rows={10}
            className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 text-slate-200 font-mono text-xs p-3 rounded-xl focus:outline-none resize-none"
            placeholder="Paste FSM JSON configuration here..."
          />
        </div>

        {errorMsg && (
          <div className="bg-rose-950/60 border border-rose-500/40 rounded-lg p-3 text-xs text-rose-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          {mode === 'export' ? (
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3 py-2 rounded-lg transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-indigo-400" />}
                <span>{copied ? 'Copied!' : 'Copy to Clipboard'}</span>
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium px-4 py-2 rounded-lg shadow-md transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .JSON</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 ml-auto">
              <button
                onClick={onClose}
                className="px-3 py-2 text-xs font-medium text-slate-400 hover:text-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmImport}
                className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium px-4 py-2 rounded-lg shadow-md transition-colors cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Import & Replace Canvas</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
