"use client";

import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";

interface ComicsPaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl?: string; // Optional base URL, defaults to /comics
}

export function ComicsPagination({ currentPage, totalPages, baseUrl = "/comics" }: ComicsPaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const navigateToPage = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    const queryString = params.toString();
    const url = queryString ? `${baseUrl}?${queryString}` : `${baseUrl}?page=${page}`;
    router.push(url);
  };

  return (
    <div className="mt-8 flex justify-center gap-2">
      {currentPage > 1 && (
        <Button
          variant="outline"
          onClick={() => navigateToPage(currentPage - 1)}
        >
          Previous
        </Button>
      )}
      
      <span className="flex items-center px-4 py-2 text-sm">
        Page {currentPage} of {totalPages}
      </span>
      
      {currentPage < totalPages && (
        <Button
          variant="outline"
          onClick={() => navigateToPage(currentPage + 1)}
        >
          Next
        </Button>
      )}
    </div>
  );
}