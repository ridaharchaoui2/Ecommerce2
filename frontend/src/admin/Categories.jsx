import { isAuthenticated } from "@/auth/helpers";
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
import { Input } from "@/components/ui/input";
import { getCategories } from "@/core/ApiCore";
import React, { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const { toast } = useToast();
  const handleChange = (e) => {
    setName(e.target.value);
  };
  const submitCategory = (e) => {
    e.preventDefault();
    const { user, token } = isAuthenticated();
    fetch(
      `${import.meta.env.VITE_BACKEND_BASE_URL}/category/create/${user._id}`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      }
    )
      .then((res) => res.json())
      .then((res) => {
        if (res.error) {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Please check form !",
            className: "bg-black text-white",
          });
        } else {
          toast({
            title: "New Category",
            description: `Category ${name} created`,
            className: "bg-black text-white",
          });
          setName("");
        }
      })
      .catch((err) =>
        toast({
          variant: "destructive",
          title: "Server error !",
          description: err,
          className: "bg-black text-white",
        })
      );
  };
  const handleDelete = (id) => {
    const { user, token } = isAuthenticated();
    fetch(
      `${import.meta.env.VITE_BACKEND_BASE_URL}/category/${id}/${user._id}`,
      {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    ).then((res) => {
      if (res.status === 204) {
        toast({
          title: "Category deleted successfully",
          className: "bg-black text-white",
        });
      }
    });
  };
  useEffect(() => {
    getCategories().then((res) => {
      setCategories(res);
    });
  }, [categories]);

  return (
    <>
      <div className="flex flex-col items-center min-h-screen p-6">
        <Card className="w-full max-w-[500px] md:max-w-[600px] shadow-lg rounded-lg  mb-8">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl font-extrabold ">
              Add Category
            </CardTitle>
            <CardDescription className="text-base ">
              Enter a name for the new category.
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-4">
            <form onSubmit={submitCategory} className="space-y-6">
              <Input
                placeholder="Enter category name"
                value={name}
                required
                onChange={handleChange}
                className="p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:outline-none"
              />
              <Button
                type="submit"
                className="w-full py-3 text-base font-semibold bg-primary  rounded-md hover:bg-primary/90 focus:ring-2 focus:ring-primary/50 focus:outline-none"
              >
                Submit
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="w-full max-w-[800px] shadow-lg rounded-lg ">
          <CardHeader>
            <CardTitle className="text-2xl font-extrabold ">
              Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category._id}>
                    <TableCell>{category.name}</TableCell>
                    <TableCell>
                      <Button
                        onClick={() => handleDelete(category._id)}
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

export default Categories;
