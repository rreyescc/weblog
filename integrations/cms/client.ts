import "server-only";

type FetchCmsOptions = {
  tags?: string[];
};

function getRequiredEnv(name: string) {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function getOptionalAuthHeader() {
  const username = process.env.CMS_USERNAME?.trim();
  const password = process.env.CMS_PASSWORD?.trim();

  if (!username && !password) {
    return undefined;
  }

  if (!username || !password) {
    throw new Error(
      "CMS authentication is misconfigured. Set both CMS_USERNAME and CMS_PASSWORD, or neither.",
    );
  }

  const credentials = `${username}:${password}`;
  return `Basic ${Buffer.from(credentials).toString("base64")}`;
}

export function getCmsHost() {
  return getRequiredEnv("CMS_HOST");
}

export function escapeGraphqlString(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

export async function fetchCms<T>(query: string, options?: FetchCmsOptions): Promise<T> {
  const cmsHost = getCmsHost();
  const authHeader = getOptionalAuthHeader();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (authHeader) {
    headers.Authorization = authHeader;
  }

  const response = await fetch(`${cmsHost}/content/cq:graphql/weblog/endpoint.json`, {
    method: "POST",
    cache: "force-cache",
    headers,
    next: {
      revalidate: false,
      tags: options?.tags ?? ["posts"],
    },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`CMS request failed (${response.status}): ${message}`);
  }

  return response.json() as Promise<T>;
}
