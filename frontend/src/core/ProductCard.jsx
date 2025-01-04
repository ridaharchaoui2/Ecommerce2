import React from "react";
import { Star, ShoppingCart, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import ShowImage from "./ShowImage";
import { useDispatch } from "react-redux";
import { addToCart } from "@/redux/cartSlice";

const ProductCard = ({ product }) => {
  let dispatch = useDispatch();
  return (
    <>
      <Card className="w-full max-w-sm mx-auto p-4 sm:p-6">
        <CardHeader className="p-0">
          <div className="relative h-48 w-full">
            <img
              src={`${import.meta.env.VITE_BACKEND_BASE_URL}/product/photo/${
                product._id
              }`}
              alt={product.name}
              className="rounded-t-lg w-full h-full object-cover"
            />
            {/* <Badge className="absolute top-2 right-2 bg-red-500">Sale</Badge> */}
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <CardTitle className="text-lg font-semibold line-clamp-2">
              {product.name}
            </CardTitle>
            <Badge variant="" className="text-xs ">
              {product.category.name}
            </Badge>
          </div>
          <div className="flex justify-between items-start mb-2">
            <span className="text-lg font-bold">
              ${product.price.toFixed(2)}
            </span>
            <Badge variant="destructive" className="text-xs">
              {product.quantity === 0
                ? " - Out of Stock"
                : "Only " + product.quantity + " left"}
            </Badge>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex flex-col  justify-between gap-2 ">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => dispatch(addToCart(product))}
            {...(product.quantity === 0 && { disabled: true })}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Add to Cart
          </Button>
          <Button asChild className="w-full">
            <Link to={`/product/${product._id}`}>View Details</Link>
          </Button>
        </CardFooter>
      </Card>
    </>
  );
};

export default ProductCard;
