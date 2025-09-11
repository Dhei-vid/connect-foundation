/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { Save, User, Shield, Bell, Database, Building2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    // Organization Settings
    organizationName: "Connect Foundation",
    organizationEmail: "info@connectfoundation.org",
    organizationPhone: "+234-800-123-4567",
    organizationAddress: "123 Charity Street, Lagos, Nigeria",
    organizationWebsite: "www.connectfoundation.org",

    // Admin Settings
    adminEmail: "admin@connectfoundation.org",
    adminName: "Admin User",

    // Notification Settings
    emailNotifications: true,
    smsNotifications: false,
    donationAlerts: true,
    issueAlerts: true,
    userRegistrationAlerts: true,

    // System Settings
    autoApproveDonations: false,
    requireOrphanageVerification: true,
    maxFileUploadSize: "10MB",
    backupFrequency: "daily",

    // Security Settings
    twoFactorAuth: true,
    sessionTimeout: "8 hours",
    passwordPolicy: "strong",
    ipWhitelist: false,
  });

  const handleSave = () => {
    // TODO: Implement save settings logic
    console.log("Save settings:", settings);
  };

  const handleInputChange = (field: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Configure your foundation&apos;s settings and preferences
        </p>
      </div>

      {/* Organization Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Building2 className="w-5 h-5" />
            <span>Organization Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Organization Name
              </label>
              <Input
                value={settings.organizationName}
                onChange={(e) =>
                  handleInputChange("organizationName", e.target.value)
                }
                placeholder="Enter organization name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Organization Email
              </label>
              <Input
                type="email"
                value={settings.organizationEmail}
                onChange={(e) =>
                  handleInputChange("organizationEmail", e.target.value)
                }
                placeholder="Enter organization email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Phone Number
              </label>
              <Input
                value={settings.organizationPhone}
                onChange={(e) =>
                  handleInputChange("organizationPhone", e.target.value)
                }
                placeholder="Enter phone number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Website</label>
              <Input
                value={settings.organizationWebsite}
                onChange={(e) =>
                  handleInputChange("organizationWebsite", e.target.value)
                }
                placeholder="Enter website URL"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Address</label>
            <Input
              value={settings.organizationAddress}
              onChange={(e) =>
                handleInputChange("organizationAddress", e.target.value)
              }
              placeholder="Enter organization address"
            />
          </div>
        </CardContent>
      </Card>

      {/* Admin Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="w-5 h-5" />
            <span>Admin Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Admin Name
              </label>
              <Input
                value={settings.adminName}
                onChange={(e) => handleInputChange("adminName", e.target.value)}
                placeholder="Enter admin name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Admin Email
              </label>
              <Input
                type="email"
                value={settings.adminEmail}
                onChange={(e) =>
                  handleInputChange("adminEmail", e.target.value)
                }
                placeholder="Enter admin email"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="w-5 h-5" />
            <span>Notification Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">
                  Email Notifications
                </label>
                <p className="text-xs text-gray-500">
                  Receive notifications via email
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) =>
                  handleInputChange("emailNotifications", e.target.checked)
                }
                className="w-4 h-4"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">SMS Notifications</label>
                <p className="text-xs text-gray-500">
                  Receive notifications via SMS
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.smsNotifications}
                onChange={(e) =>
                  handleInputChange("smsNotifications", e.target.checked)
                }
                className="w-4 h-4"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">Donation Alerts</label>
                <p className="text-xs text-gray-500">
                  Get notified of new donations
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.donationAlerts}
                onChange={(e) =>
                  handleInputChange("donationAlerts", e.target.checked)
                }
                className="w-4 h-4"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">Issue Alerts</label>
                <p className="text-xs text-gray-500">
                  Get notified of new issues
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.issueAlerts}
                onChange={(e) =>
                  handleInputChange("issueAlerts", e.target.checked)
                }
                className="w-4 h-4"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">
                  User Registration Alerts
                </label>
                <p className="text-xs text-gray-500">
                  Get notified of new user registrations
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.userRegistrationAlerts}
                onChange={(e) =>
                  handleInputChange("userRegistrationAlerts", e.target.checked)
                }
                className="w-4 h-4"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="w-5 h-5" />
            <span>System Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Auto-approve Donations
              </label>
              <select
                value={settings.autoApproveDonations ? "true" : "false"}
                onChange={(e) =>
                  handleInputChange(
                    "autoApproveDonations",
                    e.target.value === "true"
                  )
                }
                className="w-full p-3 border rounded-lg"
              >
                <option value="false">Manual Approval</option>
                <option value="true">Auto-approve</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Orphanage Verification
              </label>
              <select
                value={settings.requireOrphanageVerification ? "true" : "false"}
                onChange={(e) =>
                  handleInputChange(
                    "requireOrphanageVerification",
                    e.target.value === "true"
                  )
                }
                className="w-full p-3 border rounded-lg"
              >
                <option value="true">Required</option>
                <option value="false">Not Required</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Max File Upload Size
              </label>
              <select
                value={settings.maxFileUploadSize}
                onChange={(e) =>
                  handleInputChange("maxFileUploadSize", e.target.value)
                }
                className="w-full p-3 border rounded-lg"
              >
                <option value="5MB">5MB</option>
                <option value="10MB">10MB</option>
                <option value="25MB">25MB</option>
                <option value="50MB">50MB</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Backup Frequency
              </label>
              <select
                value={settings.backupFrequency}
                onChange={(e) =>
                  handleInputChange("backupFrequency", e.target.value)
                }
                className="w-full p-3 border rounded-lg"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5" />
            <span>Security Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Two-Factor Authentication
              </label>
              <select
                value={settings.twoFactorAuth ? "true" : "false"}
                onChange={(e) =>
                  handleInputChange("twoFactorAuth", e.target.value === "true")
                }
                className="w-full p-3 border rounded-lg"
              >
                <option value="true">Enabled</option>
                <option value="false">Disabled</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Session Timeout
              </label>
              <select
                value={settings.sessionTimeout}
                onChange={(e) =>
                  handleInputChange("sessionTimeout", e.target.value)
                }
                className="w-full p-3 border rounded-lg"
              >
                <option value="1 hour">1 Hour</option>
                <option value="4 hours">4 Hours</option>
                <option value="8 hours">8 Hours</option>
                <option value="24 hours">24 Hours</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Password Policy
              </label>
              <select
                value={settings.passwordPolicy}
                onChange={(e) =>
                  handleInputChange("passwordPolicy", e.target.value)
                }
                className="w-full p-3 border rounded-lg"
              >
                <option value="basic">Basic</option>
                <option value="strong">Strong</option>
                <option value="very-strong">Very Strong</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                IP Whitelist
              </label>
              <select
                value={settings.ipWhitelist ? "true" : "false"}
                onChange={(e) =>
                  handleInputChange("ipWhitelist", e.target.value === "true")
                }
                className="w-full p-3 border rounded-lg"
              >
                <option value="false">Disabled</option>
                <option value="true">Enabled</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} size="lg">
          <Save className="w-4 h-4 mr-2" />
          Save Settings
        </Button>
      </div>
    </div>
  );
}
