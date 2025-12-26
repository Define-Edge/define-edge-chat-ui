# MoneyOne Integration Migration Guide

This document tracks the changes made to adapt MoneyOne holdings import from a database-backed system with user authentication to a localStorage-based implementation, and provides a roadmap for future DB/auth reintegration.

## Table of Contents
- [Current Implementation (localStorage)](#current-implementation-localstorage)
- [Changes from Original Implementation](#changes-from-original-implementation)
- [Future Migration: Reintegrating DB & Auth](#future-migration-reintegrating-db--auth)

---

## Current Implementation (localStorage)

### Overview
The MoneyOne integration now uses browser localStorage instead of a database to store consent information. User identification is based on a browser-unique UUID instead of authenticated user sessions.

### Key Components

#### 1. Storage Layer (`src/lib/moneyone/moneyone.storage.ts`)
**Purpose:** Client-side localStorage management for consents

**Key Functions:**
- `getUserId()` - Generates/retrieves browser-unique UUID
- `saveConsent(consent)` - Saves consent to localStorage
- `getUserConsent(consentType)` - Retrieves user's consent by type
- `updateConsent(consentID, updates)` - Updates existing consent
- `deleteConsent(consentID)` - Removes consent from localStorage
- `getAllUserConsents()` - Gets all consents for current browser user

**Storage Schema:**
```typescript
interface ConsentData {
  consentID: string;
  consentCreationData: string; // ISO date
  consentExpiry: string; // ISO date
  userId: string; // Browser UUID
  isDataReady: boolean;
  type: ConsentType;
  name: string | null;
  mobileNo: string;
}
```

**localStorage Keys:**
- `moneyone:userId` - Browser-unique user ID
- `moneyone:consent:{consentID}` - Individual consent data
- `moneyone:user:{userId}:consents` - Index of consent IDs for a user

#### 2. Server Actions (`src/lib/moneyone/moneyone.actions.ts`)
**Changes:**
- Added `accountID: string` parameter to `createConsentRequest()`
- Added `accountID: string` parameter to `getConsentList()`
- Removed database checks from `getAllFiData()`
- All functions remain server-side to protect `moneyOneAuthHeaders`

#### 3. UI Components (Shadcn/Tailwind)
**Converted from MUI to Shadcn:**
- `CreateConsentModel.tsx` - Dialog with Input/Label components
- `import-holdings.tsx` - Button with loading states
- `FiDataAnimation.tsx` - Custom wave animation with Tailwind
- `FetchingFiDataModal.tsx` - Dialog for data fetching

#### 4. Redirect Flow (`src/app/moneyone/[slug]/page.tsx`)
**Changes:**
- Removed database queries
- Passes `accountID` from decrypted URL to `getConsentList()`
- Redirects with consent data in URL search params instead of saving to DB

#### 5. Webhook Handler (`src/app/api/webhooks/moneyone/data-ready/route.ts`)
**Changes:**
- Simplified to logging only
- Cannot update localStorage from server-side
- Client marks `isDataReady: true` when actually fetching data

---

## Changes from Original Implementation

### Deleted Files
1. **`src/lib/moneyone/moneyone.data.ts`** - Database operations layer
   - Removed all Prisma DB queries
   - Functionality moved to `moneyone.storage.ts` (client-side)

### Modified Files

#### 1. `src/lib/moneyone/moneyone.storage.ts`
**Before:** Stub functions with TODO comments
**After:** Complete localStorage implementation
```diff
- export const checkConsent = async (consentType: ConsentType) => {
-   // Logic to check consent in localstorage
- };

+ export function checkConsent(consentType: ConsentType): boolean {
+   return getUserConsent(consentType) !== null;
+ }
```

#### 2. `src/lib/moneyone/moneyone.actions.ts`
**Changes:**
```diff
  export const createConsentRequest = async (
    mobileNo: string,
    consentType: ConsentType,
+   accountID: string // Browser-unique user ID
  )

  export const getConsentList = async (
    consentHandle: string,
    mobileNo: string,
    consentType: ConsentType,
+   accountID: string
  )

  export const getAllFiData = async (consentID: string, waitTime?: number) => {
-   // Database check for isDataReady
-   const consentFound = await db.consent.findUniqueOrThrow({
-     where: { consentID, userId: session.user.id },
-   });
-   if (!consentFound.isDataReady) {
-     throw new Error(MONEY_ONE_ERROR_CODES.DATA_NOT_READY);
-   }
+   // Removed - data ready check happens in useQuery retry logic
  }
```

#### 3. `src/components/moneyone/useCreateConsentAndRedirectMut.ts`
**Changes:**
```diff
+ import { saveConsent, getUserId } from "@/lib/moneyone/moneyone.storage";

  export function useCreateConsentAndRedirectMut() {
+   const userId = getUserId();

    const createConsentReqRes = await createConsentRequest(
      formValues.number,
      consentType,
+     userId
    );

+   // Save consent to localStorage
+   saveConsent({
+     consentID: "",
+     consentCreationData: new Date().toISOString(),
+     consentExpiry: new Date(Date.now() + 365*24*60*60*1000).toISOString(),
+     userId: userId,
+     isDataReady: false,
+     type: consentType,
+     name: formValues.number,
+     mobileNo: formValues.number,
+   });
  }
```

#### 4. `src/components/moneyone/FetchingFiDataModal.tsx`
**Changes:**
```diff
+ import { updateConsent, getUserConsent } from "@/lib/moneyone/moneyone.storage";

  useQuery({
    queryFn: async () => {
      const data = await getAllFiData(consentID, 3000);

+     // Update consent in localStorage
+     const consent = getUserConsent(consentType as ConsentType);
+     if (consent) {
+       updateConsent(consent.consentID, { isDataReady: true });
+     }

      console.log("Financial data fetched successfully:", data);
    }
  });
```

#### 5. `src/app/moneyone/[slug]/page.tsx`
**Changes:**
```diff
- import { handleDecryptedUrlData } from "@/lib/moneyone/moneyone.data";
+ import { getConsentList } from "@/lib/moneyone/moneyone.actions";

  const decryptedUrlData = await decryptUrl(validatedData.data);

  if (decryptedUrlData) {
    const mobileNo: string = decryptedUrlData.userid.split("@")[0];
    const consentHandle = decryptedUrlData.srcref;
+   const accountID = decryptedUrlData.accountID || "browser-user";

-   const consentID = await handleDecryptedUrlData(decryptedUrlData, consentType);
+   const consent = await getConsentList(consentHandle, mobileNo, consentType, accountID);
+   const consentID = consent.consentID;

    const redirectUrlParams = new URLSearchParams();
    redirectUrlParams.set("consentID", consentID);
    redirectUrlParams.set("consentType", consentType);
+   redirectUrlParams.set("mobileNo", mobileNo);
+   redirectUrlParams.set("consentCreationData", consent.consentCreationData);
  }
```

#### 6. `src/app/api/webhooks/moneyone/data-ready/route.ts`
**Changes:**
```diff
- import { deleteConsent, findUserConsent } from "@/data/money-one.data";
- import { db } from "@/lib/prisma";
- import { ConsentType } from "@prisma/client";
+ import { DataReadyWebHookReqBody } from "@/lib/moneyone/moneyone.types";
+ import { ConsentType } from "@/lib/moneyone/moneyone.enums";

  if (body?.eventStatus === "DATA_READY") {
-   await db.user.findUniqueOrThrow({ where: { id: body.accountID } });
-   const foundConsent = await findUserConsent(body.accountID, consentType, { mobileNo });
-   if (foundConsent && foundConsent.consentID !== body.consentId)
-     await deleteConsent(foundConsent.consentID);
-
-   await db.consent.upsert({
-     where: { consentID: body.consentId },
-     update: { isDataReady: true, consentExpiry: new Date(body.consentExpiry) },
-     create: { /* ... */ }
-   });

+   console.log("Data ready webhook received:", {
+     consentID: body.consentId,
+     consentType,
+     mobileNo,
+     accountID: body.accountID,
+   });
+   // Note: Cannot update localStorage from server-side
+   // Client will mark data as ready when fetching
  }
```

#### 7. `src/components/moneyone/processFiData.ts`
**Changes:**
```diff
- import { FilterResponse } from "@/lib/moneyone/moneyone.types";
+ import { FiDataResponse, Holding } from "@/lib/moneyone/moneyone.types";

- export async function processFiData(...): Promise<FilterResponse> {
+ export async function processFiData(...): Promise<{ holdings: Holding[]; rawData: FiDataResponse }> {
    const response = await getAllFiData(consentId, waitTime);

    const holdings = response
      .filter((a) => a.fiType === consentType)
      .flatMap((a) => a.Summary?.Investment.Holdings.Holding || []);

-   return await filterHoldings(holdings, consentType);
+   console.log("Processed holdings:", holdings);
+   return { holdings, rawData: response };
  }
```

---

## Future Migration: Reintegrating DB & Auth

When you're ready to add database and authentication support, follow this roadmap:

### Phase 1: Database Setup

#### 1. Add Prisma Schema
```prisma
// prisma/schema.prisma

model User {
  id        String    @id @default(cuid())
  email     String    @unique
  name      String?
  consents  Consent[]
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}

model Consent {
  consentID           String      @id
  consentCreationData DateTime    @default(now())
  consentExpiry       DateTime
  userId              String
  isDataReady         Boolean     @default(false)
  type                ConsentType
  name                String?
  mobileNo            String
  user                User        @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId, type])
  @@index([mobileNo, type])
}

enum ConsentType {
  EQUITIES
  MUTUAL_FUNDS
}
```

#### 2. Create Database Data Layer
**File:** `src/lib/moneyone/moneyone.data.ts` (restore)

```typescript
import { db } from "@/lib/prisma";
import { ConsentType } from "@prisma/client";

export async function getUserConsent(
  userId: string,
  consentType: ConsentType,
  filters?: { mobileNo?: string }
) {
  return await db.consent.findFirst({
    where: {
      userId,
      type: consentType,
      ...(filters?.mobileNo && { mobileNo: filters.mobileNo }),
      consentExpiry: { gt: new Date() },
    },
    orderBy: { consentCreationData: 'desc' },
  });
}

export async function saveConsent(data: {
  consentID: string;
  userId: string;
  type: ConsentType;
  mobileNo: string;
  name?: string;
  consentExpiry: Date;
  isDataReady: boolean;
}) {
  return await db.consent.create({ data });
}

export async function updateConsent(
  consentID: string,
  updates: Partial<{
    isDataReady: boolean;
    consentExpiry: Date;
  }>
) {
  return await db.consent.update({
    where: { consentID },
    data: updates,
  });
}

export async function deleteConsent(consentID: string) {
  return await db.consent.delete({
    where: { consentID },
  });
}

export async function findUserConsent(
  userId: string,
  consentType: ConsentType,
  filters?: { mobileNo?: string }
) {
  return await db.consent.findFirst({
    where: {
      userId,
      type: consentType,
      ...(filters?.mobileNo && { mobileNo: filters.mobileNo }),
    },
  });
}
```

### Phase 2: Authentication Integration

#### 1. Install Auth Library (NextAuth/Auth.js recommended)
```bash
pnpm add next-auth @auth/prisma-adapter
```

#### 2. Setup Auth Configuration
**File:** `src/lib/auth.ts`

```typescript
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/prisma";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    session({ session, user }) {
      session.user.id = user.id;
      return session;
    },
  },
});
```

#### 3. Add Auth Route Handler
**File:** `src/app/api/auth/[...nextauth]/route.ts`

```typescript
export { GET, POST } from "@/lib/auth";
```

#### 4. Create Session Helper
**File:** `src/lib/session.ts`

```typescript
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function getSession() {
  return await auth();
}

export async function requireAuth() {
  const session = await getSession();
  if (!session?.user) {
    redirect("/api/auth/signin");
  }
  return session;
}
```

### Phase 3: Update MoneyOne Actions

#### 1. Modify `src/lib/moneyone/moneyone.actions.ts`
```diff
+ import { requireAuth } from "@/lib/session";
+ import { getUserConsent } from "./moneyone.data";

  export const createConsentRequest = async (
    mobileNo: string,
    consentType: ConsentType,
-   accountID: string
  ) => {
+   const session = await requireAuth();
+
+   // Check if consent already exists in DB
+   const existingConsent = await getUserConsent(session.user.id, consentType, { mobileNo });
+   if (existingConsent) {
+     return { consentID: existingConsent.consentID };
+   }

    const body = JSON.stringify({
      partyIdentifierType: "MOBILE",
      partyIdentifierValue: mobileNo,
      productID: consentFormMap[consentType],
-     accountID: accountID,
+     accountID: session.user.id,
      vua: `${mobileNo}@onemoney`,
    });

    // ... rest of the function
  }

  export const getAllFiData = async (consentID: string, waitTime?: number) => {
+   const session = await requireAuth();
+
+   // Verify consent belongs to user and data is ready
+   const consent = await db.consent.findUniqueOrThrow({
+     where: { consentID, userId: session.user.id },
+   });
+
+   if (!consent.isDataReady) {
+     throw new Error(MONEY_ONE_ERROR_CODES.DATA_NOT_READY);
+   }

    // ... rest of the function
  }
```

#### 2. Update `src/components/moneyone/useCreateConsentAndRedirectMut.ts`
```diff
- import { saveConsent, getUserId } from "@/lib/moneyone/moneyone.storage";
+ import { useSession } from "next-auth/react";

  export function useCreateConsentAndRedirectMut() {
+   const { data: session } = useSession();
-   const userId = getUserId();

    const createConsentReqRes = await createConsentRequest(
      formValues.number,
      consentType,
-     userId
    );

-   // Save to localStorage
-   saveConsent({ /* ... */ });
+   // Consent is saved on server via createConsentRequest or after redirect
  }
```

#### 3. Update `src/app/moneyone/[slug]/page.tsx`
```diff
+ import { requireAuth } from "@/lib/session";
+ import { handleDecryptedUrlData } from "@/lib/moneyone/moneyone.data";

  export default async function page({ params, searchParams }: Props) {
+   const session = await requireAuth();

    // ... decryption logic

    if (decryptedUrlData) {
-     const accountID = decryptedUrlData.accountID || "browser-user";
-     const consent = await getConsentList(consentHandle, mobileNo, consentType, accountID);
-     const consentID = consent.consentID;

-     const redirectUrlParams = new URLSearchParams();
-     redirectUrlParams.set("consentID", consentID);
-     redirectUrlParams.set("consentType", consentType);
-     redirectUrlParams.set("mobileNo", mobileNo);
-     redirectUrlParams.set("consentCreationData", consent.consentCreationData);

+     const consentID = await handleDecryptedUrlData(
+       decryptedUrlData,
+       consentType,
+       session.user.id
+     );
+
+     const redirectUrlParams = new URLSearchParams();
+     redirectUrlParams.set("consentID", consentID);
+     redirectUrlParams.set("consentType", consentType);
      if (threadId) redirectUrlParams.set("threadId", threadId);
    }
  }
```

#### 4. Restore Database Logic in `moneyone.data.ts`
```typescript
export async function handleDecryptedUrlData(
  decryptedUrlData: any,
  consentType: ConsentType,
  userId: string
) {
  const mobileNo: string = decryptedUrlData.userid.split("@")[0];
  const consent = await getConsentList(
    decryptedUrlData.srcref,
    mobileNo,
    consentType,
    userId
  );

  if (consent) {
    const consentID = consent.consentID;
    const expires = new Date();
    expires.setFullYear(expires.getFullYear() + 1);

    // Ensure only one consent per user/type/mobile
    const foundConsent = await findUserConsent(userId, consentType, { mobileNo });
    if (foundConsent && foundConsent.consentID !== consentID) {
      await deleteConsent(foundConsent.consentID);
    }

    await db.consent.upsert({
      where: { consentID },
      update: {
        consentExpiry: expires,
        consentCreationData: new Date(consent.consentCreationData),
      },
      create: {
        mobileNo,
        consentID,
        name: mobileNo,
        consentCreationData: new Date(consent.consentCreationData),
        userId,
        consentExpiry: expires,
        type: consentType,
        isDataReady: false,
      },
    });

    return consentID;
  }

  throw new Error("Consent not found");
}
```

#### 5. Update Webhook Handler
```diff
+ import { db } from "@/lib/prisma";

  if (body?.eventStatus === "DATA_READY") {
+   await db.user.findUniqueOrThrow({
+     where: { id: body.accountID },
+   });

    const mobileNo = body.vua.split("@")[0];
    const consentType = productIdToConsentTypeMap[body.productID];

-   console.log("Data ready webhook received:", { /* ... */ });
+   const foundConsent = await findUserConsent(body.accountID, consentType, { mobileNo });
+   if (foundConsent && foundConsent.consentID !== body.consentId) {
+     await deleteConsent(foundConsent.consentID);
+   }
+
+   await db.consent.upsert({
+     where: { consentID: body.consentId },
+     update: {
+       isDataReady: true,
+       consentExpiry: new Date(body.consentExpiry),
+     },
+     create: {
+       mobileNo,
+       name: mobileNo,
+       type: consentType,
+       consentID: body.consentId,
+       consentExpiry: new Date(body.consentExpiry),
+       userId: body.accountID,
+       isDataReady: true,
+     },
+   });
  }
```

#### 6. Update `FetchingFiDataModal.tsx`
```diff
- import { updateConsent, getUserConsent } from "@/lib/moneyone/moneyone.storage";
+ import { useSession } from "next-auth/react";

  export default function FetchingFiDataModal() {
+   const { data: session } = useSession();

    useQuery({
      queryFn: async () => {
        const data = await getAllFiData(consentID, 3000);

-       // Update localStorage
-       const consent = getUserConsent(consentType as ConsentType);
-       if (consent) {
-         updateConsent(consent.consentID, { isDataReady: true });
-       }
+       // Database is updated by webhook or getAllFiData validation

        console.log("Financial data fetched successfully:", data);
      }
    });
  }
```

### Phase 4: UI/UX Updates

#### 1. Add Login/Logout UI
**File:** `src/components/auth/SignInButton.tsx`

```typescript
"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function SignInButton() {
  const { data: session } = useSession();

  if (session) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm">{session.user?.email}</span>
        <Button onClick={() => signOut()}>Sign Out</Button>
      </div>
    );
  }

  return <Button onClick={() => signIn()}>Sign In</Button>;
}
```

#### 2. Protect Import Holdings Routes
Add auth checks to components that use MoneyOne:

```typescript
// src/components/moneyone/import-holdings.tsx
import { useSession } from "next-auth/react";

export default function ImportHoldings({ ... }) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <Button disabled>Loading...</Button>;
  }

  if (!session) {
    return (
      <Button onClick={() => signIn()}>
        Sign in to Import Holdings
      </Button>
    );
  }

  // ... rest of component
}
```

### Phase 5: Migration Strategy

#### Option A: Keep Both Systems (Recommended for Gradual Migration)
1. Keep localStorage implementation for non-authenticated users
2. Use database for authenticated users
3. Provide migration path for localStorage consents to DB

```typescript
// src/lib/moneyone/moneyone.hybrid.ts
export async function getConsent(consentType: ConsentType) {
  const session = await getSession();

  if (session?.user) {
    // Use database
    return await getUserConsent(session.user.id, consentType);
  } else {
    // Use localStorage
    return getUserConsentFromLocalStorage(consentType);
  }
}

export async function migrateLocalStorageToDb(userId: string) {
  const localConsents = getAllUserConsentsFromLocalStorage();

  for (const consent of localConsents) {
    await db.consent.create({
      data: {
        ...consent,
        userId,
      },
    });
  }

  // Clear localStorage after migration
  clearLocalStorageConsents();
}
```

#### Option B: Full Migration (Database Only)
1. Remove `moneyone.storage.ts`
2. Require authentication for all MoneyOne features
3. Show auth prompt for unauthenticated users

### Environment Variables to Add

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# OAuth Providers
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

---

## Testing Checklist

### When Migrating to DB + Auth

- [ ] Database schema created and migrated
- [ ] Auth routes working (sign in/out)
- [ ] Consent creation saves to database
- [ ] Consent retrieval from database
- [ ] Webhook updates database correctly
- [ ] Data fetching validates user ownership
- [ ] Multi-user support tested
- [ ] Consent expiry handled correctly
- [ ] Previous localStorage data can be migrated (if using hybrid approach)
- [ ] UI shows auth state correctly
- [ ] Protected routes redirect to login
- [ ] Session persistence works
- [ ] Logout clears session properly

---

## Key Differences Summary

| Aspect | Current (localStorage) | Future (DB + Auth) |
|--------|------------------------|-------------------|
| User ID | Browser UUID | Authenticated User ID |
| Storage | localStorage | PostgreSQL/Database |
| Consent Persistence | Browser-specific | Cross-device |
| Multi-device | No | Yes |
| User Isolation | Browser-based | Account-based |
| Security | Client-side only | Server-validated |
| Data Loss Risk | Browser clear/reset | Minimal (backups) |
| Webhook Updates | Logging only | Direct DB updates |
| Session Management | Not required | NextAuth/Auth.js |

---

## Notes

1. **Security:** The current localStorage implementation stores sensitive consent data in the browser. With DB+Auth, this data will be properly secured server-side.

2. **Multi-device:** Users currently can only access their consents from the same browser. With authentication, they can access from any device.

3. **Data Integrity:** Database constraints and transactions will ensure data integrity that localStorage cannot guarantee.

4. **Scalability:** Database solution scales better for multiple users and large datasets.

5. **Audit Trail:** Database can track consent history, changes, and access patterns for compliance.

---

## Questions? Issues?

When implementing DB+Auth integration, refer to:
- Original implementation in the source repository you copied from
- NextAuth documentation: https://authjs.dev
- Prisma documentation: https://www.prisma.io/docs
- This migration guide

Last Updated: December 24, 2025
