'use client'

import * as React from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { LayoutDashboard } from 'lucide-react' // Import the icon
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
import Posts from '@/components/Posts'

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isScreenTooSmall, setIsScreenTooSmall] = React.useState(false)
  const [showScreenSizeAlert, setShowScreenSizeAlert] = React.useState(true);

  const hash = React.useMemo(() => {
    const asPathHash = router.asPath.split('#')[1];
    return asPathHash ? `#${asPathHash}` : '';
  }, [router.asPath]);

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

  // Updated loading skeleton to represent the centered default view
  if (status === 'loading') {
    return (
      <div className="flex flex-1 items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
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

  // Updated renderContent to show a centered icon and text by default
  const renderContent = () => {
    switch (hash) {
      case '#posts':
        return <Posts />;
      default:
        return (
          <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
            <LayoutDashboard size={48} className="text-gray-400" />
            <h1 className="text-2xl font-bold">Ταμπλό</h1>
            <p className="text-gray-500">Επιλέξτε μια καρτέλα δίπλα.</p>
          </div>
        );
    }
  };

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
      {/* The renderContent function is now wrapped in a div that can handle the centering */}
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0 h-full">
        {renderContent()}
      </div>
    </>
  )
}
