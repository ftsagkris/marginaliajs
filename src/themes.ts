const base = `
* { margin: 0; padding: 0; box-sizing: border-box; }
body {
  font-family: var(--font);
  font-size: var(--fs);
  line-height: 1.5;
  max-width: 640px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
  background: var(--bg);
  color: var(--fg);
}
header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}
h1 { font-size: 1.4rem; font-weight: bold; color: var(--heading); }
.rss-link {
  font-size: 0.85em;
  color: var(--link);
  display: inline-flex;
  align-items: center;
  gap: 0.3em;
}
.rss-link:visited { color: var(--visited); }
.rss-link:hover { color: var(--hover); }
hr { border: none; border-top: 1px solid var(--border); margin-bottom: 1rem; }
ul { list-style: none; }
li { padding: 0.45rem 0; }
a { color: var(--link); }
a:visited { color: var(--visited); }
a:hover { color: var(--hover); }
a:active { color: var(--active); }
.meta { color: var(--meta); font-size: 0.85em; }
.empty { color: var(--meta); font-style: italic; padding: 1rem 0; }
footer {
  margin-top: 1.5rem;
  padding-top: 0.75rem;
  border-top: 1px solid var(--border);
  font-size: 0.85em;
  color: var(--meta);
}
footer a { color: var(--link); }
footer a:visited { color: var(--visited); }
@media (max-width: 640px) {
  body { padding: 1.5rem 1rem; }
}`;

