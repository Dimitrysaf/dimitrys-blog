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
import React, { useState, useEffect } from "react"
import validator from "validator"
import { Check, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { signIn } from "next-auth/react"

interface SignupDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Define a type for our form errors for type safety
interface FormErrors {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  form?: string; // For general form-level errors
}

export default function SignupDialog({ open, onOpenChange }: SignupDialogProps) {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  // Use our new FormErrors type for the state
  const [errors, setErrors] = useState<FormErrors>({})
  const [showPasswordRequirements, setShowPasswordRequirements] =
    useState(false)
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({})

  const validate = (isSubmitting: boolean) => {
    // Use our new FormErrors type for the newErrors object
    const newErrors: FormErrors = {}

    // Username validation
    if (touched.username || isSubmitting) {
      if (!username) {
        newErrors.username = "Το πεδίο αυτό απαιτείται"
      } else if (username.length > 35) {
        newErrors.username = "Το όνομα χρήστη δεν μπορεί να υπερβαίνει τους 35 χαρακτήρες."
      } else if (!/^[\u0370-\u03ff\u1f00-\u1fff a-zA-Z]+$/.test(username)) {
        newErrors.username =
          "Το όνομα χρήστη πρέπει να περιέχει μόνο ελληνικούς/αγγλικούς χαρακτήρες και κενά."
      }
    }

    // Email validation
    if (touched.email || isSubmitting) {
      if (!email) {
        newErrors.email = "Το πεδίο αυτό απαιτείται"
      } else if (!/.+@.+\..+/.test(email)) {
        newErrors.email = "Η μορφή του email πρέπει να είναι example@mail.com"
      } else if (!validator.isEmail(email)) {
        newErrors.email = "Το email δεν είναι έγκυρο."
      }
    }

    // Password validation
    if (touched.password || isSubmitting) {
      if (!password) {
        newErrors.password = "Το πεδίο αυτό απαιτείται"
      } else if (password.length < 5) {
        newErrors.password = "Ο κωδικός πρόσβασης πρέπει να έχει τουλάχιστον 5 χαρακτήρες."
      } else if (!/\d/.test(password)) {
        newErrors.password = "Ο κωδικός πρόσβασης πρέπει να περιέχει τουλάχιστον έναν αριθμό."
      } else if (!/[a-zA-Z]/.test(password)) {
        newErrors.password = "Ο κωδικός πρόσβασης πρέπει να περιέχει τουλάχιστον ένα γράμμα."
      }
    }

    // Confirm password validation
    if (touched.confirmPassword || isSubmitting) {
      if (!confirmPassword) {
        newErrors.confirmPassword = "Το πεδίο αυτό απαιτείται"
      } else if (password !== confirmPassword) {
        newErrors.confirmPassword = "Οι κωδικοί δεν ταιριάζουν."
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  useEffect(() => {
    // Clear form-level error when inputs change
    if (errors.form) {
        // By typing the state, TypeScript now understands the shape here, fixing the error.
        setErrors(({ form, ...rest }) => rest);
    }
    validate(false)
  }, [username, email, password, confirmPassword, touched])

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target
    setTouched({
      ...touched,
      [name]: true,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setTouched({
      username: true,
      email: true,
      password: true,
      confirmPassword: true,
    })

    if (validate(true)) {
      try {
        const response = await fetch("/api/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, email, password }),
        })

        const data = await response.json()

        if (!response.ok) {
          setErrors({ ...errors, form: data.message || "An unknown error occurred." })
          return
        }

        const signInResponse = await signIn("credentials", {
          redirect: false,
          email,
          password,
        })

        if (signInResponse?.error) {
          setErrors({ ...errors, form: `Sign-in failed: ${signInResponse.error}` })
          return
        }

        onOpenChange(false)

      } catch (error) {
        console.error("Signup fetch error:", error)
        setErrors({ ...errors, form: "Could not connect to the server." })
      }
    }
  }

  const passwordLengthCheck = password.length >= 5
  const passwordLetterCheck = /[a-zA-Z]/.test(password)
  const passwordNumberCheck = /\d/.test(password)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Εγγραφή</DialogTitle>
            <DialogDescription>
              Συμπληρώστε τα παρακάτω στοιχεία για να δημιουργήσετε το λογαριασμό
              σας.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-1.5">
              <Label htmlFor="username">Όνομα χρήστη</Label>
              <Input
                id="username"
                name="username"
                placeholder="Γιώργος Παρασκευατυρόπυτας"
                value={username}
                onChange={e => setUsername(e.target.value)}
                onBlur={handleBlur}
                maxLength={35}
              />
              {errors.username && (
                <p className="text-red-500 text-xs">{errors.username}</p>
              )}
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="email">Ηλ. ταχυδρομείο</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="example@gmail.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onBlur={handleBlur}
              />
              {errors.email && (
                <p className="text-red-500 text-xs">{errors.email}</p>
              )}
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="password">Κωδικός</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Κωδικός πρόσβασης"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onFocus={() => setShowPasswordRequirements(true)}
                onBlur={e => {
                  setShowPasswordRequirements(false)
                  handleBlur(e)
                }}
              />
              <AnimatePresence>
                {showPasswordRequirements && (
                  <motion.ul
                    className="text-xs list-none p-0"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.1 }}
                  >
                    <li
                      className={`flex items-center ${
                        passwordLengthCheck ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {passwordLengthCheck ? (
                        <Check className="h-4 w-4 mr-2" />
                      ) : (
                        <X className="h-4 w-4 mr-2" />
                      )}
                      Τουλάχιστον 5 χαρακτήρες
                    </li>
                    <li
                      className={`flex items-center ${
                        passwordLetterCheck ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {passwordLetterCheck ? (
                        <Check className="h-4 w-4 mr-2" />
                      ) : (
                        <X className="h-4 w-4 mr-2" />
                      )}
                      Τουλάχιστον ένα γράμμα
                    </li>
                    <li
                      className={`flex items-center ${
                        passwordNumberCheck ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {passwordNumberCheck ? (
                        <Check className="h-4 w-4 mr-2" />
                      ) : (
                        <X className="h-4 w-4 mr-2" />
                      )}
                      Τουλάχιστον έναν αριθμό
                    </li>
                  </motion.ul>
                )}
              </AnimatePresence>
              {errors.password && (
                <p className="text-red-500 text-xs">{errors.password}</p>
              )}
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="confirmPassword">Επιβεβαίωση κωδικού</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Επιβεβαίωση κωδικού"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                onBlur={handleBlur}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs">{errors.confirmPassword}</p>
              )}
            </div>
          </div>
          {errors.form && (
            <p className="text-red-500 text-sm text-center mb-4">{errors.form}</p>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="neutral">Άκυρο</Button>
            </DialogClose>
            <Button type="submit">Εγγραφή</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
