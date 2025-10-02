'use client'

import * as React from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
import { LayoutDashboard, LogIn, LogOut, Palette, Settings, User, UserPlus } from 'lucide-react'
import LoginDialog from './LoginDialog'
import SignupDialog from './SignupDialog'
import SettingsDialog from './SettingsDialog'
import { toast } from 'sonner'

export default function Menu() {
  const { data: session, status } = useSession()
  const isLoggedIn = status === 'authenticated'
  const [isLoading, setIsLoading] = React.useState(false)

  const [theme, setTheme] = React.useState('light')
  const [isLoginDialogOpen, setIsLoginDialogOpen] = React.useState(false)
  const [isSignupDialogOpen, setIsSignupDialogOpen] = React.useState(false)
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = React.useState(false)

  React.useEffect(() => {
    const isDark =
      localStorage.theme === 'dark' ||
      (!('theme' in localStorage) &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    setTheme(isDark ? 'dark' : 'light')
  }, [])

  React.useEffect(() => {
    const root = window.document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      root.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [theme])

  const handleSignOut = () => {
    setIsLoading(true)
    const promise = signOut({ redirect: false })

    toast.promise(promise, {
      loading: 'Αποσύνδεση...',
      success: () => {
        return 'Έχετε αποσυνδεθεί'
      },
      error: 'Αποτυχία αποσύνδεσης',
      finally: () => setIsLoading(false),
    })
  }

  const userIsAdminOrAuthor = isLoggedIn && [2, 3].includes((session?.user as any)?.roleId);

  return (
    <>
      <AlertDialog>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="neutral" size="icon" className="cursor-pointer">
              <User />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            {isLoggedIn ? (
              <DropdownMenuGroup>
                {userIsAdminOrAuthor && (
                    <DropdownMenuItem asChild>
                        <Link href="/dashboard" className="cursor-pointer">
                            <LayoutDashboard className="mr-2 h-4 w-4" />
                            <span>Ταμπλό</span>
                        </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                    <Link href={`/u/${session.user.id}`} className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        <span>Ο λογαριασμός μου</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => setIsSettingsDialogOpen(true)}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Ρυθμίσεις</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            ) : (
              <DropdownMenuGroup>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => setIsLoginDialogOpen(true)}
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  <span>Σύνδεση</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => setIsSignupDialogOpen(true)}
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  <span>Εγγραφή</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            )}

            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
              <DropdownMenuLabel>
                <Palette className="mr-2 h-4 w-4 inline-block" />
                <span>Εμφάνιση</span>
              </DropdownMenuLabel>
              <DropdownMenuRadioItem value="light">Φωτεινό</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="dark">Σκοτεινό</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
            {isLoggedIn && (
              <>
                <DropdownMenuSeparator />
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onSelect={event => event.preventDefault()}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Αποσύνδεση</span>
                  </DropdownMenuItem>
                </AlertDialogTrigger>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Αποσύνδεση</AlertDialogTitle>
            <AlertDialogDescription>
              Θέλετε να αποσυνδεθείτε;
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Άκυρο</AlertDialogCancel>
            <AlertDialogAction onClick={handleSignOut} disabled={isLoading}>
              Αποσύνδεση
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <LoginDialog open={isLoginDialogOpen} onOpenChange={setIsLoginDialogOpen} />
      <SignupDialog
        open={isSignupDialogOpen}
        onOpenChange={setIsSignupDialogOpen}
      />
      <SettingsDialog
        open={isSettingsDialogOpen}
        onOpenChange={setIsSettingsDialogOpen}
      />
    </>
  )
}
