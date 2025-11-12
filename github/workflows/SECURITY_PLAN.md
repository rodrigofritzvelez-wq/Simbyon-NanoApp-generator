# 🔒 Plan de Seguridad Operacional y Blindaje de IP (SENIN2)
## Symbion NanoApp Generator v1.0

Este documento formaliza las estrategias de seguridad implementadas para proteger la Propiedad Intelectual central (Algoritmos KODI y Coherence Score) de Symbion y garantizar el aislamiento total de los datos del cliente, conforme al principio de Coherencia Ética AMI – Equilibrio Luz-Sombra.

---

## 1. Blindaje de Propiedad Intelectual (IP)

### 1.1 Ofuscación del Código de la NanoApp (IROKU CORE)

| Aspecto | Implementación | Propósito |
| :--- | :--- | :--- |
| **Alcance** | Código fuente (`sourceCode`) generado por el NanoApp Service. | Proteger el valor de la IP. |
| **Técnica** | Renombramiento de variables y funciones clave (KODI, Coherence) y aplanamiento de flujo de control. | Hacer la ingeniería inversa económicamente inviable. |

### 1.2 Licenciamiento IROKU CORE (Contrato Lumínico)

* **Mecanismo:** El código generado incluye una clave hash de licencia validada contra el `tenant_id` y el `optimization_id` en tiempo de ejecución.
* **Restricción Legal:** El `Luminous Contract` (registrado en la SimbioChain local) prohíbe explícitamente la ingeniería inversa, re-venta o el uso en sistemas no licenciados, respaldando la protección legal.

---

## 2. Seguridad Operacional y Aislamiento Multi-Tenant

### 2.1 Aislamiento de Datos (PostgreSQL RLS)

* **Control:** **Row-Level Security (RLS)** activado en la base de datos PostgreSQL.
* **Mecanismo:** El API Gateway fuerza la inclusión de `WHERE tenant_id = current_tenant_id()` en todas las consultas de acceso a datos (`data_uploads`, `system_analyses`, `nano_apps`).
* **Resultado:** Un inquilino nunca puede acceder a los datos de otro, garantizando el aislamiento total requerido por GDPR/HIPAA.

### 2.2 Gestión de Credenciales (Protocolo Anti-Reseteo)

* **Password Hashing:** Se utiliza **Argon2** o **Bcrypt** para almacenar los hashes de las contraseñas de la tabla `users`.
* **Rotación de API Keys:** Se impone una rotación forzada automática cada **90 días** para las claves Enterprise (tabla `api_keys`). Las claves antiguas son revocadas (`revoked_at` TIMESTAMP).

---

## 3. Conformidad y Monitoreo de Seguridad

### 3.1 Conformidad Normativa

* **GDPR:** Aislamiento RLS y endpoints de gestión de datos personales.
* **HIPAA:** Cifrado de datos en reposo y en tránsito (`TLS 1.3`, `AES-256`) con *audit trail* completo en `usage_logs` para datos del tipo `healthcare`.

### 3.2 Monitoreo de Coherencia de Seguridad

El **Usage Logs** y el *ELK Stack* son monitoreados para detectar anomalías:

| Métrica | Localización | Umbral Crítico |
| :--- | :--- | :--- |
| **Intentos de Acceso No Autorizado** | `usage_logs` / `Auth Service` | > 100 intentos fallidos por minuto por IP. |
| **Errores de RLS** | Logs de PostgreSQL | Cualquier ocurrencia (`> 0`) en producción. |
| **Latencia de Desencriptado** | Metrics Stack | > 50ms (Indica posible cuello de botella en el hardware de seguridad). |
