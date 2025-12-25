import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Package, Truck, CheckCircle2, Clock, AlertCircle, ExternalLink } from "lucide-react";

export default function AdminOrders() {
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [notes, setNotes] = useState("");

  const { data: allOrders, refetch } = trpc.admin.getAllOrders.useQuery();
  const updateOrderStatus = trpc.admin.updateOrderStatus.useMutation({
    onSuccess: () => {
      refetch();
      setSelectedOrderId(null);
      setTrackingNumber("");
      setNotes("");
    },
  });

  const newOrders = allOrders?.filter((o) => o.status === "pending") || [];
  const inProgressOrders = allOrders?.filter((o) => o.status === "processing") || [];
  const shippedOrders = allOrders?.filter((o) => o.status === "shipped") || [];
  const deliveredOrders = allOrders?.filter((o) => o.status === "delivered") || [];

  const handleMarkAsProcessing = (orderId: number) => {
    updateOrderStatus.mutate({
      orderId,
      status: "processing",
    });
  };

  const handleMarkAsShipped = (orderId: number) => {
    if (!trackingNumber) {
      alert("Please enter a tracking number");
      return;
    }
    updateOrderStatus.mutate({
      orderId,
      status: "shipped",
      trackingNumber,
      notes: notes || undefined,
    });
  };

  const handleMarkAsDelivered = (orderId: number) => {
    updateOrderStatus.mutate({
      orderId,
      status: "delivered",
      notes: notes || undefined,
    });
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      pending: { label: "New Order", variant: "default" },
      processing: { label: "In Progress", variant: "secondary" },
      shipped: { label: "Shipped", variant: "outline" },
      delivered: { label: "Delivered", variant: "outline" },
      cancelled: { label: "Cancelled", variant: "destructive" },
    };
    const config = variants[status] || variants.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const OrderCard = ({ order, actionButton }: { order: any; actionButton?: React.ReactNode }) => (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">Order #{order.orderNumber}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {new Date(order.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
              })}
            </p>
          </div>
          {getStatusBadge(order.status)}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Customer Info */}
        <div className="grid md:grid-cols-2 gap-4 border-b pb-4">
          <div>
            <p className="text-sm font-semibold mb-1">Customer</p>
            <p className="text-sm">{order.customerName}</p>
            <p className="text-sm text-muted-foreground">{order.customerEmail}</p>
            {order.customerPhone && (
              <p className="text-sm text-muted-foreground">{order.customerPhone}</p>
            )}
          </div>
          <div>
            <p className="text-sm font-semibold mb-1">Shipping Address</p>
            <p className="text-sm">{order.shippingAddress}</p>
            <p className="text-sm">
              {order.shippingCity}, {order.shippingState} {order.shippingZip}
            </p>
            <p className="text-sm text-muted-foreground mt-1">{order.shippingMethod}</p>
          </div>
        </div>

        {/* Order Totals */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm border-b pb-4">
          <div>
            <p className="text-muted-foreground">Subtotal</p>
            <p className="font-medium">${order.subtotal}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Shipping</p>
            <p className="font-medium">
              {parseFloat(order.shipping || "0") === 0 ? "FREE" : `$${order.shipping}`}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Tax</p>
            <p className="font-medium">${order.tax}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Total</p>
            <p className="font-bold text-lg">${order.total}</p>
          </div>
        </div>

        {/* Payment & Tracking Info */}
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          {order.stripePaymentIntentId && (
            <div>
              <p className="text-muted-foreground mb-1">Payment ID</p>
              <p className="font-mono text-xs bg-slate-100 p-2 rounded">
                {order.stripePaymentIntentId}
              </p>
            </div>
          )}
          {order.trackingNumber && (
            <div>
              <p className="text-muted-foreground mb-1">Tracking Number</p>
              <div className="flex items-center gap-2">
                <p className="font-mono text-xs bg-slate-100 p-2 rounded flex-1">
                  {order.trackingNumber}
                </p>
                <a
                  href={`https://tools.usps.com/go/TrackConfirmAction?tLabels=${order.trackingNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
          )}
        </div>

        {order.notes && (
          <div className="text-sm">
            <p className="text-muted-foreground mb-1">Notes</p>
            <p className="bg-slate-50 p-2 rounded">{order.notes}</p>
          </div>
        )}

        {/* Action Button */}
        {actionButton && <div className="pt-2">{actionButton}</div>}

        {/* View Details Button */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full">
              View Order Items
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Order #{order.orderNumber} - Items</DialogTitle>
              <DialogDescription>
                Complete order details and line items
              </DialogDescription>
            </DialogHeader>
            <OrderDetailsDialog orderId={order.id} />
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-700 to-emerald-600 text-white py-12">
        <div className="container">
          <h1 className="text-4xl font-bold mb-2">Order Management</h1>
          <p className="text-emerald-100">Manage hardware store orders and fulfillment</p>
        </div>
      </div>

      <div className="container py-8">
        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{newOrders.length}</p>
                  <p className="text-sm text-muted-foreground">New Orders</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                  <Package className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{inProgressOrders.length}</p>
                  <p className="text-sm text-muted-foreground">In Progress</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center">
                  <Truck className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{shippedOrders.length}</p>
                  <p className="text-sm text-muted-foreground">Shipped</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{deliveredOrders.length}</p>
                  <p className="text-sm text-muted-foreground">Delivered</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Orders Tabs */}
        <Tabs defaultValue="new" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="new" className="relative">
              New Orders
              {newOrders.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {newOrders.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="processing">In Progress</TabsTrigger>
            <TabsTrigger value="shipped">Shipped</TabsTrigger>
            <TabsTrigger value="delivered">Delivered</TabsTrigger>
          </TabsList>

          {/* New Orders Tab */}
          <TabsContent value="new">
            {newOrders.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No New Orders</h3>
                  <p className="text-muted-foreground">
                    New customer orders will appear here
                  </p>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-900">
                      <p className="font-semibold mb-1">Action Required</p>
                      <p>
                        These orders need to be placed with Top Knobs. Log into the{" "}
                        <a
                          href="https://www.topknobs.com/dealer"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline font-medium"
                        >
                          Top Knobs dealer portal
                        </a>
                        , place the order using dealer pricing, and select drop-ship to customer address.
                      </p>
                    </div>
                  </div>
                </div>

                {newOrders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    actionButton={
                      <Button
                        onClick={() => handleMarkAsProcessing(order.id)}
                        disabled={updateOrderStatus.isPending}
                        className="w-full"
                      >
                        ✓ Mark as Ordered with Top Knobs
                      </Button>
                    }
                  />
                ))}
              </>
            )}
          </TabsContent>

          {/* In Progress Tab */}
          <TabsContent value="processing">
            {inProgressOrders.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Truck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Orders In Progress</h3>
                  <p className="text-muted-foreground">
                    Orders that have been placed with Top Knobs will appear here
                  </p>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-yellow-900">
                      <p className="font-semibold mb-1">Waiting for Shipment</p>
                      <p>
                        Check Top Knobs for tracking numbers. Once shipped, add the tracking number below
                        and mark as shipped to notify the customer.
                      </p>
                    </div>
                  </div>
                </div>

                {inProgressOrders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    actionButton={
                      <div className="space-y-3">
                        <div>
                          <Label htmlFor={`tracking-${order.id}`}>Tracking Number *</Label>
                          <Input
                            id={`tracking-${order.id}`}
                            placeholder="e.g., 9400111899563729586324"
                            value={selectedOrderId === order.id ? trackingNumber : ""}
                            onChange={(e) => {
                              setSelectedOrderId(order.id);
                              setTrackingNumber(e.target.value);
                            }}
                            onFocus={() => setSelectedOrderId(order.id)}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`notes-${order.id}`}>Notes (optional)</Label>
                          <Textarea
                            id={`notes-${order.id}`}
                            placeholder="Any special handling or notes..."
                            value={selectedOrderId === order.id ? notes : ""}
                            onChange={(e) => {
                              setSelectedOrderId(order.id);
                              setNotes(e.target.value);
                            }}
                            onFocus={() => setSelectedOrderId(order.id)}
                            rows={2}
                          />
                        </div>
                        <Button
                          onClick={() => handleMarkAsShipped(order.id)}
                          disabled={updateOrderStatus.isPending || selectedOrderId !== order.id}
                          className="w-full"
                        >
                          ✓ Mark as Shipped & Send Tracking Email
                        </Button>
                      </div>
                    }
                  />
                ))}
              </>
            )}
          </TabsContent>

          {/* Shipped Tab */}
          <TabsContent value="shipped">
            {shippedOrders.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <CheckCircle2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Shipped Orders</h3>
                  <p className="text-muted-foreground">
                    Orders that have been shipped will appear here
                  </p>
                </CardContent>
              </Card>
            ) : (
              shippedOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  actionButton={
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor={`delivered-notes-${order.id}`}>Delivery Notes (optional)</Label>
                        <Textarea
                          id={`delivered-notes-${order.id}`}
                          placeholder="Customer feedback, any issues, etc..."
                          value={selectedOrderId === order.id ? notes : ""}
                          onChange={(e) => {
                            setSelectedOrderId(order.id);
                            setNotes(e.target.value);
                          }}
                          onFocus={() => setSelectedOrderId(order.id)}
                          rows={2}
                        />
                      </div>
                      <Button
                        onClick={() => handleMarkAsDelivered(order.id)}
                        disabled={updateOrderStatus.isPending}
                        variant="outline"
                        className="w-full"
                      >
                        ✓ Mark as Delivered
                      </Button>
                    </div>
                  }
                />
              ))
            )}
          </TabsContent>

          {/* Delivered Tab */}
          <TabsContent value="delivered">
            {deliveredOrders.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <CheckCircle2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Delivered Orders Yet</h3>
                  <p className="text-muted-foreground">
                    Completed orders will appear here
                  </p>
                </CardContent>
              </Card>
            ) : (
              deliveredOrders.map((order) => <OrderCard key={order.id} order={order} />)
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function OrderDetailsDialog({ orderId }: { orderId: number }) {
  const { data: orderWithItems, isLoading } = trpc.admin.getOrderWithItems.useQuery({ orderId });

  if (isLoading) {
    return <div className="text-center py-8">Loading order details...</div>;
  }

  if (!orderWithItems) {
    return <div className="text-center py-8">Order not found</div>;
  }

  return (
    <div className="space-y-4">
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-left p-3 font-semibold">SKU</th>
              <th className="text-left p-3 font-semibold">Product</th>
              <th className="text-center p-3 font-semibold">Qty</th>
              <th className="text-right p-3 font-semibold">Price</th>
              <th className="text-right p-3 font-semibold">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {orderWithItems.items.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="p-3 font-mono text-xs">{item.sku}</td>
                <td className="p-3">{item.productName}</td>
                <td className="p-3 text-center">{item.quantity}</td>
                <td className="p-3 text-right">${item.price}</td>
                <td className="p-3 text-right font-medium">${item.subtotal}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-slate-50 p-4 rounded-lg space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span>${orderWithItems.subtotal}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Shipping</span>
          <span>
            {parseFloat(orderWithItems.shipping || "0") === 0
              ? "FREE"
              : `$${orderWithItems.shipping}`}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Tax (VA 5.3%)</span>
          <span>${orderWithItems.tax}</span>
        </div>
        <div className="flex justify-between text-lg font-bold pt-2 border-t">
          <span>Total</span>
          <span className="text-emerald-600">${orderWithItems.total}</span>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-sm text-blue-900">
          <strong>Top Knobs Ordering:</strong> Use these SKUs and quantities when placing the order
          in the dealer portal. Select drop-ship to {orderWithItems.shippingCity}, {orderWithItems.shippingState}.
        </p>
      </div>
    </div>
  );
}
