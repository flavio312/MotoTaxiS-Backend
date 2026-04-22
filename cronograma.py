
import matplotlib.pyplot as plt
import matplotlib.dates as mdates
from datetime import datetime, timedelta
import pandas as pd
import os

# Define the list of activities with ID, description, and due date
activities = [
    (1, "Documentación de problemática", "2026-01-07"),
    (2, "Documentación de historias de usuario", "2026-01-10"),
    (3, "Validación de requerimientos con stakeholders", "2026-01-12"),
    (4, "Definición de arquitectura general", "2026-01-13"),
    (5, "Selección de tecnologías y frameworks", "2026-01-15"),
    (6, "Elaboración de diagramas de componentes", "2026-01-16"),
    (7, "Identificación de entidades", "2026-01-19"),
    (8, "Identificación de relaciones entre entidades", "2026-01-20"),
    (9, "Construcción del modelo ER (1ra versión)", "2026-01-20"),
    (10, "Ajustes según retroalimentación", "2026-01-22"),
    (11, "Construcción del modelo ER (2da versión)", "2026-01-23"),
    (12, "Normalización (1FN, 2FN, 3FN)", "2026-01-23"),
    (13, "Revisión del modelo normalizado", "2026-02-03"),
    (14, "Ajustes finales al modelo", "2026-02-06"),
    (15, "Diagrama entidad-relación definitivo", "2026-02-10"),
    (16, "Creación de tablas e índices", "2026-02-12"),
    (17, "Ingresar datos para catálogos", "2026-02-13"),
    (18, "Crear usuario para conexión API REST", "2026-02-13"),
    (19, "Definición de endpoints y contratos", "2026-02-25"),
    (20, "Implementación de controladores y servicios", "2026-02-27"),
    (21, "Middleware para roles de usuario", "2026-03-02"),
    (22, "WebSocket para monitoreo de servicio", "2026-03-06"),
    (23, "Pruebas con Postman", "2026-03-12"),
    (24, "Configurar proyecto móvil", "2026-03-12"),
    (25, "Pantallas básicas (móvil)", "2026-03-23"),
    (26, "Cámara para foto de perfil", "2026-03-26"),
    (27, "Geolocalizador usuario", "2026-03-26"),
    (28, "Integración API REST (móvil)", "2026-04-06"),
    (29, "Vistas principales del panel", "2026-03-22"),
    (30, "Búsqueda de usuario por nombre", "2026-04-06"),
    (31, "Filtro por roles", "2026-04-06"),
    (32, "Integración API REST (panel)", "2026-03-27"),
    (33, "Casos de prueba unitarios e integración", "2026-04-15"),
    (34, "Pruebas funcionales y rendimiento", "2026-04-15"),
    (35, "Ajustes tras pruebas", "2026-04-20"),
    (36, "Documentación técnica", "2026-04-24"),
    (37, "Manual de usuario", "2026-04-27"),
    (38, "Entrega oficial del sistema", "2026-04-30")
]

# Create a DataFrame
df = pd.DataFrame(activities, columns=["ID", "Actividad", "Fecha"])
df["Fecha"] = pd.to_datetime(df["Fecha"])
df["Inicio"] = df["Fecha"] - pd.to_timedelta(3, unit="d")  # Assume each task takes 3 days
df["Duración"] = df["Fecha"] - df["Inicio"]

# Plotting
plt.style.use('seaborn-v0_8')
fig, ax = plt.subplots(figsize=(12, 14))

# Plot each activity as a horizontal bar
for idx, row in df.iterrows():
    ax.barh(y=row["ID"], width=row["Duración"].days, left=row["Inicio"], height=0.6, align='center', color='skyblue')
    ax.text(row["Inicio"] + timedelta(days=0.2), row["ID"], row["Actividad"], va='center', fontsize=8)

# Formatting
ax.set_xlabel("Fecha")
ax.set_ylabel("ID de Actividad")
ax.set_title("Cronograma de Actividades del Proyecto")
ax.xaxis_date()
ax.xaxis.set_major_formatter(mdates.DateFormatter('%Y-%m-%d'))
plt.xticks(rotation=45)
ax.set_yticks(df["ID"])
ax.set_yticklabels(df["ID"])
plt.tight_layout()

# Save the figure
output_path = "cronograma_actividades.png"
plt.savefig(output_path)

print("Cronograma de actividades generado y guardado como 'cronograma_actividades.png'")

