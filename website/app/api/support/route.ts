import prisma from "@/prisma/client";

export async function POST(req: Request) {
  const { name, email, message } = (await req.json()) as {
    name?: string;
    email?: string;
    message?: string;
  };

  if (!name) {
    return new Response("Name is required", {
      status: 400,
    });
  }
  if (!email) {
    return new Response("Email is required", {
      status: 400,
    });
  }
  if (!message) {
    return new Response("Message is required", {
      status: 400,
    });
  }

  const newSupportMessage = await prisma.supportMessage.create({
    data: {
      name,
      email,
      message,
    },
  });

  return Response.json(newSupportMessage);
}
