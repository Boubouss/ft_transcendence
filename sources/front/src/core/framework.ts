import { render, reRender, createElement } from "./render.ts";
import { router, navigateTo } from "./router.ts";
import { useState } from "./hooks/useState.ts";
import { useEffect } from "./hooks/useEffect.ts";

export type ComponentAttr = {
	id?: string;
	class?: string;
	onClick?: () => void;
	name?: string;
	type?: string;
	placeholder?: string;
	src?: string;
};

export type Component = {
	type: string;
	attr: ComponentAttr | null;
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
