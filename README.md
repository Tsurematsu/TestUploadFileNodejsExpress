# 📂 Subida de Archivos con Express y Fetch

Este proyecto muestra cómo subir archivos desde el frontend usando `fetch` y `FormData`, y procesarlos en el backend con **Node.js, Express y Multer**.

## 🚀 Instalación

1. **Clonar el repositorio**
   ```sh
   git clone <URL_DEL_REPOSITORIO>
   cd <NOMBRE_DEL_PROYECTO>
   ```
2. **Instalar dependencias**
   ```sh
   npm install
   ```
3. **Ejecutar el servidor**
   ```sh
   npm run dev
   ```

## 📌 Importante: Coincidencia de nombres (`name`)

El error más común al usar `multer` es **"MulterError: Unexpected field"**, que ocurre cuando el `name` del archivo en `FormData.append()` **no coincide** con el que espera el backend.

### 🔹 En el Backend (server.js)

Definimos la ruta de subida con `upload.single("archivo")`, por lo que el **campo esperado** en el frontend debe llamarse `archivo`.

```javascript
app.post('/upload', upload.single('archivo'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No se ha subido ningún archivo.')
  }
  res.send(`Archivo subido correctamente: ${req.file.filename}`)
})
```

### 🔹 En el Frontend (script.js)

Debemos asegurarnos de usar el mismo `name` en `FormData.append()`:

```javascript
const formData = new FormData()
formData.append('archivo', archivo) // Coincide con el backend
```

🔹 Si el backend espera `upload.single("archivo")`, entonces el `name` en el frontend debe ser **exactamente "archivo"**.

## ✍ Ejemplo de Código Completo

### **Backend (server.js)**

```javascript
import express from 'express'
import multer from 'multer'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'

const app = express()
app.use(cors())

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const storage = multer.diskStorage({
  destination: path.join(__dirname, 'uploads'),
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`)
  }
})

const upload = multer({ storage })

// El nombre debe coincidir upload.single('archivo') -> archivo
app.post('/upload', upload.single('archivo'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No se ha subido ningún archivo.')
  }
  res.send(`Archivo subido correctamente: ${req.file.filename}`)
})

const PORT = 3000
app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`))
```

### **Frontend (index.html + script.js)**

```html
<input type="file" id="archivo" />
<button onclick="subirArchivo()">Subir</button>

<script>
  async function subirArchivo() {
    const archivoInput = document.getElementById('archivo')
    const archivo = archivoInput.files[0]

    if (!archivo) {
      alert('Selecciona un archivo')
      return
    }

    const formData = new FormData()
    formData.append('archivo', archivo) // El nombre debe coincidir -> archivo

    try {
      const respuesta = await fetch('http://localhost:3000/upload', {
        method: 'POST',
        body: formData
      })
      const resultado = await respuesta.text()
      alert(resultado)
    } catch (error) {
      console.error('Error al subir el archivo:', error)
    }
  }
</script>
```
