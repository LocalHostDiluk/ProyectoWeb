// src/Components/MiBreadcrumb.tsx
import React from "react";
import { Breadcrumb } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";

const routeNameMap: Record<string, string> = {
  agregar: "Agregar",
  consultar: "Consultar",
  modificar: "Modificar",
  eliminar: "Eliminar",
  mensajes: "Mensajes",
};

const MiBreadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <Breadcrumb>
      <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>
        Inicio
      </Breadcrumb.Item>
      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join("/")}`;
        const isLast = index === pathnames.length - 1;

        return isLast ? (
          <Breadcrumb.Item active key={to}>
            {routeNameMap[value] || value}
          </Breadcrumb.Item>
        ) : (
          <Breadcrumb.Item linkAs={Link} linkProps={{ to }} key={to}>
            {routeNameMap[value] || value}
          </Breadcrumb.Item>
        );
      })}
    </Breadcrumb>
  );
};

export default MiBreadcrumb;
