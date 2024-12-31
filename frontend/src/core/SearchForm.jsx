import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React, { useEffect, useState } from "react";
import { getCategories, getProducts } from "./ApiCore";
import ProductCard from "./ProductCard";

const SearchForm = () => {
  const [categories, setCategories] = React.useState([]);
  const [products, setProducts] = React.useState([]);
  const [searchData, setSearchData] = React.useState({
    search: "",
    category: "",
  });
  const [sortBy, setSortBy] = useState("relevance");
  const handleChanges = (keyOrEvent, value) => {
    if (typeof keyOrEvent === "string") {
      setSearchData({
        ...searchData,
        [keyOrEvent]: value,
      });
    } else {
      setSearchData({
        ...searchData,
        [keyOrEvent.target.id]: keyOrEvent.target.value,
      });
    }
  };
  const submitSearch = (e) => {
    e.preventDefault();
    let { search, category } = searchData;
    if (search || category) {
      getProducts({
        search: search || undefined,
        category: category || undefined,
      }).then((res) => {
        setProducts(res);
      });
    } else {
      setProducts([]);
    }
  };
  useEffect(() => {
    getCategories().then((res) => {
      setCategories(res);
    });
    if (products.length > 0) {
      getProducts({
        search: searchData.search || undefined,
        category: searchData.category || undefined,
        sortBy: sortBy === "relevance" ? undefined : sortBy,
      }).then((res) => {
        setProducts(res);
      });
    }
  }, [sortBy]);
  const sortOptions = [
    { value: "relevance", label: "Relevance" },
    { value: "price_asc", label: "Price: Low to High" },
    { value: "price_desc", label: "Price: High to Low" },
    { value: "newest", label: "Newest Arrivals" },
  ];

  return (
    <>
      <div className="w-full max-w-4xl mx-auto p-4">
        <form
          onSubmit={submitSearch}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Select
            id="category"
            onValueChange={(value) =>
              handleChanges("category", value === "all" ? "" : value)
            }
          >
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Select Category" value="" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories &&
                categories.map((category) => (
                  <SelectItem key={category._id} value={category._id}>
                    {category.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          <div className="flex-1 flex">
            <Input
              id="search"
              type="text"
              placeholder="Search products..."
              onChange={handleChanges}
              className="rounded-r-none"
            />
            <Button type="submit" className="rounded-l-none">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </form>
      </div>
      <hr />

      {products && products.length > 0 && (
        <div className="flex justify-between items-center mb-4 px-4">
          <h2 className="text-xl font-semibold">
            {products.length} Products Found
          </h2>
          <Select value={sortBy} onValueChange={setSortBy}>
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
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {products &&
          products.map((product, index) => (
            <div key={index}>
              <ProductCard product={product} />
            </div>
          ))}
      </div>
    </>
  );
};

export default SearchForm;
