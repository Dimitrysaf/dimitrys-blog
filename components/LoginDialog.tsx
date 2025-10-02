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

interface LoginDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function LoginDialog({ open, onOpenChange }: LoginDialogProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null) // Clear previous errors

    const result = await signIn("credentials", {
      redirect: false, // We want to handle the result in our code
      email,
      password,
    })

    if (result?.error) {
      // If next-auth returns an error, display it
      setError("Τα στοιχεία δεν είναι σωστά. Παρακαλώ δοκιμάστε ξανά.")
    } else if (result?.ok) {
      // If login is successful, close the dialog and reload the page
      onOpenChange(false)
      window.location.reload()
    }
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
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="neutral">Άκυρο</Button>
            </DialogClose>
            <Button type="submit">Σύνδεση</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}