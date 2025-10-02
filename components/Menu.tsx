'use client'

import * as React from 'react'
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
import { LogIn, LogOut, Palette, User, UserPlus } from 'lucide-react'
import LoginDialog from './LoginDialog'
import SignupDialog from './SignupDialog'

export default function Menu() {
  const { data: session, status } = useSession()
  const isLoggedIn = status === 'authenticated'

  const [theme, setTheme] = React.useState('light')
  const [isLoginDialogOpen, setIsLoginDialogOpen] = React.useState(false)
  const [isSignupDialogOpen, setIsSignupDialogOpen] = React.useState(false)

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

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="neutral" size="icon" className="cursor-pointer">
            <User />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          {isLoggedIn ? (
            <DropdownMenuGroup>
              <DropdownMenuItem className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Ο λογαριασμός μου</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" onClick={() => signOut()}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Αποσύνδεση</span>
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
              <span>Θέμα</span>
            </DropdownMenuLabel>
            <DropdownMenuRadioItem value="light">Φωτεινό</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="dark">Σκοτεινό</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <LoginDialog open={isLoginDialogOpen} onOpenChange={setIsLoginDialogOpen} />
      <SignupDialog
        open={isSignupDialogOpen}
        onOpenChange={setIsSignupDialogOpen}
      />
    </>
  )
}
