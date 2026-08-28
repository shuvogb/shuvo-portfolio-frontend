'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check } from 'lucide-react';

export interface CustomCheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  label?: React.ReactNode;
  description?: React.ReactNode;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  variant?: 'card' | 'inline';
  containerClassName?: string;
}

export const CustomCheckbox = React.forwardRef<HTMLInputElement, CustomCheckboxProps>(
  (
    {
      id,
      label,
      description,
      checked = false,
      onCheckedChange,
      disabled = false,
      variant = 'card',
      containerClassName = '',
      className = '',
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;
    const [internalChecked, setInternalChecked] = React.useState(checked);

    React.useEffect(() => {
      setInternalChecked(checked);
    }, [checked]);

    const handleToggle = () => {
      if (disabled) return;
      const next = !internalChecked;
      setInternalChecked(next);
      onCheckedChange?.(next);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        handleToggle();
      }
    };

    const isCard = variant === 'card';

    return (
      <div
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        role="checkbox"
        aria-checked={internalChecked}
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : 0}
        className={`group select-none cursor-pointer transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-card)] ${
          isCard
            ? `flex items-center gap-3.5 p-3.5 rounded-xl border transition-all ${
                internalChecked
                  ? 'bg-[var(--accent-subtle)] border-[var(--accent-border)] shadow-xs'
                  : 'bg-[var(--bg-elevated)] border-[var(--border)] hover:border-[var(--border-strong)] hover:bg-[var(--bg-surface)]'
              }`
            : 'inline-flex items-center gap-2.5'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'active:scale-[0.99]'} ${containerClassName}`}
      >
        {/* Hidden Native Input for Form Binding */}
        <input
          type="checkbox"
          id={inputId}
          ref={ref}
          checked={internalChecked}
          onChange={(e) => {
            setInternalChecked(e.target.checked);
            onCheckedChange?.(e.target.checked);
          }}
          disabled={disabled}
          className="sr-only"
          tabIndex={-1}
          {...props}
        />

        {/* Custom Machined Checkbox Box */}
        <div
          className={`relative flex items-center justify-center shrink-0 w-5 h-5 rounded-md border transition-all duration-200 ${
            internalChecked
              ? 'bg-[var(--accent)] border-[var(--accent)] shadow-xs'
              : 'bg-[var(--bg-surface)] border-[var(--border-strong)] group-hover:border-[var(--accent)]'
          } ${className}`}
          style={{
            boxShadow: internalChecked
              ? '0 0 10px rgba(var(--accent-rgb, 59, 130, 246), 0.25)'
              : undefined,
          }}
        >
          <AnimatePresence initial={false}>
            {internalChecked && (
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 500,
                  damping: 30,
                  mass: 0.5,
                }}
                className="text-white flex items-center justify-center"
              >
                <Check size={13} strokeWidth={3} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Labels & Description */}
        {(label || description) && (
          <div className="flex flex-col min-w-0">
            {label && (
              <span
                className={`text-sm font-semibold leading-tight transition-colors ${
                  internalChecked ? 'text-[var(--fg)]' : 'text-[var(--fg)] group-hover:text-[var(--accent)]'
                }`}
              >
                {label}
              </span>
            )}
            {description && (
              <span className="text-xs text-[var(--fg-muted)] mt-0.5 leading-snug">
                {description}
              </span>
            )}
          </div>
        )}
      </div>
    );
  }
);

CustomCheckbox.displayName = 'CustomCheckbox';
