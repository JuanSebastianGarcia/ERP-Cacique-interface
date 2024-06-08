# Título del Proyecto
ERP-CACIQUE

## Empresa
Cacique Sport 

## Descripción del Proyecto
ERP-CACIQUE Es un proyecto enfocado en la optimizacion de los procesos internos de la organizaicion, procesos internos como inventario, ventas, pedidos, estadisticas, manejo de empleados,clientes y proveedores.


## Objetivos
- **Objetivo 1:** Desarrollar un proceso eficiente para gestionar el inventario de productos de la empresa.
- **Objetivo 2:**  Implementar un sistema de gestión de empleados, permitiendo acceso a la plataforma de manera segura y eficiente.


## Funcionalidades
- **Funcionalidad 1:** Agregar nuevos productos.
- **Funcionalidad 2:** Gestionar los productos.
- **Funcionalidad 3:** Agregar nuevos empleados.
- **Funcionalidad 4:**  Gestionar la información y roles de los empleados.


## Estructura
- main
  - codigo fuente
  - java
    - config:    clases de configuración de Spring
    - controller:   controladores y APIs del servidor
    - dto:    clases DTO (Data Transfer Object) para el intercambio de información entre back y front
    - exceptions:   clases de manejo de excepciones y errores en el código
    - model:   clases y/o objetos que representan los datos 
    - repository:   clases encargadas de la persistencia de los datos 
    - service:   clases que comunican las APIs con la lógica 
    - utils:  clases para procesos generales que son vitales pero no están relacionados con la lógica de negocio 
- test 
  - pruebas unitarias de los servicios.



    
    
    
    
    
    

## Cómo Ejecutarlo
Para ejecutar este proyecto a nivel local debes 

1.tener tu base de datos corriendo a nivel local o remoto

2. clonar el servidor del back en spring https://github.com/JuanSebastianGarcia/ERP-Cacique-server.git

3. clovar el servidor del fron en angular https://github.com/JuanSebastianGarcia/ERP-Cacique-interface.git

4. configurar el properties para la conexion con tu base de datos
5. ejecutar el proyecto en spring 
6. ejecutar el proyecto en angular

asegurate de descargar las dependencias de cada uno

sprign boot - > ./gradlew build --refresh-dependencies

angular - > npm install
