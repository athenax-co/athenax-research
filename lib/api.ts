export const API_BASE_URL = "https://admin.athenax.co/api";

export const CONTENT_DEFAULT_PARAMS = {
  limit: "1000",
  "where[_status][equals]": "published",
};

export const buildContentUrl = (path: string, extraParams = {}) => {
  const params = new URLSearchParams({
    ...CONTENT_DEFAULT_PARAMS,
    ...extraParams,
  });

  return `${API_BASE_URL}${path}?${params.toString()}`;
};

export const fetchFromAPI = async (url: string) => {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch from ${url}`);
    const data = await res.json();
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.docs)) return data.docs;
    if (Array.isArray(data?.data)) return data.data;
    console.error("Unexpected API response structure:", data);
    return [];
  } catch (error) {
    console.error(`Error fetching from ${url}:`, error);
    return [];
  }
};

export const getArticles = () =>
  fetchFromAPI(
    buildContentUrl("/articles", {
      "select[title]": "true",
      "select[slug]": "true",
      "select[publishedAt]": "true",
    })
  );

export const getResearch = () =>
  fetchFromAPI(
    buildContentUrl("/research", {
      "select[title]": "true",
      "select[slug]": "true",
      "select[tag]": "true",
      "select[publishedAt]": "true",
    })
  );

export const getArticleBySlug = async (slug: string) => {
  const items = await fetchFromAPI(
    buildContentUrl("/articles", {
      "where[slug][equals]": slug,
    })
  );
  return items[0] ?? null;
};

export const getResearchBySlug = async (slug: string) => {
  const items = await fetchFromAPI(
    buildContentUrl("/research", {
      "where[slug][equals]": slug,
    })
  );
  return items[0] ?? null;
};

export const sortByPublishedAtDesc = (items = []) =>
  [...items].sort(
    (a: { publishedAt?: string }, b: { publishedAt?: string }) =>
      new Date(b?.publishedAt || 0).getTime() -
      new Date(a?.publishedAt || 0).getTime()
  );

export const formatContentDate = (value: string | number | Date) => {
  if (!value) return "Date unavailable";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const normalizeTag = (tag: string) => (tag || "").trim().toLowerCase();

export const extractContentText = (value: any): string[] => {
  if (!value) return [];
  if (typeof value === "string") {
    return value
      .split(/\n{2,}/)
      .map((chunk) => chunk.trim())
      .filter(Boolean);
  }
  if (Array.isArray(value)) {
    return value.flatMap(extractContentText);
  }
  if (typeof value === "object") {
    if (typeof value.text === "string") return [value.text.trim()].filter(Boolean);
    return Object.values(value).flatMap(extractContentText);
  }
  return [];
};

export const isLexicalContent = (value: any) =>
  Boolean(
    value &&
    typeof value === "object" &&
    value.root &&
    typeof value.root === "object"
  );