import { Card, CardHeader, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from 'next/image';

type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
};

interface ProductGridProps {
  products: Product[];
  onBuy: (product: Product) => void;
  ethPrice: number;
}

export default function ProductGrid({ products, onBuy, ethPrice }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {products.map((product) => (
        <Card key={product.id} className="w-full max-w-xs mx-auto">
          <CardHeader>
            <CardTitle>{product.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="zoom-img-wrapper overflow-hidden rounded-lg relative w-full min-h-[120px] max-h-[140px]">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="zoom-img object-cover transition-transform duration-300"
              />
            </div>
            <p className="mt-2 font-medium">Price: {ethPrice} ETH</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => onBuy(product)} className="w-full">
              Buy
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
