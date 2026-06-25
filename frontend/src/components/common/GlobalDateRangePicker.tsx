import { useState, useRef, useEffect } from 'react';
import {
  format,
  subDays,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isWithinInterval,
  getDay,
  startOfDay,
  isBefore,
} from 'date-fns';

export interface DateRange {
  start: Date | null;
  end: Date | null;
}

interface Props {
  value: DateRange;
  onChange: (range: DateRange) => void;
}

const PRESETS = [
  {
    label: 'Today',
    getRange: (): DateRange => {
      const today = startOfDay(new Date());
      return { start: today, end: today };
    },
  },
  {
    label: 'Last 7 Days',
    getRange: (): DateRange => ({
      start: startOfDay(subDays(new Date(), 6)),
      end: startOfDay(new Date()),
    }),
  },
  {
    label: 'Last 30 Days',
    getRange: (): DateRange => ({
      start: startOfDay(subDays(new Date(), 29)),
      end: startOfDay(new Date()),
    }),
  },
  {
    label: 'All Time',
    getRange: (): DateRange => ({ start: null, end: null }),
  },
];

const DAY_NAMES = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

interface CalendarMonthProps {
  month: Date;
  tempRange: DateRange;
  hoverDate: Date | null;
  selecting: boolean;
  onDayClick: (day: Date) => void;
  onDayHover: (day: Date | null) => void;
  onPrev?: () => void;
  onNext?: () => void;
}

