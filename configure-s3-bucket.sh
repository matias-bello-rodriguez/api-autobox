#!/bin/bash

# Script para configurar permisos del bucket S3
# Este script hace que los archivos en el bucket sean accesibles públicamente

BUCKET_NAME="autobox"
REGION="sa-east-1"

echo "🔧 Configurando bucket S3: $BUCKET_NAME"
echo "📍 Región: $REGION"
echo ""

# 1. Desbloquear acceso público del bucket
echo "1️⃣ Desbloqueando acceso público..."
aws s3api put-public-access-block \
    --bucket $BUCKET_NAME \
    --public-access-block-configuration "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false" \
    --region $REGION

if [ $? -eq 0 ]; then
    echo "✅ Acceso público desbloqueado"
else
    echo "❌ Error al desbloquear acceso público"
    exit 1
fi

echo ""

# 2. Aplicar política de bucket para lectura pública
echo "2️⃣ Aplicando política de lectura pública..."
cat > /tmp/bucket-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::${BUCKET_NAME}/*"
    }
  ]
}
EOF

aws s3api put-bucket-policy \
    --bucket $BUCKET_NAME \
    --policy file:///tmp/bucket-policy.json \
    --region $REGION

if [ $? -eq 0 ]; then
    echo "✅ Política de bucket aplicada"
else
    echo "❌ Error al aplicar política de bucket"
    exit 1
fi

rm /tmp/bucket-policy.json

echo ""

# 3. Configurar CORS
echo "3️⃣ Configurando CORS..."
cat > /tmp/cors-config.json << EOF
{
  "CORSRules": [
    {
      "AllowedOrigins": ["*"],
      "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
      "AllowedHeaders": ["*"],
      "ExposeHeaders": ["ETag", "Content-Length", "Content-Type"],
      "MaxAgeSeconds": 3000
    }
  ]
}
EOF

aws s3api put-bucket-cors \
    --bucket $BUCKET_NAME \
    --cors-configuration file:///tmp/cors-config.json \
    --region $REGION

if [ $? -eq 0 ]; then
    echo "✅ CORS configurado"
else
    echo "❌ Error al configurar CORS"
    exit 1
fi

rm /tmp/cors-config.json

echo ""
echo "✅ ¡Bucket S3 configurado correctamente!"
echo ""
echo "🔗 Los archivos ahora son accesibles públicamente en:"
echo "   https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/[ruta-del-archivo]"
echo ""
echo "⚠️  NOTA: Los archivos ya subidos son accesibles públicamente."
echo "   Si quieres privacidad, usa URLs prefirmadas en lugar de URLs públicas."
