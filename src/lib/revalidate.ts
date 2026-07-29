import { revalidatePath } from "next/cache";
import { navigationItems } from "./constants";

function revalidatePostAndHome(articleId: number) {
  revalidatePath(`/post/${articleId}`);
  revalidatePath("/");
}

function revalidateCategoryPages(categorySlug: string) {
  revalidatePath(`/${categorySlug}`);
}

function revalidateSubcategoryPages(categorySlug: string, subcategorySlug: string) {
  revalidatePath(`/${categorySlug}/${subcategorySlug}`);
}

function getSubcategoryParentMap(): Record<string, string> {
  const map: Record<string, string> = {};
  for (const item of navigationItems) {
    for (const sub of item.submenu) {
      const subSlug = sub.href.split("/").pop()!;
      map[subSlug] = item.href.replace("/", "");
    }
  }
  return map;
}

export function revalidateArticle(articleId: number, subcategorySlug?: string) {
  revalidatePostAndHome(articleId);
  if (subcategorySlug) {
    const parentMap = getSubcategoryParentMap();
    const parentSlug = parentMap[subcategorySlug];
    if (parentSlug) {
      revalidateCategoryPages(parentSlug);
      revalidateSubcategoryPages(parentSlug, subcategorySlug);
    }
  }
}

export function revalidateAllPages() {
  revalidatePath("/");
  for (const item of navigationItems) {
    revalidatePath(item.href);
    for (const sub of item.submenu) {
      revalidatePath(sub.href);
    }
  }
}
