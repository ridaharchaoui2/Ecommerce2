import { isAuthenticated } from "@/auth/helpers";
import { getOrders, updateOrderStatus } from "@/core/ApiCore";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
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
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CalendarIcon, MapPinIcon, UserIcon } from "lucide-react";
import moment from "moment";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const { user, token } = isAuthenticated();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    getOrders(user._id, token)
      .then((res) => {
        setOrders(res);
      })
      .catch((err) => console.error(err));
  }, []);
  const handleStatusChange = (orderId, status) => {
    updateOrderStatus(orderId, user._id, token, status)
      .then((updatedOrder) => {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === updatedOrder._id ? updatedOrder : order
          )
        );
        toast({
          title: "Success",
          description: "Order status updated successfully",
          className: "bg-black text-white",
        });
      })
      .catch((err) => {
        console.error(err);
      });
  };
  const detailsDialog = (order) => {
    setSelectedOrder(order);
    setIsOpen(true);
  };
  return (
    <>
      <div className="flex justify-center ">
        <Card className="w-full max-w-[1000px] mt-2 shadow-lg rounded-lg ">
          <CardHeader>
            <div className="flex justify-between items-center mb-4">
              <CardTitle className="text-2xl font-extrabold ">Orders</CardTitle>
            </div>
            {/* <ProductSearch onSearch={handleSearch} categories={categories} /> */}
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-extrabold">Date</TableHead>
                  <TableHead className="font-extrabold">User Name</TableHead>
                  <TableHead className="font-extrabold">Amount</TableHead>
                  <TableHead className="font-extrabold">Status</TableHead>
                  <TableHead className="font-extrabold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell>
                      {moment(order.createdAt).format(
                        "MMMM Do YYYY, h:mm:ss a"
                      )}
                    </TableCell>
                    <TableCell>{order.user.name}</TableCell>
                    <TableCell>{order.amount}</TableCell>
                    <TableCell>{order.status}</TableCell>
                    <TableCell>
                      <Button onClick={() => detailsDialog(order)}>
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      {selectedOrder && (
        <Dialog open={isOpen} onOpenChange={setIsOpen} className="">
          <DialogTrigger asChild></DialogTrigger>
          <DialogContent className="sm:max-w-[600px] h-[90vh] overflow-y-auto p-6">
            <DialogHeader className="">
              <DialogTitle>Order Details</DialogTitle>
              <DialogDescription id="order-details-description">
                Detailed information about the selected order.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-medium col-span-1">Transaction ID:</span>
                <span className="col-span-3">
                  {selectedOrder.transaction_id}
                </span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-medium col-span-1">Amount:</span>
                <span className="col-span-3">
                  ${selectedOrder.amount.toFixed(2)}
                </span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-medium col-span-1">Status:</span>
                <Select
                  id="status"
                  onValueChange={(value) =>
                    handleStatusChange(selectedOrder._id, value)
                  }
                >
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue
                      placeholder={selectedOrder.status}
                      value={selectedOrder.status}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Not processed">Not processed</SelectItem>
                    <SelectItem value="Processing">Processing</SelectItem>
                    <SelectItem value="Shipped">Shipped</SelectItem>
                    <SelectItem value="Delivered">Delivered</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-medium col-span-1">
                  Status updated At:
                </span>
                <span className="col-span-3">
                  {moment(selectedOrder.updatedAt).format(
                    "MMM Do YYYY, h:mm a"
                  )}
                </span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-medium col-span-1">Address:</span>
                <span className="col-span-3">{selectedOrder.address}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-medium col-span-1">Phone:</span>
                <span className="col-span-3">{selectedOrder.phone}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-medium col-span-1">Costumer:</span>
                <span className="col-span-3">{selectedOrder.user.name}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-medium col-span-1">Date:</span>
                <span className="col-span-3">
                  {moment(selectedOrder.createdAt).format(
                    "MMM Do YYYY, h:mm a"
                  )}
                </span>
              </div>
              <div className="grid gap-2">
                <span className="font-medium">Products:</span>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Price</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedOrder.products.map((product) => (
                      <TableRow key={product._id}>
                        <TableCell>{product._id}</TableCell>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>{product.count}</TableCell>
                        <TableCell>${product.price.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button">Close</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default Orders;
