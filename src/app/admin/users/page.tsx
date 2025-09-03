import { Suspense } from "react";
import { prisma } from "@/lib/db/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UserActions } from "@/components/admin/UserActions";
import { 
  Users, 
  Wallet, 
  CreditCard, 
  Calendar,
  Search,
  Filter
} from "lucide-react";

interface UsersPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    role?: string;
  }>;
}

export default async function AdminUsersPage({ searchParams }: UsersPageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || "1");
  const limit = 20;
  const offset = (page - 1) * limit;

  // Build where clause
  const where: any = {};
  
  if (params.search) {
    where.OR = [
      { username: { contains: params.search, mode: "insensitive" } },
      { walletAddress: { contains: params.search, mode: "insensitive" } },
      { email: { contains: params.search, mode: "insensitive" } },
    ];
  }

  if (params.role) {
    where.role = params.role;
  }

  const [users, totalUsers] = await Promise.all([
    prisma.user.findMany({
      where,
      include: {
        transactions: {
          where: { status: "CONFIRMED" },
          select: { 
            type: true, 
            amount: true, 
            createdAt: true 
          },
          orderBy: { createdAt: "desc" },
          take: 5,
        },
        unlockedChapters: {
          select: { id: true }
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
    }),
    prisma.user.count({ where }),
  ]);

  const totalPages = Math.ceil(totalUsers / limit);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">
            Manage platform users and their activity
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">
            <Users className="h-3 w-3 mr-1" />
            {totalUsers} total users
          </Badge>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter(u => u.transactions.length > 0).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Users with transactions
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Credits</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.reduce((total, user) => total + user.creditsBalance, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Credits in circulation
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admins</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter(u => u.role === "ADMIN").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Administrator accounts
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>
            Platform user accounts and activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                      {(user.username || user.walletAddress.slice(2, 4)).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {user.username || "Anonymous User"}
                        </span>
                        <Badge variant={user.role === "ADMIN" ? "destructive" : "secondary"}>
                          {user.role}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Wallet className="h-3 w-3" />
                        <code>{user.walletAddress}</code>
                        {user.email && (
                          <span className="ml-2">• {user.email}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Credits: </span>
                      <span className="font-medium">{user.creditsBalance.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Unlocks: </span>
                      <span className="font-medium">{user.unlockedChapters.length}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Joined: </span>
                      <span className="font-medium">{new Date(user.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {user.transactions.length > 0 && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">Recent activity: </span>
                      {user.transactions.slice(0, 3).map((tx, i) => (
                        <Badge key={i} variant="outline" className="mr-1 text-xs">
                          {tx.type}: {tx.amount > 0 ? '+' : ''}{tx.amount}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                
                <UserActions userId={user.id} currentRole={user.role} />
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex justify-center gap-2">
              {page > 1 && (
                <Link href={`/admin/users?page=${page - 1}`}>
                  <Button variant="outline">Previous</Button>
                </Link>
              )}
              
              <span className="flex items-center px-4 py-2 text-sm">
                Page {page} of {totalPages}
              </span>
              
              {page < totalPages && (
                <Link href={`/admin/users?page=${page + 1}`}>
                  <Button variant="outline">Next</Button>
                </Link>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}