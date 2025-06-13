import { getAvailableCredits } from "@/actions/billing/getAvailableCredits";
import ReactCountUpWrapper from "@/components/ReactCountUpWrapper";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeftRightIcon, CoinsIcon } from "lucide-react";
import React, { Suspense } from "react";
import CreditsPurchase from "./_components/CreditsPurchase";
import { Period } from "@/types/analytics";
import { getCreditUsageInPeriods } from "@/actions/analytics/getCreditsUsageInPeriods";
import CreditUsageChart from "./_components/CreditUsageChart";
import { getUserPurchaseHistory } from "@/actions/billing/getPurchaseHistory";
import InvoiceBtn from "./_components/InvoiceBtn";


function page() {
  return (
    <div className="mx-auto p-4 space-y-8">
      <h1
        className="text-3xl
      font-bold"
      >
        Billing
      </h1>
      <Suspense fallback={<Skeleton className="h-[166px] w-full" />}>
        <BalanceCard />
      </Suspense>
      <CreditsPurchase />
      <Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
        <CreditUsageCard />
      </Suspense>
      <Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
        <TransactionHistoryCard />
      </Suspense>
    </div>
  );
}

async function BalanceCard() {
  const userBalance = await getAvailableCredits();
  return (
    <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border-primary/20 shadow-lg flex justify-between flex-col overflow-hidden">
      <CardContent className="p-6 relative items-center">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-1">
              Available credits
            </h3>

            <p className="text-4xl font-bold text-primary">
              <ReactCountUpWrapper value={userBalance} />
            </p>
          </div>
          <CoinsIcon size={140} className="text-primary opacity-25 absolute bottom-0 right-0" />
        </div>
      </CardContent>
      <CardFooter className="text-muted-foreground text-sm">
        When your credits reach zero, you will not be able to use the platform.
      </CardFooter>
    </Card>
  );
}

async function CreditUsageCard(){
  const period:Period = {
    month:new Date().getMonth(),
    year:new Date().getFullYear()
  }
  const data = await getCreditUsageInPeriods(period);
  return (
    <CreditUsageChart
      data={data}
      title="Credits Consumed"
      desciption="Daily credits spent in a the current month"
    />
  );

}

async function TransactionHistoryCard() {
  const purchases = await getUserPurchaseHistory()
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <ArrowLeftRightIcon className="w-6 h-6 text-primary" />
          Transaction History
        </CardTitle>
        <CardDescription>
          View your Transaction history and download invoices
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {purchases.length === 0 && (
          <p className="text-muted-foreground"> No purchases yet</p>
        )}
        {purchases.map((purchase) => (
          <div key={purchase.id} className="flex justify-between items-center py-3 border-b last:border-b-0">
            <div>
              <p className="font-medium">{formatDate(purchase.date)}</p>
              <p className="text-sm text-muted-foreground">
                {purchase.desciption}
              </p>
            </div>
            <div className="text-right">
              <p className="font-medium">
                {
                  formatAmout(purchase.amount,purchase.currency)
                }
                <InvoiceBtn id = {purchase.id} />
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}
function formatAmout(amount: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount / 100);
}

export default page;
