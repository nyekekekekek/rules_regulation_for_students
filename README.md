# rules_regulation_for_students

A student-facing guide to computer laboratory rules, with English and Bisaya
language options, adjustable text size, dark mode, rule search, and an equipment
checkout guide.

## Run the desktop app during development

```sh
npm install
npm run app:dev
```

## Build the Windows installer

On a Windows x64 computer, run:

```sh
npm install
npm run app:dist
```

The installer is written to `release/Computer Lab Rules Setup 1.0.0.exe`.
Copy that installer to the other Windows PC and run it to install the app.
After installation, the app works locally and does not require a browser or
internet connection.

## Other checks

```sh
npm run build
npm run lint
```
