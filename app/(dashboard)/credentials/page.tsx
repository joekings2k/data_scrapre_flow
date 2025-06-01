import React, { Suspense } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LockKeyholeIcon, ShieldIcon, ShieldOffIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { getCredentialsForUser } from "@/actions/credentials/getCredentialsForUser";
import { Card } from "@/components/ui/card";
import CreateCredentialsDialog from "./_components/CreateCredentialsDialog";
import { formatDistanceToNow } from "date-fns";
import DeleteCredentialDialogue from "./_components/DeleteCredentialDialogue";
export default function CredentialsPage() {
  return (
    <div className="flex flex-1  flex-col h-full">
      <div className="flex justify-between">
        <div className="flex flex-col ">
          <h1 className="text-3xl  font-bold">Credentials</h1>
          <p className="text-muted-foreground">Manage your credentials</p>
        </div>
        <CreateCredentialsDialog />
      </div>
      <div className="h-full py6 space-y-8">
        <Alert>
          <ShieldIcon className="h-4 w-4 stroke-primary" />
          <AlertTitle className="text-primary">Encryption</AlertTitle>
          <AlertDescription>
            Your credentials are encrypted at rest and in transit. We use
            256-bit AES encryption to encrypt your credentials.
          </AlertDescription>
        </Alert>
        <Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
          <UserCredentials />
        </Suspense>
      </div>
    </div>
  );
}

async function UserCredentials() {
  const credentials = await getCredentialsForUser();
  if (!credentials) {
    return <div>Something went wrong</div>;
  }
  if (credentials.length === 0) {
    return (
      <Card className="w-full p-4">
        <div className="flex flex-col gap-4  items-center justify-center ">
          <div className="rounded-full bg-accent w-20 h-20 flex items-center justify-center ">
            <ShieldOffIcon size={40} className="stroke-primary" />
          </div>
          <div className="flex flex-col gap-1 text-center">
            <p className="font-bold">No credentials created yet </p>
            <p className="text-muted-foreground text-sm">
              Click the button below to create your first credential
            </p>
          </div>
          <CreateCredentialsDialog triggerText="Create your first credential" />
        </div>
      </Card>
    );
  }
  return (
    <div className="flex gap-2 flex-wrap">
      {credentials.map((credential) => {
        const createdAt = formatDistanceToNow(credential.createdAt, {
          addSuffix: true,
        });
        return (
          <Card key={credential.id} className="w-full p-4 flex justify-between">
            <div className=" flex gap-2 items-center">
              <div className="rounded-full bg-primary/10 w-8 h-8 flex items-center justify-center">
                <LockKeyholeIcon size={18} className="stroke-primary" />
              </div>
              <div>
                <p className="font-bold">{credential.name}</p>
                <p className="text-xs text-muted-foreground">{createdAt}</p>
              </div>
            </div>
            <DeleteCredentialDialogue name={credential.name} />
          </Card>
        );
      })}
    </div>
  );
}
