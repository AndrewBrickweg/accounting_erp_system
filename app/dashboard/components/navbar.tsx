"use client";

import "@radix-ui/themes/styles.css";
import { Button } from "@radix-ui/themes";
import { Bell } from "lucide-react";

export default function Navbar() {
  return (
    <header className="flex items-center justify-between bg-white shadow px-6 py-3">
      <h1 className="text-lg items-center font-semibold text-gray-800">
        Accounting ERP System
      </h1>
      <div className="flex items-center gap-3">
        <input
          placeholder="Search..."
          className="w-64 border text-gray-400 rounded px-2 py-1"
        />
        <Button variant="outline" size="2">
          <Bell />
        </Button>
      </div>
    </header>
  );
}
