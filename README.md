# Portfolio

Personal site for Yahya Ayash Luqman. Vite + React + TypeScript, no UI or animation libraries.

```sh
npm install
npm run dev      # local dev server
npm run build    # type-check and build to dist/
```

## Where things are

- `src/content.ts`: all copy, project data and contact links.
- `src/components/`: one component per page section.
- `src/motion/engine.ts`: a single animation loop that drives every scroll- and pointer-linked effect by writing CSS custom properties. The list of hooks it looks for is at the top of the file.
- `src/motion/gl.ts`: the two WebGL fragment shaders (hero blob, footer terrain).
- `src/styles.css`: all styling, including what each custom property does.

Motion is disabled for visitors with `prefers-reduced-motion`, and the boot screen plays once per browser session.
