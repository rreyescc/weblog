import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { getPostCacheTag, getPostsListCacheTag } from "@/features/posts/post.service";
import { getPageCacheTag, getPagesListCacheTag, normalizePagePath } from "@/features/pages/page.service";
import { LOCALES } from "@/lib/i18n";
import { revalidateTag } from "next/cache";
import type { NextRequest } from "next/server";
import { z } from "zod";

const localeSchema = z.enum(LOCALES);

const postPayloadSchema = z.object({
  entity: z.literal("post"),
  event: z.enum(["created", "updated", "deleted"]),
  locale: localeSchema,
  slug: z.string().trim().min(1),
  previousSlug: z.string().trim().min(1).optional(),
}).strict();

const pagePayloadSchema = z.object({
  entity: z.literal("page"),
  event: z.enum(["created", "updated", "deleted"]),
  locale: localeSchema,
  path: z.string().trim().min(1),
  previousPath: z.string().trim().min(1).optional(),
}).strict();

const revalidatePayloadSchema = z.discriminatedUnion("entity", [
  postPayloadSchema,
  pagePayloadSchema,
]);

type RevalidatePayload = z.infer<typeof revalidatePayloadSchema>;

function getRevalidateSecret() {
  const secret = process.env.REVALIDATE_SECRET?.trim();

  if (!secret) {
    throw new Error("Missing required environment variable: REVALIDATE_SECRET");
  }

  return secret;
}

function getExpectedSignature(payload: string) {
  return createHmac("sha256", getRevalidateSecret()).update(payload, "utf8").digest("hex");
}

function normalizeSignature(signature: string) {
  return signature.startsWith("sha256=") ? signature.slice("sha256=".length) : signature;
}

function isValidSignature(rawBody: string, signatureHeader?: string | null) {
  const signature = signatureHeader ? normalizeSignature(signatureHeader.trim()) : "";
  const expectedSignature = getExpectedSignature(rawBody);
  const hasExpectedLength = signature.length === expectedSignature.length;
  const safeSignature = hasExpectedLength ? signature : "0".repeat(expectedSignature.length);
  const signatureBuffer = Buffer.from(safeSignature, "hex");
  const expectedSignatureBuffer = Buffer.from(expectedSignature, "hex");
  const signaturesMatch = timingSafeEqual(signatureBuffer, expectedSignatureBuffer);

  return hasExpectedLength && signaturesMatch;
}

function getPostTagsToRevalidate(locale: RevalidatePayload["locale"], slug: string, previousSlug?: string) {
  const tags = new Set<string>([getPostsListCacheTag(locale), getPostCacheTag(locale, slug)]);

  if (previousSlug && previousSlug !== slug) {
    tags.add(getPostCacheTag(locale, previousSlug));
  }

  return Array.from(tags);
}

function getPageTagsToRevalidate(locale: RevalidatePayload["locale"], path: string, previousPath?: string) {
  const normalizedPath = normalizePagePath(path);
  const tags = new Set<string>([getPagesListCacheTag(locale), getPageCacheTag(locale, normalizedPath)]);

  if (previousPath) {
    const normalizedPreviousPath = normalizePagePath(previousPath);
    if (normalizedPreviousPath !== normalizedPath) {
      tags.add(getPageCacheTag(locale, normalizedPreviousPath));
    }
  }

  return Array.from(tags);
}

function getTagsToRevalidate(payload: RevalidatePayload) {
  if (payload.entity === "post") {
    return getPostTagsToRevalidate(payload.locale, payload.slug, payload.previousSlug);
  }

  return getPageTagsToRevalidate(payload.locale, payload.path, payload.previousPath);
}

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-revalidate-signature");

  if (!isValidSignature(rawBody, signature)) {
    return Response.json({ revalidated: false, message: "Unauthorized" }, { status: 401 });
  }

  let parsedJson: unknown;

  try {
    parsedJson = rawBody ? JSON.parse(rawBody) : {};
  } catch {
    return Response.json({ revalidated: false, message: "Invalid JSON payload" }, { status: 400 });
  }

  const parsedPayload = revalidatePayloadSchema.safeParse(parsedJson);

  if (!parsedPayload.success) {
    return Response.json({ revalidated: false, message: "Invalid revalidation payload" }, { status: 400 });
  }

  const payload: RevalidatePayload = parsedPayload.data;
  const tags = getTagsToRevalidate(payload);

  tags.forEach((tag) => revalidateTag(tag, "max"));

  return Response.json({
    revalidated: true,
    entity: payload.entity,
    event: payload.event,
    tags,
    now: Date.now(),
  });
}
