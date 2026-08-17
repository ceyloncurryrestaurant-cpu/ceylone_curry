"use client";

import React, { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Layers } from "lucide-react";
import { toast } from "@/components/ui/Toast";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      if (data.success) setCategories(data.categories);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    try {
      const url = editingId ? `/api/categories/${editingId}` : "/api/categories";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(editingId ? "Category updated!" : "Category created!");
        setIsModalOpen(false);
        setName("");
        setDescription("");
        setEditingId(null);
        fetchCategories();
      }
    } catch (err) {
      toast.error("Error saving category.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        toast.success("Category deleted");
        fetchCategories();
      }
    } catch (err) {
      toast.error("Error deleting category");
    }
  };

  return (
    <div className="space-y-8 bg-ceylon-volcanic text-ceylon-ivory min-h-[85vh]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-ceylon-bronze/30">
        <div>
          <h1 className="font-serif-display text-3xl sm:text-4xl font-extrabold text-ceylon-ivory">
            Category Management
          </h1>
          <p className="text-xs text-ceylon-sandstone mt-1 font-light">Organize dishes into menu categories.</p>
        </div>

        <button
          onClick={() => {
            setEditingId(null);
            setName("");
            setDescription("");
            setIsModalOpen(true);
          }}
          className="px-5 py-2.5 rounded-full font-black text-xs uppercase tracking-widest text-ceylon-volcanic bg-ceylon-copper hover:bg-ceylon-saffron transition-all shadow-copper flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </button>
      </div>

      <div className="glass-cocoa rounded-[2.5rem] shadow-volcanic border border-ceylon-copper/30 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-ceylon-volcanic text-ceylon-copper text-xs uppercase font-black tracking-widest border-b border-ceylon-bronze/30">
              <th className="p-4">Category Name</th>
              <th className="p-4">Description</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ceylon-bronze/20 text-sm font-medium text-ceylon-ivory">
            {categories.map((c) => (
              <tr key={c._id} className="hover:bg-ceylon-volcanic/60 transition-colors">
                <td className="p-4 font-bold text-ceylon-ivory">{c.name}</td>
                <td className="p-4 text-xs text-ceylon-sandstone">{c.description || "-"}</td>
                <td className="p-4 text-right space-x-2">
                  <button
                    onClick={() => {
                      setEditingId(c._id);
                      setName(c.name);
                      setDescription(c.description || "");
                      setIsModalOpen(true);
                    }}
                    className="p-2 text-ceylon-copper hover:bg-ceylon-volcanic rounded-lg transition-colors cursor-pointer"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(c._id)} className="p-2 text-rose-400 hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-ceylon-volcanic/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-ceylon-cocoa border-2 border-ceylon-copper/50 rounded-[2rem] p-6 sm:p-8 max-w-md w-full space-y-4 shadow-volcanic text-ceylon-ivory">
            <h3 className="font-serif-display font-extrabold text-2xl text-ceylon-ivory">
              {editingId ? "Edit Category" : "Add Category"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-ceylon-copper uppercase mb-1">Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-ceylon-copper/40 text-sm font-semibold bg-ceylon-volcanic text-ceylon-ivory focus:outline-none focus:border-ceylon-saffron"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-ceylon-copper uppercase mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-ceylon-copper/40 text-sm font-medium bg-ceylon-volcanic text-ceylon-ivory focus:outline-none focus:border-ceylon-saffron"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-ceylon-copper/40 font-bold text-xs text-ceylon-ivory hover:bg-ceylon-volcanic cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl font-black text-xs text-ceylon-volcanic bg-ceylon-copper hover:bg-ceylon-saffron shadow-copper uppercase tracking-widest cursor-pointer transition-all"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
