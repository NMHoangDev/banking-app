# BankDB System - Banking App

Ung dung quan tri nghiep vu ngan hang duoc xay dung bang React + TypeScript + Vite + Tailwind CSS.

## Huong dan chay du an

Yeu cau:
- Node.js 18+

Lenh:
1. Cai dependencies
   - `npm install`
2. Chay local
   - `npm run dev`
3. Kiem tra type
   - `npm run lint`
4. Build production
   - `npm run build`

## Cap nhat gan day (ban da chinh sua)

### 1) Bo sung trang dang nhap
- Tao file: `src/pages/Login.tsx`
- Tich hop route: `/login`
- Giao dien theo theme he thong (material symbols, mau primary/surface, panel trai/phai)

### 2) Bo sung trang dang ky
- Tao file: `src/pages/Register.tsx`
- Tich hop route: `/register`
- Form dang ky day du thong tin:
  - Ho ten, so dien thoai, email, username
  - Mat khau + xac nhan mat khau (co an/hien)
  - Chon role (`customer`, `employee`, `admin`)
  - Checkbox dong y dieu khoan

### 3) Cap nhat Router
- Cap nhat `src/App.tsx`:
  - Them `LoginPage`
  - Them `RegisterPage`
  - Them routes public:
    - `/login`
    - `/register`

### 4) Chinh lai Navbar/Header theo template moi
- Cap nhat `src/components/layout/Header.tsx`
- Navbar moi gom:
  - Logo + ten he thong ben trai
  - Cac muc menu o giua (`Trang chu`, `Tinh nang`, `Ve chung toi`, `Ho tro`)
  - Khu vuc ben phai (`VI`, `Dang nhap`, `Dang ky`)
- Giu tone mau va style dong bo voi cac trang hien co

### 5) Sua loi TypeScript ve `Modal maxWidth`
Da sua cac loi `TS2322` do dung gia tri khong hop le `"6xl"`:
- `src/pages/Customers.tsx`: doi thanh `maxWidth="2xl"`
- `src/pages/Accounts.tsx`: doi thanh `maxWidth="2xl"`

## Cac file da thay doi lien quan

- `src/App.tsx`
- `src/components/layout/Header.tsx`
- `src/pages/Login.tsx` (new)
- `src/pages/Register.tsx` (new)
- `src/pages/Customers.tsx`
- `src/pages/Accounts.tsx`

## Ghi chu

- Du an hien co them mot so file page dang duoc chinh sua (`Beneficiaries`, `Dashboard`, `Transactions`, `Transfer`).
- Neu can, co the bo sung tiep phan "Release notes" theo tung ngay hoac tung nhanh (branch) de de theo doi lich su thay doi.
