import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva("btn", {
  variants: {
    variant: {
      default: "btn-primary",
      outline: "btn-outline",
      secondary: "btn-outline bg-yellow",
      ghost: "btn-ghost",
      destructive: "btn-primary",
      link: "border-0 bg-transparent p-0 min-h-0 text-danger shadow-none hover:translate-x-0 hover:translate-y-0 hover:underline",
    },
    size: {
      default: "",
      xs: "btn-sm min-h-8 px-2.5 text-xs",
      sm: "btn-sm",
      lg: "px-7 py-3.25 text-base",
      icon: "size-10 p-0",
      "icon-xs": "btn-sm size-8 p-0",
      "icon-sm": "btn-sm size-9 p-0",
      "icon-lg": "size-11 p-0",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

function Button({ className, variant = "default", size = "default", ...props }: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return <ButtonPrimitive data-slot="button" className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}

export { Button, buttonVariants };
