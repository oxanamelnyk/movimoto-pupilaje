# Clients Page Implementation Plan

This document outlines the step-by-step process to create the Clients management page with Tariff Plans and Services, as shown in the design mockup.

---

## Phase 1: Database & Schema

### 1.1 Create Clients Table

- `id` (primary key)
- `name` (client name - e.g., "Movimoto")
- `description` (business description - e.g., "Motorcycle logistics and storage")
- `status` (enum: Active/Inactive)
- `createdAt` (timestamp)
- `updatedAt` (timestamp)

### 1.2 Create Tariff Plans Table

- `id` (primary key)
- `clientId` (foreign key → clients.id)
- `name` (e.g., "Tariff 2026")
- `validFrom` (date)
- `validTo` (date)
- `status` (enum: Active/Archived)
- `description` (optional notes)
- `createdAt`, `updatedAt`

### 1.3 Create Tariff Services Table

- `id` (primary key)
- `tariffId` (foreign key → tariff_plans.id)
- `name` (service name - e.g., "BCN Zone 1")
- `price` (decimal)
- `unit` (e.g., "moto", "unit")
- `type` (enum: Fixed/Variable)
- `discount` (percentage - nullable)
- `category` (enum: Delivery/Storage/etc)
- `createdAt`, `updatedAt`

---

## Phase 2: API Routes

### 2.1 Client Endpoints

- `GET /api/clients` - List all clients with pagination
- `GET /api/clients/[id]` - Get single client details
- `POST /api/clients` - Create new client
- `PUT /api/clients/[id]` - Update client details
- `DELETE /api/clients/[id]` - Archive/delete client

### 2.2 Tariff Plan Endpoints

- `GET /api/clients/[id]/tariffs` - List all tariff plans for a client
- `POST /api/clients/[id]/tariffs` - Create new tariff plan
- `PUT /api/tariffs/[id]` - Update tariff plan
- `DELETE /api/tariffs/[id]` - Archive tariff plan
- `POST /api/tariffs/[id]/duplicate` - Duplicate existing tariff

### 2.3 Tariff Service Endpoints

- `GET /api/tariffs/[id]/services` - Get all services in a tariff
- `POST /api/tariffs/[id]/services` - Add service to tariff
- `PUT /api/services/[id]` - Update service
- `DELETE /api/services/[id]` - Remove service

---

## Phase 3: React Pages & Layouts

### 3.1 Clients List Page

**Path:** `app/dashboard/clients/page.tsx`

Features:

- Table of all clients
- Columns: Name, Description, Status, Actions
- Search/filter functionality
- "New Client" button (top right)
- Status badges (Active/Inactive)

### 3.2 Client Detail Page

**Path:** `app/dashboard/clients/[id]/page.tsx`

Structure:

- **Header Section:**
  - Client icon/avatar
  - Client name (heading)
  - Status badge (Active/Archived)
  - Description
  - "Edit Client" button (top right)

- **Tab Navigation:**
  - "Invoices" tab
  - "Tariffs" tab (default view)

- **Tariffs Tab Content:**
  - Two-column layout:
    - **Left Panel:** Tariff Plans list
    - **Right Panel:** Tariff Details & Services

---

## Phase 4: UI Components

### 4.1 Tariff Plans Sidebar

**Component:** `components/clients/TariffPlansList.tsx`

Features:

- List of tariff plans for selected client
- Each item shows:
  - Plan name
  - Status badge
  - Last updated date
  - Three-dot menu (Edit, Duplicate, Delete)
- Highlight active/selected plan
- "+ New Tariff Plan" button at bottom

### 4.2 Tariff Details Panel

**Component:** `components/clients/TariffDetails.tsx`

Displays:

- Tariff name (heading)
- Status badge
- Valid from/to dates
- Description (if any)
- Expandable sections:
  - **Delivery** (6 services in mockup)
  - **Storage** (4 services, collapsed by default)

### 4.3 Services Table

**Component:** `components/clients/ServicesTable.tsx`

Columns:

- Service (name)
- Price (€ format)
- Type (Fixed/Variable)
- Unit (moto, unit, etc)
- Discount (percentage or "-")
- Actions (edit & delete icons)

Features:

- Editable cells (inline edit on click)
- Delete service confirmation modal
- "+ Add Service" link below table

### 4.4 Modals/Dialogs

#### 4.4.1 Create/Edit Tariff Modal

**Component:** `components/clients/TariffModal.tsx`

Fields:

- Tariff name (text input)
- Valid from (date picker)
- Valid to (date picker)
- Status (select: Active/Archived)
- Description (textarea)
- Action buttons: Save, Cancel

#### 4.4.2 Create/Edit Service Modal

**Component:** `components/clients/ServiceModal.tsx`

Fields:

- Service name (text input)
- Price (number input, currency)
- Type (select: Fixed/Variable)
- Unit (select: moto, unit, etc)
- Category (select: Delivery/Storage/etc)
- Discount (number input, percentage)
- Action buttons: Save, Cancel

---

## Phase 5: Integration with Existing System

### 5.1 Link Clients to Vehicles

- Add `clientId` field to vehicles table (if not exists)
- Update vehicle form to select client
- Filter vehicles by client in list view

### 5.2 Link Clients to Invoices

- Invoices should reference client via vehicle
- Show client tariff in invoice calculation
- Use tariff rates for pricing

### 5.3 Navigation

- Add "Clients" link to sidebar navigation
- Breadcrumb: Dashboard > Clients > [Client Name] > Tariffs

---

## Implementation Order (Recommended)

1. ✅ Database schema creation (Drizzle migrations)
2. ✅ API routes for clients (CRUD)
3. ✅ API routes for tariffs (CRUD)
4. ✅ API routes for services (CRUD)
5. ✅ Clients list page
6. ✅ Client detail page (structure)
7. ✅ TariffPlansList component
8. ✅ TariffDetails component
9. ✅ ServicesTable component
10. ✅ Modals (TariffModal, ServiceModal)
11. ✅ Integration with vehicles
12. ✅ Integration with invoices
13. ✅ Navigation & breadcrumbs
14. ✅ Testing & refinements

---

## UI Reference

### Layout Structure

```
┌─ Client Header (Name, Status, Description)
├─ Tabs (Invoices | Tariffs)
└─ Tab Content:
    ├─ Left Sidebar (Tariff Plans List)
    │  ├─ Tariff 2026 (Active) [Selected]
    │  ├─ Tariff 2024 (Archived)
    │  └─ + New Tariff Plan
    │
    └─ Right Panel (Tariff Details)
       ├─ Tariff 2026
       ├─ Valid from 01/01/2026
       ├─ Delivery (6 services)
       │  ├─ Service Table
       │  ├─ Columns: Service | Price | Type | Unit | Discount | Actions
       │  └─ + Add Service
       │
       └─ Storage (4 services)
          ├─ [Collapsed]
          └─ [Click to expand]
```

---

## Notes

- Status badges use colors: Green for Active, Gray for Archived
- Tariff plans can be duplicated to create new plans with same services
- Services can be edited inline or via modal
- All changes should be saved to database
- Support pagination on clients list if > 20 items
- Consider bulk operations for services (edit multiple, delete multiple)
