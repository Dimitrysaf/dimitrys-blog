import React from 'react';
import { Button } from './ui/button';
import {
    CommandDialog,
    CommandEmpty,
    CommandInput,
    CommandList,
} from "@/components/ui/command";
import { Search } from "lucide-react";

const SearchButton: React.FC = () => {
    const [open, setOpen] = React.useState(false);

    React.useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, []);

    return (
        <>
            <Button onClick={() => setOpen(true)} variant="neutral" className="flex items-center gap-2 cursor-pointer">
                <Search className="h-4 w-4" />
            </Button>
            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder="Πληκτρολογήστε για να αναζητήσετε..." />
                <CommandList>
                    <CommandEmpty>Δεν βρέθηκαν αποτελέσματα.</CommandEmpty>
                </CommandList>
            </CommandDialog>
        </>
    );
};

export default SearchButton;