import prisma from "@/prisma/client";

export async function POST(req: Request) {
  const { email } = (await req.json()) as {
    email?: string;
  };

  if (!email) {
    return new Response("Email is required", {
      status: 400,
    });
  }
  const newEmail = await prisma.notifyEmail.create({
    data: {
      email,
    },
  });

  return Response.json(newEmail);
}
