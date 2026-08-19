"use client";

import React, { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Tag, Upload, X, Check, Flame } from "lucide-react";
import { toast } from "@/components/ui/Toast";

function getImageUrl(item: any): string | null {
  if (!item) return null;
  if (typeof item === "string" && item.trim().length > 0) return item;
  if (Array.isArray(item)) {
    if (item.length === 0) return null;
    return getImageUrl(item[0]);
  }
  if (item.url && typeof item.url === "string") return item.url;
  if (item.image && typeof item.image === "string") return item.image;
  if (item.images) return getImageUrl(item.images);
  return null;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form Fields
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [ingredientsStr, setIngredientsStr] = useState("");
  const [allergensStr, setAllergensStr] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);

  // Offer fields
  const [isOffer, setIsOffer] = useState(false);
  const [offerPrice, setOfferPrice] = useState("");

  // Images state (max 4 images)
  const [images, setImages] = useState<any[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Delete modal state
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      if (data.success) setProducts(data.products);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      if (data.success) {
        setCategories(data.categories);
        if (data.categories.length > 0 && !categoryId) {
          setCategoryId(data.categories[0]._id);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenAddModal = () => {
    setEditingId(null);
    setName("");
    setShortDescription("");
    setDescription("");
    setPrice("");
    setIngredientsStr("");
    setAllergensStr("");
    setIsAvailable(true);
    setIsFeatured(false);
    setIsOffer(false);
    setOfferPrice("");
    setImages([]);
    if (categories.length > 0) setCategoryId(categories[0]._id);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (p: any) => {
    setEditingId(p._id);
    setName(p.name);
    setCategoryId(p.categoryId?._id || p.categoryId);
    setShortDescription(p.shortDescription || "");
    setDescription(p.description || "");
    setPrice(p.price.toString());
    setIngredientsStr(p.ingredients ? p.ingredients.join(", ") : "");
    setAllergensStr(p.allergens ? p.allergens.join(", ") : "");
    setIsAvailable(p.isAvailable !== false);
    setIsFeatured(p.isFeatured || false);
    setIsOffer(p.isOffer || false);
    setOfferPrice(p.offerPrice ? p.offerPrice.toString() : "");
    setImages(p.images || []);
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (images.length + files.length > 4) {
      toast.error("Maximum 4 images allowed per product.");
      return;
    }

    setUploadingImage(true);
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("file", files[i]);
    }

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success && data.images) {
        setImages((prev) => [...prev, ...data.images].slice(0, 4));
        toast.success("Image uploaded!");
      } else {
        toast.error(data.error || "Upload failed");
      }
    } catch (err) {
      toast.error("Image upload failed");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !categoryId) {
      toast.error("Please fill required fields (Name, Category, Price).");
      return;
    }

    const payload = {
      name,
      categoryId,
      shortDescription,
      description,
      price: parseFloat(price),
      ingredients: ingredientsStr.split(",").map((s) => s.trim()).filter(Boolean),
      allergens: allergensStr.split(",").map((s) => s.trim()).filter(Boolean),
      isAvailable,
      isFeatured,
      isOffer,
      offerPrice: isOffer && offerPrice ? parseFloat(offerPrice) : undefined,
      images,
    };

    try {
      const url = editingId ? `/api/products/${editingId}` : "/api/products";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(editingId ? "Product updated!" : "Product added!");
        setIsModalOpen(false);
        fetchProducts();
      } else {
        toast.error(data.error || "Failed to save product.");
      }
    } catch (err) {
      toast.error("An error occurred.");
    }
  };

  const handleDeleteProduct = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/products/${deleteId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        toast.success("Product deleted along with Cloudinary images!");
        setDeleteId(null);
        fetchProducts();
      } else {
        toast.error(data.error || "Delete failed");
      }
    } catch (err) {
      toast.error("Delete error");
    }
  };

  return (
    <div className="space-y-8 bg-[#FAF7F2] text-[#071B5C] min-h-[85vh]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-gray-200">
        <div>
          <h1 className="font-serif-display text-3xl sm:text-4xl font-extrabold text-[#071B5C]">
            Product Management
          </h1>
          <p className="text-xs text-gray-500 mt-1 font-light">
            Add, update, manage Cloudinary images (max 4), and toggle daily offers.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-5 py-2.5 rounded-full font-black text-xs uppercase tracking-widest text-[#071B5C] bg-ceylon-gold hover:bg-[#071B5C] hover:text-white transition-all shadow-gold flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Product List Table */}
      {loading ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 shadow-md">
          <div className="animate-spin w-8 h-8 border-4 border-[#071B5C] border-t-transparent rounded-full mx-auto" />
        </div>
      ) : (
        <div className="bg-white rounded-[2.5rem] shadow-md border border-gray-200 overflow-hidden text-[#071B5C]">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#071B5C] text-white text-xs uppercase font-black tracking-widest">
                  <th className="p-4">Image</th>
                  <th className="p-4">Dish Name</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Offer State</th>
                  <th className="p-4">Available</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-sm font-medium text-[#071B5C]">
                {products.map((p) => {
                  const firstImg = getImageUrl(p);
                  return (
                    <tr key={p._id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center">
                          {firstImg ? (
                            <img src={firstImg} alt={p.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-[10px] text-gray-400 p-1 block text-center">No Img</span>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="font-bold text-[#071B5C] block">{p.name}</span>
                        {p.isFeatured && (
                          <span className="text-[10px] text-ceylon-gold font-bold uppercase inline-flex items-center gap-0.5">
                            <Flame className="w-3 h-3 fill-current text-ceylon-gold" /> Favourite
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-xs font-medium text-gray-600">
                        {p.categoryId?.name || "Uncategorized"}
                      </td>
                      <td className="p-4 font-bold text-[#071B5C]">
                        £{p.price.toFixed(2)}
                      </td>
                      <td className="p-4">
                        {p.isOffer && p.offerPrice ? (
                          <span className="px-2.5 py-1 rounded-full bg-ceylon-red text-white text-xs font-extrabold shadow-sm">
                            £{p.offerPrice.toFixed(2)} ({p.discountPercentage}% OFF)
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400">Regular</span>
                        )}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                            p.isAvailable !== false
                              ? "bg-emerald-100 text-emerald-700 border border-emerald-300"
                              : "bg-gray-100 text-gray-500 border border-gray-300"
                          }`}
                        >
                          {p.isAvailable !== false ? "Yes" : "No"}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => handleOpenEditModal(p)}
                          className="p-2 text-[#071B5C] hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                          title="Edit Product"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteId(p._id)}
                          className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#071B5C]/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border-2 border-gray-200 rounded-[2.5rem] w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl text-[#071B5C]">
            <div className="flex justify-between items-center pb-4 border-b border-gray-200">
              <h3 className="font-serif-display font-extrabold text-2xl text-[#071B5C]">
                {editingId ? "Edit Product" : "Add New Dish"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-[#071B5C] transition-colors cursor-pointer">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#071B5C] uppercase mb-1">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-semibold bg-gray-50 text-[#071B5C] focus:outline-none focus:border-[#071B5C]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#071B5C] uppercase mb-1">Category *</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-semibold bg-gray-50 text-[#071B5C] focus:outline-none focus:border-[#071B5C]"
                  >
                    {categories.map((c) => (
                      <option key={c._id} value={c._id} className="bg-white text-[#071B5C]">
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#071B5C] uppercase mb-1">Regular Price (£) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-semibold bg-gray-50 text-[#071B5C] focus:outline-none focus:border-[#071B5C]"
                  />
                </div>

                <div className="flex items-center gap-6 pt-5">
                  <label className="flex items-center gap-2 text-xs font-bold text-[#071B5C] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isAvailable}
                      onChange={(e) => setIsAvailable(e.target.checked)}
                      className="rounded accent-[#071B5C]"
                    />
                    Available
                  </label>
                  <label className="flex items-center gap-2 text-xs font-bold text-ceylon-gold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isFeatured}
                      onChange={(e) => setIsFeatured(e.target.checked)}
                      className="rounded accent-[#071B5C]"
                    />
                    Featured Favourite
                  </label>
                </div>
              </div>

              {/* Offer Toggle */}
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-3">
                <label className="flex items-center gap-2 font-bold text-ceylon-red text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isOffer}
                    onChange={(e) => setIsOffer(e.target.checked)}
                    className="rounded accent-ceylon-red"
                  />
                  <span>Available on Daily Special Offer?</span>
                </label>

                {isOffer && (
                  <div>
                    <label className="block text-xs font-bold text-ceylon-red uppercase mb-1">Offer Price (£)</label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="e.g. 9.99"
                      value={offerPrice}
                      onChange={(e) => setOfferPrice(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl border border-ceylon-red/50 text-sm font-bold bg-white text-[#071B5C] focus:outline-none focus:border-[#071B5C]"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-[#071B5C] uppercase mb-1">Short Description</label>
                <input
                  type="text"
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-medium bg-gray-50 text-[#071B5C] focus:outline-none focus:border-[#071B5C]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#071B5C] uppercase mb-1">Full Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-medium bg-gray-50 text-[#071B5C] focus:outline-none focus:border-[#071B5C]"
                />
              </div>

              {/* Cloudinary Image Uploader (Max 4 Images) */}
              <div>
                <label className="block text-xs font-bold text-[#071B5C] uppercase mb-1">
                  Product Images (Maximum 4 Cloudinary Images)
                </label>
                <div className="grid grid-cols-4 gap-3">
                  {images.map((img, i) => {
                    const imgUrl = getImageUrl(img);
                    return (
                      <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-gray-300 group bg-gray-100 flex items-center justify-center">
                        {imgUrl ? (
                          <img src={imgUrl} alt={`Upload ${i + 1}`} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-[9px] text-gray-400">No URL</span>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(i)}
                          className="absolute top-1 right-1 p-1 bg-rose-600 text-white rounded-full text-xs shadow-md opacity-90 hover:opacity-100 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    );
                  })}

                  {images.length < 4 && (
                    <label className="aspect-square rounded-xl border-2 border-dashed border-gray-300 hover:border-[#071B5C] flex flex-col items-center justify-center cursor-pointer bg-gray-50 transition-colors">
                      <Upload className="w-5 h-5 text-[#071B5C] mb-1" />
                      <span className="text-[10px] font-bold text-[#071B5C]">
                        {uploadingImage ? "Uploading..." : `Upload (${4 - images.length} left)`}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        disabled={uploadingImage}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-full font-black text-sm uppercase tracking-widest text-[#071B5C] bg-ceylon-gold hover:bg-[#071B5C] hover:text-white shadow-gold cursor-pointer transition-all"
              >
                Save Product
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 bg-[#071B5C]/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white border-2 border-gray-200 rounded-[2rem] p-6 max-w-sm w-full space-y-4 text-center text-[#071B5C] shadow-2xl">
            <h3 className="font-serif-display font-extrabold text-2xl text-[#071B5C]">Delete Product?</h3>
            <p className="text-xs text-gray-500">
              This will permanently remove the product and associated Cloudinary images.
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 py-2.5 rounded-xl border border-gray-300 font-bold text-xs text-[#071B5C] hover:bg-gray-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteProduct}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
