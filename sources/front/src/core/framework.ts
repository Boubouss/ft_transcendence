import { render, reRender, createElement } from "./render.ts";
import { router, navigateTo } from "./router.ts";
import { useState } from "./hooks/useState.ts";
import { useEffect } from "./hooks/useEffect.ts";

export type ComponentChildren = string | Component | false | null;

export type ComponentAttr = {
	id?: string;
	class?: string;
	src?: string;
	onClick?: () => void;
	name?: string;
	type?: string;
	placeholder?: string;
	ref?: { current: HTMLElement | null };
	value?: string | number | null;
};

export type Component = {
	type: string;
	attr: ComponentAttr | null;
	children: ComponentChildren[];
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
