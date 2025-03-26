import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const authToken = (await cookies()).get("auth_token")?.value;

  if (!authToken) {
    redirect("/login");
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <p>Welcome to your protected dashboard!</p>
    </div>
  );
}
