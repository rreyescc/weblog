import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { getPostCacheTag, POSTS_LIST_CACHE_TAG } from "@/features/posts/post.service";
import { revalidateTag } from "next/cache";
import type { NextRequest } from "next/server";
import { z } from "zod";

const revalidatePayloadSchema = z.object({
  entity: z.literal("post"),
  event: z.enum(["created", "updated", "deleted"]),
  slug: z.string().trim().min(1),
  previousSlug: z.string().trim().min(1).optional(),
}).strict();

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

function getTagsToRevalidate(payload: RevalidatePayload) {
  const tags = new Set<string>([POSTS_LIST_CACHE_TAG, getPostCacheTag(payload.slug)]);

  if (payload.previousSlug && payload.previousSlug !== payload.slug) {
    tags.add(getPostCacheTag(payload.previousSlug));
  }

  return Array.from(tags);
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
