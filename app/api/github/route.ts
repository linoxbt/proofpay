import { NextResponse } from "next/server";
import { fetchGitHubActivity } from "../../../lib/github";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username");

  if (!username) {
    return NextResponse.json({ error: "Missing username" }, { status: 400 });
  }

  try {
    const token = process.env.GITHUB_TOKEN;
    const data = await fetchGitHubActivity(username, token);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch GitHub activity" },
      { status: 500 }
    );
  }
}
