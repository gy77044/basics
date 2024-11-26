import * as React from "react";

function SvgPdf(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg className="icon file-icon file-icon--pdf" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 19.607 24" {...props}>
      <path className="file-icon__shadow" d="M19.592 7.219v-.004c0-.014-.006-.026-.008-.039-.004-.03-.006-.06-.018-.089a.318.318 0 0 0-.055-.085c-.006-.008-.009-.017-.016-.025l-.002-.003-.003-.003-5.451-5.599-.001-.001a.338.338 0 0 0-.238-.102h-.001l-.005-.001H2.947a1.71 1.71 0 0 0-1.708 1.708v19.331a1.71 1.71 0 0 0 1.708 1.708h14.937a1.71 1.71 0 0 0 1.708-1.707V7.221v-.002z" />
      <path className="file-icon__outline" d="M18.354 5.951v-.004c0-.014-.006-.026-.008-.039-.004-.03-.006-.06-.018-.089a.318.318 0 0 0-.055-.085c-.006-.008-.009-.017-.016-.025l-.002-.003-.003-.003L12.801.104 12.8.103a.338.338 0 0 0-.238-.102h-.001L12.556 0H1.708A1.71 1.71 0 0 0 0 1.708v19.331a1.71 1.71 0 0 0 1.708 1.708h14.937a1.71 1.71 0 0 0 1.708-1.707V5.953l.001-.002zm-5.457-4.768l4.305 4.422h-4.305V1.183zm3.749 20.881H1.708c-.565 0-1.025-.46-1.025-1.025V1.708c0-.565.46-1.025 1.025-1.025h10.506v5.264c0 .189.153.342.342.342h5.115v14.75a1.027 1.027 0 0 1-1.025 1.025z" />
      <path className="file-icon__type" d="M6.083 15.424h-.992v1.031h-.66v-3.504c.551 0 1.101-.005 1.652-.005 1.711 0 1.716 2.478 0 2.478zm-.992-.606h.991c.846 0 .841-1.241 0-1.241h-.991v1.241zM10.944 14.674c.015.886-.525 1.781-1.751 1.781H7.817v-3.504h1.376c1.201 0 1.736.857 1.751 1.723zm-2.472 1.145h.721c.796 0 1.111-.58 1.096-1.151-.015-.545-.335-1.091-1.096-1.091h-.721v2.242zM11.531 16.455v-3.498h2.518v.635h-1.857v.956h1.757v.611h-1.757v1.296h-.661z" />
    </svg>
  );
}

export default SvgPdf;