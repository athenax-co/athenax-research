// const API_BASE_URL = "https://admin.athenax.co/api";

// const CONTENT_DEFAULT_PARAMS = {
//   limit: "1000",
//   "where[_status][equals]": "published",
// };

// const buildContentUrl = (path: string, extraParams = {}) => {
//   const params = new URLSearchParams({
//     ...CONTENT_DEFAULT_PARAMS,
//     ...extraParams,
//   });

//   return `${API_BASE_URL}${path}?${params.toString()}`;
// };

// const fetchFromAPI = async (url: string) => {
//   try {
//     const res = await fetch(url);
//     if (!res.ok) throw new Error(`Failed to fetch from ${url}`);
//     const data = await res.json();
//     if (Array.isArray(data)) return data;
//     if (Array.isArray(data?.docs)) return data.docs;
//     if (Array.isArray(data?.data)) return data.data;
//     console.error("Unexpected API response structure:", data);
//     return [];
//   } catch (error) {
//     console.error(`Error fetching from ${url}:`, error);
//     return [];
//   }
// };

// export const getResearch = () =>
//   fetchFromAPI(
//     buildContentUrl("/research", {
//       "select[title]": "true",
//       "select[slug]": "true",
//       "select[tag]": "true",
//       "select[publishedAt]": "true",
//     })
//   );

// export const getResearchBySlug = async (slug: string) => {
//   const items = await fetchFromAPI(
//     buildContentUrl("/research", {
//       "where[slug][equals]": slug,
//     })
//   );
//   return items[0] ?? null;
// };

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

const WORDS_PER_MINUTE = 220;

export const estimateReadTime = (content: string): number => {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
};

