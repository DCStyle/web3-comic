"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { MoreHorizontal, Edit, Eye, Trash2, BookOpen } from "lucide-react";
import toast from "react-hot-toast";

interface ComicActionsProps {
  comicId: string;
  comicSlug: string;
}

export function ComicActions({ comicId, comicSlug }: ComicActionsProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      
      const response = await fetch(`/api/admin/comics/${comicId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete comic");
      }

      toast.success("Comic deleted successfully");
      window.location.reload();
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Failed to delete comic");
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <Link href={`/comics/${comicSlug}`}>
            <DropdownMenuItem>
              <Eye className="mr-2 h-4 w-4" />
              View Public
            </DropdownMenuItem>
          </Link>
          <Link href={`/admin/comics/${comicId}/edit`}>
            <DropdownMenuItem>
              <Edit className="mr-2 h-4 w-4" />
              Edit Details
            </DropdownMenuItem>
          </Link>
          <Link href={`/admin/comics/${comicId}/chapters`}>
            <DropdownMenuItem>
              <BookOpen className="mr-2 h-4 w-4" />
              Manage Chapters
            </DropdownMenuItem>
          </Link>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            className="text-red-600"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Comic
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Comic</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the comic,
              all its volumes, chapters, and pages. Any user unlocks will also be removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Deleting..." : "Delete Comic"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}