const themes: Record<string, string> = {
  classic: `
:root {
  color-scheme: light dark;
  --font: "Times New Roman", "Georgia", serif;
  --fs: 16px;
  --bg: #fff; --fg: #000; --heading: #000;
  --link: #0000ee; --visited: #551a8b; --hover: #0000ee; --active: #ee0000;
  --meta: #666; --border: #999;
}
@media (prefers-color-scheme: dark) { :root {
  --bg: #1a1a1a; --fg: #ccc; --heading: #ddd;
  --link: #6699ff; --visited: #b07cd8; --hover: #6699ff; --active: #ff6666;
  --meta: #888; --border: #444;
}}`,

  terminal: `
:root {
  color-scheme: dark light;
  --font: "SF Mono", "Menlo", "Consolas", "Liberation Mono", monospace;
  --fs: 14px;
  --bg: #1a1a1a; --fg: #b0b0b0; --heading: #d0d0d0;
  --link: #e8a735; --visited: #e8a735; --hover: #f0be50; --active: #a87520;
  --meta: #666; --border: #333;
}
@media (prefers-color-scheme: light) { :root {
  --bg: #faf8f5; --fg: #555; --heading: #333;
  --link: #c07b10; --visited: #c07b10; --hover: #d98e20; --active: #8a5a06;
  --meta: #999; --border: #ddd;
}}

h1 { font-size: 1rem; letter-spacing: 0.04em; text-transform: uppercase; }
header { padding-bottom: 1rem; border-bottom: 1px solid var(--border); margin-bottom: 1.5rem; }
hr { display: none; }
a { text-decoration: none; font-weight: 600; }
a:hover { text-decoration: underline; text-underline-offset: 0.15em; }
li { padding: 0.6rem 0; border-bottom: 1px solid var(--border); }
li:last-child { border-bottom: none; }
.rss-link, .rss-link:visited { color: #777; font-weight: normal; transition: color 0.15s; }
.rss-link:hover { color: var(--link); }
footer a, footer a:visited { color: #777; text-decoration: none; }
footer a:hover { color: var(--link); }`,

  modern: `
:root {
  color-scheme: light dark;
  --font: "Inter", system-ui, -apple-system, sans-serif;
  --fs: 15px;
  --bg: #fafafa; --fg: #444; --heading: #1a1a1a;
  --link: #1a1a1a; --visited: #1a1a1a; --hover: #555; --active: #000;
  --meta: #999; --border: #eaeaea;
}
@media (prefers-color-scheme: dark) { :root {
  --bg: #161616; --fg: #a0a0a0; --heading: #ededed;
  --link: #ededed; --visited: #ededed; --hover: #ccc; --active: #fff;
  --meta: #666; --border: #272727;
}}

body { line-height: 1.65; padding: 3rem 2rem; }
header { margin-bottom: 1.5rem; }
h1 { font-size: 1.6rem; font-weight: 800; letter-spacing: -0.02em; }
hr { display: none; }
a { text-decoration: none; }
a:hover { text-decoration: underline; text-underline-offset: 0.15em; }
li { padding: 0.65rem 0; border-bottom: 1px solid var(--border); }
li:last-child { border-bottom: none; }
.meta { font-size: 0.8em; margin-top: 0.15rem; letter-spacing: 0.01em; }
.rss-link, .rss-link:visited { color: var(--meta); text-decoration: none; font-weight: 500; }
.rss-link:hover { color: var(--link); }
footer { font-size: 0.8em; }
footer a, footer a:visited { color: var(--meta); text-decoration: none; }
footer a:hover { color: var(--link); }
@media (max-width: 640px) { body { padding: 2rem 1rem; } }`,

  daily: `
:root {
  color-scheme: light dark;
  --font: "Georgia", "Times New Roman", serif;
  --fs: 17px;
  --bg: #FAF8F3; --fg: #1A1A1A; --heading: #0A0A0A;
  --link: #111111; --visited: #111111; --hover: #000000; --active: #000000;
  --meta: #6F6F6F; --border: #D8D2C8;
}
@media (prefers-color-scheme: dark) { :root {
  --bg: #1C1A18; --fg: #E8E3DC; --heading: #FFFFFF;
  --link: #F5F5F5; --visited: #F5F5F5; --hover: #FFFFFF; --active: #DDDDDD;
  --meta: #A8A29E; --border: #3A3632;
}}

body { max-width: 680px; line-height: 1.7; }
h1 { font-weight: 700; font-size: 1.8rem; letter-spacing: -0.01em; }
a { text-decoration: none; }
a:hover { text-decoration: underline; }
li { padding: 0.5rem 0; }
.meta { font-size: 0.8em; font-style: italic; }
footer { font-size: 0.8em; }
footer a { color: var(--meta); }`,

  raw: `
:root {
  color-scheme: light dark;
  --font: "Courier New", "Times New Roman", serif;
  --fs: 16px;
  --bg: #E0E0E0; --fg: #000000; --heading: #000000;
  --link: #0000FF; --visited: #551A8B; --hover: #0000FF; --active: #FF0000;
  --meta: #000000; --border: #000000;
}
@media (prefers-color-scheme: dark) { :root {
  --bg: #000000; --fg: #FFFFFF; --heading: #FFFFFF;
  --link: #4DA3FF; --visited: #B48EAD; --hover: #82CFFF; --active: #FF5555;
  --meta: #FFFFFF; --border: #FFFFFF;
}}

body { max-width: none; margin: 0; padding: 8px; line-height: 1.4; }
header { display: block; margin-bottom: 8px; }
h1 {
  font-size: 1.1rem; font-weight: normal; text-transform: uppercase;
  margin-bottom: 4px;
  background: #000; color: #E0E0E0; display: inline-block; padding: 0 10px;
}
hr { display: block; border: none; border-top: 2px solid var(--border); margin: 6px 0 10px 0; }
.rss-link { font-size: 0.75em; }
a { text-decoration: underline; font-weight: normal; }
ul { margin: 0; }
li { border: 1px solid #000; margin-bottom: -1px; padding: 5px; position: relative; }
li:nth-child(odd) { margin-left: 0px; }
li:nth-child(even) { margin-left: 12px; }
li:nth-child(3n) { margin-left: 4px; }
li:nth-child(5n) { transform: translateX(-2px); }
.meta { font-size: 0.75em; margin-left: 6px; }
footer { margin-top: 12px; padding-top: 6px; border-top: 2px solid var(--border); font-size: 0.75em; }`,

  win: `
:root {
  --font: "Tahoma", "MS Sans Serif", "Verdana", sans-serif;
  --fs: 13px;
  --bg: #C0C0C0; --fg: #000000; --heading: #000000;
  --link: #0000FF; --visited: #800080; --hover: #0000FF; --active: #FF0000;
  --meta: #000000;
  --border-light: #FFFFFF; --border-mid: #C0C0C0;
  --border-dark: #808080; --border-darker: #000000;
  --border: #808080;
}
@media (prefers-color-scheme: dark) { :root {
  --bg: #1E1E1E; --fg: #FFFFFF; --heading: #FFFFFF;
  --link: #4DA3FF; --visited: #C586C0; --hover: #82CFFF; --active: #FF5555;
  --meta: #CCCCCC;
  --border-light: #3A3A3A; --border-dark: #000000;
  --border: #3A3A3A;
}}

body { margin: 0; padding: 12px; }
header {
  background: linear-gradient(to right, #000080, #1084D0);
  color: white; padding: 4px 6px; margin-bottom: 6px;
  display: flex; justify-content: space-between; align-items: center;
  font-weight: bold;
}
h1 { font-size: 13px; font-weight: bold; color: white; }
.rss-link, .rss-link:visited, .rss-link:hover { color: white; }
ul {
  background: #C0C0C0; padding: 6px;
  border-top: 2px solid var(--border-dark); border-left: 2px solid var(--border-dark);
  border-bottom: 2px solid var(--border-light); border-right: 2px solid var(--border-light);
}
li { padding: 4px 6px; }
li:hover { background: #000080; }
li:hover a, li:hover .meta { color: #FFFFFF; }
a { color: var(--link); text-decoration: underline; }
a:visited { color: var(--visited); }
.meta { font-size: 11px; margin-top: 2px; }
hr {
  border: none;
  border-top: 2px solid var(--border-dark); border-bottom: 2px solid var(--border-light);
  margin: 6px 0;
}
footer {
  margin-top: 6px; padding: 4px 6px; background: #C0C0C0; font-size: 11px;
  border-top: 2px solid var(--border-dark); border-left: 2px solid var(--border-dark);
  border-bottom: 2px solid var(--border-light); border-right: 2px solid var(--border-light);
}`,
};

export const VALID_THEMES = Object.keys(themes);

export function loadTheme(name: string | undefined): string {
  if (!name) name = "terminal";
  const css = themes[name];
  if (!css) {
    throw new Error(
      `Unknown theme "${name}". Valid themes: ${VALID_THEMES.join(", ")}`,
    );
  }
  return css + "\n" + base;
}
