"use client";

export default function Footer() {
  return (
    <footer className="bg-white text-center border-t py-3 text-sm text-gray-500">
      © {new Date().getFullYear()} AccountingERP. All rights reserved.
    </footer>
  );
}
