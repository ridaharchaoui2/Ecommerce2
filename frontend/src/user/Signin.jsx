import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Signin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setUser({ ...user, [e.target.id]: e.target.value });
  };

  const submitSignin = (e) => {
    e.preventDefault();
    fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/signin`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "content-Type": "application/json",
      },
      body: JSON.stringify(user),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.error) {
          toast({
            title: "warning",
            description: "Email or password is incorrect",
            className: "bg-black text-white",
          });
        } else {
          toast({
            title: "Success",
            description: "User is authenticated successfully",
            className: "bg-black text-white",
          });
          localStorage.setItem("jwt_info", JSON.stringify(res));
          if (res.user.role === 1) {
            navigate("/admin/dashboard");
          } else {
            navigate("/");
          }
        }
      })
      .catch((err) =>
        toast({
          title: "Server Error",
          description: err,
          className: "bg-black text-white",
        })
      );
  };
  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
          <CardDescription>
            Enter your email and password to sign in.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  onChange={handleChange}
                  placeholder="name@example.com"
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button className="w-full" type="submit" onClick={submitSignin}>
            Sign In
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Signin;
