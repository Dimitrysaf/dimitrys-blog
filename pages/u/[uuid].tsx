import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import Banner from '../../components/Banner';
import { ShieldCheck, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface User {
    username: string;
    role: { name: string; description: string | null };
    createdAt: string;
}

// A skeleton component that mimics the page layout
const UserProfileSkeleton = () => {
    return (
        <div className="relative">
            <Banner>
                <div className="w-full text-center">
                    {/* Skeleton for username */}
                    <Skeleton className="h-9 w-64 mx-auto" />
                </div>
            </Banner>
            {/* Skeleton for badges */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center justify-center gap-2">
                <Skeleton className="h-6 w-24 rounded-md" />
                <Skeleton className="h-6 w-36 rounded-md" />
            </div>
        </div>
    );
};

const UserProfilePage = () => {
    const router = useRouter();
    const { uuid } = router.query;
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        if (uuid) {
            fetch(`/api/user/${uuid}`)
                .then(res => res.ok ? res.json() : Promise.reject('User not found'))
                .then(data => {
                    setUser(data);
                })
                .catch(console.error);
        }
    }, [uuid]);

    const formatCreatedAt = (createdAt: string) => {
        const date = new Date(createdAt);
        return new Intl.DateTimeFormat('el-GR', {
            timeZone: 'Europe/Athens',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }).format(date);
    };

    // While the user data is loading, display the skeleton
    if (!user) {
        return <UserProfileSkeleton />;
    }

    return (
        <TooltipProvider>
            <div className="relative">
                <Banner>
                    <div className="w-full text-center">
                        <h1 className="text-4xl font-bold" style={{ fontFamily: 'Times New Roman, serif', wordBreak: 'break-word' }}>
                            {user.username}
                        </h1>
                    </div>
                </Banner>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-wrap items-center justify-center gap-2">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Badge variant="neutral" className="cursor-pointer">
                                <ShieldCheck className="mr-2 h-4 w-4" />
                                {user.role.name}
                            </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{user.role.description || 'No description available'}</p>
                        </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Badge variant="neutral" className="cursor-pointer">
                                <Calendar className="mr-2 h-4 w-4" />
                                {formatCreatedAt(user.createdAt)}
                            </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Ημερομηνία δημιουργίας λογαριασμού</p>
                        </TooltipContent>
                    </Tooltip>
                </div>
            </div>
        </TooltipProvider>
    );
};

export default UserProfilePage;
