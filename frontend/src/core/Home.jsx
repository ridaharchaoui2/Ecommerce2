import React, { useEffect, useState } from "react";
import { filterProducts, getProducts } from "./ApiCore";
import ProductCard from "./ProductCard";
import SearchForm from "./SearchForm";
import { Button } from "@/components/ui/button";
import { useLocation } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Home = () => {
  const location = useLocation();
  const searchData = location.state?.searchData;
  const [products, setProducts] = useState([]);
  const [limit, setLimit] = useState(10);
  const [skip, setSkip] = useState(0);
  const [size, setSize] = useState(0);
  const [sortBy, setSortBy] = useState("relevance");
  const loadMore = () => {
    let toSkip = skip + limit;
  };
  const buttonToLoadMore = () => {
    return (
      size > 0 &&
      size >= limit && (
        <div className="text-center mt-4">
          <Button onClick={loadMore} className="btn btn-outline-dark">
            Load More
          </Button>
        </div>
      )
    );
  };
  useEffect(() => {
    getProducts({
      search: searchData?.search || "",
      category: searchData?.category || undefined,
      sortBy: sortBy === "relevance" ? undefined : sortBy,
    })
      .then((res) => {
        setProducts(res);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
      });
  }, [searchData, sortBy]);

  const sortOptions = [
    { value: "relevance", label: "Relevance" },
    { value: "price_asc", label: "Price: Low to High" },
    { value: "price_desc", label: "Price: High to Low" },
    { value: "newest", label: "Newest Arrivals" },
    { value: "sold_desc", label: "Best Sellers" },
  ];

  return (
    <>
      <div className="container mx-auto px-4 py-6">
        <Select className={"mt-2"} value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mt-3 gap-4">
          {products.map((product) => (
            <div key={product._id}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
        {buttonToLoadMore()}
      </div>
    </>
  );
};

export default Home;
