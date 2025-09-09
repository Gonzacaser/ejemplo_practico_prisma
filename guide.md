Inicializar un proyecto Node.js con TypeScript y Prisma         

Tener la extension de Prisma

npm init -y
npm install prisma typescript tsx @types/node --save-dev

Crear tsconfig.json con la documentacion 



Inicializar prisma:
Podemos especificar un provider, por ejemplo postgres
[Se crea la carpeta Prisma con el schema]

npx prisma init
npx prisma init --datasource-provider postgresql

Una vez especificados los datos en el .env para conectarse a la DB. Podemos modificar el schema, crear models.
Para enviarlos a la DB:
npx prisma migrate dev --name [ crea la carpeta de migrations, podemos ver los .sql ]

Comando de regeneración al cambiar el schema
npx prisma generate

En el schema:

-generator
-datasource
-model
-enum ( dato discreto )

Los campos tienen, nombre, tipo, y luego los atributos que arrancan con @.
Modificadores del schema: el ? para opcionales, y el [] para arrays

Los @id @default () pueden ser autoincrementales o uuid también.
@unique 

El tipo podria ser Json también, en postgresql

para hacer relacion 1 a N usar @relation ("nombreOpcional", fields: [] , references: [])
al tener varias relaciones entre dos tablas, es necesario usar el nombre para distinguir las referencias

para la relacion N a M basta con especificar los atributos con [] en ambas tablas