import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  incrementCount,
  decrementCount,
  removeFromCart,
} from "@/redux/cartSlice";
import { Minus, Plus, Trash, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "@/config";
import { Separator } from "@/components/ui/separator";

const CartSheet = ({ open, onClose }) => {
  const { cartItems } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.count,
      0
    );
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-[400px] ">
        <SheetHeader>
          <SheetTitle>Shopping Cart ({cartItems.length})</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-auto py-4">
            {cartItems.length === 0 ? (
              <p className="text-center text-gray-500">Your cart is empty</p>
            ) : (
              cartItems.map((item, index) => (
                <React.Fragment key={index}>
                  <div className="flex items-center justify-between py-4">
                    <div className="flex items-center space-x-4">
                      <img
                        src={`${API_URL}/product/photo/${item._id}`}
                        alt={item.name}
                        className="w-12 h-12 rounded-md"
                      />
                      <div>
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-gray-500">
                          ${item.price?.toFixed(2)} each
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => dispatch(decrementCount(item))}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center">{item.count}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => dispatch(incrementCount(item))}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => dispatch(removeFromCart(item))}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-sm font-medium">
                        Total: ${item.price * item.count}
                      </p>
                    </div>
                  </div>
                  {index < cartItems.length - 1 && (
                    <Separator className="my-2" />
                  )}
                </React.Fragment>
              ))
            )}
          </div>
          <div className="border-t pt-4 pb-3">
            <div className="flex justify-between mb-4">
              <span className="font-medium">Total:</span>
              <span className="font-medium">${getTotal()}</span>
            </div>
            <Button
              className="w-full"
              onClick={() => {
                onClose();
                navigate("/checkout");
              }}
              disabled={cartItems.length === 0}
            >
              Checkout
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CartSheet;
