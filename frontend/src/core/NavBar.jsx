import { useEffect, useState } from "react";
import { Search, ShoppingCart, Menu, ChevronDown, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useToast } from "@/hooks/use-toast";
import { isAuthenticated } from "@/auth/helpers";
import CartSheet from "./CartSheet";
import { getCategories } from "./ApiCore";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/mode-toggle";

const NavBar = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [categories, setCategories] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const signout = () => {
    fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/signout`).then(() => {
      toast({
        title: "User SignOut",
        className: "bg-black text-white",
      });
      localStorage.removeItem("jwt_info");
      localStorage.removeItem("cartItems");
      navigate("/signin");
      //window.location.reload();
    });
  };
  ////////////////////
  const [searchData, setSearchData] = useState({
    search: "",
    category: "",
  });

  const handleChanges = (keyOrEvent, value) => {
    const newSearchData =
      typeof keyOrEvent === "string"
        ? { ...searchData, [keyOrEvent]: value }
        : { ...searchData, [keyOrEvent.target.name]: keyOrEvent.target.value };

    setSearchData(newSearchData);
    navigate("/", { state: { searchData: newSearchData } });
  };
  /////////////////////
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
    }
  };
  useEffect(() => {
    getCategories().then((res) => {
      setCategories(res);
    });
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 shadow-md z-50 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold ">EShop</span>
            </Link>
            {isAuthenticated() && (
              <div className="hidden sm:ml-6 sm:flex">
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
              </div>
            )}
          </div>
          <div className="ml-4 flex items-center">
            <Link to="/" className=" text-xl font-semibold hover:text-gray-600">
              Home
            </Link>
          </div>

          <div className="flex items-center">
            {isAuthenticated() && (
              <form
                onSubmit={(e) => e.preventDefault()}
                className="hidden sm:block"
              >
                <div className="relative">
                  <Input
                    type="search"
                    name="search"
                    placeholder="Search products..."
                    className="w-full sm:w-64"
                    value={searchData.search}
                    onChange={handleChanges}
                  />
                </div>
              </form>
            )}

            <div className="ml-4 flex items-center">
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => setIsCartOpen(true)}
              >
                <ShoppingCart className="h-6 w-6" />
                <span className="sr-only">View cart</span>
                {cartItems.length > 0 && (
                  <div className="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full -top-2 -right-2">
                    {cartItems.length}
                  </div>
                )}
              </Button>
              <CartSheet
                open={isCartOpen}
                onClose={() => setIsCartOpen(false)}
              />
            </div>
            {!isAuthenticated() ? (
              <>
                <Link
                  to="/signin"
                  className="px-3 py-2 rounded-md text-sm font-medium"
                >
                  Connexion
                </Link>
                <Link
                  to="/signup"
                  className="  px-3 py-2 rounded-md text-sm font-medium"
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <User className="h-5 w-5" />
                      <span className="sr-only">User menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Link to="/profile">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Link href="#" onClick={signout}>
                        Log out
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
            <ModeToggle />
            <div className="ml-4 sm:hidden">
              <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right">
                  <nav className="flex flex-col space-y-4">
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => {
                        handleChanges("category", "");
                        setIsMenuOpen(false);
                      }}
                    >
                      All Categories
                    </Button>
                    {categories.map((category) => (
                      <Button
                        key={category._id}
                        variant="ghost"
                        className={cn(
                          "w-full justify-start",
                          searchData.category === category._id && "bg-accent"
                        )}
                        onClick={() => {
                          handleChanges("category", category._id);
                          setIsMenuOpen(false);
                        }}
                      >
                        {category.name}
                      </Button>
                    ))}
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
      <div className="sm:hidden">
        <form onSubmit={(e) => e.preventDefault()} className="p-2">
          <div className="relative">
            <Input
              type="search"
              placeholder="Search products..."
              className="w-full"
              name="search"
              value={searchData.search}
              onChange={handleChanges}
            />
          </div>
        </form>
      </div>
    </nav>
  );
};
export default NavBar;
