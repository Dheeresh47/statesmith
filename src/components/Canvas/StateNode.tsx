import React, { useState, memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { ArrowRight, Edit2, Play, Trash2, CheckCircle } from 'lucide-react';
import { clsx } from 'clsx';

export interface StateNodeData {
  [key: string]: unknown;
  name: string;
  isInitial: boolean;
  isAccepting: boolean;
  isActive?: boolean;
  isRejectedState?: boolean;
  onSetInitial?: (id: string) => void;
  onToggleAccepting?: (id: string) => void;
  onRename?: (id: string, newName: string) => void;
  onDelete?: (id: string) => void;
}

export const StateNode: React.FC<NodeProps<any>> = memo(({ id, data, selected }) => {
  const {
    name,
    isInitial,
    isAccepting,
    isActive,
    isRejectedState,
    onSetInitial,
    onToggleAccepting,
    onRename,
    onDelete,
  } = data as StateNodeData;

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(name);
  const [showMenu, setShowMenu] = useState(false);

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (editName.trim() && onRename) {
      onRename(id, editName.trim());
    }
    setIsEditing(false);
  };

  return (
    <div
      className="relative group transition-all duration-200"
      onMouseEnter={() => setShowMenu(true)}
      onMouseLeave={() => setShowMenu(false)}
    >
      <Handle type="target" position={Position.Top} id="t-top" className="!w-3 !h-3 !bg-indigo-500 !border-2 !border-slate-900" />
      <Handle type="source" position={Position.Top} id="s-top" className="!w-3 !h-3 !bg-indigo-500 !border-2 !border-slate-900" />
      <Handle type="target" position={Position.Right} id="t-right" className="!w-3 !h-3 !bg-indigo-500 !border-2 !border-slate-900" />
      <Handle type="source" position={Position.Right} id="s-right" className="!w-3 !h-3 !bg-indigo-500 !border-2 !border-slate-900" />
      <Handle type="target" position={Position.Bottom} id="t-bottom" className="!w-3 !h-3 !bg-indigo-500 !border-2 !border-slate-900" />
      <Handle type="source" position={Position.Bottom} id="s-bottom" className="!w-3 !h-3 !bg-indigo-500 !border-2 !border-slate-900" />
      <Handle type="target" position={Position.Left} id="t-left" className="!w-3 !h-3 !bg-indigo-500 !border-2 !border-slate-900" />
      <Handle type="source" position={Position.Left} id="s-left" className="!w-3 !h-3 !bg-indigo-500 !border-2 !border-slate-900" />

      {isInitial && (
        <div className="absolute -left-12 top-1/2 -translate-y-1/2 flex items-center text-amber-400 font-semibold text-xs tracking-wider z-10 animate-pulse">
          <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 px-1.5 py-0.5 rounded text-[10px] font-mono mr-1">
            START
          </span>
          <ArrowRight className="w-5 h-5 stroke-[2.5]" />
        </div>
      )}

      <div
        className={clsx(
          'w-16 h-16 rounded-full flex items-center justify-center relative font-mono text-base font-bold shadow-lg transition-all duration-300 select-none cursor-pointer',
          isActive && !isRejectedState && 'bg-sky-950 text-sky-200 border-2 border-sky-400 ring-4 ring-sky-500/40 scale-110 shadow-sky-500/50 animate-active-node z-20',
          isActive && isRejectedState && 'bg-rose-950 text-rose-200 border-2 border-rose-500 ring-4 ring-rose-500/40 scale-110 shadow-rose-500/50 z-20',
          selected && !isActive && 'border-2 border-indigo-400 ring-2 ring-indigo-500/50 shadow-indigo-500/30 scale-105',
          !isActive && !selected && 'bg-slate-900 border-2 border-slate-700 text-slate-200 hover:border-slate-500 hover:shadow-slate-700/50'
        )}
      >
        {isAccepting && (
          <div
            className={clsx(
              'absolute inset-1 rounded-full border-2 pointer-events-none transition-colors duration-200',
              isActive && !isRejectedState ? 'border-sky-300' : isActive && isRejectedState ? 'border-rose-400' : 'border-indigo-400/90'
            )}
          />
        )}

        {isEditing ? (
          <form onSubmit={handleSaveName} className="z-20 w-12 text-center" onClick={(e) => e.stopPropagation()}>
            <input
              type="text"
              autoFocus
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onBlur={handleSaveName}
              className="w-full bg-slate-950 border border-indigo-500 text-indigo-300 rounded px-1 py-0.5 text-xs text-center font-mono focus:outline-none"
            />
          </form>
        ) : (
          <span className="z-10 tracking-tight truncate max-w-[50px]" title={name}>
            {name}
          </span>
        )}
      </div>

      {(showMenu || selected) && (
        <div
          className="absolute -top-10 left-1/2 -translate-x-1/2 flex items-center bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-lg p-1 gap-1 shadow-xl z-30 animate-in fade-in zoom-in-95 duration-150"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => onSetInitial && onSetInitial(id)}
            title={isInitial ? 'Initial State' : 'Set as Initial State'}
            className={clsx(
              'p-1.5 rounded hover:bg-slate-800 transition-colors',
              isInitial ? 'text-amber-400 bg-amber-500/10' : 'text-slate-400 hover:text-slate-200'
            )}
          >
            <Play className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => onToggleAccepting && onToggleAccepting(id)}
            title={isAccepting ? 'Accepting State' : 'Set as Accepting State'}
            className={clsx(
              'p-1.5 rounded hover:bg-slate-800 transition-colors',
              isAccepting ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-400 hover:text-slate-200'
            )}
          >
            <CheckCircle className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => {
              setEditName(name);
              setIsEditing(true);
            }}
            title="Rename State"
            className="p-1.5 rounded text-slate-400 hover:text-indigo-400 hover:bg-slate-800 transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => onDelete && onDelete(id)}
            title="Delete State"
            className="p-1.5 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
});

StateNode.displayName = 'StateNode';
