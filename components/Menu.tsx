'use client'

import * as React from 'react'
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
  // For demonstration purposes, we'll simulate the login state.
  // In a real application, this would come from your auth provider.
  const [isLoggedIn, setIsLoggedIn] = React.useState(false)
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
              <DropdownMenuLabel>Ο λογαριασμός μου</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Λογαριασμός</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          ) : (
            <DropdownMenuGroup>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => setIsLoginDialogOpen(true)}>
                <LogIn className="mr-2 h-4 w-4" />
                <span>Σύνδεση</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => setIsSignupDialogOpen(true)}>
                <UserPlus className="mr-2 h-4 w-4" />
                <span>Εγγραφή</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuLabel className="flex items-center">
              <Palette className="mr-2 h-4 w-4" />
              <span>Εμφάνιση</span>
            </DropdownMenuLabel>
            <DropdownMenuRadioGroup
              value={theme}
              onValueChange={value => setTheme(value as 'light' | 'dark')}>
              <DropdownMenuRadioItem value="light" className="cursor-pointer">Φωτεινό</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="dark" className="cursor-pointer">Σκοτεινό</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuGroup>
          {isLoggedIn && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => setIsLoggedIn(false)}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Αποσύνδεση</span>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <LoginDialog open={isLoginDialogOpen} onOpenChange={setIsLoginDialogOpen} />
      <SignupDialog open={isSignupDialogOpen} onOpenChange={setIsSignupDialogOpen} />
    </>
  )
}
