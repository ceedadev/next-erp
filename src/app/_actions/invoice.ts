"use server";

export async function createInvoice(values: any) {
  console.log("invoice created");
  console.log(values);
}

export async function getPaymentTerms() {
  const data = [
    { value: "cod", name: "Cash On Delivery", day: 0 },
    { value: "cbd", name: "Cash Before Delivery", day: 0 },
    { value: "net7", name: "Net 7 Days", day: 7 },
    { value: "net14", name: "Net 14 Days", day: 14 },
    { value: "net30", name: "Net 30 Days", day: 30 },
  ];
  return data;
}

export async function getDeliveryMethods() {
  const data = [
    { value: "courier", name: "Courier" },
    { value: "pickup", name: "Pickup" },
  ];
  return data;
}
