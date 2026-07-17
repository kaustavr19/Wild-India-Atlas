import { getJournalIndex } from "@/lib/journalIndex";

export const dynamic = "force-static";

export function GET() {
  return Response.json(getJournalIndex(), {
    headers: {
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
