# Script para copiar contenido de archivos a un archivo de texto combinado
# Node_modules y .env se incluyen en el proceso si existen

# Configuración de rutas - Editar según necesites
$directorioOrigen = ".\src"  # Directorio donde están tus archivos
$archivoDestino = ".\contenido_combinado.txt"  # Ruta donde se guardará el archivo combinado

# Opciones (opcional)
$incluyeNodeModules = $true  # Si se procesan node_modules
$incluyeEnv = $true          # Si se procesa el archivo .env
$excluirArchivos = @(".git","backend/*.log", "backend/temp", "backend/backup", "backend/node_modules", "backend/.env", "frontend/node_modules", "frontend/dist", "backend/dist", "frontend/build", "backend/build")  # Archivos a excluir

# Función para obtener lista de archivos
function Get-ArchivosProcesar {
    param (
        [string]$rutaOrigen
    )
    
    $archivos = Get-ChildItem -Path $rutaOrigen -File
    
    # Filtrar archivos según criterios
    if ($incluyeNodeModules) {
        $nodeModules = Get-ChildItem -Path $rutaOrigen -Directory -Filter "node_modules"
        foreach ($nm in $nodeModules) {
            $archivos += Get-ChildItem -Path $nm.FullName -File
        }
    }
    
    if ($incluyeEnv) {
        $envFile = Get-ChildItem -Path $rutaOrigen -File -Filter ".env"
        foreach ($env in $envFile) {
            $archivos += $env
        }
    }
    
    # Excluir archivos específicos
    foreach ($excluido in $excluirArchivos) {
        $archivos = $archivos | Where-Object { $_.Name -notmatch $excluido }
    }
    
    return $archivos
}

# Función para procesar archivos
function Procesar-Archivos {
    param (
        [string]$directorio,
        [string]$destino
    )
    
    $archivos = Get-ArchivosProcesar -rutaOrigen $directorio
    
    Write-Output "Iniciando proceso de copia..."
    Write-Output "Archivos a procesar: $($archivos.Count)"
    
    # Crear archivo de encabezado
    "==========================================" | Out-File -FilePath $destino -Encoding UTF8
    "Contenido combinado de archivos" | Out-File -FilePath $destino -Encoding UTF8 -Append
    "Fecha: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" | Out-File -FilePath $destino -Encoding UTF8 -Append
    "==========================================" | Out-FilePath $destino -Encoding UTF8 -Append
    
    foreach ($archivo in $archivos) {
        try {
            # Procesar contenido
            $contenido = Get-Content -Path $archivo.FullName -ErrorAction SilentlyContinue
            
            # Separador entre archivos
            "`n`n==========================================" | Out-File -FilePath $destino -Encoding UTF8 -Append
            "Archivo: $($archivo.Name)" | Out-File -FilePath $destino -Encoding UTF8 -Append
            "Ruta: $($archivo.FullName)" | Out-File -FilePath $destino -Encoding UTF8 -Append
            "Fecha modificación: $($archivo.LastWriteTime)" | Out-File -FilePath $destino -Encoding UTF8 -Append
            "==========================================" | Out-File -FilePath $destino -Encoding UTF8 -Append
            
            # Agregar contenido real del archivo
            $contenido | Out-File -FilePath $destino -Encoding UTF8 -Append
            
            Write-Output "✓ Procesado: $($archivo.Name)"
        }
        catch {
            Write-Error "✗ Error procesando $($archivo.Name): $_"
        }
    }
    
    Write-Output "`nProceso completado con éxito."
    Write-Output "Contenido guardado en: $destino"
    
    # Información adicional del archivo generado
    $fileInfo = Get-Item $destino
    Write-Output "Tamaño del archivo: $([math]::Round($fileInfo.Length / 1KB, 2)) KB"
}

# Ejecución principal
try {
    Procesar-Archivos -directorio $directorioOrigen -destino $archivoDestino
}
catch {
    Write-Error "Error crítico: $_"
    Write-Output "Asegúrate de tener permisos suficientes y que las rutas sean correctas."
}