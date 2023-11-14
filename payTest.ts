// let url = `https://api.stripe.com/v1/checkout/sessions/cs_test_a16vj6ihkrMuceGXqBZhtxOJ3diaFAz5kddgtPbX94xWYj0F9PqzHqkmX7/line_items`;

import axios from "axios";

export async function getStripeData(cs_id: string) {
  //   const key = `sk_test_51M3GvwI11DBOYm9qoCxuY0tNzOvzyd5E6oddM0Xx8ebV0RHIkyiLxQJpGnOV4OOzXIrEmBFf5AObp6SZOPSnPSe1006bX3w2Zn:`;
  const key = `${process.env.STRIPE_PRIVATE_KEY}`;
  let url = `https://api.stripe.com/v1/checkout/sessions/${cs_id}/line_items`;

  let resStripe = await axios.get(url, {
    headers: {
      Authorization: "Basic " + Buffer.from(key).toString("base64"),
    },
  });

  console.log(resStripe.data.data);

  return resStripe.data.data;
}

// getStripeData(
//   "cs_test_a16vj6ihkrMuceGXqBZhtxOJ3diaFAz5kddgtPbX94xWYj0F9PqzHqkmX7"
// );

// getStripeData("ch_3M4dKrI11DBOYm9q0oacIYZR");
