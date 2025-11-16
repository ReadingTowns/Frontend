'use client'

import { Toaster, ToastBar, toast } from 'react-hot-toast'

export default function CustomToaster() {
  return (
    <Toaster position="top-center" toastOptions={{ duration: 3000 }}>
      {t => (
        <div
          onClick={() => toast.dismiss(t.id)}
          className="cursor-pointer active:opacity-80 active:scale-[0.98] transition-all duration-100"
        >
          <ToastBar toast={t} />
        </div>
      )}
    </Toaster>
  )
}
