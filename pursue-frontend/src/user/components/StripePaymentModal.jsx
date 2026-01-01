import {
  CardElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { confirmStripePayment } from "../../user/services/paymentService";

export default function StripePaymentModal({
  clientSecret,
  paymentId,
  close,
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const pay = async () => {
    setLoading(true);

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });

    if (result.error) {
      alert(result.error.message);
      setLoading(false);
      return;
    }

    await confirmStripePayment(paymentId);
    close();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white p-6 w-[400px] rounded">
        <h3 className="font-bold mb-4">Card Payment</h3>

        <CardElement className="border p-3 rounded" />

        <div className="flex justify-end gap-2 mt-6">
          <button onClick={close} className="border px-4 py-2 rounded">
            Cancel
          </button>
          <button
            onClick={pay}
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            {loading ? "Processing..." : "Pay"}
          </button>
        </div>
      </div>
    </div>
  );
}
