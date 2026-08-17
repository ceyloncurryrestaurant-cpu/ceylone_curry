import { redirect } from "next/navigation";

export default async function ProductRedirectPage({ params }: { params: { id: string } | Promise<{ id: string }> }) {
  const resolvedParams = await Promise.resolve(params);
  redirect(`/menu/${resolvedParams.id}`);
}
