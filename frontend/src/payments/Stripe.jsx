import { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { useSelector, useDispatch } from "react-redux";
import { clearCartItem } from "@/redux/cartSlice";
import { Button } from "@/components/ui/button";
import { API_URL } from "@/config";
import { isAuthenticated } from "@/auth/helpers";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { createOrder, processPayment } from "@/core/ApiCore"; // Updated import
import { CreditCardIcon, HandCoins } from "lucide-react";

const StripeCheckout = ({ amount, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState("card");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
  });
  const [phone, setPhone] = useState("");
  const paymentMethods = [
    {
      id: "card",
      name: "Credit Card",
      icon: <CreditCardIcon className="h-6 w-6" />,
      description: "Pay with credit or debit card",
    },
    {
      id: "cod",
      name: "Cash on Delivery",
      icon: <HandCoins className="h-6 w-6" />,
      description: "Pay when you receive",
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { user, token } = isAuthenticated();
    const formattedAddress = `${address.street}, ${address.city}, ${address.state} ${address.zipCode}`;

    try {
      if (selectedMethod === "card") {
        // Create payment intent first
        const paymentIntent = await processPayment(user._id, token, {
          amount: Math.round(amount), // Send actual amount, let backend handle conversion
          currency: "usd",
        });

        // Confirm the payment with Stripe
        const { error, paymentIntent: confirmedPayment } =
          await stripe.confirmCardPayment(paymentIntent.clientSecret, {
            payment_method: {
              card: elements.getElement(CardElement),
              billing_details: {
                address: {
                  line1: address.street,
                  city: address.city,
                  state: address.state,
                  postal_code: address.zipCode,
                },
              },
            },
          });

        if (error) throw new Error(error.message);

        // Create order after successful payment
        const orderData = {
          products: cartItems.map((item) => ({
            product: item._id,
            name: item.name,
            price: item.price,
            count: item.count,
          })),
          amount: amount,
          address: formattedAddress,
          phone: phone,
          status: "Processing",
          payment_method: "card",
          transaction_id: confirmedPayment.id,
          userId: user._id,
        };

        await createOrder(user._id, token, orderData);
      } else if (selectedMethod === "cod") {
        // Create COD order directly
        const orderData = {
          products: cartItems.map((item) => ({
            product: item._id,
            name: item.name,
            price: item.price,
            count: item.count,
          })),
          amount: amount,
          address: formattedAddress,
          status: "Not processed",
          payment_method: "cod",
          userId: user._id,
        };

        await createOrder(user._id, token, orderData);
      }

      toast({
        title: "Success",
        description: "Order placed successfully",
      });

      dispatch(clearCartItem());
      navigate("/shop");
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message,
      });
    }
    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md mx-auto space-y-6 mt-6"
    >
      <div className="grid grid-cols-2 gap-4">
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            className={`p-4 border rounded-lg cursor-pointer ${
              selectedMethod === method.id
                ? "border-primary ring-2 ring-primary/20"
                : ""
            }`}
            onClick={() => setSelectedMethod(method.id)}
          >
            <div className="flex items-center space-x-3">
              {method.icon}
              <div>
                <h3 className="font-medium">{method.name}</h3>
                <p className="text-sm text-gray-500">{method.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Contact Information</h3>
        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter your phone number"
            required
          />
        </div>
        <h3 className="text-lg font-medium">Shipping Address</h3>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <Label htmlFor="street">Street Address</Label>
            <Input
              id="street"
              value={address.street}
              onChange={(e) =>
                setAddress({ ...address, street: e.target.value })
              }
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={address.city}
                onChange={(e) =>
                  setAddress({ ...address, city: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                value={address.state}
                onChange={(e) =>
                  setAddress({ ...address, state: e.target.value })
                }
                required
              />
            </div>
          </div>
          <div>
            <Label htmlFor="zipCode">ZIP Code</Label>
            <Input
              id="zipCode"
              value={address.zipCode}
              onChange={(e) =>
                setAddress({ ...address, zipCode: e.target.value })
              }
              required
            />
          </div>
        </div>
      </div>

      {selectedMethod === "card" && (
        <div className="p-4 border rounded-lg">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#424770",
                  "::placeholder": {
                    color: "#aab7c4",
                  },
                },
                invalid: {
                  color: "#9e2146",
                },
              },
            }}
          />
        </div>
      )}

      <Button
        type="submit"
        disabled={
          loading || (selectedMethod === "card" && (!stripe || !elements))
        }
        className="w-full"
      >
        {loading ? "Processing..." : `Pay $${amount}`}
      </Button>
    </form>
  );
};

export default StripeCheckout;
