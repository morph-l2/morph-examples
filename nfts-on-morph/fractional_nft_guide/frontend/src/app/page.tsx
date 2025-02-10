"use client";
import { useEffect, useState } from "react";
import { okidoFinanceAbi, okidoFinance } from "@/constants";
import { Button } from "@/components/ui/button";
import { useReadContract } from "wagmi";
import PropertyCard from "@/components/PropertyCard";
import AddPropertyModal from "@/components/AddPropertyModal";

export default function Home() {
  const [properties, setProperties] = useState<any>([]);

  const { data: propertyData } = useReadContract({
    abi: okidoFinanceAbi,
    address: okidoFinance,
    functionName: "listProperties",
  });

  useEffect(() => {
    if (propertyData) {
      setProperties(propertyData);
    }
  }, [propertyData]);

  return (
    <main>
      <section className="py-6 flex justify-between  items-center text-center ">
        <h1 className="text-2xl font-bold">Okido Finance</h1>

        <AddPropertyModal>
          <Button>Add property </Button>
        </AddPropertyModal>
      </section>

      <div className="container mx-auto py-4">
        <h1 className="text-2xl font-bold mb-6">Properties</h1>
        <div className="flex gap-4 flex-wrap">
          {properties.length > 0 ? (
            properties
              .toReversed()
              .map((property: any) => (
                <PropertyCard key={property.tokenId} property={property} />
              ))
          ) : (
            <div>
              <h1 className="text-2xl font-semibold">No property available</h1>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
