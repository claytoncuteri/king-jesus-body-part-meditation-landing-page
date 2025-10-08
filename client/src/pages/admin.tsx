// Admin dashboard page with Replit Auth protection
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, DollarSign, MousePointer, Mail, Plus, Trash2, Eye, EyeOff, LogOut } from "lucide-react";
import { Link } from "wouter";

export default function Admin() {
  const { toast } = useToast();
  const { user, isLoading, isAuthenticated } = useAuth();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newTestimonial, setNewTestimonial] = useState({ name: "", content: "" });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "Please log in to access the admin dashboard",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [isAuthenticated, isLoading, toast]);

  // Get analytics data
  const { data: analytics } = useQuery({
    queryKey: ["/api/admin/analytics"],
    enabled: isAuthenticated,
  });

  // Get testimonials
  const { data: testimonials = [] } = useQuery({
    queryKey: ["/api/admin/testimonials"],
    enabled: isAuthenticated,
  });

  // Add testimonial mutation
  const addTestimonialMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/admin/testimonials", newTestimonial);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/testimonials"] });
      queryClient.invalidateQueries({ queryKey: ["/api/testimonials"] });
      toast({
        title: "Success",
        description: "Testimonial added successfully",
      });
      setNewTestimonial({ name: "", content: "" });
      setIsAddDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete testimonial mutation
  const deleteTestimonialMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/admin/testimonials/${id}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/testimonials"] });
      queryClient.invalidateQueries({ queryKey: ["/api/testimonials"] });
      toast({
        title: "Success",
        description: "Testimonial deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Toggle visibility mutation
  const toggleVisibilityMutation = useMutation({
    mutationFn: async ({ id, isVisible }: { id: string; isVisible: boolean }) => {
      return await apiRequest("PATCH", `/api/admin/testimonials/${id}`, { isVisible });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/testimonials"] });
      queryClient.invalidateQueries({ queryKey: ["/api/testimonials"] });
      toast({
        title: "Success",
        description: "Visibility updated",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-sidebar border-b border-primary/20 py-4 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold font-serif text-primary">Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground">King Jesus Meditation</p>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="outline" data-testid="button-view-site">
                  View Site
                </Button>
              </Link>
              <Button
                variant="ghost"
                onClick={() => window.location.href = "/api/logout"}
                data-testid="button-logout"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* KPI Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6" data-testid="card-kpi-visitors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Visitors</p>
                <p className="text-3xl font-bold font-cinzel text-primary mt-1">
                  {analytics?.totalVisitors || 0}
                </p>
              </div>
              <Users className="h-10 w-10 text-primary/50" />
            </div>
          </Card>

          <Card className="p-6" data-testid="card-kpi-clicks">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Clicks</p>
                <p className="text-3xl font-bold font-cinzel text-primary mt-1">
                  {analytics?.totalClicks || 0}
                </p>
              </div>
              <MousePointer className="h-10 w-10 text-primary/50" />
            </div>
          </Card>

          <Card className="p-6" data-testid="card-kpi-purchases">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Purchases</p>
                <p className="text-3xl font-bold font-cinzel text-primary mt-1">
                  {analytics?.totalPurchases || 0}
                </p>
              </div>
              <DollarSign className="h-10 w-10 text-primary/50" />
            </div>
          </Card>

          <Card className="p-6" data-testid="card-kpi-revenue">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-3xl font-bold font-cinzel text-primary mt-1">
                  ${analytics?.totalRevenue?.toFixed(2) || "0.00"}
                </p>
              </div>
              <DollarSign className="h-10 w-10 text-primary/50" />
            </div>
          </Card>
        </div>

        {/* Conversion Rate */}
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Conversion Metrics</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-muted-foreground">Conversion Rate</p>
              <p className="text-2xl font-bold text-primary">
                {analytics?.conversionRate?.toFixed(1) || 0}%
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email Leads</p>
              <p className="text-2xl font-bold text-secondary">
                {analytics?.totalEmailLeads || 0}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg. Order Value</p>
              <p className="text-2xl font-bold font-cinzel">
                ${analytics?.avgOrderValue?.toFixed(2) || "0.00"}
              </p>
            </div>
          </div>
        </Card>

        {/* Tabs for different sections */}
        <Tabs defaultValue="testimonials" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2" data-testid="tabs-admin">
            <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
            <TabsTrigger value="purchases">Recent Purchases</TabsTrigger>
          </TabsList>

          {/* Testimonials Tab */}
          <TabsContent value="testimonials" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold font-serif">Manage Testimonials</h2>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button data-testid="button-add-testimonial">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Testimonial
                  </Button>
                </DialogTrigger>
                <DialogContent data-testid="dialog-add-testimonial">
                  <DialogHeader>
                    <DialogTitle>Add New Testimonial</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={newTestimonial.name}
                        onChange={(e) =>
                          setNewTestimonial({ ...newTestimonial, name: e.target.value })
                        }
                        placeholder="User name"
                        data-testid="input-testimonial-name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="content">Testimonial</Label>
                      <Textarea
                        id="content"
                        value={newTestimonial.content}
                        onChange={(e) =>
                          setNewTestimonial({ ...newTestimonial, content: e.target.value })
                        }
                        placeholder="This meditation brought me instant peace!"
                        rows={4}
                        data-testid="textarea-testimonial-content"
                      />
                    </div>
                    <Button
                      onClick={() => addTestimonialMutation.mutate()}
                      disabled={!newTestimonial.name || !newTestimonial.content || addTestimonialMutation.isPending}
                      className="w-full"
                      data-testid="button-save-testimonial"
                    >
                      {addTestimonialMutation.isPending ? "Adding..." : "Add Testimonial"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Content</TableHead>
                    <TableHead>Visible</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {testimonials.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground">
                        No testimonials yet. Add your first one!
                      </TableCell>
                    </TableRow>
                  ) : (
                    testimonials.map((testimonial: any) => (
                      <TableRow key={testimonial.id} data-testid={`row-testimonial-${testimonial.id}`}>
                        <TableCell className="font-medium">{testimonial.name}</TableCell>
                        <TableCell className="max-w-md truncate">{testimonial.content}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              toggleVisibilityMutation.mutate({
                                id: testimonial.id,
                                isVisible: !testimonial.isVisible,
                              })
                            }
                            data-testid={`button-toggle-${testimonial.id}`}
                          >
                            {testimonial.isVisible ? (
                              <Eye className="h-4 w-4 text-primary" />
                            ) : (
                              <EyeOff className="h-4 w-4 text-muted-foreground" />
                            )}
                          </Button>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteTestimonialMutation.mutate(testimonial.id)}
                            data-testid={`button-delete-${testimonial.id}`}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          {/* Recent Purchases Tab */}
          <TabsContent value="purchases" className="space-y-4">
            <h2 className="text-2xl font-bold font-serif">Recent Purchases</h2>
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {analytics?.recentPurchases?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground">
                        No purchases yet
                      </TableCell>
                    </TableRow>
                  ) : (
                    analytics?.recentPurchases?.map((purchase: any) => (
                      <TableRow key={purchase.id}>
                        <TableCell>
                          {new Date(purchase.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{purchase.email}</TableCell>
                        <TableCell>{purchase.name || "-"}</TableCell>
                        <TableCell className="font-cinzel font-semibold">
                          ${purchase.amount.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                              purchase.status === "completed"
                                ? "bg-primary/20 text-primary"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {purchase.status}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
