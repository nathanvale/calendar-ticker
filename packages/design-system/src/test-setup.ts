/**
 * Happy-DOM Test Setup
 *
 * Registers global browser APIs for DOM testing with Bun.
 * This preload file enables document, window, and other browser globals.
 */

import { GlobalRegistrator } from "@happy-dom/global-registrator";

GlobalRegistrator.register();
