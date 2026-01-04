"use client";

import { Button } from "@/components/ui/button";
import { studentAuthClient } from "@/lib/student-auth-client";
import { useMutation } from "@tanstack/react-query";
import { useTeacher } from "../../../_components/teacher-context-provider";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Spinner } from "@/components/ui/spinner";

export function SignUpButton() {
  const student = useQuery(api.studentAuth.getCurrentStudent);
  const teacher = useTeacher();

  console.log("student", student);

  const { mutate: signUp, isPending } = useMutation({
    mutationFn: async () => {
      await studentAuthClient.signUp.email({
        email: "test@test.com",
        password: "password1234",
        name: "Test User",
        teacherId: teacher._id,
      });
    },
  });

  return (
    <>
      {!student ? (
        <Button onClick={() => signUp()} disabled={isPending}>
          {isPending ? <Spinner /> : "Sign Up"}
        </Button>
      ) : (
        <h1>{student.name}</h1>
      )}
    </>
  );
}
