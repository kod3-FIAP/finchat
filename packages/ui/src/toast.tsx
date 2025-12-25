"use client";

import type { ToasterProps } from "sonner";
import { Toaster as Sonner, toast } from "sonner";

import { useTheme } from "./theme";

export const Toaster = ({ ...props }: ToasterProps) => {
	const { themeMode } = useTheme();

	return (
		<Sonner
			className="toaster group"
			style={
				{
					"--normal-bg": "var(--popover)",
					"--normal-border": "var(--border)",
					"--normal-text": "var(--popover-foreground)",
				} as React.CSSProperties
			}
			theme={themeMode === "auto" ? "system" : themeMode}
			{...props}
		/>
	);
};

export { toast };
