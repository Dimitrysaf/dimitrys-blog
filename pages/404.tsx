import Link from 'next/link';
import Container from '@/components/Container';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <Container>
      <div className="flex flex-col items-center justify-center text-center py-20">
        <h1 className="text-6xl font-bold text-gray-800 dark:text-gray-100">404</h1>
        <h2 className="text-2xl font-semibold mt-4 text-gray-600 dark:text-gray-300">Σελίδα δεν βρέθηκε</h2>
        <p className="mt-2 text-gray-500 dark:text-gray-400">Λυπούμαστε, αλλά η σελίδα που αναζητάτε δεν υπάρχει.</p>
        <div className="mt-6">
          <Link href="/" passHref>
            <Button>Επιστροφή στην αρχική σελίδα</Button>
          </Link>
        </div>
      </div>
    </Container>
  );
}
