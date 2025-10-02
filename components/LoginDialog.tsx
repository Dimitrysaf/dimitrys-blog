'use client'

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import React, { useState } from "react"
import { signIn } from "next-auth/react"
import { toast } from "sonner"

interface LoginDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function LoginDialog({ open, onOpenChange }: LoginDialogProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const promise = signIn("credentials", {
      redirect: false,
      email,
      password,
    })

    toast.promise(promise, {
      loading: "Σύνδεση...",
      success: result => {
        if (result?.ok) {
          onOpenChange(false)
          return `Έχετε συνδεθεί ως ${email}`
        } else {
          throw new Error(result?.error || "Τα στοιχεία δεν είναι σωστά.")
        }
      },
      error: err => {
        return err.message || "Τα στοιχεία δεν είναι σωστά. Παρακαλώ δοκιμάστε ξανά."
      },
      finally: () => {
        setIsLoading(false)
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Σύνδεση</DialogTitle>
            <DialogDescription>
              Συνδεθείτε στο λογαριασμό σας.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-1.5">
              <Label htmlFor="email">Ηλ. ταχυδρομείο</Label>
              <Input
                id="email-login"
                name="email"
                type="email"
                placeholder="example@gmail.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="password">Κωδικός</Label>
              <Input
                id="password-login"
                name="password"
                type="password"
                placeholder="Κωδικός πρόσβασης"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="neutral" disabled={isLoading}>Άκυρο</Button>
            </DialogClose>
            <Button type="submit" disabled={isLoading}>Σύνδεση</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
