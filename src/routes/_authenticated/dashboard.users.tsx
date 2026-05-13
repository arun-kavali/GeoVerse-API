import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const Route = createFileRoute("/_authenticated/dashboard/users")({
  component: UsersPage,
});

const sample = [
  { name: "Saurabh Khanna", email: "saurabh@acme.com", plan: "Startup", status: "Active", joined: "2 days ago" },
  { name: "Manish Kumar", email: "manish@logistix.io", plan: "Enterprise", status: "Active", joined: "1 week ago" },
  { name: "Priya Singh", email: "priya@parcels.in", plan: "Developer", status: "Active", joined: "3 weeks ago" },
  { name: "Rahul Verma", email: "rahul@gov.in", plan: "Enterprise", status: "Suspended", joined: "1 month ago" },
];

function UsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Users</h1>
        <p className="text-sm text-muted-foreground">All accounts on the platform.</p>
      </div>
      <Card>
        <CardHeader><CardTitle className="text-base">All users</CardTitle><CardDescription>Showing recent signups</CardDescription></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sample.map((u) => (
                <TableRow key={u.email}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <div className="grid h-7 w-7 place-items-center rounded-full bg-primary/10 text-xs text-primary">{u.name.split(" ").map(n => n[0]).join("")}</div>
                      {u.name}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{u.email}</TableCell>
                  <TableCell>{u.plan}</TableCell>
                  <TableCell><Badge variant="secondary" className={u.status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}>{u.status}</Badge></TableCell>
                  <TableCell className="text-right text-xs text-muted-foreground">{u.joined}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
