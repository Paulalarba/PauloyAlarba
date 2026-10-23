# Paul Alarba portfolio · React frontend

This is a React/Vite frontend built from the ASP.NET MVC portfolio in `../PaulAlarba`. It keeps the existing layout, content, images, styles, and interactive hero. The original MVC project is the reference; it has not been modified.

## Structure

```text
public/                 Original images, resume, and favicon
src/components/         Header, Hero, PortfolioContent, ContactForm, Footer
src/styles/site.css     Original design styles
src/App.jsx             Page composition and scroll reveals
src/main.jsx            React entry point
```

## Run

```powershell
npm install
npm run dev
```

For a production bundle, run `npm run build`. External Google Fonts and Font Awesome require a network connection. The contact form opens the visitor's email client with the message populated; the MVC contact POST uses server antiforgery and is not called by this standalone frontend.
