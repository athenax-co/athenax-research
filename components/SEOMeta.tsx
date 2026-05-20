import { useEffect } from "react";

export const toSlug = (str: string) => str.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");

const SEOMeta = ({ title, description, type="website", image="" }: { title: string; description: string; type?: string; image?: string }) => {
  useEffect(() => {
    document.title = title;
    const setMeta = (name: string, content: string, prop: boolean = false) => {
      const sel = prop ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let el = document.querySelector(sel);
      if (!el) { el=document.createElement("meta"); prop?el.setAttribute("property",name):el.setAttribute("name",name); document.head.appendChild(el); }
      el.setAttribute("content", content);
    };
    setMeta("description", description);
    setMeta("og:title",       title,       true);
    setMeta("og:description", description, true);
    setMeta("og:type",        type,        true);
    if(image) setMeta("og:image", image, true);
    return () => { document.title = "AthenaX — Discovery Platform for Frontier Products"; };
  }, [title, description]);
  return null;
};

export default SEOMeta;