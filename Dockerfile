# Usamos una imagen de Node.js para compilar el proyecto
FROM node:18 AS build

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar los archivos package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar todo el código del proyecto
COPY . .

# Construir el proyecto para producción
RUN npm run build

# Etapa de producción
FROM nginx:alpine

# Copiar los archivos generados por Vite al directorio de Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Exponer el puerto 80
EXPOSE 80

# Configuración de Nginx para servir los archivos estáticos
CMD ["nginx", "-g", "daemon off;"]
