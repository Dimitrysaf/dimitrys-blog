
import React, { useState, useMemo } from 'react';
import ImageCard from './ui/image-card';
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ArrowUpDown } from 'lucide-react';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
  } from '@/components/ui/pagination';

interface ImageGridItem {
  imageUrl: string;
  title: string;
  createdAt: string; 
}

interface ImageGridProps {
  items: ImageGridItem[];
}

const ImageGrid: React.FC<ImageGridProps> = ({ items }) => {
  const [sortOption, setSortOption] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const sortedItems = useMemo(() => {
    const newItems = [...items];
    switch (sortOption) {
      case 'oldest':
        return newItems.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      case 'a-z':
        return newItems.sort((a, b) => a.title.localeCompare(b.title));
      case 'z-a':
        return newItems.sort((a, b) => b.title.localeCompare(a.title));
      case 'newest':
      default:
        return newItems.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
  }, [items, sortOption]);

  const totalPages = Math.ceil(sortedItems.length / ITEMS_PER_PAGE);

  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedItems.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [sortedItems, currentPage]);

  const handlePreviousPage = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePageClick = (e: React.MouseEvent, page: number) => {
    e.preventDefault();
    setCurrentPage(page);
  }

  return (
    <section>
        <div className="flex items-center mb-8">
            <h1 className="text-3xl font-bold">Αναρτήσεις</h1>
            <div className="flex-grow border-t border-gray-300 mx-4"></div>
            <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button size="icon" className="cursor-pointer">
                    <ArrowUpDown className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Ταξινόμηση κατά</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={sortOption} onValueChange={setSortOption}>
                <DropdownMenuRadioItem value="newest">Νεότερο σε παλαιότερο</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="oldest">Παλαιότερο σε νεότερο</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="a-z">Αλφαβητικά (Α-Ω)</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="z-a">Αλφαβητικά (Ω-Α)</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
            </DropdownMenu>
        </div>
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 rounded-lg text-center h-64">
          <h2 className="text-xl font-semibold mb-2">Καμία ανάρτηση ακόμα</h2>
          <p className="text-gray-500">Επιστρέψτε αργότερα για νέες αναρτήσεις!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {paginatedItems.map((item) => (
            <ImageCard key={item.title} imageUrl={item.imageUrl} caption={item.title} />
          ))}
        </div>
      )}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center">
            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious href="#" onClick={handlePreviousPage} className={currentPage === 1 ? "pointer-events-none text-gray-400" : ""} />
                    </PaginationItem>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <PaginationItem key={page}>
                            <PaginationLink href="#" onClick={(e) => handlePageClick(e, page)} isActive={currentPage === page}>
                                {page}
                            </PaginationLink>
                        </PaginationItem>
                    ))}
                    <PaginationItem>
                        <PaginationNext href="#" onClick={handleNextPage} className={currentPage === totalPages ? "pointer-events-none text-gray-400" : ""} />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
        )}
    </section>
  );
};

export default ImageGrid;
