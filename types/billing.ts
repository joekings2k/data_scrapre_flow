export enum PackId {
  SMALL ="SMALL",
  MEDIUM="MEDIUM",
  LARGE="LARGE",
}

export type CreditsPack ={
id:PackId,
name:string,
label:string,
credits:number,
price:number,
priceId:string
}

export const CreditsPack: CreditsPack[] = [
  {
    id: PackId.SMALL,
    name: "Small Pack",
    label: "1000 Credits",
    credits: 1000,
    price: 999,
    priceId: process.env.STRIPE_SMALL_PACK_PRICE_ID!,
  },
  {
    id: PackId.MEDIUM,
    name: "Medium pack",
    label: "5000 Credits",
    credits: 5000,
    price: 3999,
    priceId: process.env.STRIPE_MEDIUM_PACK_PRICE_ID!,
  },
  {
    id: PackId.LARGE,
    name: "Large pack",
    label: "10000 Credits",
    credits: 10000,
    price: 6999,
    priceId: process.env.STRIPE_LARGE_PACK_PRICE_ID!,
  },
];

export const getCreditsPack =(id:PackId)=> CreditsPack.find((pack)=> pack.id === id)