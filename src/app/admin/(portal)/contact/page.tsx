/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import {
  MessageSquare,
  Search,
  Eye,
  Mail,
  Reply,
  CheckCircle,
  Clock,
  User,
  Calendar,
  Archive,
  XCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

// Mock data - in real app, this would come from your database
const mockInquiries = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    subject: "Interested in Volunteering",
    message:
      "Hi, I'm interested in volunteering at your foundation. I have experience working with children and would love to help out. Could you please provide more information about volunteer opportunities?",
    status: "new" as const,
    createdAt: new Date("2024-01-21"),
    updatedAt: new Date("2024-01-21"),
  },
  {
    id: "2",
    name: "Michael Brown",
    email: "m.brown@email.com",
    subject: "Donation Inquiry",
    message:
      "I would like to make a large donation to support your cause. Could you please provide information about how to donate and what the funds would be used for?",
    status: "read" as const,
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-01-20"),
  },
  {
    id: "3",
    name: "Emily Davis",
    email: "emily.davis@email.com",
    subject: "Orphanage Registration",
    message:
      "We run a small orphanage and would like to register with your foundation to receive assistance. What is the process for registration?",
    status: "replied" as const,
    createdAt: new Date("2024-01-19"),
    updatedAt: new Date("2024-01-19"),
  },
  {
    id: "4",
    name: "David Wilson",
    email: "d.wilson@email.com",
    subject: "Partnership Opportunity",
    message:
      "I represent a corporate foundation and we're interested in partnering with your organization. Could we schedule a meeting to discuss potential collaboration?",
    status: "closed" as const,
    createdAt: new Date("2024-01-18"),
    updatedAt: new Date("2024-01-18"),
  },
  {
    id: "5",
    name: "Lisa Anderson",
    email: "lisa.anderson@email.com",
    subject: "Media Inquiry",
    message:
      "I'm a journalist writing an article about charitable organizations. Could you provide some information about your foundation's impact and success stories?",
    status: "new" as const,
    createdAt: new Date("2024-01-22"),
    updatedAt: new Date("2024-01-22"),
  },
  {
    id: "6",
    name: "Robert Taylor",
    email: "r.taylor@email.com",
    subject: "Technical Support",
    message:
      "I'm having trouble making a donation through your website. The payment keeps failing. Could you help me resolve this issue?",
    status: "read" as const,
    createdAt: new Date("2024-01-17"),
    updatedAt: new Date("2024-01-17"),
  },
];

const statusColors = {
  new: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  read: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  replied: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  closed: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
};

