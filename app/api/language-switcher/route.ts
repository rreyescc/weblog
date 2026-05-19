import "server-only";

import { getLanguageSwitcherHrefs } from "@/features/i18n/language-switcher.service";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const pathname = request.nextUrl.searchParams.get("pathname") ?? "/";
  const hrefs = await getLanguageSwitcherHrefs(pathname);

  return Response.json({ hrefs }, { headers: { "Cache-Control": "no-store" } });
}
