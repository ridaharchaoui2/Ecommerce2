import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getUser, getUserOrders } from "@/core/ApiCore";
import { isAuthenticated } from "@/auth/helpers";
import moment from "moment";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Select, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, MapPinIcon, UserIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Profile = () => {
  const [profile, setProfile] = useState({});
  const { user, token } = isAuthenticated();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [orders, setOrders] = useState([]);
  useEffect(() => {
    getUser(user._id, token)
      .then((data) => {
        setProfile(data);
      })
      .catch((err) => {
        console.error(err);
      });
    getUserOrders(user._id, token)
      .then((data) => {
        setOrders(data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);
  const detailsDialog = (order) => {
    setSelectedOrder(order);
    setIsOpen(true);
  };
  return (
    <>
      <div className="container mx-auto p-4">
        <Card className="w-full max-w-3xl mx-auto">
          <CardHeader>
            <div className="flex items-center space-x-4">
              <Avatar className="w-20 h-20">
                <AvatarImage src="" alt={profile?.name} />
                <AvatarFallback>
                  {profile?.name
                    ? profile.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                    : ""}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>{profile?.name}</CardTitle>
                <CardDescription>{profile?.email}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold mb-2">Recent Orders</h3>
                <ul className="space-y-2">
                  {orders.map((order) => (
                    <li
                      key={order._id}
                      className="flex justify-between items-center border-b pb-2"
                    >
                      <span># {order._id}</span>
                      <span>
                        {moment(order.createdAt).format("MMM Do YYYY, h:mm a")}
                      </span>
                      <span>${order.amount.toFixed(2)}</span>
                      <span className="text-sm font-medium">
                        {order.status}
                      </span>
                      <Button onClick={() => detailsDialog(order)}>
                        View Details
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
          <CardFooter></CardFooter>
        </Card>
      </div>
      {/* Order Details Dialog */}
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

                <Badge>
                  <span className="font-bold col-span-1">
                    {selectedOrder.status}
                  </span>
                </Badge>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-medium col-span-1">
                  Status updated At:
                </span>
                <span className="col-span-3">
                  {moment(selectedOrder.updatedAt).format(
                    "MMMM Do YYYY, h:mm:ss a"
                  )}
                </span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-medium col-span-1">Address:</span>
                <span className="col-span-3">{selectedOrder.address}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-medium col-span-1">Name:</span>
                <span className="col-span-3">{profile?.name}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-medium col-span-1">
                  Order created At:
                </span>
                <span className="col-span-3">
                  {moment(selectedOrder.createdAt).format(
                    "MMMM Do YYYY, h:mm:ss a"
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
                <Button type="button" className="bg-black text-white">
                  Close
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default Profile;
