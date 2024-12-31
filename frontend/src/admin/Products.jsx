import { isAuthenticated } from "@/auth/helpers";
import { API_URL } from "@/config";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
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
import { Input } from "@/components/ui/input";
import { getProducts } from "@/core/ApiCore";
import { Trash2 } from "lucide-react";
import ProductSearch from "./ProductSearch";
import { useToast } from "@/hooks/use-toast";

const Products = () => {
  const [product, setProduct] = useState({
    photo: "",
    name: "",
    description: "",
    quantity: 0,
    price: 0,
    shipping: "",
    category: 0,
  });
  const [formData, setFormData] = useState(new FormData());
  const [categories, setCategories] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState(products);
  const { toast } = useToast();

  const getCategories = () => {
    fetch(`${API_URL}/category`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => setCategories(res.categories))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    getCategories();
    getProducts({ sortBy: "createdAt", order: "desc", limit: 100 }).then(
      (res) => {
        setProducts(res);
      }
    );
  }, []);
  useEffect(() => {
    setFilteredProducts(products);
  }, [products]);

  const handleChange = (e) => {
    const value = e.target.id === "photo" ? e.target.files[0] : e.target.value;
    setFormData((prevFormData) => {
      prevFormData.set(e.target.id, value);
      return prevFormData;
    });
    setProduct((prevProduct) => ({
      ...prevProduct,
      [e.target.id]: value,
    }));
  };
  const submitProduct = async (e) => {
    e.preventDefault();
    const { user, token } = isAuthenticated();

    try {
      const res = await fetch(`${API_URL}/product/create/${user._id}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (data.error) {
        toast({
          variant: "destructive",
          title: "Error!",
          description: "Please check form!",
        });
      } else {
        // Refresh products list
        const updatedProducts = await getProducts({
          sortBy: "createdAt",
          order: "desc",
          limit: 100,
        });

        setProducts(updatedProducts);
        setFilteredProducts(updatedProducts);

        toast({
          title: "New Product created Successfully",
          className: "bg-black text-white",
        });

        // Reset form
        setProduct({
          photo: "",
          name: "",
          description: "",
          quantity: 0,
          price: 0,
          shipping: "",
          category: 0,
        });
        setFormData(new FormData());
        setIsDialogOpen(false);
      }
    } catch (err) {
      toastr.error(err, "Server error!", {
        positionClass: "toast-bottom-left",
      });
      toast({
        variant: "destructive",
        title: "Server error!",
        description: err,
        className: "bg-black text-white",
      });
    }
  };
  const addProductDialog = () => {
    return (
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="py-3 px-6 text-base font-semibold bg-primary text-white rounded-md hover:bg-primary/90">
            Add Product
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px] h-[90vh] overflow-y-auto p-6">
          <DialogHeader>
            <DialogTitle>Add Product</DialogTitle>
            <DialogDescription id="order-details-description">
              Add Product
            </DialogDescription>
            <DialogDescription>
              Fill in the details to add a new product.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={submitProduct} className="space-y-3">
            {/* Photo Input */}
            <div className="space-y-2">
              <label
                htmlFor="photo"
                className="block font-medium text-gray-700"
              >
                Product Photo
              </label>
              <Input
                type="file"
                id="photo"
                name="photo"
                required
                onChange={handleChange}
                className="p-2 border border-gray-300 rounded-md w-full"
              />
            </div>

            {/* Name Input */}
            <div className="space-y-2">
              <label htmlFor="name" className="block font-medium text-gray-700">
                Product Name
              </label>
              <Input
                type="text"
                id="name"
                name="name"
                required
                onChange={handleChange}
                placeholder="Enter product name"
              />
            </div>

            {/* Description Input */}
            <div className="space-y-2">
              <label
                htmlFor="description"
                className="block font-medium text-gray-700"
              >
                Product Description
              </label>
              <textarea
                id="description"
                name="description"
                required
                onChange={handleChange}
                className="p-3 border border-gray-300 rounded-md w-full"
                placeholder="Enter product description"
              />
            </div>

            {/* Quantity and Price Inputs */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label
                  htmlFor="quantity"
                  className="block font-medium text-gray-700"
                >
                  Quantity
                </label>
                <Input
                  type="number"
                  id="quantity"
                  name="quantity"
                  required
                  onChange={handleChange}
                  placeholder="Enter quantity"
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="price"
                  className="block font-medium text-gray-700"
                >
                  Price
                </label>
                <Input
                  type="number"
                  id="price"
                  name="price"
                  required
                  onChange={handleChange}
                  placeholder="Enter price"
                />
              </div>
            </div>

            {/* Category and Shipping Inputs */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label
                  htmlFor="category"
                  className="block font-medium text-gray-700"
                >
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  required
                  onChange={handleChange}
                  className="p-3 border border-gray-300 rounded-md w-full"
                >
                  <option value="">Select a category</option>
                  {categories.map((category, index) => (
                    <option key={index} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="shipping"
                  className="block font-medium text-gray-700"
                >
                  Shipping
                </label>
                <select
                  id="shipping"
                  name="shipping"
                  required
                  onChange={handleChange}
                  className="p-3 border border-gray-300 rounded-md w-full"
                >
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <DialogFooter>
              <Button
                type="submit"
                className="py-3 text-base font-semibold bg-primary text-white rounded-md hover:bg-primary/90"
              >
                Add Product
              </Button>
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Close
                </Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    );
  };
  const handleSearch = ({ search, category }) => {
    let filtered = [...products];
    if (search) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (category) {
      filtered = filtered.filter(
        (product) => product.category._id === category
      );
    }
    setFilteredProducts(filtered);
  };
  const handleDelete = async (productId) => {
    try {
      const { user, token } = isAuthenticated();
      const res = await fetch(`${API_URL}/product/${productId}/${user._id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 204) {
        // Update both states to remove deleted product
        const updatedProducts = products.filter((p) => p._id !== productId);
        setProducts(updatedProducts);
        setFilteredProducts(updatedProducts);

        toast({
          title: "Success",
          description: "Product deleted successfully",
          className: "bg-black text-white",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error deleting product",
        description: error,
        className: "bg-black text-white",
      });
    }
  };
  return (
    <>
      <div className="flex justify-center min-h-screen">
        <Card className="w-full max-w-[1000px] mt-2 shadow-lg rounded-lg bg-white">
          <CardHeader>
            <div className="flex justify-between items-center mb-4">
              <CardTitle className="text-2xl font-extrabold text-gray-800">
                Products
              </CardTitle>
              {addProductDialog()}
            </div>
            <ProductSearch onSearch={handleSearch} categories={categories} />
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-extrabold">Image</TableHead>
                  <TableHead className="font-extrabold">Id</TableHead>
                  <TableHead className="font-extrabold">Name</TableHead>
                  <TableHead className="font-extrabold">Price</TableHead>
                  <TableHead className="font-extrabold">Quantity</TableHead>
                  <TableHead className="font-extrabold">Category</TableHead>
                  <TableHead className="font-extrabold">Sold</TableHead>
                  <TableHead className="font-extrabold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product._id}>
                    <TableCell>
                      <img
                        src={`${API_URL}/product/photo/${product._id}`}
                        alt={product.name}
                        className="w-12 h-12 rounded-md"
                      />
                    </TableCell>
                    <TableCell>{product._id}</TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.price}</TableCell>
                    <TableCell>{product.quantity}</TableCell>
                    <TableCell>{product.category.name}</TableCell>
                    <TableCell>{product.sold}</TableCell>
                    <TableCell>
                      <Button
                        onClick={() => handleDelete(product._id)}
                        className="bg-red-500 hover:bg-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Products;
