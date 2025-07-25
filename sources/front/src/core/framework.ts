import { render, reRender, createElement } from "./render.ts";
import { router, navigateTo } from "./router.ts";
import { useState } from "./hooks/useState.ts";
import { useEffect } from "./hooks/useEffect.ts";
import { useRef } from "./hooks/useRef.ts";

export type ComponentAttr = {
  id?: string;
  class?: string;
  src?: string;
  onClick?: () => void;
  onChange?: () => void;
  name?: string;
  type?: string;
  placeholder?: string;
  ref?: { current: HTMLElement | null };
  checked?: boolean;
  readonly?: boolean;
  disabled?: boolean;
  for?: string;
  style?: string;
  accept?: string;
  value?: string | number | null;
  min?: number;
};

type Self = {
  type: string;
  attr: ComponentAttr | null;
  children: Component[];
};

export type Component = string | false | null | Self;

export {
  render,
  reRender,
  createElement,
  navigateTo,
  router,
  useState,
  useEffect,
  useRef,
};
