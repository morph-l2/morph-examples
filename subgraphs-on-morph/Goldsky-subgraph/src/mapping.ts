import { BigInt } from "@graphprotocol/graph-ts";
import {
  Okido,
  PropertyCreated as PropertyCreatedEvent,
  SharesPurchased as SharesPurchasedEvent,
} from "../generated/OkidoFinance Subgraph/Okido";
import {
  Property,
  Share,
  User,
  PropertyCreated,
  SharesPurchased,
} from "../generated/schema";

export function handlePropertyCreated(event: PropertyCreatedEvent): void {
  let property = new Property(event.params.tokenId.toString());
  property.tokenId = event.params.tokenId;
  property.fractionalContract = event.params.fractionalContract;
  property.pricePerShare = event.params.pricePerShare;
  property.totalShares = BigInt.fromI32(0); // This should be set correctly
  property.sharesSold = BigInt.fromI32(0);
  property.name = event.params.name; // Set the name from the event or contract call
  property.uri = event.params.uri; // Set the URI from the event or contract call
  property.save();

  let propertyCreated = new PropertyCreated(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  );
  propertyCreated.tokenId = event.params.tokenId;
  propertyCreated.fractionalContract = event.params.fractionalContract;
  propertyCreated.pricePerShare = event.params.pricePerShare;
  propertyCreated.timestamp = event.block.timestamp;
  propertyCreated.save();
}

export function handleSharesPurchased(event: SharesPurchasedEvent): void {
  let shareId =
    event.params.tokenId.toString() + "-" + event.params.buyer.toHex();
  let share = Share.load(shareId);
  if (share == null) {
    share = new Share(shareId);
    share.property = event.params.tokenId.toString();
    share.owner = event.params.buyer.toHex();
    share.shares = BigInt.fromI32(0);
    share.purchaseTimestamp = event.block.timestamp;
  }
  share.shares = share.shares.plus(event.params.shares);
  share.save();

  let property = Property.load(event.params.tokenId.toString());
  if (property != null) {
    property.sharesSold = property.sharesSold.plus(event.params.shares);
    property.save();
  }

  let user = User.load(event.params.buyer.toHex());
  if (user == null) {
    user = new User(event.params.buyer.toHex());
  }
  user.save();

  let sharesPurchased = new SharesPurchased(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  );
  sharesPurchased.tokenId = event.params.tokenId;
  sharesPurchased.buyer = event.params.buyer.toHex();
  sharesPurchased.shares = event.params.shares;
  sharesPurchased.timestamp = event.block.timestamp;
  sharesPurchased.save();
}
