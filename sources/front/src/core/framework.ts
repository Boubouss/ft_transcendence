import { render, reRender, createElement } from "./render.ts";
import { router, navigateTo } from "./router.ts";
import { useState } from "./hooks/useState.ts";
import { useEffect } from "./hooks/useEffect.ts";

export type ComponentProps = {
	id?: string;
	class?: string;
	onClick?: () => void;
};

export type Component = {
	type: string;
	props: ComponentProps | null;
	children: (string | Component)[];
};

export {
	render,
	reRender,
	createElement,
	navigateTo,
	router,
	useState,
	useEffect,
};
