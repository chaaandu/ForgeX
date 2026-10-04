'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { createContext, useCallback, useContext, useState } from 'react'

type ToastFn = (message: string) => void

const ToastContext = createContext<ToastFn | null>(null)

export function useToast(): ToastFn {
  const value = useContext(ToastContext)
  if (!value) throw new Error('useToast outside ToastProvider')
  return value
}

type Note = { id: number; message: string }

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [notes, setNotes] = useState<Note[]>([])

  const push = useCallback<ToastFn>((message) => {
    const id = Date.now() + Math.random()
    setNotes((current) => [...current, { id, message }])
    setTimeout(() => setNotes((current) => current.filter((note) => note.id !== id)), 4000)
  }, [])

  return (
    <ToastContext.Provider value={push}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-6 z-[60] flex flex-col items-center gap-2 px-4"
      >
        <AnimatePresence initial={false}>
          {notes.map((note) => (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="border-line-strong bg-surface-modal text-primary pointer-events-auto max-w-sm rounded-xl border px-4 py-2.5 text-[14px] shadow-lg shadow-black/40"
            >
              {note.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}
