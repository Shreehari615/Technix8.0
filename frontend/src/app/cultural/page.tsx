import { redirect } from "next/navigation";

/**
 * Cultural section has been removed.
 * Redirect visitors to the main events page.
 */
export default function CulturalPage() {
  redirect("/events");
}
