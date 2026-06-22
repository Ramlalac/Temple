import crypto from "crypto";
import Razorpay from "razorpay";

let razorpayClient;

function getRazorpayClient() {
  const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } = process.env;

  if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
    throw new Error("Razorpay is not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in server/.env.");
  }

  if (!razorpayClient) {
    razorpayClient = new Razorpay({
      key_id: RAZORPAY_KEY_ID,
      key_secret: RAZORPAY_KEY_SECRET
    });
  }

  return razorpayClient;
}

function getDonationAmountInPaise(amount) {
  const parsedAmount = Number(amount);

  if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
    return null;
  }

  return Math.round(parsedAmount * 100);
}

export async function createRazorpayOrder(req, res) {
  const { amount, name, purpose, donationFor } = req.body;
  const amountInPaise = getDonationAmountInPaise(amount);

  if (!amountInPaise) {
    return res.status(400).json({ error: "A valid donation amount is required." });
  }

  try {
    const razorpay = getRazorpayClient();
    const receipt = `donation_${Date.now()}`.slice(0, 40);
    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt,
      notes: {
        name: name || "Devotee",
        purpose: purpose || "Donation",
        donationFor: donationFor || "Temple Donation"
      }
    });

    return res.json({
      key: process.env.RAZORPAY_KEY_ID,
      order
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message || "Unable to create Razorpay order."
    });
  }
}

export function verifyRazorpayPayment(req, res) {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature
  } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ error: "Payment verification details are required." });
  }

  const { RAZORPAY_KEY_SECRET } = process.env;

  if (!RAZORPAY_KEY_SECRET) {
    return res.status(500).json({ error: "Razorpay secret is not configured." });
  }

  const expectedSignature = crypto
    .createHmac("sha256", RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return res.status(400).json({ error: "Invalid Razorpay payment signature." });
  }

  return res.json({
    verified: true,
    paymentId: razorpay_payment_id,
    orderId: razorpay_order_id
  });
}
