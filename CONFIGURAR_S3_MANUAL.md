# Configuración Manual del Bucket S3 - AutoBox

## Problema Actual
El bucket S3 "autobox" es privado por defecto, lo que impide que los videos se reproduzcan desde las URLs públicas.

## Solución: Configurar Acceso Público

### Opción 1: Usar Consola de AWS (Recomendado si no tienes AWS CLI)

#### Paso 1: Desbloquear Acceso Público
1. Ve a [AWS S3 Console](https://s3.console.aws.amazon.com/s3/buckets)
2. Selecciona el bucket **autobox**
3. Ve a la pestaña **"Permissions"** (Permisos)
4. En la sección **"Block public access (bucket settings)"**:
   - Click en **"Edit"**
   - **Desmarca** todas las casillas:
     - ☐ Block all public access
     - ☐ Block public access to buckets and objects granted through new access control lists (ACLs)
     - ☐ Block public access to buckets and objects granted through any access control lists (ACLs)
     - ☐ Block public access to buckets and objects granted through new public bucket or access point policies
     - ☐ Block public and cross-account access to buckets and objects through any public bucket or access point policies
   - Click en **"Save changes"**
   - Escribe **"confirm"** en el diálogo
   - Click en **"Confirm"**

#### Paso 2: Aplicar Política de Bucket
1. Permanece en la pestaña **"Permissions"**
2. Scroll down hasta **"Bucket policy"**
3. Click en **"Edit"**
4. Pega esta política (reemplaza con tu región si es diferente):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::autobox/*"
    }
  ]
}
```

5. Click en **"Save changes"**

#### Paso 3: Configurar CORS
1. Permanece en **"Permissions"**
2. Scroll down hasta **"Cross-origin resource sharing (CORS)"**
3. Click en **"Edit"**
4. Pega esta configuración:

```json
[
  {
    "AllowedOrigins": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
    "AllowedHeaders": ["*"],
    "ExposeHeaders": ["ETag", "Content-Length", "Content-Type"],
    "MaxAgeSeconds": 3000
  }
]
```

5. Click en **"Save changes"**

### Opción 2: Instalar AWS CLI

#### En Linux/macOS:
```bash
# Instalar AWS CLI
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# Configurar credenciales
aws configure
# Ingresa:
# - AWS Access Key ID
# - AWS Secret Access Key  
# - Default region name: sa-east-1
# - Default output format: json

# Ejecutar el script
cd /home/matias/appAutobox/backend-autobox/api
./configure-s3-bucket.sh
```

## Verificar que Funciona

Después de configurar el bucket, prueba acceder a un video directamente en el navegador:

```
https://autobox.s3.sa-east-1.amazonaws.com/vehicles/videos/1762980538938_A282C0ED-3BA2-43EC-BFD7-23AC71CCC0B5.mov
```

Si descarga o reproduce el video, está configurado correctamente.

## Seguridad

⚠️ **IMPORTANTE**: Con esta configuración, TODOS los archivos en el bucket son públicamente accesibles.

Si necesitas privacidad:
- Usa URLs prefirmadas (el código backend ya lo soporta)
- Configura un CDN con CloudFront
- Implementa autenticación en las solicitudes S3

## Alternativa: URLs Firmadas (Ya implementado en el backend)

El backend ya tiene soporte para URLs firmadas que expiran en 1 hora. Para usarlas:

1. Desactiva el código de conversión a URLs públicas en `vehicles.service.ts`
2. Las URLs firmadas se generan automáticamente y son seguras
3. Los videos serán accesibles solo por 1 hora desde la generación de la URL

### Para habilitar URLs firmadas:
El código ya está en el backend, solo necesitas que el bucket tenga permisos para que el backend pueda firmar las URLs.

## Estado Actual del Proyecto

- ✅ Backend: Genera URLs públicas de S3
- ✅ Backend: Tiene soporte para URLs firmadas (método `convertVideoUrls`)
- ✅ Frontend: Muestra videos en cards
- ✅ Frontend: Modal de reproducción con controles nativos
- ❌ **Bucket S3: No tiene permisos públicos** ← Esto es lo que necesitas configurar
- ⚠️ Formato de video: `.mov` puede tener problemas de compatibilidad en Android

## Próximos Pasos

1. **Urgente**: Configurar permisos del bucket S3 (siguiendo este documento)
2. Probar que el video se reproduce en la app
3. Considerar convertir videos a formato `.mp4` para mejor compatibilidad
4. Implementar compresión de videos para reducir tamaño
