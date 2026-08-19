"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Plus, Edit, Trash2, Layers, X, Upload, ImageIcon } from "lucide-react";
import { toast } from "@/components/ui/Toast";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append("file", files[0]);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success && (data.url || data.images?.[0]?.url)) {
        const uploadedUrl = data.url || data.images[0].url;
        setImageUrl(uploadedUrl);
        toast.success("Category image uploaded successfully!");
      } else {
        toast.error(data.error || "Upload failed");
      }
    } catch (err) {
      toast.error("Image upload failed");
    } finally {
      setUploadingImage(false);
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
        body: JSON.stringify({ name, description, image: imageUrl }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(editingId ? "Category updated!" : "Category created!");
        setIsModalOpen(false);
        setName("");
        setDescription("");
        setImageUrl("");
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
    <div className="space-y-8 bg-[#FAF7F2] text-[#071B5C] min-h-[85vh]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-gray-200">
        <div>
          <h1 className="font-serif-display text-3xl sm:text-4xl font-extrabold text-[#071B5C]">
            Category Management
          </h1>
          <p className="text-xs text-gray-500 mt-1 font-light">Organize dishes & category thumbnail images.</p>
        </div>

        <button
          onClick={() => {
            setEditingId(null);
            setName("");
            setDescription("");
            setImageUrl("");
            setIsModalOpen(true);
          }}
          className="px-5 py-2.5 rounded-full font-black text-xs uppercase tracking-widest text-[#071B5C] bg-ceylon-gold hover:bg-[#071B5C] hover:text-white transition-all shadow-gold flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-md border border-gray-200 overflow-hidden text-[#071B5C]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#071B5C] text-white text-xs uppercase font-black tracking-widest">
              <th className="p-4">Image</th>
              <th className="p-4">Category Name</th>
              <th className="p-4">Slug</th>
              <th className="p-4">Description</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-sm font-medium text-[#071B5C]">
            {categories.map((c) => (
              <tr key={c._id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4">
                  {c.image ? (
                    <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-ceylon-gold shadow-sm bg-gray-100">
                      <Image src={c.image} alt={c.name} fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-full border border-gray-300 bg-gray-100 flex items-center justify-center text-gray-400">
                      <ImageIcon className="w-5 h-5" />
                    </div>
                  )}
                </td>
                <td className="p-4 font-bold text-[#071B5C]">{c.name}</td>
                <td className="p-4 text-xs font-mono text-gray-500">{c.slug}</td>
                <td className="p-4 text-xs text-gray-600 font-light">{c.description || "N/A"}</td>
                <td className="p-4 text-right space-x-2">
                  <button
                    onClick={() => {
                      setEditingId(c._id);
                      setName(c.name);
                      setDescription(c.description || "");
                      setImageUrl(c.image || "");
                      setIsModalOpen(true);
                    }}
                    className="p-2 text-[#071B5C] hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(c._id)}
                    className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#071B5C]/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border-2 border-gray-200 rounded-[2.5rem] w-full max-w-md p-6 space-y-5 shadow-2xl text-[#071B5C] my-8">
            <div className="flex justify-between items-center pb-4 border-b border-gray-200">
              <h3 className="font-serif-display font-extrabold text-2xl text-[#071B5C]">
                {editingId ? "Edit Category" : "Add Category"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-[#071B5C] cursor-pointer">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#071B5C] uppercase mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-semibold bg-gray-50 text-[#071B5C] focus:outline-none focus:border-[#071B5C]"
                  placeholder="e.g. Kottu Roti"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#071B5C] uppercase mb-1">Category Image</label>
                {imageUrl ? (
                  <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-ceylon-gold shadow-md mx-auto mb-3 group">
                    <Image src={imageUrl} alt="Category preview" fill className="object-cover" />
                    <button
                      type="button"
                      onClick={() => setImageUrl("")}
                      className="absolute inset-0 bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                ) : null}

                <div className="flex gap-2 items-center">
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="Paste image URL (https://...)"
                    className="flex-1 px-3.5 py-2 rounded-xl border border-gray-300 text-xs bg-gray-50 text-[#071B5C] focus:outline-none focus:border-[#071B5C]"
                  />
                  <label className="px-3.5 py-2 rounded-xl bg-[#071B5C] hover:bg-[#0D2A78] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shrink-0 transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingImage ? "Uploading..." : "Upload"}</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploadingImage} />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#071B5C] uppercase mb-1">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-medium bg-gray-50 text-[#071B5C] focus:outline-none focus:border-[#071B5C]"
                  placeholder="Short description of this category..."
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-full font-black text-sm uppercase tracking-widest text-[#071B5C] bg-ceylon-gold hover:bg-[#071B5C] hover:text-white shadow-gold cursor-pointer transition-all"
              >
                Save Category
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
