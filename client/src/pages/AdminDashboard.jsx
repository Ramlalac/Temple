import { useEffect, useMemo, useRef, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import PageHero from "../components/common/PageHero";
import Seo from "../components/common/Seo";
import { deleteApi, fetchApi, getAuthToken, postApi, putApi, uploadApi } from "../lib/api";
import { getSectionForTable, normalizeContentList } from "../lib/content";

const TABLE_OPTIONS = [
  { value: "events", label: "Events" },
  { value: "gallery", label: "Gallery" },
  { value: "activities", label: "Activities" },
  { value: "blogs", label: "Blogs" },
  { value: "donation_temples", label: "Donation Temple Cards" }
];

const SECTION_OPTIONS = [
  "homepage",
  "events page",
  "gallery page",
  "blog page",
  "activities page",
  "donations page"
];

const CATEGORY_OPTIONS = [
  { value: "", label: "No category" },
  { value: "festival", label: "Festival" },
  { value: "temple", label: "Temple" },
  { value: "event", label: "Event" },
  { value: "Lord Krishna", label: "Lord Krishna" },
  { value: "Radha Rani", label: "Radha Rani" },
  { value: "Lord Balaji", label: "Lord Balaji" },
  { value: "Lord Shiva", label: "Lord Shiva" },
  { value: "Lord Hanuman", label: "Lord Hanuman" },
  { value: "Lord Ganesha", label: "Lord Ganesha" }
];

const EMPTY_FORM = {
  title: "",
  description: "",
  image_url: "",
  section: "events page",
  category: ""
};

function AdminDashboard() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const token = getAuthToken();
  const [selectedTable, setSelectedTable] = useState("events");
  const [data, setData] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [file, setFile] = useState(null);
  const [editingId, setEditingId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const normalizedData = useMemo(() => normalizeContentList(data), [data]);
  const isDonationTempleManager = selectedTable === "donation_temples";

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  async function fetchContent(table = selectedTable) {
    const response = await fetchApi(`/content/${table}`);
    console.log("DATA:", response);
    setData(response);
  }

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      setError("");

      try {
        const response = await fetchApi(`/content/${selectedTable}`);
        console.log("DATA:", response);
        if (mounted) {
          setData(response);
        }
      } catch (loadError) {
        if (mounted) {
          setError(loadError.message || "Unable to load content.");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, [selectedTable]);

  useEffect(() => {
    setForm({
      ...EMPTY_FORM,
      section: getSectionForTable(selectedTable) || "homepage"
    });
    setEditingId("");
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [selectedTable]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function startEdit(item) {
    setEditingId(item.id);
    setError("");
    setSuccess("");
    setForm({
      title: item.title || "",
      description: item.description || "",
      image_url: item.image_url || item.image || "",
      section: item.section || getSectionForTable(selectedTable) || "homepage",
      category: item.category || ""
    });
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function resetForm() {
    setEditingId("");
    setFile(null);
    setForm({
      ...EMPTY_FORM,
      section: getSectionForTable(selectedTable) || "homepage"
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      let imageUrl = form.image_url.trim();

      if (file) {
        const formData = new FormData();
        formData.append("image", file);
        const uploadData = await uploadApi("/upload", formData, { token });

        console.log("UPLOAD RESPONSE:", uploadData);
        imageUrl = uploadData.url;
      }

      const trimmedTitle = form.title.trim();

      if (!imageUrl) {
        throw new Error("Image is required.");
      }

      const payload = {
        ...(trimmedTitle ? { title: trimmedTitle } : {}),
        description: form.description.trim(),
        image_url: imageUrl,
        section: form.section,
        category: form.category
      };

      if (editingId) {
        const updatedItem = await putApi(`/content/${selectedTable}/${editingId}`, payload, { token });
        console.log("UPDATE RESPONSE:", updatedItem);
        setSuccess("Content updated successfully.");
      } else {
        const createdItem = await postApi(`/content/${selectedTable}`, payload, { token });
        console.log("CREATE RESPONSE:", createdItem);
        setSuccess("Content created successfully.");
      }

      resetForm();
      await fetchContent();
    } catch (submitError) {
      console.error("CMS SAVE ERROR:", submitError);

      if (submitError.message === "No token" || submitError.message === "Invalid token") {
        localStorage.removeItem("token");
        navigate("/login", { replace: true });
        return;
      }

      setError(submitError.message || "Unable to save content.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    setDeletingId(id);
    setError("");
    setSuccess("");

    try {
      await deleteApi(`/content/${selectedTable}/${id}`, { token });
      await fetchContent();
      setSuccess("Content deleted successfully.");
    } catch (deleteError) {
      console.error("CMS DELETE ERROR:", deleteError);

      if (deleteError.message === "No token" || deleteError.message === "Invalid token") {
        localStorage.removeItem("token");
        navigate("/login", { replace: true });
        return;
      }

      setError(deleteError.message || "Unable to delete content.");
    } finally {
      setDeletingId("");
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  }

  return (
    <>
      <Seo
        title="Admin CMS | Shree Krishna Devasthana"
        description="Manage events, gallery items, activities, and blogs from a unified temple CMS."
      />
      <PageHero
        title="Admin CMS"
        description="Manage every public content section from one secure dashboard with authenticated uploads and live refreshes."
        image="https://images.unsplash.com/photo-1519817650390-64a93db511aa?auto=format&fit=crop&w=1600&q=80"
      />
      <section className="section-shell py-20">
        <div className="grid gap-8 xl:grid-cols-[0.95fr_1.05fr]">
          <form className="card-surface grid gap-5 p-6 sm:p-8" onSubmit={handleSubmit}>
            <div className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-gold">Content Manager</p>
              <h2 className="font-heading text-3xl text-ink sm:text-4xl">
                {editingId ? "Edit content" : "Create content"}
              </h2>
              <p className="soft-copy text-sm sm:text-base">
                Choose the table, assign the page section, upload media, and publish changes without refreshing the app.
                {isDonationTempleManager
                  ? " For donation temple cards, use Title as the card name and Category as the deity/donation recipient."
                  : ""}
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-white/87">Content Type</span>
                <select
                  className="input-surface bg-gray-800 text-white border border-gray-600 rounded p-2"
                  value={selectedTable}
                  onChange={(event) => setSelectedTable(event.target.value)}
                >
                  {TABLE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-white/87">Section</span>
                <select
                  className="input-surface bg-gray-800 text-white border border-gray-600 rounded p-2"
                  name="section"
                  value={form.section}
                  onChange={handleChange}
                >
                  {SECTION_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-white/87">
                {isDonationTempleManager ? "Deity / Donation For" : "Category"}
              </span>
              <select
                className="input-surface bg-gray-800 text-white border border-gray-600 rounded p-2"
                name="category"
                value={form.category}
                onChange={handleChange}
              >
                {CATEGORY_OPTIONS.map((option) => (
                  <option key={option.value || "none"} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-white/87">Title</span>
              <input
                className="input-surface"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder={isDonationTempleManager ? "Shree Krishna" : "Enter a title"}
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-white/87">Description</span>
              <textarea
                className="input-surface min-h-36 resize-y"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Enter content description"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-white/87">Featured Image</span>
              <input
                ref={fileInputRef}
                className="input-surface file:mr-4 file:rounded-full file:border-0 file:bg-white/10 file:px-4 file:py-2 file:text-sm file:font-medium file:text-ink"
                type="file"
                accept="image/*"
                onChange={(event) => setFile(event.target.files?.[0] || null)}
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-white/87">Existing Image URL</span>
              <input
                className="input-surface"
                name="image_url"
                value={form.image_url}
                onChange={handleChange}
                placeholder="https://..."
              />
            </label>

            <div className="rounded-[1.5rem] border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/75">
              {file ? `Selected image: ${file.name}` : form.image_url ? `Using image URL: ${form.image_url}` : "No image selected yet."}
            </div>

            {error ? (
              <p className="rounded-2xl border border-rose-400/10 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
                {error}
              </p>
            ) : null}

            {success ? (
              <p className="rounded-2xl border border-emerald-400/10 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">
                {success}
              </p>
            ) : null}

            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex justify-center rounded-full bg-gradient-to-r from-saffron to-gold px-6 py-3 text-sm font-semibold text-cosmic transition hover:shadow-glow disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Saving..." : editingId ? "Update Content" : "Add Content"}
              </button>

              <button
                type="button"
                onClick={resetForm}
                className="inline-flex justify-center rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-ink transition hover:bg-white/10"
              >
                Clear Form
              </button>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex justify-center rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-ink transition hover:bg-white/10"
            >
              Logout
            </button>
          </form>

          <div className="card-surface p-6 sm:p-8">
            <div className="flex flex-col gap-2 border-b border-white/10 pb-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-gold">Library</p>
                <h2 className="mt-2 font-heading text-3xl text-ink">
                  {TABLE_OPTIONS.find((option) => option.value === selectedTable)?.label}
                </h2>
              </div>
              <p className="soft-copy text-sm">{loading ? "Loading..." : `${normalizedData.length} item${normalizedData.length === 1 ? "" : "s"}`}</p>
            </div>

            {loading ? (
              <div className="py-10 text-center text-sm text-white/65">Loading content from Supabase...</div>
            ) : normalizedData.length === 0 ? (
              <div className="py-10 text-center text-sm text-white/65">No content found for this table yet.</div>
            ) : (
              <div className="mt-6 grid gap-5">
                {normalizedData.map((item) => (
                  <article
                    key={item.id || item.slug}
                    className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/5 shadow-aura"
                  >
                    <div className="grid gap-0 md:grid-cols-[220px_1fr]">
                      <img
                        src={item.image_url || item.image}
                        alt={item.title}
                        className="h-48 w-full object-cover md:h-full"
                        loading="lazy"
                      />
                      <div className="flex flex-col gap-4 p-5">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">
                            {item.section || "Unassigned section"}
                          </p>
                          <h3 className="mt-2 font-heading text-2xl text-ink">{item.title}</h3>
                          <p className="soft-copy mt-3 text-sm leading-6">{item.description || "No description yet."}</p>
                          {item.category ? (
                            <p className="mt-3 text-xs uppercase tracking-[0.22em] text-white/55">
                              Category: {item.category}
                            </p>
                          ) : null}
                        </div>
                        <div className="mt-auto flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <p className="text-xs text-white/45">ID: {item.id || item.slug || "pending"}</p>
                          <div className="flex gap-3">
                            <button
                              type="button"
                              onClick={() => startEdit(item)}
                              className="inline-flex justify-center rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-ink transition hover:bg-white/10"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(item.id)}
                              disabled={!item.id || deletingId === item.id}
                              className="inline-flex justify-center rounded-full border border-rose-300/20 bg-rose-300/10 px-5 py-2.5 text-sm font-semibold text-rose-100 transition hover:bg-rose-300/20 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {deletingId === item.id ? "Deleting..." : "Delete"}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

export default AdminDashboard;
