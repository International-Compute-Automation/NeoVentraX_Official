/// <reference types="astro/client" />

declare namespace App {
  interface Locals {
    /** live Industries content from the site database (set by src/middleware.ts) */
    site: import('./lib/site-content').SiteContent;
  }
}
