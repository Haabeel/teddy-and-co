"use client";

import Image from "next/image";
import { useCartStore } from "@/hooks/useCartStore";
import { media as wixMedia } from "@wix/sdk";
import { useWixClient } from "@/hooks/useWixClient";
import { currentCart } from "@wix/ecom"; // Provides currentCart.Cart, currentCart.LineItem
import { useEffect, useMemo } from "react"; // Added useMemo

const CartModal = () => {
  const wixClient = useWixClient();
  const { cart, isLoading, removeItem, getCart } = useCartStore();

  // Optional: Fetch cart on mount if not already loaded
  // useEffect(() => {
  //   if (wixClient && (!cart || !cart.lineItems)) { // Condition to fetch if cart seems empty/not loaded
  //     getCart(wixClient);
  //   }
  // }, [wixClient, getCart, cart]);

  const handleCheckout = async () => {
    try {
      const checkout =
        await wixClient.currentCart.createCheckoutFromCurrentCart({
          channelType: currentCart.ChannelType.WEB,
        });

      const { redirectSession } =
        await wixClient.redirects.createRedirectSession({
          ecomCheckout: { checkoutId: checkout.checkoutId! },
          callbacks: {
            postFlowUrl: window.location.origin,
            thankYouPageUrl: `${window.location.origin}/success`,
          },
        });

      if (redirectSession?.fullUrl) {
        window.location.href = redirectSession.fullUrl;
      }
    } catch (err) {
      console.error("Checkout error:", err);
    }
  };

  const cartIsEmpty = !cart || !cart.lineItems || cart.lineItems.length === 0;

  // Calculate subtotal using useMemo to avoid recalculation on every render
  // unless 'cart' or 'cartIsEmpty' changes.
  const subtotalDisplay = useMemo(() => {
    console.log(cart.lineItems);
    if (cartIsEmpty || !cart.lineItems) {
      return "AED 0.00"; // Default if cart is empty or lineItems are missing
    }

    let calculatedSubtotal = 0;
    for (const item of cart.lineItems) {
      let itemTotalValue = 0;
      // Prioritize lineItem.totalPrice if available (Wix often calculates this)
      if (item.price?.amount) {
        itemTotalValue = parseFloat(item.price.amount);
        console.log(itemTotalValue);
      }
      // Fallback: Calculate from unit price and quantity
      else if (item.price?.amount && typeof item.quantity === "number") {
        itemTotalValue = parseFloat(item.price.amount) * item.quantity;
        console.log(itemTotalValue);
      }
      calculatedSubtotal += itemTotalValue;
    }

    // Use the cart's currency if available, otherwise default to USD ($)
    const currencySymbol =
      cart.currency === "EUR" ? "€" : cart.currency === "GBP" ? "£" : "AED";
    return `${currencySymbol}${calculatedSubtotal.toFixed(2)}`;
  }, [cart, cartIsEmpty]); // cart.lineItems could also be a dependency if cart object reference changes but lineItems doesn't

  return (
    <div className="w-max absolute p-4 rounded-md shadow-[0_3px_10px_rgb(0,0,0,0.2)] bg-white top-12 right-0 flex flex-col gap-6 z-20">
      {cartIsEmpty ? (
        <div className="p-4 text-center text-gray-500">Cart is Empty</div>
      ) : (
        <>
          <h2 className="text-xl font-semibold">Shopping Cart</h2>
          <div className="flex flex-col gap-8 max-h-96 overflow-y-auto pr-2">
            {cart.lineItems!.map(
              (
                item: currentCart.LineItem, // Explicitly type item
              ) => (
                <div className="flex gap-4" key={item._id}>
                  {item.image && (
                    <Image
                      src={wixMedia.getScaledToFillImageUrl(
                        item.image,
                        72,
                        96,
                        {},
                      )}
                      alt={item.productName?.original || "Product image"}
                      width={72}
                      height={96}
                      className="object-cover rounded-md"
                    />
                  )}
                  <div className="flex flex-col justify-between w-full">
                    <div>
                      <div className="flex items-center justify-between gap-8">
                        <h3 className="font-semibold text-sm">
                          {item.productName?.original}
                        </h3>
                        <div className="p-1 bg-gray-50 rounded-sm flex items-center gap-2 text-sm">
                          {item.quantity && item.quantity > 1 && (
                            <div className="text-xs text-green-500">
                              {item.quantity} x&nbsp;
                            </div>
                          )}
                          {/* Display unit price here. The total is part of the subtotal. */}
                          {item.price?.formattedAmount ||
                            `$${parseFloat(item.price?.amount || "0").toFixed(2)}`}
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-sm mt-1">
                      <span className="text-gray-500">
                        Qty. {item.quantity}
                      </span>
                      <button
                        className="text-blue-500 hover:text-blue-700 disabled:text-gray-400"
                        style={{
                          cursor: isLoading ? "not-allowed" : "pointer",
                        }}
                        onClick={() => removeItem(wixClient, item._id!)}
                        disabled={isLoading}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ),
            )}
          </div>
          <div className="border-t pt-4 mt-4">
            <div className="flex items-center justify-between font-semibold">
              <span className="">Subtotal</span>
              <span className="">{subtotalDisplay}</span>{" "}
              {/* Display calculated subtotal */}
            </div>
            <p className="text-gray-500 text-xs mt-2 mb-4">
              Shipping and taxes calculated at checkout.
            </p>
            <div className="flex justify-between text-sm">
              <button
                className="rounded-md py-2 px-4 bg-black text-white disabled:cursor-not-allowed disabled:opacity-75 hover:bg-gray-800"
                disabled={isLoading || cartIsEmpty}
                onClick={handleCheckout}
              >
                Checkout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CartModal;
