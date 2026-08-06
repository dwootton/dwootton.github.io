# dwootton.github.io

A single-file personal site. There is no build step and no package dependency.

## Local preview

```sh
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

## Publishing

GitHub Pages publishes directly from the root of the `main` branch. The root
`CNAME` file keeps the custom domain configured as `www.dylanwootton.com`.
