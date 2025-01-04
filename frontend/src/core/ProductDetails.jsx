import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProduct, relatedProducts } from "./ApiCore";
import { useDispatch } from "react-redux";
import { addToCart } from "@/redux/cartSlice";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import ProductCard from "./ProductCard";

const ProductDetails = () => {
  const dispatch = useDispatch();
  const [product, setProduct] = useState({});
  const [related, setRelated] = useState([]);
  const { id } = useParams();
  useEffect(() => {
    getProduct(id)
      .then((data) => {
        setProduct(data);
        return relatedProducts(id);
      })
      .then((data) => setRelated(data))
      .catch((err) => console.error(err));
  }, [id]);
  return (
    <>
      <div className="container mx-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-start md:space-x-8 py-8">
            {/* Product Image */}
            <div className="md:w-1/2">
              <img
                src={`${import.meta.env.VITE_BACKEND_BASE_URL}/product/photo/${
                  product._id
                }`}
                alt={product.name}
                width={600}
                height={600}
                className="w-full rounded-lg shadow-lg"
              />
            </div>

            {/* Product Details */}
            <div className=" md:w-1/2 mt-6 md:mt-0">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold ">{product.name}</h1>
                <Badge variant="" className="text-base ">
                  {product.category?.name}
                </Badge>
              </div>

              {/* Price */}

              <div className="flex justify-between items-start mb-2">
                <p className="mt-2 text-2xl font-semibold ">${product.price}</p>
                <Badge variant="destructive" className="text-xs">
                  {product.quantity === 0
                    ? " - Out of Stock"
                    : "Only " + product.quantity + " left"}
                </Badge>
              </div>

              {/* Rating */}
              <div className="mt-4 flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < 4 ? "text-yellow-400 fill-current" : "text-gray-300"
                    }`}
                  />
                ))}
                <span className="ml-2 text-sm text-gray-600">
                  (128 reviews)
                </span>
              </div>

              {/* Description */}
              <p className="mt-4 text-gray-600">{product.description}</p>

              {/* Features */}
              <ul className="mt-4 space-y-2">
                <li className="flex items-center text-gray-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500 mr-2"></span>
                  Adjustable height and tilt
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500 mr-2"></span>
                  360-degree swivel
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500 mr-2"></span>
                  High-density foam cushion
                </li>
              </ul>

              {/* Add to Cart Button */}
              <div className="mt-6">
                <Button
                  className="w-full md:w-auto"
                  onClick={() => dispatch(addToCart(product))}
                  {...(product.quantity === 0 && { disabled: true })}
                >
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Related Products
          </h2>
          <div className="grid  md:grid-cols-4 gap-4">
            {related &&
              related.map((product, index) => (
                <ProductCard key={index} product={product} />
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetails;
