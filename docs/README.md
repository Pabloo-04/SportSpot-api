# 🗄️ Documentación de la Base de Datos – SportSpot (MongoDB)

Este documento reúne toda la documentación oficial de la base de datos de SportSpot, incluyendo:

- Descripción general del esquema
- Definición y propósito de cada colección
- Validaciones, restricciones y relaciones
- CRUD de ejemplo por colección
- Justificación técnica de campos

La base de datos está diseñada para permitir una gestión eficiente de reservas, usuarios y canchas en múltiples centros deportivos.

---

## Documentos incluidos

###  1. Documentación general del esquema MongoDB
Contiene:
- Explicación del modelo completo  
- Tipos de datos utilizados  
- Descripcion de cada campo

**Archivo:**  
`Documentacion_SportSpot_MongoDB.pdf`

---

### 2. Documento técnico por colección
Incluye:
- Cada colección de la BD
- Campos, tipos, reglas y propósito
- Relaciones

**Archivo:**  
`Documento_Tecnico_SportSpot_MongoDB_Colecciones.pdf`

---

## 3. Restricciones, Validaciones y Relaciones
Describe:
- Validaciones de Mongoose  
- Restricciones por campo  
- Relaciones entre colecciones (`userId`, `canchaId`, `espacios_reservados`, etc.)

**Archivo:**  
`Restricciones_Validaciones_Relaciones_SportSpot.pdf`

---

## 4. CRUD (por colección)
Incluye:
- Create, Read, Update y Delete  
- Ejemplos reales basados en la BD de SportSpot

**Archivo:**  
`CRUD_Ejemplos_SportSpot.pdf`

---

## Estructura de la Base de Datos (Resumen)

Las colecciones principales son:

- users → Datos del usuario  
- canchas → Información de cada cancha/centro  
- reservas→ Historial y gestión de reservas  

Cada colección tiene su documentación detallada en los archivos PDF incluidos.

---


