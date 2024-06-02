"use client";

import { useMutation } from "@tanstack/react-query";
import * as zod from "zod";
import { useToast } from "./ui/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";

const schema = zod.object({
  email: zod.string().email({ message: "Invalid email" }),
});

export function NotifyForm() {
  const { toast } = useToast();

  const form = useForm<zod.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
    },
  });

  const { mutate: submitEmail, isPending } = useMutation({
    mutationFn: async (formData: zod.infer<typeof schema>) => {
      console.log(formData);
      const res = await fetch("/api/notify", {
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
        title: "Success!",
        description: "You've been added to the notification list.",
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
    submitEmail(data);
  }

  return (
    <Form {...form}>
      <form className="flex space-x-2" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="max-w-lg flex-1">
              <FormControl>
                <Input placeholder="Enter your email" {...field} type="email" />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" className="flex gap-2 items-center">
          Notify Me {isPending && <Loader2 className="animate-spin h-4 w-4" />}
        </Button>
      </form>
      {
        form.getFieldState("email").error && (
          <p className="text-xs font-medium text-red-500">
            {form.getFieldState("email").error?.message}
          </p>
        )
      }
      <p className="text-xs text-muted-foreground dark:text-muted-foreground">
        Sign up to get notified when the app launches.
      </p>

    </Form>
  );
}
