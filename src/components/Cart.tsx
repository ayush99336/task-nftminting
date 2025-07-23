import { Card, CardHeader, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
};

interface CartProps {
  cart: Product[];
  total: number;
  onPay: () => void;
  paying: boolean;
  wallet: string | null;
}

export default function Cart({ cart, total, onPay, paying, wallet }: CartProps) {
  return (
    <Card className="max-w-sm mx-auto mt-0">
      <CardHeader>
        <CardTitle>Shopping Cart</CardTitle>
      </CardHeader>
      <CardContent>
        {cart.length === 0 ? (
          <p>Cart is empty.</p>
        ) : (
          <>
            <ul className="mb-3">
              {cart.map((item, idx) => (
                <li key={idx}>
                  {item.name} - {0.000001}
                </li>
              ))}
            </ul>
            <p className="font-semibold">Total: {total} ETH</p>
          </>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={onPay} disabled={cart.length === 0 || !wallet || paying} className="w-full">
          {paying ? "Paying..." : `Pay ${total} ETH`}
        </Button>
      </CardFooter>
    </Card>
  );
}
