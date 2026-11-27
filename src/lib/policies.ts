/* Policy pages. Razorpay account approval ke liye yeh pages zaruri hote hain.
   TODO(sir se confirm): neeche ka text DRAFT hai. Launch se pehle seller ko asli policy deni hogi. */
export interface Policy {
  slug: string;
  title: string;
  sections: { heading: string; body: string[] }[];
}

export const POLICIES: Policy[] = [
  {
    slug: "shipping",
    title: "Shipping policy",
    sections: [
      { heading: "Delivery area", body: ["Delivery areas and pincodes will be listed here."] },
      { heading: "Delivery time", body: ["Expected delivery time will be listed here."] },
      { heading: "Delivery charges", body: ["Delivery charges, if any, are shown at checkout before you pay."] },
    ],
  },
  {
    slug: "returns",
    title: "Returns & refunds",
    sections: [
      { heading: "Returns", body: ["Conditions for returning a product will be listed here."] },
      { heading: "Refunds", body: ["How and when refunds are paid will be listed here."] },
      { heading: "Damaged or wrong item", body: ["Contact us with your order number and a photo of the product."] },
    ],
  },
  {
    slug: "privacy",
    title: "Privacy policy",
    sections: [
      {
        heading: "What we collect",
        body: ["Your name, mobile number, email (optional) and delivery address, so that we can deliver your order."],
      },
      { heading: "Payments", body: ["Online payments are processed by the payment gateway. We do not store card details."] },
      { heading: "Contact", body: ["For any privacy question, reach us through the Contact page."] },
    ],
  },
  {
    slug: "terms",
    title: "Terms & conditions",
    sections: [
      { heading: "Orders", body: ["Placing an order is an offer to buy the products at the price shown at checkout."] },
      { heading: "Prices", body: ["Prices are in Indian Rupees and include all taxes."] },
      { heading: "Governing terms", body: ["Full terms will be listed here."] },
    ],
  },
];

export const getPolicy = (slug: string) => POLICIES.find((p) => p.slug === slug);
