import React, { useState, memo } from 'react';
import { BaseEdge, EdgeLabelRenderer, getBezierPath, type EdgeProps } from '@xyflow/react';
import { Edit3, Trash2, Check } from 'lucide-react';
import { clsx } from 'clsx';

export interface CustomEdgeData {
  [key: string]: unknown;
  symbols: string[];
  isActive?: boolean;
  isBiDirectional?: boolean;
  onEditSymbols?: (edgeId: string, newSymbols: string[]) => void;
  onDeleteEdge?: (edgeId: string) => void;
}

export const CustomEdge: React.FC<EdgeProps<any>> = memo(({
  id,
  source,
  target,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
  selected,
}) => {
  const {
    symbols = [],
    isActive = false,
    isBiDirectional = false,
    onEditSymbols,
    onDeleteEdge,
  } = (data || {}) as CustomEdgeData;

  const [isEditing, setIsEditing] = useState(false);
  const [symbolsInput, setSymbolsInput] = useState(symbols.join(', '));
  const [showControls, setShowControls] = useState(false);

  const isSelfLoop = source === target;

  let path = '';
  let labelX = 0;
  let labelY = 0;

  if (isSelfLoop) {
    const radius = 35;
    const loopX = sourceX;
    const loopY = sourceY - 10;
    path = `M ${loopX - 15} ${loopY} C ${loopX - radius - 15} ${loopY - radius * 2}, ${loopX + radius + 15} ${loopY - radius * 2}, ${loopX + 15} ${loopY}`;
    labelX = loopX;
    labelY = loopY - radius * 1.6;
  } else if (isBiDirectional) {
    const dx = targetX - sourceX;
    const dy = targetY - sourceY;
    const len = Math.sqrt(dx * dx + dy * dy) || 1;
    const normX = -dy / len;
    const normY = dx / len;
    const offset = 35;

    const midX = (sourceX + targetX) / 2 + normX * offset;
    const midY = (sourceY + targetY) / 2 + normY * offset;

    path = `M ${sourceX} ${sourceY} Q ${midX} ${midY} ${targetX} ${targetY}`;
    labelX = midX;
    labelY = midY;
  } else {
    const [bezierPath, bx, by] = getBezierPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
    });
    path = bezierPath;
    labelX = bx;
    labelY = by;
  }

  const handleSaveSymbols = (e: React.FormEvent) => {
    e.preventDefault();
    if (onEditSymbols) {
      const parsed = symbolsInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      onEditSymbols(id, parsed);
    }
    setIsEditing(false);
  };

  const formattedLabel = symbols.length > 0 ? symbols.join(', ') : 'ε';

  return (
    <>
      <path
        d={path}
        fill="none"
        strokeWidth={20}
        stroke="transparent"
        className="cursor-pointer"
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      />

      <BaseEdge
        id={id}
        path={path}
        markerEnd={markerEnd}
        style={{
          ...style,
          stroke: isActive ? '#38bdf8' : selected ? '#818cf8' : '#64748b',
          strokeWidth: isActive ? 3.5 : selected ? 2.5 : 2,
        }}
        className={clsx(
          'transition-all duration-300',
          isActive && 'animated-edge-path drop-shadow-[0_0_8px_rgba(56,189,248,0.8)]'
        )}
      />

      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
          }}
          className="nodrag nopan group flex items-center gap-1 z-20"
          onMouseEnter={() => setShowControls(true)}
          onMouseLeave={() => setShowControls(false)}
        >
          {isEditing ? (
            <form onSubmit={handleSaveSymbols} className="flex items-center gap-1 bg-slate-900 border border-indigo-500 rounded-md p-1 shadow-lg">
              <input
                type="text"
                autoFocus
                value={symbolsInput}
                onChange={(e) => setSymbolsInput(e.target.value)}
                placeholder="0, 1"
                className="w-16 bg-slate-950 text-indigo-200 text-xs font-mono px-1.5 py-0.5 rounded border border-slate-700 focus:outline-none"
              />
              <button
                type="submit"
                className="p-1 bg-indigo-600 text-white rounded hover:bg-indigo-500 transition-colors"
                title="Save Symbols"
              >
                <Check className="w-3 h-3" />
              </button>
            </form>
          ) : (
            <div className="flex items-center gap-1">
              <span
                onClick={() => {
                  setSymbolsInput(symbols.join(', '));
                  setIsEditing(true);
                }}
                className={clsx(
                  'px-2 py-0.5 rounded-full text-xs font-mono font-bold tracking-tight shadow-md border cursor-pointer select-none transition-all duration-200',
                  isActive
                    ? 'bg-sky-500 text-slate-950 border-sky-300 ring-2 ring-sky-400/50 scale-110'
                    : selected
                    ? 'bg-indigo-600 text-white border-indigo-400 ring-2 ring-indigo-500/50'
                    : 'bg-slate-900/90 text-slate-200 border-slate-700 hover:border-slate-500 hover:text-white'
                )}
                title="Click to edit transition symbols"
              >
                {formattedLabel}
              </span>

              {(showControls || selected) && (
                <div className="flex items-center gap-1 bg-slate-900/90 border border-slate-700 rounded-full p-0.5 shadow-md">
                  <button
                    onClick={() => {
                      setSymbolsInput(symbols.join(', '));
                      setIsEditing(true);
                    }}
                    title="Edit Symbols"
                    className="p-1 text-slate-400 hover:text-indigo-300 transition-colors"
                  >
                    <Edit3 className="w-3 h-3" />
                  </button>
                  {onDeleteEdge && (
                    <button
                      onClick={() => onDeleteEdge(id)}
                      title="Delete Transition"
                      className="p-1 text-slate-400 hover:text-rose-400 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </EdgeLabelRenderer>
    </>
  );
});

CustomEdge.displayName = 'CustomEdge';
