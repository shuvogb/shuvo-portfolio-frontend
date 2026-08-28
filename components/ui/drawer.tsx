'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Slot } from '@radix-ui/react-slot';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DrawerContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const DrawerContext = React.createContext<DrawerContextType | null>(null);

export function useDrawer() {
  const context = React.useContext(DrawerContext);
  if (!context) {
    throw new Error('useDrawer must be used within a Drawer provider');
  }
  return context;
}

export function Drawer({
  open: controlledOpen,
  onOpenChange,
  children,
}: {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const setOpen = React.useCallback(
    (value: boolean) => {
      if (!isControlled) {
        setUncontrolledOpen(value);
      }
      onOpenChange?.(value);
    },
    [isControlled, onOpenChange]
  );

  return (
    <DrawerContext.Provider value={{ open, setOpen }}>
      {children}
    </DrawerContext.Provider>
  );
}

export function DrawerTrigger({
  asChild = false,
  children,
  className,
  onClick,
  ...props
}: React.ComponentProps<'button'> & { asChild?: boolean }) {
  const { setOpen } = useDrawer();
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      type="button"
      className={className}
      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(e);
        setOpen(true);
      }}
      {...props}
    >
      {children}
    </Comp>
  );
}

export function DrawerContent({
  children,
  className,
  width = 'max-w-3xl',
}: {
  children: React.ReactNode;
  className?: string;
  width?: string;
}) {
  const { open, setOpen } = useDrawer();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, setOpen]);

  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Deep Cinematic Frosted Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-md"
            style={{
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
            }}
          />

          {/* Precision Spring Slide-in Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 32, stiffness: 340, mass: 0.9 }}
            className={cn(
              'relative z-10 flex h-full w-full flex-col bg-[var(--bg-surface)] text-[var(--fg)] border-l border-[var(--border)] shadow-2xl overflow-hidden',
              width,
              className
            )}
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderLeft: '1px solid var(--border)',
              boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.45), 0 0 0 1px var(--border)',
            }}
          >
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}

export function DrawerHeader({
  children,
  className,
}: React.ComponentProps<'div'>) {
  const { setOpen } = useDrawer();

  return (
    <div
      className={cn(
        'flex items-center justify-between border-b border-[var(--border)] bg-[var(--bg-surface)] shrink-0',
        className
      )}
      style={{
        padding: '1.75rem 2.25rem 1.35rem 2.25rem',
      }}
    >
      <div className="flex flex-col gap-1.5 pr-6 min-w-0">{children}</div>
      <button
        type="button"
        onClick={() => setOpen(false)}
        className="inline-flex size-9 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] text-[var(--fg-muted)] hover:text-[var(--fg)] hover:border-[var(--accent)] hover:bg-[var(--accent-subtle)] active:scale-95 transition-all duration-150 cursor-pointer shrink-0 shadow-xs"
        aria-label="Close drawer"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}

export function DrawerTitle({
  children,
  className,
}: React.ComponentProps<'h2'>) {
  return (
    <h2
      className={cn(
        'text-lg font-bold text-[var(--fg)] tracking-[-0.02em] m-0',
        className
      )}
    >
      {children}
    </h2>
  );
}

export function DrawerDescription({
  children,
  className,
}: React.ComponentProps<'p'>) {
  return (
    <p
      className={cn('text-xs text-[var(--fg-muted)] m-0 leading-relaxed font-normal', className)}
    >
      {children}
    </p>
  );
}

export function DrawerBody({
  children,
  className,
}: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'flex-1 overflow-y-auto space-y-5 bg-[var(--bg)]',
        className
      )}
      style={{
        padding: '1.75rem 2.25rem',
      }}
    >
      {children}
    </div>
  );
}

export function DrawerFooter({
  children,
  className,
}: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'flex items-center justify-end gap-3 border-t border-[var(--border)] bg-[var(--bg-surface)] shrink-0 sticky bottom-0 z-20',
        className
      )}
      style={{
        padding: '1.35rem 2.25rem 1.75rem 2.25rem',
      }}
    >
      {children}
    </div>
  );
}
