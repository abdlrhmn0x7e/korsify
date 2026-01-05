"use client";

import { Button } from "@/components/ui/button";
import { studentAuthClient } from "@/lib/student-auth-client";
import { useMutation } from "@tanstack/react-query";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Spinner } from "@/components/ui/spinner";

export function SignUpButton() {
  const student = useQuery(api.studentAuth.getCurrentStudent);

  const { mutate: signIn, isPending } = useMutation({
    mutationFn: async () => {
      await studentAuthClient.signIn.email({
        email: "test2@test.com",
        password: "password1234",
      });
    },
  });
  const { mutate: signUp, isPending: isPendingWithGoogle } = useMutation({
    mutationFn: async () => {
      await studentAuthClient.signUp.email({
        email: "test2@test.com",
        password: "password1234",
        name: "Test User 2",
        teacherId: "123",
      });
    },
  });

  console.log("student", student);

  return (
    <>
      {!student ? (
        <div className="flex items-center gap-2">
          <Button onClick={() => signIn()} disabled={isPending}>
            {isPending ? <Spinner /> : "Sign in"}
          </Button>
          <Button onClick={() => signUp()} disabled={isPendingWithGoogle}>
            {isPendingWithGoogle ? <Spinner /> : "Sign up"}
          </Button>
        </div>
      ) : (
        <h1>{student.name}</h1>
      )}
    </>
  );
}
