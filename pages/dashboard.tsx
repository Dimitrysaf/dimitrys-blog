'use client'

import * as React from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Skeleton } from '@/components/ui/skeleton'
import {
  SidebarProvider,
  SidebarInset,
} from "@/components/ui/sidebar"
import { AppSidebar } from '@/components/AppSidebar'

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isScreenTooSmall, setIsScreenTooSmall] = React.useState(false)

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1300 || window.innerHeight < 919) {
        setIsScreenTooSmall(true)
      } else {
        setIsScreenTooSmall(false)
      }
    }

    window.addEventListener('resize', handleResize)

    // Call handler right away so state gets updated with initial window size
    handleResize()

    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize)
  }, []) // Empty array ensures that effect is only run on mount and unmount


  // Render a skeleton loading state while the session is being checked.
  if (status === 'loading') {
    return (
      <div className="p-4">
        <Skeleton className="h-8 w-48 mb-4" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    )
  }

  // If the screen is small, show an alert dialog.
  if (isScreenTooSmall) {
    return (
      <AlertDialog open={true}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Μη συμβατό</AlertDialogTitle>
            <AlertDialogDescription>
              Η συσκευή ή η οθόνη της συσκευής δεν είναι αρκετά μεγάλη για να φανεί η σελίδα.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => router.push('/')}>Εντάξει</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  }

  const roleId = (session?.user as any)?.roleId
  const isAuthorized = status === 'authenticated' && roleId !== undefined && roleId >= 2

  // If the user is authorized, render the dashboard content with the sidebar.
  if (isAuthorized) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            {/* The content for each tab will go here as separate components */}
          </div>
        </SidebarInset>
      </SidebarProvider>
    )
  }

  // If the user is not authorized, show a permanent alert dialog.
  return (
    <AlertDialog open={true}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Δεν έχετε πρόσβαση</AlertDialogTitle>
          <AlertDialogDescription>
            Χρειάζεστε να είστε είτε διαχειριστής είτε αρθρογράφος. Παρακαλώ
            επικοινωνήστε με το διαχειρηστή για να σας προσθέσει τον ρόλο
            του αρθουγράφου.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => router.push('/')}>Εντάξει</AlertDialogCancel>
          <AlertDialogAction asChild>
            <a href="mailto:admin@example.com">Επικοινωνήστε...</a>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
