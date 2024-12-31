const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.stripePayment = async (req, res) => {
  try {
    const { amount, currency = "usd" } = req.body;
    console.log("Payment Intent Request:", { amount, currency });

    if (!amount) {
      return res.status(400).json({ error: "Amount is required" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency,
      payment_method_types: ["card"],
      metadata: {
        userId: req.profile._id.toString(), // Convert ObjectId to string
      },
    });

    console.log("Payment Intent Created:", paymentIntent.id);
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Stripe payment error:", error.message);
    res.status(500).json({
      error: error.message || "Payment failed",
    });
  }
};
