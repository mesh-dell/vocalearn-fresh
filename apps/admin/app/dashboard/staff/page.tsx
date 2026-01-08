"use client";

import { useEffect, useState } from "react";
import { Button } from "@repo/ui/button";
import { Card, CardContent } from "@repo/ui/card";
import { ScrollArea } from "@repo/ui/scroll-area";
import { Loader2, PlusCircle, ArrowLeft } from "lucide-react";
import { StaffGet } from "@/Models/Staff";
import { fetchStaffAPI } from "@/Services/AdminService";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";

export default function AdminStaffPage() {
  const [staff, setStaff] = useState<StaffGet[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const router = useRouter();

  useEffect(() => {
    const loadStaff = async () => {
      try {
        const data = await fetchStaffAPI();
        setStaff(data);
      } catch (err) {
        console.error("Failed to load staff", err);
      } finally {
        setLoading(false);
      }
    };
    loadStaff();
  }, []);

  const totalPages = Math.ceil(staff.length / pageSize);
  const paginatedStaff = staff.slice((page - 1) * pageSize, page * pageSize);

  const nextPage = () => setPage((p) => Math.min(p + 1, totalPages));
  const prevPage = () => setPage((p) => Math.max(p - 1, 1));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 bg-background text-muted-foreground">
        <Loader2 className="animate-spin mr-2" /> Loading staff...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-6 py-6 border-b border-border">
        <div className="flex items-center gap-3 mb-4 sm:mb-0">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
            onClick={() => router.push("/dashboard")}
          >
            <ArrowLeft size={16} />
            Back
          </Button>
          <h1 className="text-3xl font-bold">All Staff</h1>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Button
            variant="default"
            className="flex items-center gap-2"
            onClick={() => router.push("/dashboard/staff/create")}
          >
            <PlusCircle size={18} />
            Add Staff
          </Button>
        </div>
      </header>

      {/* Staff list */}
      {staff.length === 0 ? (
        <p className="text-muted-foreground px-6 py-10">No staff found.</p>
      ) : (
        <Card className="mx-6 my-6">
          <CardContent className="p-0">
            <ScrollArea className="h-[70vh]">
              <table className="min-w-full divide-y divide-border">
                <thead className="bg-muted sticky top-0">
                  <tr>
                    {[
                      "Name",
                      "Email",
                      "Department",
                      "Phone",
                      "Gender",
                      "Admission Year",
                    ].map((title) => (
                      <th
                        key={title}
                        className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground"
                      >
                        {title}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {paginatedStaff.map((member) => (
                    <tr key={member.staffId || member.email}>
                      <td className="px-6 py-3">
                        {member.firstName} {member.lastName}
                      </td>
                      <td className="px-6 py-3">{member.email}</td>
                      <td className="px-6 py-3">{member.department}</td>
                      <td className="px-6 py-3">{member.phoneNumber}</td>
                      <td className="px-6 py-3">{member.gender}</td>
                      <td className="px-6 py-3">{member.admissionYear}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </ScrollArea>
          </CardContent>

          {/* Pagination Controls */}
          <div className="flex justify-between items-center p-4 border-t border-border">
            <Button
              onClick={prevPage}
              disabled={page === 1}
              variant="outline"
              className="text-sm"
            >
              Previous
            </Button>

            <span className="text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </span>

            <Button
              onClick={nextPage}
              disabled={page === totalPages}
              variant="outline"
              className="text-sm"
            >
              Next
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
