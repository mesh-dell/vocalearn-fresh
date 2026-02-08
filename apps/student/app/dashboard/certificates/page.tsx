"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Download, Award, FileText } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card";
import { Button } from "@repo/ui/button";
import { Badge } from "@repo/ui/badge";

import { useAuth } from "@/Context/useAuth";
import { fetchCertificatesByAdmissionIdAPI } from "@/Services/CertificateService";
import { CourseCertificate } from "@/Models/Certificate";

export default function StudentCertificatesPage() {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState<CourseCertificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCertificates = async () => {
      try {
        if (!user?.admissionId) return;

        const data = await fetchCertificatesByAdmissionIdAPI(user.admissionId);
        setCertificates(data);
      } catch (error) {
        toast.error("Failed to load certificates");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadCertificates();
  }, [user]);

  const handleDownloadCertificate = (
    certificateUrl: string,
    courseName: string,
  ) => {
    const link = document.createElement("a");
    link.href = certificateUrl;
    link.download = `${courseName}_Certificate.pdf`;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleViewCertificate = (certificateUrl: string) => {
    window.open(certificateUrl, "_blank");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <p className="text-muted-foreground">Loading certificates…</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Award className="h-8 w-8 text-yellow-500" />
            My Certificates
          </h1>
          <p className="text-muted-foreground mt-1">
            View and download your course completion certificates
          </p>
        </div>
        <Badge variant="outline" className="text-lg px-4 py-2">
          {certificates.length} Certificate
          {certificates.length !== 1 ? "s" : ""}
        </Badge>
      </div>

      {/* Empty state */}
      {certificates.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Award className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Certificates Yet</h3>
            <p className="text-muted-foreground text-center max-w-md">
              Complete your courses to earn certificates. Keep up the great
              work!
            </p>
          </CardContent>
        </Card>
      )}

      {/* Certificates grid */}
      {certificates.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {certificates.map((certificate, index) => (
            <Card
              key={`${certificate.admissionId}-${certificate.courseName}-${index}`}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <Award className="h-10 w-10 text-yellow-500" />
                  <Badge variant="default">Certified</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <CardTitle className="text-lg line-clamp-2">
                    {certificate.courseName}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Course Completion Certificate
                  </p>
                </div>

                <div className="pt-2 space-y-2">
                  <Button
                    variant="default"
                    className="w-full"
                    onClick={() =>
                      handleViewCertificate(certificate.certificateFileName)
                    }
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    View Certificate
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() =>
                      handleDownloadCertificate(
                        certificate.certificateFileName,
                        certificate.courseName,
                      )
                    }
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Info section */}
      {certificates.length > 0 && (
        <Card className="bg-muted/50">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-2">About Your Certificates</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>
                • Certificates are issued upon successful course completion
              </li>
              <li>• Download your certificates in PDF format</li>
              <li>
                • Share your achievements on social media or with employers
              </li>
              <li>
                • Certificates include your name, course details, and completion
                date
              </li>
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