function CalendarMonth({
  month,
  tempRange,
  hoverDate,
  selecting,
  onDayClick,
  onDayHover,
  onPrev,
  onNext,
}: CalendarMonthProps) {
  const days = eachDayOfInterval({ start: startOfMonth(month), end: endOfMonth(month) });
  const startOffset = getDay(startOfMonth(month));

  // Compute the effective (sorted) range for highlight rendering
  const base = tempRange.start;
  let previewEnd: Date | null = tempRange.end;
  if (selecting && base && hoverDate) {
    previewEnd = hoverDate;
  }

  const effectiveStart =
    base && previewEnd && isBefore(previewEnd, base) ? previewEnd : base;
  const effectiveEnd =
    base && previewEnd && isBefore(previewEnd, base) ? base : previewEnd;

  const isInRange = (day: Date) => {
    if (!effectiveStart || !effectiveEnd) return false;
    if (isSameDay(effectiveStart, effectiveEnd)) return false;
    return isWithinInterval(day, { start: effectiveStart, end: effectiveEnd });
  };

  const isRangeStart = (day: Date) => !!effectiveStart && isSameDay(day, effectiveStart);
  const isRangeEnd = (day: Date) => !!effectiveEnd && isSameDay(day, effectiveEnd);

  return (
    <div className="w-52 select-none">
      {/* Month header */}
      <div className="flex items-center justify-between mb-3">
        {onPrev ? (
          <button
            onClick={onPrev}
            className="w-7 h-7 flex items-center justify-center rounded-full text-lg leading-none text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            ‹
          </button>
        ) : (
          <span className="w-7" />
        )}
        <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
          {format(month, 'MMMM yyyy')}
        </span>
        {onNext ? (
          <button
            onClick={onNext}
            className="w-7 h-7 flex items-center justify-center rounded-full text-lg leading-none text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            ›
          </button>
        ) : (
          <span className="w-7" />
        )}
      </div>

      {/* Day name headers */}
      <div className="grid grid-cols-7 mb-1">
        {DAY_NAMES.map((d) => (
          <div
            key={d}
            className="text-center text-[10px] font-semibold uppercase tracking-wide text-zinc-400 dark:text-zinc-500 py-1"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7">
        {Array.from({ length: startOffset }).map((_, i) => (
          <div key={`pad-${i}`} />
        ))}

        {days.map((day) => {
          const inRange = isInRange(day);
          const isStart = isRangeStart(day);
          const isEnd = isRangeEnd(day);
          const isSingle = isStart && isEnd;

          return (
            <div key={day.toISOString()} className="relative h-8 flex items-center justify-center">
              {/* Range fill strip */}
              {(inRange || (!isSingle && (isStart || isEnd))) && (
                <div
                  className={`absolute inset-y-1 bg-indigo-50 dark:bg-indigo-900/30 ${
                    isStart ? 'left-1/2 right-0' : isEnd ? 'left-0 right-1/2' : 'left-0 right-0'
                  }`}
                />
              )}

              <button
                onClick={() => onDayClick(day)}
                onMouseEnter={() => onDayHover(day)}
                className={[
                  'relative z-10 w-7 h-7 text-xs flex items-center justify-center rounded-full transition-colors',
                  isStart || isEnd
                    ? 'bg-indigo-600 text-white font-semibold'
                    : inRange
                    ? 'text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-800/50'
                    : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800',
                ].join(' ')}
              >
                {format(day, 'd')}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function formatRangeLabel(range: DateRange): string {
  if (!range.start && !range.end) return 'All Time';
  if (range.start && !range.end) return format(range.start, 'MMM d, yyyy');
  if (range.start && range.end) {
    if (isSameDay(range.start, range.end)) return format(range.start, 'MMM d, yyyy');
    return `${format(range.start, 'MMM d')} – ${format(range.end, 'MMM d, yyyy')}`;
  }
  return 'Select range';
}

export default function GlobalDateRangePicker({ value, onChange }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [tempRange, setTempRange] = useState<DateRange>(value);
  const [selecting, setSelecting] = useState(false);
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [leftMonth, setLeftMonth] = useState(() => subMonths(startOfDay(new Date()), 1));
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const rightMonth = addMonths(leftMonth, 1);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen]);

  const handleOpen = () => {
    setTempRange(value);
    setSelecting(false);
    setHoverDate(null);
    setActivePreset(null);
    setIsOpen(true);
  };

  const handleDayClick = (day: Date) => {
    if (!selecting) {
      setTempRange({ start: day, end: null });
      setSelecting(true);
      setActivePreset(null);
    } else {
      const anchor = tempRange.start!;
      const ordered = isBefore(day, anchor)
        ? { start: day, end: anchor }
        : { start: anchor, end: day };
      setTempRange(ordered);
      setSelecting(false);
      setHoverDate(null);
    }
  };

  const handlePreset = (preset: (typeof PRESETS)[number]) => {
    setTempRange(preset.getRange());
    setSelecting(false);
    setHoverDate(null);
    setActivePreset(preset.label);
  };

  const handleApply = () => {
    onChange(tempRange);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setTempRange(value);
    setSelecting(false);
    setHoverDate(null);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={wrapperRef}>
      {/* Trigger */}
      <button
        onClick={handleOpen}
        className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg border border-zinc-200/70 dark:border-zinc-700/60 bg-white/70 dark:bg-zinc-900/50 backdrop-blur-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 transition-colors shadow-sm"
      >
        <svg className="w-4 h-4 text-zinc-400 dark:text-zinc-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
        <span className="font-medium whitespace-nowrap">{formatRangeLabel(value)}</span>
        <svg className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Popover */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 z-50 rounded-xl shadow-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 overflow-hidden">
          <div className="flex">
            {/* Preset column */}
            <div className="flex flex-col gap-0.5 p-3 border-r border-zinc-100 dark:border-zinc-800/80 w-36 bg-zinc-50/60 dark:bg-zinc-900/40">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 px-2 py-1.5 mb-0.5">
                Quick Select
              </p>
              {PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => handlePreset(preset)}
                  className={[
                    'text-left text-sm px-3 py-2 rounded-lg transition-colors font-medium',
                    activePreset === preset.label
                      ? 'bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300'
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 hover:text-zinc-900 dark:hover:text-zinc-200',
                  ].join(' ')}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {/* Calendar column */}
            <div className="p-4">
              <div
                className="flex gap-6"
                onMouseLeave={() => setHoverDate(null)}
              >
                <CalendarMonth
                  month={leftMonth}
                  tempRange={tempRange}
                  hoverDate={hoverDate}
                  selecting={selecting}
                  onDayClick={handleDayClick}
                  onDayHover={setHoverDate}
                  onPrev={() => setLeftMonth((m) => subMonths(m, 1))}
                />
                <CalendarMonth
                  month={rightMonth}
                  tempRange={tempRange}
                  hoverDate={hoverDate}
                  selecting={selecting}
                  onDayClick={handleDayClick}
                  onDayHover={setHoverDate}
                  onNext={() => setLeftMonth((m) => addMonths(m, 1))}
                />
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800/80">
                <p className="text-xs text-zinc-400 dark:text-zinc-500 min-h-[1rem]">
                  {selecting ? 'Click to select end date' : ''}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={handleCancel}
                    className="px-4 py-1.5 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleApply}
                    disabled={selecting}
                    className="px-4 py-1.5 text-sm rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium transition-colors"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
