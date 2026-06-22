import getSupabaseClient from "../config/supabase.js";

const ALLOWED_TABLES = new Set(["events", "gallery", "activities", "blogs", "donation_temples"]);
const FALLBACK_COLUMNS = {
  events: ["id", "title", "description", "image_url", "section", "category", "created_at"],
  gallery: ["id", "title", "description", "image_url", "section", "category", "created_at"],
  activities: ["id", "title", "description", "image_url", "section", "category", "created_at"],
  blogs: ["id", "title", "description", "image_url", "section", "category", "created_at"],
  donation_temples: ["id", "title", "description", "image_url", "section", "category", "created_at"]
};

function getValidatedTable(table) {
  if (!ALLOWED_TABLES.has(table)) {
    return null;
  }

  return table;
}

async function getValidColumns(supabase, table) {
  const { data, error } = await supabase
    .from(table)
    .select("*")
    .limit(1);

  if (error) {
    throw error;
  }

  if (data?.[0]) {
    return Object.keys(data[0]);
  }

  return FALLBACK_COLUMNS[table] || ["title", "description", "image_url", "section", "created_at"];
}

function filterPayload(payload, validColumns) {
  const safePayload = {};

  for (const key of Object.keys(payload)) {
    if (validColumns.includes(key) && payload[key] !== undefined) {
      safePayload[key] = payload[key];
    }
  }

  return safePayload;
}

function getMissingColumnFromError(error) {
  const message = error?.message || "";
  const match = message.match(/Could not find the '([^']+)' column/i);
  return match?.[1] || null;
}

async function executeWithSchemaFallback(operation, table, payload) {
  let safePayload = { ...payload };

  while (Object.keys(safePayload).length > 0) {
    const { data, error } = await operation(safePayload);

    if (!error) {
      return { data, error: null, safePayload };
    }

    const missingColumn = getMissingColumnFromError(error);

    if (!missingColumn || !(missingColumn in safePayload)) {
      return { data: null, error, safePayload };
    }

    console.log(`SCHEMA CACHE MISMATCH: removing '${missingColumn}' from ${table} payload and retrying.`);
    delete safePayload[missingColumn];
  }

  return {
    data: null,
    error: {
      message: `No valid columns left to write for ${table}`
    },
    safePayload
  };
}

export async function getContent(req, res) {
  const table = getValidatedTable(req.params.table);

  if (!table) {
    return res.status(400).json({ error: "Invalid content table" });
  }

  try {
    const supabase = getSupabaseClient();
    let query = supabase
      .from(table)
      .select("*");

    const { data, error } = await query.order("created_at", { ascending: false });

    if (error) {
      const fallback = await query;

      if (fallback.error) {
        return res.status(500).json(fallback.error);
      }

      return res.json(fallback.data);
    }

    return res.json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

export async function createContent(req, res) {
  const table = getValidatedTable(req.params.table);
  const { title, description, image_url, section, category } = req.body;

  if (!table) {
    return res.status(400).json({ error: "Invalid content table" });
  }

  if (!image_url) {
    return res.status(400).json({ error: "image_url is required" });
  }

  try {
    const supabase = getSupabaseClient();
    const validColumns = await getValidColumns(supabase, table);
    console.log("VALID COLUMNS:", table, validColumns);

    const fullPayload = {
      title: title?.trim() || "Untitled Content",
      description: description || "",
      image_url,
      section: section || "",
      category: category || "",
      created_at: new Date().toISOString()
    };
    const payload = filterPayload(fullPayload, validColumns);

    console.log("SAFE PAYLOAD:", table, payload);

    if (validColumns.includes("title") && !payload.title) {
      return res.status(400).json({ error: "title is required" });
    }

    if (Object.keys(payload).length === 0) {
      return res.status(400).json({ error: "No valid columns available for insert" });
    }

    const { data, error, safePayload } = await executeWithSchemaFallback(
      (nextPayload) =>
        supabase
          .from(table)
          .insert([nextPayload])
          .select("*")
          .single(),
      table,
      payload
    );

    if (error) {
      console.log("SAFE PAYLOAD RETRIED:", table, safePayload);
      console.log("SUPABASE ERROR:", table, error);
      return res.status(500).json({
        error: error.message || "Supabase insert failed",
        details: error.details || null,
        hint: error.hint || null,
        code: error.code || null
      });
    }

    return res.json(data);
  } catch (error) {
    console.log("CONTENT CREATE ERROR:", table, error);
    return res.status(500).json({ error: error.message });
  }
}

export async function updateContent(req, res) {
  const table = getValidatedTable(req.params.table);
  const { id } = req.params;
  const { title, description, image_url, section, category } = req.body;

  if (!table) {
    return res.status(400).json({ error: "Invalid content table" });
  }

  if (!id) {
    return res.status(400).json({ error: "Content id is required" });
  }

  try {
    const supabase = getSupabaseClient();
    const validColumns = await getValidColumns(supabase, table);
    console.log("VALID COLUMNS:", table, validColumns);

    const fullPayload = {
      title,
      description,
      image_url,
      section,
      category
    };
    const payload = filterPayload(fullPayload, validColumns);

    console.log("SAFE PAYLOAD:", table, payload);

    if (Object.keys(payload).length === 0) {
      return res.status(400).json({ error: "No valid columns available for update" });
    }

    const { data, error, safePayload } = await executeWithSchemaFallback(
      (nextPayload) =>
        supabase
          .from(table)
          .update(nextPayload)
          .eq("id", id)
          .select("*")
          .single(),
      table,
      payload
    );

    if (error) {
      console.log("SAFE PAYLOAD RETRIED:", table, safePayload);
      console.log("SUPABASE ERROR:", table, error);
      return res.status(500).json({
        error: error.message || "Supabase update failed",
        details: error.details || null,
        hint: error.hint || null,
        code: error.code || null
      });
    }

    return res.json(data);
  } catch (error) {
    console.log("CONTENT UPDATE ERROR:", table, error);
    return res.status(500).json({ error: error.message });
  }
}

export async function deleteContent(req, res) {
  const table = getValidatedTable(req.params.table);
  const { id } = req.params;

  if (!table) {
    return res.status(400).json({ error: "Invalid content table" });
  }

  if (!id) {
    return res.status(400).json({ error: "Content id is required" });
  }

  try {
    const supabase = getSupabaseClient();
    const { error } = await supabase
      .from(table)
      .delete()
      .eq("id", id);

    if (error) {
      return res.status(500).json(error);
    }

    return res.json({ message: "Deleted" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
