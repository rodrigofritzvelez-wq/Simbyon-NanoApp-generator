# 🚀 Symbion NanoApp Generator (IROKU CORE) - Arquitectura SENIN2

[![GitHub Actions Workflow Status](https://github.com/${{ github.repository }}/actions/workflows/main_ci.yml/badge.svg)](https://github.com/${{ github.repository }}/actions/workflows/main_ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE.md)
[![Language: TypeScript/Go/Python](https://img.shields.io/badge/Language-TS%2FGo%2FPy-informational)](https://github.com/${{ github.repository }})

Este repositorio aloja la arquitectura de microservicios y el SDK del **Symbion NanoApp Generator**, una plataforma diseñada para cuantificar la **Incoherencia Sistémica** y generar soluciones de optimización ultraligeras (**IROKU CORE**) mediante algoritmos de **Optimización Cinética Distribuida (KODI)**.

El objetivo es aplicar el Principio Ontológico – **KAKNA MAYAN** para lograr la **Coherencia Fractal Integral** en sistemas industriales (Supply Chain, Healthcare, IoT Energy).

---

## ✨ 1. La Arquitectura SENIN2 (Microservicios)

La plataforma opera un flujo de trabajo asíncrono que transforma los datos de un sistema incoherente en una NanoApp optimizada.

| Microservicio | Tecnología Principal | Propósito SENIN2 |
| :--- | :--- | :--- |
| **Auth Service** | Node.js/TS | Gestiona la Soberanía (API Keys) y el Multi-Tenant RLS. |
| **Analysis Service** | Python (ML) | **Diagnóstico Ontológico.** Clasifica el sistema y calcula el **Coherence Score** inicial. |
| **Optimization Service**| Go | **KODI Core.** Ejecuta el algoritmo de Simulated Annealing para minimizar la Energía Cinética (costos/latencia) y maximizar el ROI. |
| **NanoApp Service** | Node.js/TS | Genera el código ultraligero y ofuscado del **IROKU CORE** (el producto final). |
| **Deployment Service**| Go/K8s API | Despliega el IROKU CORE en entornos Edge/Cloud de cliente. |

---

## 💻 2. SDK y Flujo de Activación

La interacción con la plataforma se realiza a través del **SimbyonClient SDK**. El flujo completo se inicia en la página de activación (`index.html`).

### 2.1 Flujo Operacional

1.  **Carga de Datos:** El cliente sube los datos de rendimiento del sistema (e.g., latencia, inventario).
2.  **Análisis:** El servicio de Análisis detecta el `systemType` y genera las métricas *Before/After* simuladas.
3.  **Optimización KODI:** El servicio KODI ejecuta la simulación para encontrar la configuración de **"Menor Energía"** (mayor coherencia).
4.  **Generación de NanoApp:** Se genera el código JS/Kotlin (IROKU CORE) que contiene la lógica para ejecutar la **Adaptive Coherence Protocol** en el sistema host del cliente.

### 2.2 Dependencias del SDK

Para interactuar con la API, utilice el SDK:

```bash
npm install simbyon-client-sdk
(test compilation)
