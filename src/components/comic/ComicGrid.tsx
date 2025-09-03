import Image from "next/image";
import Link from "next/link";
import { GlowCard } from "@/components/ui/glow-card";
import { AnimatedBadge } from "@/components/ui/animated-badge";
import { parseGenres } from "@/lib/utils/genre";
import { BookOpen, Clock, CheckCircle, Pause, Star } from "lucide-react";

interface Comic {
  id: string;
  title: string;
  slug: string;
  description: string;
  author: string;
  coverImage: string;
  genre: string[];
  status: "ONGOING" | "COMPLETED" | "HIATUS";
  freeChapters: number;
  featured: boolean;
  volumes: Array<{
    chapters: Array<{ id: string }>;
  }>;
}

interface ComicGridProps {
  comics: Comic[];
}

export function ComicGrid({ comics }: ComicGridProps) {
  if (comics.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="max-w-md mx-auto">
          <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-2xl font-semibold text-foreground mb-2">No Comics Found</h3>
          <p className="text-lg text-muted-foreground">
            Check back soon for new releases and updates.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
      {comics.map((comic) => {
        const totalChapters = comic.volumes.reduce(
          (total, volume) => total + volume.chapters.length,
          0
        );

        const getStatusIcon = (status: string) => {
          switch (status) {
            case "ONGOING":
              return <Clock className="h-3 w-3" />;
            case "COMPLETED":
              return <CheckCircle className="h-3 w-3" />;
            case "HIATUS":
              return <Pause className="h-3 w-3" />;
            default:
              return <Clock className="h-3 w-3" />;
          }
        };

        const getStatusVariant = (status: string) => {
          switch (status) {
            case "ONGOING":
              return "info";
            case "COMPLETED":
              return "success";
            case "HIATUS":
              return "warning";
            default:
              return "default";
          }
        };

        return (
          <Link key={comic.id} href={`/comics/${comic.slug}`}>
            <GlowCard
              variant="comic"
              shimmer
              className="h-full cursor-pointer group"
            >
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl mb-4">
                <Image
                  src={comic.coverImage}
                  alt={`${comic.title} cover`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 16vw"
                />
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Featured badge */}
                {comic.featured && (
                  <div className="absolute top-3 right-3">
                    <AnimatedBadge
                      variant="gradient"
                      size="sm"
                      animation="glow"
                      icon={<Star className="h-3 w-3" />}
                    >
                      Featured
                    </AnimatedBadge>
                  </div>
                )}

                {/* Quick info overlay */}
                <div className="absolute bottom-3 left-3 right-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <AnimatedBadge
                    variant="glass"
                    size="sm"
                    icon={<BookOpen className="h-3 w-3" />}
                  >
                    {totalChapters} chapters
                  </AnimatedBadge>
                </div>
              </div>

              <div className="space-y-3">
                {/* Title */}
                <h3 className="font-display font-bold text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors duration-300">
                  {comic.title}
                </h3>

                {/* Author */}
                <p className="text-sm text-muted-foreground font-medium">
                  by {comic.author}
                </p>

                {/* Genres */}
                <div className="flex flex-wrap gap-2">
                  {parseGenres(comic.genre).slice(0, 2).map((genre) => (
                    <AnimatedBadge
                      key={genre}
                      variant="secondary"
                      size="sm"
                    >
                      {genre}
                    </AnimatedBadge>
                  ))}
                </div>

                {/* Status and Stats */}
                <div className="flex justify-between items-center pt-2">
                  <AnimatedBadge
                    variant={getStatusVariant(comic.status) as any}
                    size="sm"
                    icon={getStatusIcon(comic.status)}
                  >
                    {comic.status.toLowerCase()}
                  </AnimatedBadge>
                  
                  <div className="text-xs text-muted-foreground font-semibold">
                    {comic.freeChapters} free
                  </div>
                </div>
              </div>
            </GlowCard>
          </Link>
        );
      })}
    </div>
  );
}