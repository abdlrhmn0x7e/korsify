"use client";

import { useState } from "react";
import { IconEye, IconEyeOff } from "@tabler/icons-react";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import type { InputProps } from "@/components/ui/input";

interface PasswordInputProps extends Omit<InputProps, "type"> {
  placeholder?: string;
}

function PasswordInput({
  placeholder = "********",
  ...props
}: PasswordInputProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <InputGroup>
      <InputGroupInput
        {...props}
        type={isVisible ? "text" : "password"}
        placeholder={placeholder}
      />
      <InputGroupAddon align="inline-end">
        <InputGroupButton
          type="button"
          variant="ghost"
          size="xs"
          tabIndex={-1}
          onClick={() => setIsVisible((prev) => !prev)}
          aria-label={isVisible ? "Hide password" : "Show password"}
        >
          {isVisible ? (
            <IconEyeOff className="size-4 text-muted-foreground" />
          ) : (
            <IconEye className="size-4 text-muted-foreground" />
          )}
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  );
}

export { PasswordInput };
