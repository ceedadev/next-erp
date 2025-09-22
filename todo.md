# Next ERP - MVP Core Features Todo

## 🎯 MVP Goals
Complete the core ERP functionality to make this a usable business management system.

## 📋 High Priority Features

### 1. Customer Management
- [ ] **Customer List Page** - Complete CRUD operations
  - [ ] List all customers with pagination
  - [ ] Search and filter customers
  - [ ] Customer actions (view, edit, delete)
- [ ] **Add Customer Form** - Following product-form.tsx pattern
- [ ] **Edit Customer Form** - Update existing customers
- [ ] **Customer Detail Page** - View customer info and related invoices

### 2. Product Management Completion
- [ ] **Edit Product Form** - Currently missing
- [ ] **Product Detail Page** - View product info and stock levels
- [ ] **Inventory Management** - Stock tracking and updates
- [ ] **Product Search/Filter** - Enhanced product discovery

### 3. Invoice Management Enhancement
- [ ] **Edit Invoice Form** - Update existing invoices
- [ ] **Invoice Payment Tracking** - Mark as paid/unpaid
- [ ] **Invoice Detail View** - Better invoice display
- [ ] **Invoice PDF Generation** - Print/download invoices

### 4. Financial Management
- [ ] **Real Dashboard KPIs** - Replace dummy data with actual calculations
  - [ ] Total sales from invoices
  - [ ] Total inventory value
  - [ ] Customer count
  - [ ] Recent activities
- [ ] **Sales Reports** - Basic reporting functionality
- [ ] **Payment Tracking** - Track invoice payments

### 5. Data Integration & Actions
- [ ] **Server Actions Enhancement** - Complete CRUD for all entities
- [ ] **Data Fetchers** - Consistent data fetching patterns
- [ ] **Form Validations** - Robust validation using Zod
- [ ] **Error Handling** - Proper error states and messages

### 6. UI/UX Improvements
- [ ] **Loading States** - Better user feedback
- [ ] **Empty States** - Handle no-data scenarios
- [ ] **Pagination** - For all list views
- [ ] **Search Functionality** - Global and per-page search
- [ ] **Toast Notifications** - Success/error feedback

## 🔧 Technical Improvements

### Database & Backend
- [ ] **Complete Schema Relations** - Ensure all FK relationships work
- [ ] **Data Seeding** - Sample data for testing
- [ ] **Database Migrations** - Proper migration handling

### Frontend Architecture
- [ ] **Form Components** - Reusable form patterns
- [ ] **Table Components** - Consistent table layouts
- [ ] **Action Components** - Standardized CRUD actions

## 📊 Success Metrics for MVP
- [ ] Can manage customers (add, edit, list, delete)
- [ ] Can manage products with inventory tracking
- [ ] Can create and edit invoices
- [ ] Dashboard shows real business metrics
- [ ] All forms have proper validation
- [ ] Basic reporting functionality works

## 🚀 Implementation Order
1. Customer Management (highest business value)
2. Product Management completion
3. Invoice Management enhancement
4. Real dashboard data
5. UI/UX polish

---
*This todo focuses on creating a functional ERP system that a small business could actually use.*