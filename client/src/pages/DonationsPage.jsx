import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import PageHero from "../components/common/PageHero";
import Seo from "../components/common/Seo";
import { donationPayment, donationSubTemples, donationTypes } from "../data/siteContent";
import { postApi } from "../lib/api";

function loadRazorpayCheckout() {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve();
      return;
    }

    const existingScript = document.querySelector("script[src='https://checkout.razorpay.com/v1/checkout.js']");

    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(), { once: true });
      existingScript.addEventListener("error", () => reject(new Error("Unable to load Razorpay Checkout.")), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Unable to load Razorpay Checkout."));
    document.body.appendChild(script);
  });
}

const emptyForm = {
  name: "",
  amount: "",
  purpose: "Annadan",
  donationFor: ""
};

function DonationsPage() {
  const [searchParams] = useSearchParams();
  const selectedTempleId = searchParams.get("deity");
  const formRef = useRef(null);
  const selectedTemple = useMemo(
    () => donationSubTemples.find((temple) => temple.id === selectedTempleId) || null,
    [selectedTempleId]
  );
  const [formData, setFormData] = useState(emptyForm);
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!selectedTemple) {
      setFormData(emptyForm);
      setStatus("idle");
      setMessage("");
      return;
    }

    setFormData((current) => ({
      ...current,
      donationFor: selectedTemple.deity
    }));

    window.setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }, [selectedTemple]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedTemple) {
      return;
    }

    setStatus("creating");
    setMessage("");

    try {
      await loadRazorpayCheckout();

      const orderData = await postApi("/payments/razorpay/order", {
        ...formData,
        donationFor: selectedTemple.deity
      });

      setStatus("checkout");

      const checkout = new window.Razorpay({
        key: orderData.key,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: donationPayment.name,
        description: `${formData.purpose} - ${selectedTemple.deity}`,
        order_id: orderData.order.id,
        prefill: {
          name: formData.name
        },
        notes: {
          purpose: formData.purpose,
          donationFor: selectedTemple.deity
        },
        theme: {
          color: "#e98f08"
        },
        handler: async (response) => {
          setStatus("verifying");

          try {
            await postApi("/payments/razorpay/verify", response);
            setStatus("success");
            setMessage(`Payment successful. Payment ID: ${response.razorpay_payment_id}`);
            setFormData({
              ...emptyForm,
              purpose: formData.purpose,
              donationFor: selectedTemple.deity
            });
          } catch (verificationError) {
            setStatus("error");
            setMessage(verificationError.message || "Payment verification failed.");
          }
        },
        modal: {
          ondismiss: () => {
            setStatus("idle");
            setMessage("Payment was cancelled before completion.");
          }
        }
      });

      checkout.open();
    } catch (paymentError) {
      setStatus("error");
      setMessage(paymentError.message || "Unable to start Razorpay payment.");
    }
  };

  return (
    <>
      <Seo
        title="Donations | Shree Krishna Devasthana"
        description="Offer annadan, gau seva, and general donations to support the temple."
      />
      <PageHero
        title="Offer Your Donation"
        description="Select the deity or temple seva first. The donation form and Razorpay payment open only after your seva is chosen."
        image="https://images.unsplash.com/photo-1482192505345-5655af888cc4?auto=format&fit=crop&w=1600&q=80"
      />

      <section className="section-shell py-20">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-gold">Choose Seva</p>
          <h2 className="mt-4 font-heading text-4xl text-ink">Donate for a temple or deity</h2>
          <p className="soft-copy mt-4 text-lg leading-8">
            Select one of the six temple sevas. The payment credentials remain the same, and your selected deity is captured in Razorpay notes.
          </p>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {donationSubTemples.map((temple) => {
            const isActive = selectedTemple?.id === temple.id;

            return (
              <Link
                key={temple.id}
                to={`/donations?deity=${temple.id}#donation-form`}
                className={`group overflow-hidden rounded-lg border text-left shadow-aura transition hover:-translate-y-1 hover:border-gold ${
                  isActive ? "border-gold bg-amber-50" : "border-amber-100 bg-white"
                }`}
              >
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={temple.image}
                    alt={temple.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                  {isActive ? (
                    <span className="absolute right-4 top-4 rounded-full bg-gold px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-cosmic">
                      Selected
                    </span>
                  ) : null}
                </div>
                <div className="p-5">
                  <p className="text-sm uppercase tracking-[0.24em] text-gold">{temple.deity}</p>
                  <h3 className="mt-2 font-heading text-2xl text-ink">{temple.name}</h3>
                  <p className="soft-copy mt-3 text-sm leading-6">{temple.description}</p>
                </div>
              </Link>
            );
          })}
        </div>

        <div id="donation-form" ref={formRef} className="mt-12">
          {!selectedTemple ? (
            <div className="card-surface p-8 text-center">
              <p className="text-sm uppercase tracking-[0.28em] text-gold">Donation form locked</p>
              <h3 className="mt-3 font-heading text-3xl text-ink">Please choose a seva card first</h3>
              <p className="soft-copy mx-auto mt-4 max-w-2xl">
                After selecting the temple or deity, the donation form and Razorpay payment option will appear here.
              </p>
            </div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="space-y-6">
                {donationTypes.map((type) => (
                  <div key={type.title} className="card-surface p-8">
                    <h2 className="font-heading text-3xl text-ink">{type.title}</h2>
                    <p className="soft-copy mt-3">{type.description}</p>
                  </div>
                ))}
                <div className="card-surface p-8">
                  <p className="text-sm uppercase tracking-[0.28em] text-gold">Razorpay Payment</p>
                  <h3 className="mt-3 font-heading text-2xl text-ink">Secure online donation</h3>
                  <div className="mt-6 rounded-lg border border-amber-100 bg-amber-50 p-5">
                    <p className="font-semibold text-ink">Donation account</p>
                    <p className="mt-2 text-sm text-stone-700">Name: {donationPayment.name}</p>
                    <p className="mt-2 text-sm text-stone-700">Mobile: {donationPayment.phone}</p>
                    <p className="mt-2 text-sm text-stone-700">Donation For: {selectedTemple.deity}</p>
                    <p className="mt-2 break-all text-sm text-stone-700">UPI ID: {donationPayment.upiId}</p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="card-surface p-8 sm:p-10">
                <p className="text-sm uppercase tracking-[0.28em] text-gold">Donation Form</p>
                <h2 className="mt-4 font-heading text-4xl text-ink">Contribute with devotion</h2>
                <div className="mt-5 rounded-lg border border-gold/25 bg-amber-50 px-4 py-3 text-sm font-semibold text-ink">
                  Donation For: {selectedTemple.deity}
                </div>
                <div className="mt-8 space-y-5">
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-stone-700">Name</span>
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="input-surface"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-stone-700">Amount</span>
                    <input
                      name="amount"
                      type="number"
                      min="1"
                      value={formData.amount}
                      onChange={handleChange}
                      required
                      className="input-surface"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-stone-700">Donation For</span>
                    <input
                      name="donationFor"
                      value={formData.donationFor}
                      readOnly
                      className="input-surface"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-stone-700">Purpose</span>
                    <select
                      name="purpose"
                      value={formData.purpose}
                      onChange={handleChange}
                      className="input-surface"
                    >
                      {donationTypes.map((type) => (
                        <option key={type.title} value={type.title}>
                          {type.title}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <button
                  type="submit"
                  disabled={status === "creating" || status === "verifying"}
                  className="mt-8 rounded-full bg-gradient-to-r from-saffron to-gold px-6 py-3 text-sm font-semibold text-white transition hover:shadow-glow disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {status === "creating"
                    ? "Creating Razorpay order..."
                    : status === "verifying"
                      ? "Verifying payment..."
                      : "Pay with Razorpay"}
                </button>
                {message ? (
                  <p
                    className={`mt-5 rounded-lg border px-4 py-3 text-sm ${
                      status === "success"
                        ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                        : "border-rose-200 bg-rose-50 text-rose-700"
                    }`}
                  >
                    {message}
                  </p>
                ) : null}
              </form>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default DonationsPage;
