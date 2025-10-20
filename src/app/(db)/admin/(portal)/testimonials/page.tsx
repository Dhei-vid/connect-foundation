"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Trash2, Edit, Play, Quote } from "lucide-react";
import {
  getTestimonials,
  deleteTestimonial,
  TestimonialRecord,
} from "@/firebase/testimonials";
import { AddTestimonialModal } from "@/components/admin/add-testimonial-modal";
import Image from "next/image";
import { toast } from "sonner";

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<TestimonialRecord[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<TestimonialRecord | null>(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      setLoading(true);
      const data = await getTestimonials();
      setTestimonials(data);
    } catch (e) {
      console.error(e);
      toast.error("Failed to load testimonials");
    } finally {
      setLoading(false);
    }
  }

  const filtered = testimonials.filter((t) => {
    const s = search.toLowerCase();
    return (
      t.name.toLowerCase().includes(s) ||
      t.role.toLowerCase().includes(s) ||
      (t.content || "").toLowerCase().includes(s)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Testimonials</h1>
          <p className="text-muted-foreground">Create and manage testimonials. Not linked publicly yet.</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => { setEditing(null); setShowModal(true); }}>
            <Plus className="w-4 h-4 mr-2" /> Add Testimonial
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search testimonials..." className="pl-9" />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filtered.map((t) => (
          <Card key={t.id} className="overflow-hidden">
            {t.imageUrl ? (
              <div className="relative h-40">
                <Image src={t.imageUrl} alt={t.name} fill className="object-cover" />
                <div className="absolute inset-0 bg-black/30" />
              </div>
            ) : null}
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Badge variant={t.published ? "default" : "secondary"}>
                      {t.published ? "Published" : "Draft"}
                    </Badge>
                    <Badge variant="outline">{t.type}</Badge>
                  </div>
                  <div className="mt-3 font-semibold">{t.name}</div>
                  <div className="text-sm text-muted-foreground">{t.role}</div>
                </div>
                {t.type === "video" ? (
                  <Play className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <Quote className="w-5 h-5 text-muted-foreground" />
                )}
              </div>
              {t.content ? (
                <p className="mt-4 text-muted-foreground text-sm line-clamp-3">{t.content}</p>
              ) : null}

              <div className="mt-6 flex justify-end gap-2">
                <Button size="sm" variant="outline" onClick={() => { setEditing(t); setShowModal(true); }}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="destructive" onClick={async () => { await deleteTestimonial(t.id); toast.success("Deleted"); load(); }}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AddTestimonialModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={load}
        editingTestimonial={editing}
      />
    </div>
  );
}


