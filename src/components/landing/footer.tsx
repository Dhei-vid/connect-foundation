"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Heart,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Globe,
} from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const footerLinks = {
  company: [
    { name: "About Us", href: "/about-us" },
    { name: "Our Mission", href: "/about-us#mission" },
    { name: "Team", href: "/about-us#team" },
    { name: "Careers", href: "/careers" },
  ],
  programs: [
    { name: "Orphanage Support", href: "/programs/orphanages" },
    { name: "Education", href: "/programs/education" },
    { name: "Healthcare", href: "/programs/healthcare" },
    { name: "Emergency Relief", href: "/programs/emergency" },
  ],
  resources: [
    { name: "Impact Reports", href: "/impact" },
    { name: "Transparency", href: "/transparency" },
    { name: "FAQ", href: "/contact" },
  ],
  support: [
    { name: "Contact Us", href: "/contact" },
    { name: "Help Center", href: "/help" },
    { name: "Donor Portal", href: "/donor-portal" },
    { name: "Volunteer", href: "/volunteer" },
  ],
};

const socialLinks = [
  { name: "Facebook", icon: Facebook, href: "https://facebook.com" },
  { name: "Twitter", icon: Twitter, href: "https://twitter.com" },
  { name: "Instagram", icon: Instagram, href: "https://instagram.com" },
  { name: "LinkedIn", icon: Linkedin, href: "https://linkedin.com" },
];

export function Footer() {
  return (
    <footer className="relative bg-main-blue">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url(('https://images.pexels.com/photos/2646237/pexels-photo-2646237.jpeg')]" />

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 py-16 ">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
            {/* Logo and Description */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="mb-6 w-full lg:w-96 2xl:w-[12rem]"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-2xl font-bold text-grey/90">
                    Connect Foundation
                  </span>
                </div>
                <p className="text-grey/90 leading-relaxed">
                  Bridging the gap between orphanages and donors worldwide.
                  Every child deserves a chance to thrive.
                </p>
              </motion.div>

              {/* Contact Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
                className="space-y-3"
              >
                <div className="flex items-center gap-3 text-grey/70">
                  <Mail className="w-4 h-4" />
                  <span>hello@connectfoundation.org</span>
                </div>
                <div className="flex items-center gap-3 text-grey/70">
                  <Phone className="w-4 h-4" />
                  <span>+234 (0) 80545234567</span>
                </div>
                <div className="flex items-center gap-3 text-grey/70">
                  <MapPin className="w-4 h-4" />
                  <span>50 Ebitu Ukiwe Street, Jabi, Abuja</span>
                </div>
              </motion.div>
            </div>

            {/* Company Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="font-semibold text-lg mb-4 text-grey/90">
                Company
              </h3>
              <ul className="space-y-2">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-grey/70 hover:text-foreground transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Resources Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <h3 className="font-semibold text-grey/90 text-lg mb-4">
                Resources
              </h3>
              <ul className="space-y-2">
                {footerLinks.resources.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-grey/70 hover:text-foreground transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Support Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true }}
            >
              <h3 className="font-semibold text-lg mb-4 text-grey/90">
                Support
              </h3>
              <ul className="space-y-2">
                {footerLinks.support.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-grey/70 hover:text-foreground transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Social Links and Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row justify-between items-center gap-6 py-8 border-t border-t border-grey/20"
          >
            {/* Social Links */}
            <div className="flex items-center gap-4">
              <span className="text-grey/70">Follow us:</span>
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-200"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>

            {/* Newsletter Signup */}
            <div className="flex items-center gap-4">
              <span className="text-grey/70">Stay updated:</span>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <Button className="border border-grey/50 bg-transparent h-9 px-4 py-3 text-grey rounded-lg hover:shadow-lg transition-all duration-200">
                  Subscribe
                </Button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-grey/20">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-4">
                <span>&copy; 2024 HAID Technologies. All rights reserved.</span>
                <div className="flex items-center gap-4">
                  <Link
                    href="/privacy"
                    className="hover:text-foreground transition-colors"
                  >
                    Privacy Policy
                  </Link>
                  <Link
                    href="/terms"
                    className="hover:text-foreground transition-colors"
                  >
                    Terms of Service
                  </Link>
                </div>
              </div>
              <div className="flex flex-row items-center gap-2">
                <Globe className="w-4 h-4" />
                <div className="flex flex-row gap-2">
                  Made with <Heart size={16} className="text-gold" /> for
                  children worldwide
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
