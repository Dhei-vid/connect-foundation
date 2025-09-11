/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import {
  Users,
  Search,
  Eye,
  Edit,
  Trash2,
  Shield,
  User,
  Plus,
  XCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

// Mock data - in real app, this would come from your database
const mockUsers = [
  {
    uid: "user_1",
    email: "admin@connectfoundation.org",
    displayName: "Admin User",
    photoURL: "/api/placeholder/100/100",
    role: "admin" as const,
    createdAt: new Date("2023-01-01"),
    lastLoginAt: new Date("2024-01-21"),
  },
  {
    uid: "user_2",
    email: "hope@hopechildrenshome.org",
    displayName: "Hope Children's Home",
    photoURL: "/api/placeholder/100/100",
    role: "orphanage" as const,
    createdAt: new Date("2023-02-15"),
    lastLoginAt: new Date("2024-01-20"),
  },
  {
    uid: "user_3",
    email: "john.smith@email.com",
    displayName: "John Smith",
    photoURL: "/api/placeholder/100/100",
    role: "donor" as const,
    createdAt: new Date("2023-03-10"),
    lastLoginAt: new Date("2024-01-19"),
  },
  {
    uid: "user_4",
    email: "sunshine@sunshineorphanage.org",
    displayName: "Sunshine Orphanage",
    photoURL: "/api/placeholder/100/100",
    role: "orphanage" as const,
    createdAt: new Date("2023-04-05"),
    lastLoginAt: new Date("2024-01-18"),
  },
  {
    uid: "user_5",
    email: "sarah.johnson@email.com",
    displayName: "Sarah Johnson",
    photoURL: "/api/placeholder/100/100",
    role: "donor" as const,
    createdAt: new Date("2023-05-20"),
    lastLoginAt: new Date("2024-01-17"),
  },
  {
    uid: "user_6",
    email: "littleangels@littleangelshome.org",
    displayName: "Little Angels Home",
    photoURL: "/api/placeholder/100/100",
    role: "orphanage" as const,
    createdAt: new Date("2023-06-12"),
    lastLoginAt: new Date("2024-01-16"),
  },
];

const roleColors = {
  admin: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  orphanage: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  donor: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
};

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<
    "all" | "admin" | "orphanage" | "donor"
  >("all");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredUsers = mockUsers.filter((user) => {
    const matchesSearch =
      user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = filterRole === "all" || user.role === filterRole;

    return matchesSearch && matchesRole;
  });

  const handleEditUser = (userId: string) => {
    // TODO: Implement edit user logic
    console.log("Edit user:", userId);
  };

  const handleDeleteUser = (userId: string) => {
    // TODO: Implement delete user logic
    console.log("Delete user:", userId);
  };

  const handleRoleChange = (userId: string, newRole: string) => {
    // TODO: Implement role change logic
    console.log("Change role:", userId, newRole);
  };

  const handleAddUser = () => {
    // TODO: Implement add user logic
    console.log("Add new user");
    setShowAddModal(false);
  };

  // Calculate statistics
  const totalUsers = mockUsers.length;
  const adminUsers = mockUsers.filter((u) => u.role === "admin").length;
  const orphanageUsers = mockUsers.filter((u) => u.role === "orphanage").length;
  const donorUsers = mockUsers.filter((u) => u.role === "donor").length;

  // Recent users (last 30 days)
  const recentUsers = mockUsers.filter((user) => {
    const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    return user.createdAt >= monthAgo;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Users Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage user accounts and roles
          </p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              {recentUsers.length} new this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admins</CardTitle>
            <Shield className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{adminUsers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orphanages</CardTitle>
            <User className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {orphanageUsers}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Donors</CardTitle>
            <User className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {donorUsers}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Users */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentUsers.slice(0, 5).map((user) => (
              <div
                key={user.uid}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-500" />
                  </div>
                  <div>
                    <p className="font-medium">{user.displayName}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className={roleColors[user.role]}>{user.role}</Badge>
                  <p className="text-sm text-gray-500 mt-1">
                    {user.createdAt.toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value as any)}
                className="px-3 py-2 border rounded-lg text-sm"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="orphanage">Orphanage</option>
                <option value="donor">Donor</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">User</th>
                  <th className="text-left py-3 px-4">Email</th>
                  <th className="text-left py-3 px-4">Role</th>
                  <th className="text-left py-3 px-4">Created</th>
                  <th className="text-left py-3 px-4">Last Login</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr
                    key={user.uid}
                    className="border-b hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-gray-500" />
                        </div>
                        <div>
                          <div className="font-medium">{user.displayName}</div>
                          <div className="text-sm text-gray-500">
                            ID: {user.uid}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">{user.email}</td>
                    <td className="py-3 px-4">
                      <Badge className={roleColors[user.role]}>
                        {user.role}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      {user.createdAt.toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      {user.lastLoginAt.toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedUser(user)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditUser(user.uid)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteUser(user.uid)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>User Details</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedUser(null)}
                >
                  <XCircle className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <User className="w-10 h-10 text-gray-500" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">
                    {selectedUser.displayName}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {selectedUser.email}
                  </p>
                  <Badge
                    className={
                      roleColors[selectedUser.role as keyof typeof roleColors]
                    }
                  >
                    {selectedUser.role}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Account Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>User ID:</span>
                      <span className="font-medium">{selectedUser.uid}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Email:</span>
                      <span className="font-medium">{selectedUser.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Role:</span>
                      <Badge
                        className={
                          roleColors[
                            selectedUser.role as keyof typeof roleColors
                          ]
                        }
                      >
                        {selectedUser.role}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Activity</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Created:</span>
                      <span className="font-medium">
                        {selectedUser.createdAt.toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Last Login:</span>
                      <span className="font-medium">
                        {selectedUser.lastLoginAt.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Change Role</h3>
                <div className="flex gap-2">
                  <Button
                    variant={
                      selectedUser.role === "admin" ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => handleRoleChange(selectedUser.uid, "admin")}
                  >
                    Admin
                  </Button>
                  <Button
                    variant={
                      selectedUser.role === "orphanage" ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() =>
                      handleRoleChange(selectedUser.uid, "orphanage")
                    }
                  >
                    Orphanage
                  </Button>
                  <Button
                    variant={
                      selectedUser.role === "donor" ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => handleRoleChange(selectedUser.uid, "donor")}
                  >
                    Donor
                  </Button>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  onClick={() => {
                    handleEditUser(selectedUser.uid);
                    setSelectedUser(null);
                  }}
                  className="flex-1"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit User
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    handleDeleteUser(selectedUser.uid);
                    setSelectedUser(null);
                  }}
                  className="flex-1"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete User
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setSelectedUser(null)}
                  className="flex-1"
                >
                  Close
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <CardTitle>Add New User</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Display Name
                </label>
                <Input placeholder="Enter display name" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <Input type="email" placeholder="Enter email address" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Role</label>
                <select className="w-full p-3 border rounded-lg">
                  <option value="donor">Donor</option>
                  <option value="orphanage">Orphanage</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Password
                </label>
                <Input type="password" placeholder="Enter password" />
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={handleAddUser} className="flex-1">
                  Add User
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
