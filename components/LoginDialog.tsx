'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface LoginDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function LoginDialog({ open, onOpenChange }: LoginDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Σύνδεση</DialogTitle>
          <DialogDescription>
            Συνδεθείτε στο λογαριασμό σας.
          </DialogDescription>
        </DialogHeader>
        {/* Form elements will go here */}
      </DialogContent>
    </Dialog>
  )
}
