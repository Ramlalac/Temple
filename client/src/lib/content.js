const SECTION_BY_TABLE = {
  events: "events page",
  gallery: "gallery page",
  blogs: "blog page",
  activities: "activities page",
  donation_temples: "donations page"
};

const SECTION_ALIASES = {
  events: new Set(["events", "events page"]),
  gallery: new Set(["gallery", "gallery page"]),
  blogs: new Set(["blog", "blog page", "blogs", "blogs page"]),
  activities: new Set(["activities", "activities page", "activity", "activity page"]),
  donation_temples: new Set(["donations", "donations page", "donation", "donation page"])
};

function slugify(value = "") {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function formatDate(dateValue) {
  if (!dateValue) {
    return "";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  }).format(new Date(dateValue));
}

export function normalizeContentItem(item) {
  const image = item.image_url || item.image || "/assets/vishnu.png";
  const description = item.description || "";

  return {
    ...item,
    image,
    image_url: image,
    slug: item.slug || slugify(item.title || ""),
    excerpt: item.excerpt || description,
    content: item.content || description,
    date: item.date || formatDate(item.created_at),
    category: item.category || ""
  };
}

export function normalizeContentList(items = []) {
  return items.map(normalizeContentItem);
}

export function filterContentBySection(items = [], table) {
  const expectedSection = SECTION_BY_TABLE[table];
  const normalized = normalizeContentList(items);

  if (!expectedSection) {
    return normalized;
  }

  const aliases = SECTION_ALIASES[table] || new Set([expectedSection]);
  const matching = normalized.filter((item) => aliases.has((item.section || "").toLowerCase()));

  if (matching.length > 0) {
    return matching;
  }

  return normalized;
}

export function getSectionForTable(table) {
  return SECTION_BY_TABLE[table] || "";
}