export default function ContactPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "new" | "read" | "replied" | "closed"
  >("all");
  const [selectedInquiry, setSelectedInquiry] = useState<any>(null);
  const [replyText, setReplyText] = useState("");

  const filteredInquiries = mockInquiries.filter((inquiry) => {
    const matchesSearch =
      inquiry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.message.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || inquiry.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const handleStatusUpdate = (inquiryId: string, newStatus: string) => {
    // TODO: Implement status update logic
    console.log("Update inquiry status:", inquiryId, newStatus);
  };

  const handleReply = (inquiryId: string) => {
    // TODO: Implement reply logic
    console.log("Reply to inquiry:", inquiryId, replyText);
    setReplyText("");
    setSelectedInquiry(null);
  };

  const handleArchive = (inquiryId: string) => {
    // TODO: Implement archive logic
    console.log("Archive inquiry:", inquiryId);
  };

  // Calculate statistics
  const totalInquiries = mockInquiries.length;
  const newInquiries = mockInquiries.filter((i) => i.status === "new").length;
  const readInquiries = mockInquiries.filter((i) => i.status === "read").length;
  const repliedInquiries = mockInquiries.filter(
    (i) => i.status === "replied"
  ).length;
  const closedInquiries = mockInquiries.filter(
    (i) => i.status === "closed"
  ).length;

  // Recent inquiries (last 7 days)
  const recentInquiries = mockInquiries.filter((inquiry) => {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return inquiry.createdAt >= weekAgo;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Contact Inquiries
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage and respond to contact inquiries and messages
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card className="py-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalInquiries}</div>
            <p className="text-xs text-muted-foreground">
              {recentInquiries.length} this week
            </p>
          </CardContent>
        </Card>

        <Card className="py-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {newInquiries}
            </div>
          </CardContent>
        </Card>

        <Card className="py-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Read</CardTitle>
            <Eye className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {readInquiries}
            </div>
          </CardContent>
        </Card>

        <Card className="py-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Replied</CardTitle>
            <Reply className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {repliedInquiries}
            </div>
          </CardContent>
        </Card>

        <Card className="py-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Closed</CardTitle>
            <CheckCircle className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">
              {closedInquiries}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Inquiries */}
      <Card className="py-4">
        <CardHeader>
          <CardTitle>Recent Inquiries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentInquiries.slice(0, 5).map((inquiry) => (
              <div
                key={inquiry.id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">{inquiry.name}</p>
                    <p className="text-sm text-gray-500">{inquiry.subject}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className={statusColors[inquiry.status]}>
                    {inquiry.status}
                  </Badge>
                  <p className="text-sm text-gray-500 mt-1">
                    {inquiry.createdAt.toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search inquiries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-3 py-2 border rounded-lg text-sm"
              >
                <option value="all">All Status</option>
                <option value="new">New</option>
                <option value="read">Read</option>
                <option value="replied">Replied</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Inquiries List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {filteredInquiries.map((inquiry) => (
          <Card key={inquiry.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold">{inquiry.subject}</h3>
                    <Badge className={statusColors[inquiry.status]}>
                      {inquiry.status}
                    </Badge>
                  </div>

                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <User className="w-4 h-4 mr-1" />
                    {inquiry.name}
                    <Mail className="w-4 h-4 mr-1 ml-3" />
                    {inquiry.email}
                    <Calendar className="w-4 h-4 mr-1 ml-3" />
                    {inquiry.createdAt.toLocaleDateString()}
                  </div>

                  <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                    {inquiry.message}
                  </p>
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedInquiry(inquiry)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View
                  </Button>
                  {inquiry.status === "new" && (
                    <Button
                      size="sm"
                      onClick={() => handleStatusUpdate(inquiry.id, "read")}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Mark Read
                    </Button>
                  )}
                  {inquiry.status !== "closed" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedInquiry(inquiry)}
                    >
                      <Reply className="w-4 h-4 mr-2" />
                      Reply
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Inquiry Details Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  {selectedInquiry.subject}
                  <Badge
                    className={
                      statusColors[
                        selectedInquiry.status as keyof typeof statusColors
                      ]
                    }
                  >
                    {selectedInquiry.status}
                  </Badge>
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedInquiry(null)}
                >
                  <XCircle className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Contact Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Name:</span>
                      <span className="font-medium">
                        {selectedInquiry.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Email:</span>
                      <span className="font-medium">
                        {selectedInquiry.email}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <Badge
                        className={
                          statusColors[
                            selectedInquiry.status as keyof typeof statusColors
                          ]
                        }
                      >
                        {selectedInquiry.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Timeline</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Received:</span>
                      <span className="font-medium">
                        {selectedInquiry.createdAt.toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Last Updated:</span>
                      <span className="font-medium">
                        {selectedInquiry.updatedAt.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Message</h3>
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {selectedInquiry.message}
                  </p>
                </div>
              </div>

              {selectedInquiry.status !== "closed" && (
                <div>
                  <h3 className="font-semibold mb-2">Reply</h3>
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="w-full p-3 border rounded-lg"
                    rows={4}
                    placeholder="Type your reply here..."
                  />
                </div>
              )}

              <div className="flex gap-2 pt-4">
                {selectedInquiry.status === "new" && (
                  <Button
                    onClick={() => {
                      handleStatusUpdate(selectedInquiry.id, "read");
                      setSelectedInquiry(null);
                    }}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Mark as Read
                  </Button>
                )}
                {selectedInquiry.status !== "closed" && (
                  <Button
                    onClick={() => handleReply(selectedInquiry.id)}
                    disabled={!replyText.trim()}
                  >
                    <Reply className="w-4 h-4 mr-2" />
                    Send Reply
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={() => {
                    handleStatusUpdate(selectedInquiry.id, "closed");
                    setSelectedInquiry(null);
                  }}
                >
                  <Archive className="w-4 h-4 mr-2" />
                  Close Inquiry
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setSelectedInquiry(null)}
                  className="flex-1"
                >
                  Close
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
