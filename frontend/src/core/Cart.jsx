import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Minus, ShoppingCart, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  decrementCount,
  incrementCount,
  removeFromCart,
} from "@/redux/cartSlice";
import { API_URL } from "@/config";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <>
      <div className="container">
        <Card className="w-full max-w-md mx-auto mt-4 ">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ShoppingCart className="w-5 h-5" />
              <span>Your Cart</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px] pr-4">
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
            </ScrollArea>
          </CardContent>
          <Separator />
          <CardFooter className="flex flex-col space-y-4 pt-4">
            <div className="flex justify-between w-full text-lg font-semibold">
              <span>Total:</span>
              <span>
                $
                {cartItems
                  .reduce((sum, item) => sum + item.price * item.count, 0)
                  .toFixed(2)}
              </span>
            </div>
            <Button
              className="w-full"
              disabled={cartItems.length === 0}
              onClick={() => navigate("/checkout")}
            >
              Proceed to Checkout ($
              {cartItems
                .reduce((sum, item) => sum + item.price * item.count, 0)
                .toFixed(2)}
              )
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
};

export default Cart;
