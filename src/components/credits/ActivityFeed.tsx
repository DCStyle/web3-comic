"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Activity, 
  ShoppingCart, 
  BookOpen,
  Star,
  TrendingUp,
  Users
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ActivityItem {
  id: string;
  type: "purchase" | "unlock" | "milestone";
  user: string;
  action: string;
  credits?: number;
  comic?: string;
  timestamp: Date;
}

// Mock activity data - in a real app, this would come from an API
const generateMockActivity = (): ActivityItem[] => [
  {
    id: "1",
    type: "purchase",
    user: "Reader47",
    action: "purchased 625 credits",
    credits: 625,
    timestamp: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
  },
  {
    id: "2", 
    type: "unlock",
    user: "ComicFan88",
    action: "unlocked Chapter 15",
    comic: "Mystic Heroes",
    timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
  },
  {
    id: "3",
    type: "milestone", 
    user: "BookLover23",
    action: "reached Gold Collector status",
    timestamp: new Date(Date.now() - 8 * 60 * 1000), // 8 minutes ago
  },
  {
    id: "4",
    type: "purchase",
    user: "StoryHunter",
    action: "purchased 1500 credits",
    credits: 1500,
    timestamp: new Date(Date.now() - 12 * 60 * 1000), // 12 minutes ago
  },
  {
    id: "5",
    type: "unlock",
    user: "MangaReader99",
    action: "unlocked Chapter 8",
    comic: "Dark Chronicles",
    timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
  },
  {
    id: "6",
    type: "purchase",
    user: "DigitalBookworm",
    action: "purchased 500 credits",
    credits: 500,
    timestamp: new Date(Date.now() - 18 * 60 * 1000), // 18 minutes ago
  }
];

export function ActivityFeed() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLive, setIsLive] = useState(true);

  // Initialize activities
  useEffect(() => {
    setActivities(generateMockActivity());
  }, []);

  // Simulate live updates
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      // Randomly add new activity
      if (Math.random() < 0.3) {
        const newActivity: ActivityItem = {
          id: Date.now().toString(),
          type: Math.random() < 0.6 ? "purchase" : Math.random() < 0.8 ? "unlock" : "milestone",
          user: `Reader${Math.floor(Math.random() * 999)}`,
          action: Math.random() < 0.6 
            ? `purchased ${[100, 500, 625, 1000, 1500][Math.floor(Math.random() * 5)]} credits`
            : Math.random() < 0.8
            ? `unlocked Chapter ${Math.floor(Math.random() * 20) + 1}`
            : "reached Silver Explorer status",
          credits: Math.random() < 0.6 ? [100, 500, 625, 1000, 1500][Math.floor(Math.random() * 5)] : undefined,
          comic: Math.random() < 0.4 ? ["Mystic Heroes", "Dark Chronicles", "Space Odyssey", "Magic Academy"][Math.floor(Math.random() * 4)] : undefined,
          timestamp: new Date(),
        };

        setActivities(prev => [newActivity, ...prev.slice(0, 5)]);
      }
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [isLive]);

  const getActivityIcon = (type: ActivityItem["type"]) => {
    switch (type) {
      case "purchase":
        return <ShoppingCart className="h-4 w-4 text-green-500" />;
      case "unlock":
        return <BookOpen className="h-4 w-4 text-blue-500" />;
      case "milestone":
        return <Star className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getActivityColor = (type: ActivityItem["type"]) => {
    switch (type) {
      case "purchase":
        return "bg-green-500/10 border-green-500/20";
      case "unlock":
        return "bg-blue-500/10 border-blue-500/20";
      case "milestone":
        return "bg-yellow-500/10 border-yellow-500/20";
    }
  };

  return (
    <Card className="bg-card/80 backdrop-blur-sm border border-border/50 h-fit">
      <CardHeader className="pb-3">
        <CardTitle className="text-foreground flex items-center gap-2 text-lg">
          <Activity className="h-5 w-5" />
          Live Activity
          <Badge variant="outline" className="ml-auto bg-green-500/10 border-green-500/30 text-green-600">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-1" />
            Live
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {activities.length === 0 ? (
          <div className="text-center py-8">
            <Activity className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground/50 text-sm">Loading activity...</p>
          </div>
        ) : (
          <>
            {activities.map((activity, index) => (
              <div
                key={activity.id}
                className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-500 hover:scale-[1.02] ${getActivityColor(activity.type)} ${
                  index === 0 ? 'animate-in slide-in-from-top duration-500' : ''
                }`}
              >
                <div className="p-2 rounded-full bg-background/50">
                  {getActivityIcon(activity.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs bg-primary/10 text-primary">
                        {activity.user.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-sm text-foreground truncate">
                      {activity.user}
                    </span>
                  </div>
                  
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {activity.action}
                    {activity.comic && (
                      <span className="text-primary font-medium">
                        {" "} in {activity.comic}
                      </span>
                    )}
                  </p>
                  
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted-foreground/70">
                      {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                    </span>
                    {activity.credits && (
                      <Badge variant="secondary" className="text-xs px-1.5 py-0">
                        {activity.credits} credits
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Activity Stats */}
            <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/10">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Today's Activity</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-lg font-bold text-primary">
                    {Math.floor(Math.random() * 50) + 20}
                  </div>
                  <div className="text-xs text-muted-foreground">Purchases</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-secondary">
                    {Math.floor(Math.random() * 200) + 100}
                  </div>
                  <div className="text-xs text-muted-foreground">Unlocks</div>
                </div>
              </div>
            </div>

            {/* Community Callout */}
            <div className="mt-4 p-3 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg border border-border/30">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Join the Community</span>
              </div>
              <p className="text-xs text-muted-foreground">
                {Math.floor(Math.random() * 100) + 50} readers are currently browsing comics
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}