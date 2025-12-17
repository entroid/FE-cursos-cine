# UI Components Reference

Esta guía documenta los componentes base del sistema de diseño (Cards y Botones) y cómo utilizarlos correctamente en la aplicación.

## Button

Componente de botón versátil que soporta múltiples variantes, tamaños y renderizado polimórfico (como link).

**Importación:**
```tsx
import { Button } from "@/components/ui/button"
```

### Variantes

El sistema utiliza 3 colores semánticos, cada uno con 2 estados (outline y filled):

| Variante | Descripción | Uso Recomendado |
|----------|-------------|-----------------|
| `primary` | Borde primario, fondo transparente | Acciones principales, formularios (Submit), Botones "Guardar" |
| `primary-filled` | Fondo primario, texto contraste | Acciones de alta prioridad o para variar visualmente del primary standard |
| `accent` | Borde acento, fondo transparente | Navegación secundaria, "Anterior/Siguiente" |
| `accent-filled` | Fondo acento, texto contraste | CTAs principales ("Comprar Ahora", "Continuar Curso") |
| `destructive` | Borde destructivo, texto rojo | Acciones peligrosas secundarias ("Cerrar sesión") |
| `destructive-filled` | Fondo destructivo | Acciones peligrosas principales ("Eliminar cuenta") |

### Tamaños

| Size | Prop | Descripción |
|------|------|-------------|
| Small | `size="sm"` | `px-3 py-1.5` - Para tablas o UI densa |
| Medium | `size="md"` | `px-4 py-2` - **Default**. Botones estándar |
| Large | `size="lg"` | `px-6 py-3` - Hero sections o CTAs grandes |

### Ejemplos de Uso

**Botón Estándar:**
```tsx
<Button variant="primary" onClick={handleSubmit}>
    Guardar Cambios
</Button>
```

**Botón como Link (Navegación):**
Utiliza la prop `asChild` para renderizar un componente `Link` de Next.js manteniendo los estilos del botón.
```tsx
<Button variant="accent-filled" asChild>
    <Link href="/dashboard">
        Ir al Dashboard
    </Link>
</Button>
```

**Botón Full Width:**
Acepta clases utilitarias de Tailwind vía `className`.
```tsx
<Button variant="primary" className="w-full">
    Ingresar
</Button>
```

**Estado Loading/Disabled:**
```tsx
<Button disabled>
    {loading ? "Cargando..." : "Enviar"}
</Button>
```

---

## Card

Componentes contenedores para agrupar contenido. Existen dos variantes principales.

**Importación:**
```tsx
import { Card, CardInteractive } from "@/components/ui/card"
```

### 1. Card (Estática)
Contenedor simple con borde, fondo y sombra suave. Ideal para secciones de contenido, formularios y paneles informativos.

**Props:**
- `padding`: Controla el padding interno.
    - `none`: `p-0` (útil si necesitas control total o grids internos)
    - `sm`: `p-4`
    - `md`: `p-6` (**Default**)
    - `lg`: `p-8`
- `className`: Clases adicionales.

**Ejemplo:**
```tsx
<Card padding="lg">
    <h2 className="text-xl mb-4">Título de la Sección</h2>
    <p>Contenido del card...</p>
</Card>
```

### 2. CardInteractive
Variante diseñada para elementos clickeables o items de grid (como cursos).
- **Sin padding por defecto** (permite imágenes full-width).
- **Efectos de hover**: Sombra más pronunciada y borde coloreado al pasar el mouse.
- `group`: Clase automática para permitir efectos en hijos (`group-hover`).

**Ejemplo (Grid de Cursos):**
```tsx
<CardInteractive className="h-full flex flex-col">
    {/* Imagen full width */}
    <div className="aspect-video bg-gray-200 relative">
        <Image src="..." fill alt="..." />
    </div>
    
    {/* Contenido con padding manual */}
    <div className="p-4">
        <h3 className="group-hover:text-primary transition-colors">
            Título del Curso
        </h3>
    </div>
</CardInteractive>
```

---

## Principios de Diseño
- **Bordes**: `border-2` (botones) y `border` (cards) sólido.
- **Rounded**: **NO** utilizamos bordes redondeados (`rounded-none` implícito) para una estética editorial/brutalista.
- **Tipografía**: Botones siempre `uppercase` y `font-light`.
- **Interacción**: Estados claros de `:hover` y `:focus-visible`.
