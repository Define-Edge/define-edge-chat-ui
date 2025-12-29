# Import Equity and Mutual Funds Holdings - Technical Documentation

## Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Complete User Flow](#complete-user-flow)
4. [Technical Implementation](#technical-implementation)
5. [Data Models](#data-models)
6. [Storage Strategy](#storage-strategy)
7. [API Integration](#api-integration)
8. [Code References](#code-references)
9. [Configuration](#configuration)
10. [Error Handling](#error-handling)
11. [Security Considerations](#security-considerations)

---

## Overview

The import holdings feature enables users to securely import their Equity and Mutual Fund holdings data from their depository accounts through India's RBI-approved Account Aggregator (AA) framework, powered by MoneyOne.

### Key Features
- **RBI-Approved**: Uses Account Aggregator framework for secure data access
- **Bank-Level Security**: 256-bit encryption and read-only access
- **No Credential Storage**: Never stores user login credentials
- **Automatic Analysis**: Imported data is automatically sent to AI for portfolio analysis
- **Persistent Consent**: Stores consent data in browser localStorage for reuse

### Supported Asset Types
- **Equities (EQSUMMARY)**: Stock holdings with ISIN, units, last traded price
- **Mutual Funds (WM101)**: MF holdings with scheme details, NAV, folio numbers

---

## Architecture

### Component Hierarchy

```
Thread (Main Chat UI)
├─ FetchingFiDataModal (handles OAuth callback data)
├─ ImportDataPage (Import view)
│   ├─ ConnectAccounts
│   │   └─ ImportMethod (Equity/MF cards)
│   │       └─ ImportHoldings (Connect button)
│   │           ├─ useCheckConsentMut (check existing consent)
│   │           └─ CreateConsentModel (new consent form)
│   │               └─ useCreateConsentAndRedirectMut
│   └─ FetchingFiDataModal (reused for data fetching)
└─ ThreadHistory
    └─ Import Button (opens ImportDataPage)
```

### State Management Flow

```
URL Query State (nuqs)
├─ importViewOpen: boolean (toggles import view)
├─ threadId: string | null (current thread)
├─ consentID: string (after OAuth redirect)
├─ consentType: ConsentType (EQUITIES | MUTUAL_FUNDS)
└─ mobileNo: string (user identifier)

localStorage (moneyone.storage.ts)
├─ moneyone:userId (browser-unique user ID)
├─ moneyone:consent:{consentID} (consent data)
├─ moneyone:user:{userId}:consents (user's consent index)
└─ moneyone:pending-consent:{consentHandle} (temporary during OAuth)
```

---

## Complete User Flow

### Phase 1: Initiate Import

**Location**: Import Data Page → Connect Accounts section

1. User clicks "Import" from ThreadHistory sidebar
2. `importViewOpen` query param set to `true`
3. `ImportDataPage` renders with account connection cards
4. `useMoneyOneStatus` hook checks localStorage for existing consents
5. Cards show "Connect" button if no valid consent exists

**Code**: `src/components/thread/history/index.tsx:155-160`

### Phase 2: Consent Creation

**Location**: Connect button → Create Consent Modal

1. User clicks "Connect" on Equity or MF card
2. `ImportHoldings` component executes `useCheckConsentMut`
3. If no valid consent exists, `CreateConsentModel` opens
4. User enters:
   - Mobile number (10 digits)
   - PAN number (10 alphanumeric chars)

**Code**: `src/components/moneyone/import-holdings.tsx:24-42`

### Phase 3: Consent Request & Redirect

**Location**: Create Consent Modal → MoneyOne OAuth

**Flow**:
```
useCreateConsentAndRedirectMut.mutate()
  ↓
createConsentRequest(mobileNo, consentType, userId)
  → POST /v2/requestconsent
  ← { status: "success", data: { consent_handle } }
  ↓
Save pending consent to localStorage
  key: moneyone:pending-consent:{consentHandle}
  value: { consentHandle, mobileNo, consentType, userId, ... }
  ↓
getEncryptedUrl(consentHandle, redirectUrl, pan, consentType)
  → POST /webRedirection/getEncryptedUrl
  ← { status: "success", data: { webRedirectionUrl } }
  ↓
redirect(webRedirectionUrl) → User taken to MoneyOne OAuth page
```

**Redirect URL Format**:
```
https://yourdomain.com/moneyone/{consentType}~{userId}~{threadId}
Example: https://app.com/moneyone/EQUITIES~abc123~thread-xyz
```

**Code**: `src/components/moneyone/useCreateConsentAndRedirectMut.ts:20-82`

### Phase 4: OAuth & Return

**Location**: MoneyOne OAuth → Redirect Handler

1. User authenticates at their depository/broker
2. User grants consent for data access
3. MoneyOne redirects back with encrypted params:
   ```
   ?ecreq=...&fi=...&resdate=...
   ```

**Code**: MoneyOne → `src/app/moneyone/[slug]/page.tsx`

### Phase 5: Consent Verification

**Location**: Redirect Handler Page

**Flow**:
```
Receive encrypted params from MoneyOne
  ↓
Parse slug: {consentType}~{accountID}~{threadId}
  ↓
decryptUrl(searchParams)
  → POST /webRedirection/decryptUrl
  ← { status: "S", userid, srcref }
  ↓
Extract mobileNo from userid (split '@')
Extract consentHandle from srcref
  ↓
getConsentList(consentHandle, mobileNo, consentType, accountID)
  → POST /v2/getconsentslist
  ← { status: "success", data: [{ consentID, ... }] }
  ↓
Find consent matching consentHandle
Extract consentID
  ↓
redirect(/?consentID={id}&consentType={type}&mobileNo={no}&...)
```

**Code**: `src/app/moneyone/[slug]/page.tsx:12-79`

### Phase 6: Data Fetching

**Location**: Main App with FetchingFiDataModal

**Flow**:
```
FetchingFiDataModal detects consentID in URL params
  ↓
useQuery triggered with consentID
  ↓
completePendingConsent(consentID, consentType, mobileNo)
  - Find pending consent in localStorage
  - Save full consent with real consentID
  - Remove pending consent entry
  ↓
getAllFiData(consentID, waitTime: 3000ms)
  → POST /getallfidata
  ← { status: "success", data: FiDataResponse }
  ↓
handleImportHoldings(data, consentType)
  - Extract holdings from accounts
  - Format based on consentType
  - Convert to markdown table
  - Create AI message with data
  - Submit to stream for analysis
  ↓
updateConsent(consentID, { isDataReady: true })
  ↓
Remove URL params (consentID, consentType, mobileNo)
Close modal after 1.5s
```

**Code**: `src/components/moneyone/FetchingFiDataModal.tsx:12-96`

### Phase 7: AI Analysis

**Location**: Thread Component

**Flow**:
```
handleImportHoldings(data: FiDataResponse, consentType: ConsentType)
  ↓
Extract all holdings from all accounts:
  data.forEach(account => {
    holdings.push(...account.Summary.Investment.Holdings.Holding)
  })
  ↓
Format holdings based on consentType:

  EQUITIES:
    - Issuer
    - ISIN
    - Description
    - Units
    - Last Traded Price

  MUTUAL_FUNDS:
    - Scheme
    - AMC
    - Folio No
    - Closing Units
    - NAV
    - NAV Date
  ↓
convertToMarkdownTable(formattedHoldings)
  ↓
Create message:
  "I've imported my {assetType} holdings. Here's the data:

  {markdownTable}

  Please analyze my portfolio and provide insights."
  ↓
stream.submit({ messages: [...toolMessages, newHumanMessage] })
  - Uses existing threadId or creates new thread
  - AI receives holdings data
  - AI analyzes and responds with insights
```

**Code**: `src/components/thread/index.tsx:286-360`

---

## Technical Implementation

### 1. Import Button Integration

**Location**: `src/components/thread/history/index.tsx:151-164`

```tsx
<Button
  variant="outline"
  className="w-full justify-start gap-2"
  onClick={() => {
    setQuery({
      importViewOpen: true,
      threadId: null,
    });
  }}
>
  <Database className="h-4 w-4" />
  Import
</Button>
```

**Behavior**:
- Opens import view
- Clears active thread
- Maintains other query params

### 2. Import Data Page

**Location**: `src/modules/import-data/components/ImportDataPage.tsx`

**Hooks Used**:
```tsx
const {
  equityConsent,
  mfConsent,
  refresh: refreshMoneyOneStatus,
} = useMoneyOneStatus();
```

**Key Features**:
- Checks localStorage for existing consents
- Shows "Connect" button if no consent
- Shows consent status if data is ready
- Handles refresh of consent status

### 3. Consent Status Hook

**Location**: `src/modules/import-data/hooks/useMoneyOneStatus.ts`

```tsx
export function useMoneyOneStatus(): MoneyOneStatus {
  const [equityConsent, setEquityConsent] = useState<ConsentData | null>(null);
  const [mfConsent, setMfConsent] = useState<ConsentData | null>(null);

  const checkConsents = () => {
    const equity = getUserConsent(ConsentType.EQUITIES);
    const mf = getUserConsent(ConsentType.MUTUAL_FUNDS);

    // Only consider as connected if data is ready
    setEquityConsent(equity?.isDataReady ? equity : null);
    setMfConsent(mf?.isDataReady ? mf : null);
  };

  // Listen for storage changes
  useEffect(() => {
    checkConsents();
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return {
    equityConsent,
    mfConsent,
    isEquityConnected: equityConsent !== null,
    isMfConnected: mfConsent !== null,
    refresh: checkConsents,
  };
}
```

### 4. Import Holdings Component

**Location**: `src/components/moneyone/import-holdings.tsx`

```tsx
export default function ImportHoldings({ consentType, handlePfAction }: Props) {
  const [showCreateConsentModal, setShowCreateConsentModal] = useState(false);
  const checkConsentMut = useCheckConsentMut(consentType);

  const handleImportClick = () => {
    checkConsentMut.mutate(undefined, {
      onSettled: (data, error) => {
        if (data) {
          // Existing consent found with data
          setShowCreateConsentModal(false);
          handlePfAction(data, consentType);
        } else if (!error) {
          // No consent, show modal
          setShowCreateConsentModal(true);
        }
      },
      onError: (error: any) => {
        toast.error("Failed to check consent");
      },
    });
  };

  return (
    <Button onClick={handleImportClick} disabled={checkConsentMut.isPending}>
      {checkConsentMut.isPending ? <Loader2 /> : "Connect"}
    </Button>
  );
}
```

### 5. Data Fetching Modal

**Location**: `src/components/moneyone/FetchingFiDataModal.tsx`

**Features**:
- Triggered by `consentID` in URL params
- Uses React Query for automatic retry (every 3s)
- Shows loading animation during fetch
- Completes pending consent
- Marks consent as data ready
- Cleans up URL params
- Auto-closes after success

**Query Configuration**:
```tsx
const { isLoading, data } = useQuery({
  queryKey: ["fi-data", consentID],
  queryFn: async () => {
    // ... fetch logic
  },
  enabled: !!consentID && !!consentType,
  retry: true,
  retryDelay: 3000,
  refetchOnWindowFocus: false,
});
```

---

## Data Models

### ConsentData (localStorage)

```typescript
interface ConsentData {
  consentID: string;           // Real consent ID from MoneyOne
  consentCreationData: string; // ISO date string
  consentExpiry: string;       // ISO date string
  userId: string;              // Browser-unique user ID
  isDataReady: boolean;        // Whether data has been fetched
  type: ConsentType;           // EQUITIES | MUTUAL_FUNDS
  name: string | null;         // User identifier (mobile)
  mobileNo: string;            // User's mobile number
}
```

### FiDataResponse

```typescript
type FiDataResponse = AccountType[];

type AccountType = {
  linkReferenceNumber: string;
  maskedAccountNumber: string;
  fiType: string;
  bank: string;
  Summary?: {
    costValue: string;
    currentValue: string;
    Investment: {
      Holdings: {
        Holding: Holding[];
      };
    };
  };
};
```

### Holding (Unified for Equity & MF)

```typescript
type Holding = {
  // Mutual Fund fields
  amc: string;              // Asset Management Company
  nav: string;              // Net Asset Value
  folioNo: string;          // Folio number
  navDate: string;          // NAV date
  amfiCode: string;         // AMFI code
  schemeTypes: string;      // Scheme type
  closingUnits: string;     // Closing units
  schemeOption: string;     // Scheme option
  schemeCategory: string;   // Scheme category

  // Equity fields
  units: string;            // Number of units
  issuerName: string;       // Company name
  isin: string;             // ISIN code
  isinDescription: string;  // Description
  lastTradedPrice: string;  // Last traded price

  // Common fields
  ucc: string;
  lienUnits: string;
  registrar: string;
  schemeCode: string;
  FatcaStatus: string;
  lockinUnits: string;
};
```

---

## Storage Strategy

### localStorage Keys

```typescript
// User identification
"moneyone:userId" → uuidv4()

// Consent storage
"moneyone:consent:{consentID}" → ConsentData

// User's consent index
"moneyone:user:{userId}:consents" → string[] (consent IDs)

// Temporary during OAuth flow
"moneyone:pending-consent:{consentHandle}" → PendingConsentData
```

### Storage Functions

**Location**: `src/lib/moneyone/moneyone.storage.ts`

```typescript
// Core functions
getUserId(): string
saveConsent(consent: ConsentData): void
getConsent(consentID: string): ConsentData | null
getUserConsent(consentType: ConsentType): ConsentData | null
updateConsent(consentID: string, updates: Partial<ConsentData>): void
deleteConsent(consentID: string): void
getAllUserConsents(): ConsentData[]
checkConsent(consentType: ConsentType): boolean
completePendingConsent(...): ConsentData | null
```

### Consent Lifecycle

```
1. User initiates → savePendingConsent(consentHandle)
2. OAuth redirect → completePendingConsent(consentID)
3. Data fetched → updateConsent({ isDataReady: true })
4. User revokes → deleteConsent(consentID)
```

---

## API Integration

### MoneyOne Base Configuration

**Location**: `src/lib/moneyone/moneyone.actions.ts`

**Environment Variables**:
```bash
MONEY_ONE_BASE_URL=https://api.moneyone.in
MONEY_ONE_CLIENT_ID=your_client_id
MONEY_ONE_CLIENT_SECRET=your_client_secret
MONEY_ONE_EQUITIES_CONSENT_FORM=EQSUMMARY
MONEY_ONE_MUTUAL_FUNDS_CONSENT_FORM=WM101
MONEY_ONE_EQUITIES_FIPS=FIP1,FIP2,FIP3
MONEY_ONE_MUTUAL_FUNDS_FIPS=FIP4,FIP5,FIP6
```

### API Endpoints

#### 1. Create Consent Request

```typescript
POST /v2/requestconsent

Request:
{
  "partyIdentifierType": "MOBILE",
  "partyIdentifierValue": "9876543210",
  "productID": "EQSUMMARY" | "WM101",
  "accountID": "uuid-v4",
  "vua": "9876543210@onemoney"
}

Response:
{
  "status": "success",
  "ver": "1.0",
  "data": {
    "status": "PENDING",
    "consent_handle": "consent-handle-123"
  }
}
```

**Code**: `src/lib/moneyone/moneyone.actions.ts:29-73`

#### 2. Get Encrypted URL

```typescript
POST /webRedirection/getEncryptedUrl

Request:
{
  "consentHandle": "consent-handle-123",
  "redirectUrl": "https://app.com/moneyone/EQUITIES~userId",
  "fipID": ["FIP1", "FIP2"],
  "pan": "ABCDE1234F"
}

Response:
{
  "status": "success",
  "data": {
    "webRedirectionUrl": "https://moneyone.in/auth?encrypted=..."
  }
}

→ Automatically redirects to webRedirectionUrl
```

**Code**: `src/lib/moneyone/moneyone.actions.ts:75-111`

#### 3. Decrypt URL

```typescript
POST /webRedirection/decryptUrl

Request:
{
  "webRedirectionURL": {
    "ecreq": "...",
    "fi": "...",
    "resdate": "..."
  }
}

Response:
{
  "status": "success",
  "data": {
    "status": "S",
    "userid": "9876543210@onemoney",
    "srcref": "consent-handle-123"
  }
}
```

**Code**: `src/lib/moneyone/moneyone.actions.ts:151-181`

#### 4. Get Consent List

```typescript
POST /v2/getconsentslist

Request:
{
  "partyIdentifierType": "MOBILE",
  "partyIdentifierValue": "9876543210",
  "productID": "EQSUMMARY",
  "accountID": "uuid-v4"
}

Response:
{
  "status": "success",
  "data": [
    {
      "consentID": "consent-id-456",
      "consentHandle": "consent-handle-123",
      "status": "ACTIVE",
      "productID": "EQSUMMARY",
      "accountID": "uuid-v4",
      "aaId": "AA-ID",
      "vua": "9876543210@onemoney",
      "consentCreationData": "2024-01-01T00:00:00Z"
    }
  ]
}
```

**Code**: `src/lib/moneyone/moneyone.actions.ts:113-149`

#### 5. Get All FI Data

```typescript
POST /getallfidata

Request:
{
  "consentID": "consent-id-456"
}

Response:
{
  "status": "success",
  "data": [
    {
      "linkReferenceNumber": "LRN123",
      "maskedAccountNumber": "XXXX1234",
      "fiType": "EQUITIES",
      "bank": "NSDL",
      "Summary": {
        "costValue": "100000",
        "currentValue": "120000",
        "Investment": {
          "Holdings": {
            "Holding": [
              {
                "issuerName": "TCS",
                "isin": "INE467B01029",
                "units": "10",
                "lastTradedPrice": "3500"
              }
            ]
          }
        }
      }
    }
  ]
}

Error (data not ready):
{
  "errorCode": "NoDataFound",
  "errorMsg": "Data not ready!"
}
```

**Code**: `src/lib/moneyone/moneyone.actions.ts:183-227`

### Webhook Handler

**Location**: `src/app/api/webhooks/moneyone/data-ready/route.ts`

**Purpose**: Receives DATA_READY event from MoneyOne (currently for logging only)

```typescript
POST /api/webhooks/moneyone/data-ready

Request:
{
  "timestamp": "2024-01-01T00:00:00Z",
  "consentHandle": "consent-handle-123",
  "eventType": "DATA_READY",
  "eventStatus": "DATA_READY",
  "consentId": "consent-id-456",
  "vua": "9876543210@onemoney",
  "productID": "EQSUMMARY",
  "accountID": "uuid-v4",
  "fetchType": "FIRST_TIME",
  "consentExpiry": "2025-01-01T00:00:00Z",
  "dataExpiry": "2025-01-01T00:00:00Z",
  "sessionId": "session-123",
  "firstTimeFetch": true,
  "linkRefNumbers": [...]
}
```

**Note**: Client-side polling via React Query handles data readiness; webhook is for monitoring.

---

## Code References

### Key Files & Line Numbers

| Component | File Path | Key Lines |
|-----------|-----------|-----------|
| **Import Button** | `src/components/thread/history/index.tsx` | 151-164 |
| **Import Data Page** | `src/modules/import-data/components/ImportDataPage.tsx` | 33-255 |
| **Connect Accounts** | `src/modules/import-data/components/ConnectAccounts.tsx` | 16-58 |
| **Import Holdings** | `src/components/moneyone/import-holdings.tsx` | 17-72 |
| **Create Consent Modal** | `src/components/moneyone/CreateConsentModel.tsx` | 21-90 |
| **Consent Mutation** | `src/components/moneyone/useCreateConsentAndRedirectMut.ts` | 16-82 |
| **OAuth Redirect Handler** | `src/app/moneyone/[slug]/page.tsx` | 12-79 |
| **Data Fetching Modal** | `src/components/moneyone/FetchingFiDataModal.tsx` | 12-96 |
| **Thread Import Handler** | `src/components/thread/index.tsx` | 286-360 |
| **Storage Functions** | `src/lib/moneyone/moneyone.storage.ts` | 1-225 |
| **API Actions** | `src/lib/moneyone/moneyone.actions.ts` | 1-228 |
| **MoneyOne Status Hook** | `src/modules/import-data/hooks/useMoneyOneStatus.ts` | 18-52 |
| **Data Ready Webhook** | `src/app/api/webhooks/moneyone/data-ready/route.ts` | 10-45 |
| **Markdown Converter** | `src/lib/convertToMarkdownTable.ts` | 1-17 |

### Function Call Chain

```
User clicks "Connect"
  → ImportHoldings.handleImportClick()
    → useCheckConsentMut.mutate()
      → checkExistingConsent()
        → NO CONSENT FOUND
          → CreateConsentModel opens
            → useCreateConsentAndRedirectMut.mutate()
              → createConsentRequest()
                → savePendingConsent()
                  → getEncryptedUrl()
                    → redirect(moneyOneUrl)
                      → [User at MoneyOne OAuth]
                        → MoneyOne redirects back
                          → /moneyone/[slug]/page.tsx
                            → decryptUrl()
                              → getConsentList()
                                → redirect(/?consentID=...)
                                  → FetchingFiDataModal.useQuery
                                    → completePendingConsent()
                                      → getAllFiData()
                                        → handleImportHoldings()
                                          → extractHoldings()
                                            → convertToMarkdownTable()
                                              → stream.submit()
                                                → [AI analyzes data]
```

---

## Configuration

### Environment Variables

**Required for MoneyOne Integration**:

```bash
# MoneyOne API Configuration
MONEY_ONE_BASE_URL=https://api.moneyone.in
MONEY_ONE_CLIENT_ID=your_client_id_here
MONEY_ONE_CLIENT_SECRET=your_client_secret_here

# Consent Form IDs (Product IDs)
MONEY_ONE_EQUITIES_CONSENT_FORM=EQSUMMARY
MONEY_ONE_MUTUAL_FUNDS_CONSENT_FORM=WM101

# Financial Information Provider IDs (comma-separated)
MONEY_ONE_EQUITIES_FIPS=NSDL-FIP,CDSL-FIP
MONEY_ONE_MUTUAL_FUNDS_FIPS=CAMS-FIP,KARVY-FIP
```

### MoneyOne Headers

**Location**: `src/lib/moneyone/moneyone.headers.ts`

```typescript
export const moneyOneAuthHeaders = {
  "client-id": process.env.MONEY_ONE_CLIENT_ID!,
  "client-secret": process.env.MONEY_ONE_CLIENT_SECRET!,
};
```

### Consent Type Mapping

**Location**: `src/lib/moneyone/moneyone.enums.ts`

```typescript
export enum ConsentType {
  MUTUAL_FUNDS = 'MUTUAL_FUNDS',
  EQUITIES = 'EQUITIES'
}
```

**Product ID Mapping** (`src/app/api/webhooks/moneyone/data-ready/route.ts:5-8`):

```typescript
const productIdToConsentTypeMap: { [productId: string]: ConsentType } = {
  EQSUMMARY: ConsentType.EQUITIES,
  WM101: ConsentType.MUTUAL_FUNDS,
};
```

---

## Error Handling

### Error Types & Recovery

#### 1. Consent Creation Errors

**Location**: `src/components/moneyone/useCreateConsentAndRedirectMut.ts:31-32`

```typescript
if ("error" in createConsentReqRes) throw createConsentReqRes;
```

**Common Errors**:
- `503 Service Temporarily Unavailable`: MoneyOne API down
- Invalid mobile/PAN format
- Network timeout

**User Experience**: Toast error shown, modal remains open for retry

#### 2. Data Not Ready Error

**Location**: `src/lib/moneyone/moneyone.actions.ts:209`

```typescript
if (response?.errorCode === "NoDataFound") throw response;
```

**Recovery**: React Query automatically retries every 3 seconds

**User Experience**: Loading modal shows "Fetching data..." animation

#### 3. No Holdings Found

**Location**: `src/components/thread/index.tsx:299-302`

```typescript
if (allHoldings.length === 0) {
  console.warn("No holdings found in the imported data");
  return;
}
```

**User Experience**: Warning logged, no message sent to AI

#### 4. Consent Not Found

**Location**: `src/app/moneyone/[slug]/page.tsx:56`

```typescript
if (!consent) return <div>Consent not found</div>;
```

**Recovery**: User must create new consent

#### 5. Storage Errors

**Location**: `src/lib/moneyone/moneyone.storage.ts`

```typescript
try {
  return JSON.parse(consentData) as ConsentData;
} catch {
  return null;
}
```

**Recovery**: Graceful fallback to null, treated as no consent

### Error Monitoring

All MoneyOne API errors are logged:
```typescript
console.error("---Error occurred while ...", error);
```

Production recommendation: Integrate with Sentry/LogRocket for error tracking

---

## Security Considerations

### 1. No Credential Storage

- Application **never** stores user login credentials
- Uses OAuth-based Account Aggregator framework
- MoneyOne handles all authentication

### 2. Client-Side Encryption

- All sensitive data transmitted via HTTPS
- MoneyOne uses bank-level 256-bit encryption
- Encrypted URL parameters for OAuth callback

### 3. Read-Only Access

- Consents only grant read permissions
- Cannot initiate transactions
- Cannot modify account data

### 4. Consent Expiry

- Consents have defined expiry (default: 1 year)
- Expired consents automatically invalidated
- User must re-authorize after expiry

### 5. Browser-Only Storage

- localStorage used for consent data (client-side only)
- Data tied to specific browser/device
- No server-side storage of financial data in current implementation

### 6. User Control

- Users can revoke consent anytime (via `deleteConsent`)
- Clear consent status shown in UI
- Transparent data usage messaging

### 7. API Security

**Server-Side Actions**:
```typescript
"use server"; // Ensures MoneyOne credentials only used server-side
```

**Headers Protection**:
```typescript
export const moneyOneAuthHeaders = {
  "client-id": process.env.MONEY_ONE_CLIENT_ID!, // Server-only env var
  "client-secret": process.env.MONEY_ONE_CLIENT_SECRET!, // Server-only
};
```

**Never Exposed to Client**:
- MoneyOne client ID and secret
- PAN numbers (only used during redirect)
- Full consent handles

### 8. Data Minimization

- Only holdings data is fetched
- No transaction history stored
- No account numbers stored (only masked)
- Holdings converted to markdown immediately, raw data not persisted

### 9. Secure Redirects

**URL Pattern Validation** (`src/app/moneyone/[slug]/page.tsx:21`):
```typescript
if (!Object.values(ConsentType).includes(slugParts[0] as ConsentType))
  return <div>Invalid slug</div>;
```

**Schema Validation**:
```typescript
const validatedData = webRedirectionDecryptionApiReqParamsSchema.safeParse(searchParamsData);
if (!validatedData.success) {
  return <div>Invalid search params</div>;
}
```

### 10. Best Practices for Production

**Recommended Enhancements**:

1. **Move to Database Storage**:
   ```typescript
   // Replace localStorage with secure server-side storage
   // Encrypt consent data at rest
   // Associate with authenticated user accounts
   ```

2. **Add Rate Limiting**:
   ```typescript
   // Limit consent creation attempts per user
   // Prevent API abuse
   ```

3. **Implement Consent Revocation API**:
   ```typescript
   // POST /api/consent/revoke
   // Properly clean up MoneyOne side as well
   ```

4. **Add Webhook Signature Verification**:
   ```typescript
   // Verify webhook requests actually from MoneyOne
   // Prevent spoofing
   ```

5. **Session Management**:
   ```typescript
   // Tie consents to authenticated user sessions
   // Invalidate on logout
   ```

6. **Audit Logging**:
   ```typescript
   // Log all consent creation/usage/deletion
   // Track data access patterns
   ```

---

## Future Enhancements

### Planned Features

1. **Multi-Account Support**: Import from multiple depository accounts
2. **Historical Data**: Fetch transaction history over time
3. **Automatic Refresh**: Periodic background data sync
4. **Portfolio Analytics**: Built-in analysis before AI chat
5. **Data Export**: Download holdings as CSV/Excel
6. **Consent Management UI**: View/revoke all active consents
7. **Bank Account Integration**: Expand to savings/current accounts
8. **Notification System**: Alert when new holdings added

### Technical Debt

1. **Move to Database**: Replace localStorage with PostgreSQL/MongoDB
2. **Add Server-Side Session**: Proper user authentication
3. **Implement Caching**: Redis layer for frequent queries
4. **Add Monitoring**: Sentry for errors, PostHog for analytics
5. **Type Safety**: Strengthen type checking with Zod for all API responses
6. **Testing**: Unit tests for storage, integration tests for flow
7. **Documentation**: OpenAPI spec for internal APIs

---

## Troubleshooting

### Common Issues

#### Import Button Not Showing
- **Check**: `importViewOpen` query param
- **Fix**: Navigate to thread history and click "Import"

#### Connect Button Disabled
- **Check**: Browser console for errors
- **Fix**: Clear localStorage, refresh page

#### OAuth Redirect Fails
- **Check**: Redirect URL matches configured domain in MoneyOne dashboard
- **Fix**: Update `MONEY_ONE_REDIRECT_URL` environment variable

#### Data Not Fetching
- **Check**: Browser console for "NoDataFound" errors
- **Fix**: Wait 5-10 seconds, MoneyOne may still be fetching from FIPs

#### Consent Not Persisting
- **Check**: localStorage quota not exceeded
- **Fix**: Clear old consents or other localStorage data

#### AI Not Analyzing
- **Check**: Holdings array is not empty
- **Fix**: Verify `allHoldings.length > 0` in console

### Debug Mode

Enable detailed logging:
```bash
NODE_ENV=development # Shows all MoneyOne API logs
```

Check localStorage:
```javascript
// In browser console
Object.keys(localStorage)
  .filter(k => k.startsWith('moneyone:'))
  .forEach(k => console.log(k, localStorage.getItem(k)));
```

---

## Conclusion

The import holdings feature provides a secure, user-friendly way to import financial data using India's Account Aggregator framework. The implementation follows best practices for OAuth flows, state management, and error handling, while maintaining security and data privacy standards.

For questions or issues, refer to:
- MoneyOne Documentation: [moneyoneaccount.com/docs](https://moneyoneaccount.com/docs)
- RBI AA Framework: [rbi.org.in/Scripts/AA_FAQs.aspx](https://rbi.org.in/Scripts/AA_FAQs.aspx)
- Internal Team: Contact finSharpe engineering team

---

**Document Version**: 1.0
**Last Updated**: 2024
**Maintained By**: FinSharpe Engineering Team
