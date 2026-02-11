"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Department = {
  id: number;
  name: string;
  code: string;
  managerId?: string | null;
};

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    managerId: "",
  });

  // Fetch departments on component mount
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await fetch("/api/departments");
        if (!res.ok) throw new Error(` Error: ${res.statusText} `);
        const data = await res.json();
        setDepartments(data);
      } catch (err) {
        // setError("Failed to load departments.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDepartments();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      name: formData.name.trim(),
      code: formData.code.trim(),
      managerId: formData.managerId.trim() || null,
    };

    try {
      const res = await fetch("/api/departments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(` Error: ${res.statusText} `);
      const newDept = await res.json();
      setDepartments((prev) => [...prev, newDept]);
      setFormData({
        name: "",
        code: "",
        managerId: "",
      });
    } catch (err) {
      console.error("Error adding department:", err);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <main className="p-8 space-y-6">
      <div className="flex flex-col gap-4 mb-6">
        <h1 className="text-2xl font-bold">Departments</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
          <Input
            placeholder="Department Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <Input
            placeholder="Department Code"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            required
          />
          <Input
            placeholder="Manager ID (optional)"
            value={formData.managerId}
            onChange={(e) =>
              setFormData({
                ...formData,
                managerId: e.target.value,
              })
            }
          />
          <Button type="submit">Submit</Button>
        </form>
      </div>

      {departments.length === 0 ? (
        <p>No Departments Found</p>
      ) : (
        <div className="space-y-4">
          {departments.map((dept) => (
            <Card key={dept.id} className="mb-4">
              <CardHeader>
                <CardTitle>{dept.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Code: {dept.code}</p>
                <p>Manager ID: {dept.managerId || "N/A"}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}
