"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as zod from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "./ui/use-toast";
import { Loader2 } from "lucide-react";

const schema = zod.object({
  name: zod
    .string()
    .min(1, { message: "Name is required" })
    .max(255, { message: "Name is too long" }),
  email: zod.string().email({ message: "Invalid email" }),
  message: zod
    .string()
    .min(1, { message: "Message is required" })
    .max(1000, { message: "Message is too long" }),
});

export function SupportForm() {
  const form = useForm<zod.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    }
  });

  const { toast } = useToast();

  const { mutate: submitForm, isPending } = useMutation({
    mutationFn: async (formData: zod.infer<typeof schema>) => {
      const res = await fetch("/api/support", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data);
      }

      return data;
    },
    onSuccess: () => {
      form.reset();
      toast({
        title: "Message sent",
        description: "We will get back to you shortly!",
      });
    },
    onError: (err) => {
      console.log(err);
      toast({
        title: "An error occurred",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  function onSubmit(data: zod.infer<typeof schema>) {
    console.log(data);
    submitForm(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Enter your name..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Enter your email..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder="Enter your message..."
                  {...field}
                  className="min-h-[150px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full flex items-center gap-2">
          Submit {isPending && <Loader2 className=" animate-spin  h-4 w-4" />}
        </Button>
      </form>
    </Form>
  );
}
