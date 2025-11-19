# SportSpot-api


Esta API está desarrollada en Node.js + Express, utiliza MongoDB Atlas como base de datos y se ejecuta mediante Docker Compose.



La API se conecta a MongoDB Atlas, por lo que no usa un contenedor de base de datos local.

### Ejecución con Docker Compose

Para construir e iniciar el contenedor:

```bash
docker compose up --build
```

Para detenerlo:
```bash
docker compose down
```

Para ver logs:
```bash
docker logs -f express-api
```
### Acceso a la API

Una vez iniciada, la API estará disponible en:

http://localhost:3000

