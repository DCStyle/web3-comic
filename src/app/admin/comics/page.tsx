import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ComicActions } from "@/components/admin/ComicActions";
import { parseGenres } from "@/lib/utils/genre";
import { 
  Plus, 
  BookOpen, 
  Users, 
  Clock, 
  Eye,
  Edit,
  Trash2 
} from "lucide-react";

export default async function AdminComicsPage() {
  const comics = await prisma.comic.findMany({
    include: {
      volumes: {
        include: {
          chapters: {
            include: {
              unlocks: true,
              _count: {
                select: { pages: true }
              }
            }
          }
        }
      },
      tags: true,
    },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Comic Management</h1>
          <p className="text-muted-foreground">
            Manage comics, volumes, and chapters
          </p>
        </div>
        <Link href="/admin/comics/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Comic
          </Button>
        </Link>
      </div>

      <div className="grid gap-4">
        {comics.map((comic) => {
          const totalChapters = comic.volumes.reduce((total, volume) => 
            total + volume.chapters.length, 0
          );
          const totalPages = comic.volumes.reduce((total, volume) => 
            total + volume.chapters.reduce((chapterTotal, chapter) => 
              chapterTotal + chapter._count.pages, 0
            ), 0
          );
          const totalUnlocks = comic.volumes.reduce((total, volume) => 
            total + volume.chapters.reduce((chapterTotal, chapter) => 
              chapterTotal + chapter.unlocks.length, 0
            ), 0
          );

          return (
            <Card key={comic.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex gap-4">
                    <div className="w-16 h-20 relative bg-muted rounded overflow-hidden">
                      <img
                        src={comic.coverImage}
                        alt={comic.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="space-y-2">
                      <CardTitle className="text-xl">{comic.title}</CardTitle>
                      <CardDescription>by {comic.author}</CardDescription>
                      <div className="flex items-center gap-2">
                        {parseGenres(comic.genre).map((g) => (
                          <Badge key={g} variant="secondary" className="text-xs">
                            {g}
                          </Badge>
                        ))}
                        <Badge
                          variant={
                            comic.status === "ONGOING" ? "default" :
                            comic.status === "COMPLETED" ? "secondary" :
                            "destructive"
                          }
                        >
                          {comic.status.toLowerCase()}
                        </Badge>
                        {comic.featured && (
                          <Badge variant="outline" className="text-yellow-600">
                            Featured
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <ComicActions comicId={comic.id} comicSlug={comic.slug} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    <span>{totalChapters} chapters</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{totalPages} pages</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{totalUnlocks} unlocks</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-muted-foreground" />
                    <span>{comic.freeChapters} free</span>
                  </div>
                </div>
                
                <div className="mt-4 text-sm text-muted-foreground">
                  <p className="line-clamp-2">{comic.description}</p>
                </div>
                
                <div className="mt-4 text-xs text-muted-foreground">
                  Created: {new Date(comic.createdAt).toLocaleDateString()} • 
                  Updated: {new Date(comic.updatedAt).toLocaleDateString()}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {comics.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No comics yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first comic to get started
            </p>
            <Link href="/admin/comics/create">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Comic
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}