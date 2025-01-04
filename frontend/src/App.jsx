import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import "./App.css";
import Signin from "./user/Signin";
import Signup from "./user/Signup";
import NavBar from "./core/NavBar";
import Home from "./core/Home";
import AdminDashboard from "./user/AdminDashboard";
import PrivateRoute from "./auth/PrivateRoute";
import AdminRoute from "./auth/AdminRoute";
import Categories from "./admin/Categories";
import Products from "./admin/Products";
import Cart from "./core/Cart";
import ProductDetails from "./core/ProductDetails";
import MainLayout from "./core/MainLayout";
import Layout from "./core/Layout";
import Orders from "./admin/Orders";
import Checkout from "./payments/Checkout";
import Signout from "./user/Signout";
import Profile from "./user/Profile";
import MyOrders from "./user/MyOrders";
import Footer from "./core/Footer";
import { ThemeProvider } from "./components/theme-provider";

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes with NavBar */}

          <Route
            path="*"
            element={
              <MainLayout>
                <Routes>
                  <Route
                    path="/"
                    element={
                      <>
                        <NavBar />
                        <Outlet />
                        <Footer />
                      </>
                    }
                  >
                    <Route path="/" element={<Home />} />

                    <Route path="/checkout" element={<PrivateRoute />}>
                      <Route path="" element={<Checkout />} />
                    </Route>
                    <Route path="/profile" element={<PrivateRoute />}>
                      <Route path="" element={<Profile />} />
                    </Route>
                    <Route path="/myorders" element={<PrivateRoute />}>
                      <Route path="" element={<MyOrders />} />
                    </Route>
                    <Route path="/signin" element={<Signin />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/product/:id" element={<ProductDetails />} />
                  </Route>
                </Routes>
              </MainLayout>
            }
          />
          {/* Admin Routes without NavBar */}
          <Route path={"/admin"} element={<AdminRoute />}>
            <Route element={<Layout />}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="category/create" element={<Categories />} />
              <Route path="product/create" element={<Products />} />
              <Route path="orders" element={<Orders />} />
              <Route path="signout" element={<Signout />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
