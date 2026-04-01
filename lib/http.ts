import { NextResponse } from "next/server.js";

export function buildResourceLocation(
  request: Request,
  resourceId: number | string
) {
  const url = new URL(request.url);
  url.pathname = `${url.pathname.replace(/\/$/, "")}/${resourceId}`;
  return url.toString();
}

export function createdJson(
  request: Request,
  resourceId: number | string,
  body: unknown
) {
  return NextResponse.json(body, {
    status: 201,
    headers: {
      Location: buildResourceLocation(request, resourceId),
    },
  });
}

export function noContent() {
  return new NextResponse(null, { status: 204 });
}
