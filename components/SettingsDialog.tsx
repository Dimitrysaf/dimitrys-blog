'use client'

import * as React from 'react'
import { signOut, useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from '@/components/ui/alert-dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

interface SettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

async function saveUserSettings(settings: { username: string }) {
  const response = await fetch('/api/user/update', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(settings),
  })

  if (!response.ok) {
    const data = await response.json()
    throw new Error(data.message || 'Failed to save settings.')
  }

  return response.json()
}

async function fetchUserSettings() {
  const response = await fetch('/api/user/fetch');
  if (!response.ok) {
    throw new Error('Failed to fetch user settings.');
  }
  return response.json();
}

async function deleteUserAccount(password: string) {
    const response = await fetch('/api/user/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
  
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Failed to delete account.');
    }
  
    return response.json();
  }

export default function SettingsDialog({
  open,
  onOpenChange,
}: SettingsDialogProps) {
  const { data: session, update: updateSession } = useSession()
  const [isLoading, setIsLoading] = React.useState(false)
  const [username, setUsername] = React.useState('')
  const [initialUsername, setInitialUsername] = React.useState('')
  const [userId, setUserId] = React.useState('')
  const [password, setPassword] = React.useState('')

  const usernameError = React.useMemo(() => {
    if (username.trim() === '') {
        return 'Το όνομα χρήστη δεν μπορεί να είναι κενό.';
    }
    return null;
  }, [username]);

  React.useEffect(() => {
    if (open) {
      if (session?.user?.id) {
        setUserId(session.user.id);
      }
      setIsLoading(true);
      fetchUserSettings().then(data => {
        setUsername(data.username);
        setInitialUsername(data.username);
        setIsLoading(false);
      }).catch(err => {
        toast.error(err.message || 'Could not fetch user data.');
        setIsLoading(false);
      });
    }
  }, [open, session])

  const handleSave = async () => {
    setIsLoading(true)

    const promise = saveUserSettings({ username }).then(() => {
      return updateSession({ user: { username } })
    })

    toast.promise(promise, {
      loading: 'Αποθήκευση ρυθμίσεων...',
      success: () => {
        onOpenChange(false)
        return 'Οι ρυθμίσεις αποθηκεύτηκαν με επιτυχία!'
      },
      error: (err) => err.message || 'Προέκυψε κάποιο σφάλμα.',
      finally: () => setIsLoading(false),
    })
  }

  const handleDelete = async () => {
    setIsLoading(true);

    const promise = deleteUserAccount(password).then(() => {
        signOut({ callbackUrl: '/' });
    });

    toast.promise(promise, {
        loading: 'Διαγραφή λογαριασμού...',
        success: 'Ο λογαριασμός σας διαγράφηκε με επιτυχία.',
        error: (err) => err.message || 'Προέκυψε κάποιο σφάλμα.',
        finally: () => {
            setIsLoading(false);
            setPassword('');
            onOpenChange(false);
        },
    });
  }

  const isSaveDisabled = isLoading || !!usernameError || username === initialUsername;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ρυθμίσεις</DialogTitle>
          <DialogDescription>
            Ρυθμίσεις λογαριασμού και ιστοσελίδας
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
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
              maxLength={35}
            />
            {usernameError && <p className="text-sm text-destructive mt-1">{usernameError}</p>}
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="uuid">Αναγνωριστικό</Label>
            <Input
              id="uuid"
              name="uuid"
              value={userId}
              disabled={true}
            />
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="noShadow" className="bg-destructive text-destructive-foreground" disabled={isLoading}>
                Διαγραφή Λογαριασμού
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Είστε σίγουροι;</AlertDialogTitle>
                <AlertDialogDescription>
                  Αυτή η ενέργεια δεν μπορεί να αναιρεθεί. Ο λογαριασμός σας θα διαγραφεί οριστικά και τα δεδομένα σας θα αφαιρεθούν από τους διακομιστές μας.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="grid gap-1.5">
                  <Label htmlFor="password">Κωδικός πρόσβασης</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Κωδικός πρόσβασης"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                  />
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel>Άκυρο</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} disabled={isLoading || !password}>
                  Συνέχεια
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="neutral" disabled={isLoading}>
              Άκυρο
            </Button>
          </DialogClose>
          <Button type="submit" onClick={handleSave} disabled={isSaveDisabled}>
            Αποθήκευση
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
