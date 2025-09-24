"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  updateProductQuantity,
  adjustInventory,
} from "@/app/_actions/inventory";
import { MinusIcon, PencilIcon, PlusIcon, RefreshCwIcon } from "lucide-react";

interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  price: string;
  categoryId: string | null;
  categoryName: string | null;
  createdAt: Date;
  updatedAt: Date | null;
  isActive: boolean;
}

interface InventoryRowProps {
  item: InventoryItem;
}

export default function InventoryRow({ item }: InventoryRowProps) {
  const router = useRouter();
  const { toast } = useToast();

  const [isPending, startTransition] = React.useTransition();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [adjustmentType, setAdjustmentType] = React.useState<"set" | "adjust">(
    "adjust",
  );
  const [newQuantity, setNewQuantity] = React.useState(
    item.quantity.toString(),
  );
  const [adjustmentAmount, setAdjustmentAmount] = React.useState("");
  const [reason, setReason] = React.useState("");

  // Get stock status
  const getStockStatus = (quantity: number) => {
    if (quantity === 0) {
      return { label: "Out of Stock", variant: "destructive" as const };
    } else if (quantity <= 10) {
      return { label: "Low Stock", variant: "secondary" as const };
    }
    return { label: "In Stock", variant: "default" as const };
  };

  const stockStatus = getStockStatus(item.quantity);

  const handleQuickAdjustment = (adjustment: number) => {
    startTransition(async () => {
      try {
        const result = await adjustInventory(
          item.id,
          adjustment,
          `Quick adjustment: ${adjustment > 0 ? "+" : ""}${adjustment}`,
        );
        if (result.success) {
          toast({
            title: "Inventory Updated",
            description: `${item.name} quantity changed from ${result.previousQuantity} to ${result.newQuantity}`,
          });
        } else {
          toast({
            title: "Error",
            description: result.error || "Failed to update inventory",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Something went wrong. Please try again.",
          variant: "destructive",
        });
      }
    });
  };

  const handleInventoryUpdate = () => {
    if (adjustmentType === "set") {
      const qty = parseInt(newQuantity);
      if (isNaN(qty) || qty < 0) {
        toast({
          title: "Invalid Quantity",
          description: "Please enter a valid quantity (0 or greater)",
          variant: "destructive",
        });
        return;
      }

      startTransition(async () => {
        try {
          const result = await updateProductQuantity(item.id, qty, reason);
          if (result.success) {
            toast({
              title: "Inventory Updated",
              description: `${item.name} quantity set to ${qty}`,
            });
            setIsDialogOpen(false);
            setReason("");
          } else {
            toast({
              title: "Error",
              description: result.error || "Failed to update inventory",
              variant: "destructive",
            });
          }
        } catch (error) {
          toast({
            title: "Error",
            description: "Something went wrong. Please try again.",
            variant: "destructive",
          });
        }
      });
    } else {
      const adjustment = parseInt(adjustmentAmount);
      if (isNaN(adjustment) || adjustment === 0) {
        toast({
          title: "Invalid Adjustment",
          description: "Please enter a valid adjustment amount",
          variant: "destructive",
        });
        return;
      }

      startTransition(async () => {
        try {
          const result = await adjustInventory(item.id, adjustment, reason);
          if (result.success) {
            toast({
              title: "Inventory Adjusted",
              description: `${item.name} quantity adjusted by ${adjustment > 0 ? "+" : ""}${adjustment}`,
            });
            setIsDialogOpen(false);
            setReason("");
            setAdjustmentAmount("");
          } else {
            toast({
              title: "Error",
              description: result.error || "Failed to adjust inventory",
              variant: "destructive",
            });
          }
        } catch (error) {
          toast({
            title: "Error",
            description: "Something went wrong. Please try again.",
            variant: "destructive",
          });
        }
      });
    }
  };

  return (
    <TableRow>
      <TableCell className="font-medium">
        <div className="flex flex-col">
          <span>{item.name}</span>
          <span className="text-xs text-muted-foreground">{item.sku}</span>
        </div>
      </TableCell>
      <TableCell>
        {item.categoryName ? (
          <Badge variant="outline">{item.categoryName}</Badge>
        ) : (
          <span className="text-muted-foreground italic">Uncategorized</span>
        )}
      </TableCell>
      <TableCell className="text-center">
        <div className="flex flex-col items-center gap-1">
          <span className="font-semibold text-lg">{item.quantity}</span>
          <Badge variant={stockStatus.variant} className="text-xs">
            {stockStatus.label}
          </Badge>
        </div>
      </TableCell>
      <TableCell className="text-right font-mono">
        ${parseFloat(item.price).toFixed(2)}
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1">
          {/* Quick adjustment buttons */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuickAdjustment(-1)}
            disabled={isPending || item.quantity === 0}
            className="h-8 w-8 p-0"
          >
            <MinusIcon className="h-3 w-3" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuickAdjustment(1)}
            disabled={isPending}
            className="h-8 w-8 p-0"
          >
            <PlusIcon className="h-3 w-3" />
          </Button>

          {/* Advanced adjustment dialog */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                disabled={isPending}
                className="h-8 w-8 p-0"
              >
                <RefreshCwIcon className="h-3 w-3" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Update Inventory</DialogTitle>
                <DialogDescription>
                  Adjust inventory for {item.name} (Current: {item.quantity})
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="flex gap-2">
                  <Button
                    variant={
                      adjustmentType === "adjust" ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => setAdjustmentType("adjust")}
                  >
                    Adjust
                  </Button>
                  <Button
                    variant={adjustmentType === "set" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setAdjustmentType("set")}
                  >
                    Set Quantity
                  </Button>
                </div>

                {adjustmentType === "adjust" ? (
                  <div className="space-y-2">
                    <Label htmlFor="adjustment">Adjustment Amount</Label>
                    <Input
                      id="adjustment"
                      type="number"
                      placeholder="e.g., +5 or -3"
                      value={adjustmentAmount}
                      onChange={(e) => setAdjustmentAmount(e.target.value)}
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="quantity">New Quantity</Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="0"
                      value={newQuantity}
                      onChange={(e) => setNewQuantity(e.target.value)}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="reason">Reason (Optional)</Label>
                  <Textarea
                    id="reason"
                    placeholder="e.g., Stock intake, Damaged goods, etc."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleInventoryUpdate} disabled={isPending}>
                  Update Inventory
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Edit product details */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/dashboard/products/${item.id}`)}
            disabled={isPending}
            className="h-8 w-8 p-0 ml-2"
          >
            <PencilIcon className="h-3 w-3" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
