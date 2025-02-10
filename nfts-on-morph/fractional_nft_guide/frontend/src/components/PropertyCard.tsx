import Image from "next/image";
import { Button } from "./ui/button";
import BuySharesModal from "./BuySharesModal";

interface PropertyCardProps {
  property: any;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  return (
    <div className=" w-96 text-black rounded overflow-hidden shadow-lg bg-white flex-shrink-0">
      <Image
        width={600}
        height={400}
        className="w-full h-48 object-cover"
        src={property.uri}
        alt="property"
      />
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">
          {property.name} (id: {property.tokenId.toString()})
        </div>
        <p className="text-gray-700  font-medium  text-base">
          Price Per Share: {property.pricePerShare.toString()} OKD
        </p>
        <p className="text-gray-700 font-medium text-base">
          Total Shares: {property.totalShares.toString()}
        </p>
        <p className="text-gray-700 font-medium  text-base">
          Shares Sold: {property.sharesSold.toString()}
        </p>

        <div className="flex justify-center my-4">
          <BuySharesModal>
            <Button
              size="lg"
              className="items-center bg-slate-600 text-white hover:bg-blue-900"
            >
              Buy Shares
            </Button>
          </BuySharesModal>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
