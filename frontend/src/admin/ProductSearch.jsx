import React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ProductSearch = ({ onSearch, categories }) => {
  const [searchData, setSearchData] = React.useState({
    search: "",
    category: "",
  });

  const handleChanges = (keyOrEvent, value) => {
    const newSearchData =
      typeof keyOrEvent === "string"
        ? { ...searchData, [keyOrEvent]: value }
        : { ...searchData, [keyOrEvent.target.id]: keyOrEvent.target.value };

    setSearchData(newSearchData);
    onSearch(newSearchData);
  };

  return (
    <div className="flex gap-4 mb-4">
      <Select
        id="category"
        onValueChange={(value) =>
          handleChanges("category", value === "all" ? "" : value)
        }
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category._id} value={category._id}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="flex-1">
        <Input
          id="search"
          type="text"
          placeholder="Search products..."
          onChange={handleChanges}
        />
      </div>
    </div>
  );
};

export default ProductSearch;
