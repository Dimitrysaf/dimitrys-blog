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

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isScreenTooSmall, setIsScreenTooSmall] = React.useState(false)
  const [showScreenSizeAlert, setShowScreenSizeAlert] = React.useState(true);

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1300 || window.innerHeight < 919) {
        setIsScreenTooSmall(true)
      } else {
        setIsScreenTooSmall(false)
      }
    }

    window.addEventListener('resize', handleResize)
    handleResize()
    return () => window.removeEventListener('resize', handleResize)
  }, [])

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

  const roleId = (session?.user as any)?.roleId
  const isAuthorized = status === 'authenticated' && roleId !== undefined && roleId >= 2

  if (!isAuthorized) {
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
              <a href="mailto:demetresmeliates+help@gmail.com">Επικοινωνήστε...</a>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  }

  return (
    <>
      {isScreenTooSmall && showScreenSizeAlert && (
        <AlertDialog open={true} onOpenChange={setShowScreenSizeAlert}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Μη συμβατό</AlertDialogTitle>
              <AlertDialogDescription>
                Η συσκευή ή η οθόνη της συσκευής δεν είναι αρκετά μεγάλη για να φανεί η σελίδα.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => router.push('/')}>Εντάξει</AlertDialogCancel>
              <AlertDialogAction onClick={() => setShowScreenSizeAlert(false)}>
                Φύγε απο 'δω
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        {/* The content for each tab will go here as separate components */}
      </div>
    </>
  )
}
