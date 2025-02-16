import * as React from "react";
import "../../styles/components.css";

const Button = React.forwardRef(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const baseClass = "button";
    const variantClass = `button-${variant}`;
    const sizeClass = size !== "default" ? `button-${size}` : "";

    const combinedClassName = `${baseClass} ${variantClass} ${sizeClass} ${
      className || ""
    }`;

    return <button className={combinedClassName} ref={ref} {...props} />;
  }
);

Button.displayName = "Button";

export { Button };
