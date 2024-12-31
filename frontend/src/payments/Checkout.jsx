import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Stripe from "./Stripe";
import { useSelector } from "react-redux";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const Checkout = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const amount = cartItems.reduce(
    (sum, item) => sum + item.price * item.count,
    0
  );
  return (
    <Elements stripe={stripePromise}>
      <Stripe amount={amount} />
    </Elements>
  );
};

export default Checkout;
