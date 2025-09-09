// src/swagger.ts
import swaggerJSDoc from 'swagger-jsdoc';
const openapiDefinition = {
    openapi: '3.0.3',
    info: {
        title: 'RPG API (Characters / Classes / Items)',
        version: '1.0.0',
        description: 'API CRUD con Express + Prisma. Endpoints: classes, items, characters.',
    },
    servers: [{ url: 'http://localhost:3000', description: 'Local Dev' }],
    tags: [
        { name: 'Classes', description: 'Gestión de clases de personajes' },
        { name: 'Items', description: 'Gestión de ítems' },
        { name: 'Characters', description: 'Gestión de personajes' },
    ],
    components: {
        schemas: {
            CharacterClass: {
                type: 'object',
                properties: {
                    id: { type: 'integer', example: 1 },
                    name: { type: 'string', example: 'Warrior' },
                    description: { type: 'string', example: 'Melee fighter' },
                },
                required: ['name', 'description'],
            },
            ClassCreateInput: {
                type: 'object',
                properties: {
                    name: { type: 'string', example: 'Mage' },
                    description: { type: 'string', example: 'Caster DPS' },
                },
                required: ['name', 'description'],
            },
            Item: {
                type: 'object',
                properties: {
                    id: { type: 'integer', example: 10 },
                    name: { type: 'string', example: 'Iron Sword' },
                    description: { type: 'string', example: 'Basic melee weapon' },
                },
                required: ['name', 'description'],
            },
            ItemCreateInput: {
                type: 'object',
                properties: {
                    name: { type: 'string', example: 'Health Potion' },
                    description: { type: 'string', example: 'Restores 50 HP' },
                },
                required: ['name', 'description'],
            },
            CharacterItemLink: {
                type: 'object',
                properties: {
                    characterId: { type: 'integer', example: 1 },
                    itemId: { type: 'integer', example: 10 },
                    items: { $ref: '#/components/schemas/Item' },
                },
            },
            Character: {
                type: 'object',
                properties: {
                    id: { type: 'integer', example: 1 },
                    name: { type: 'string', example: 'Arthas' },
                    level: { type: 'integer', example: 7 },
                    hp: { type: 'integer', example: 120 },
                    mana: { type: 'integer', example: 30 },
                    attack: { type: 'integer', example: 18 },
                    classId: { type: 'integer', example: 2 },
                    class: { $ref: '#/components/schemas/CharacterClass' },
                    items: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/CharacterItemLink' },
                    },
                },
                required: ['name', 'level', 'hp', 'mana', 'attack', 'classId'],
            },
            CharacterCreateInput: {
                type: 'object',
                properties: {
                    name: { type: 'string', example: 'Jaina' },
                    level: { type: 'integer', example: 3 },
                    hp: { type: 'integer', example: 80 },
                    mana: { type: 'integer', example: 120 },
                    attack: { type: 'integer', example: 9 },
                    classId: { type: 'integer', example: 2 },
                },
                required: ['name', 'level', 'hp', 'mana', 'attack', 'classId'],
            },
            CharacterUpdateInput: {
                type: 'object',
                properties: {
                    name: { type: 'string', example: 'Jaina Proudmoore' },
                    level: { type: 'integer', example: 4 },
                    hp: { type: 'integer', example: 90 },
                    mana: { type: 'integer', example: 140 },
                    attack: { type: 'integer', example: 11 },
                    classId: { type: 'integer', example: 2 },
                },
            },
            ErrorResponse: {
                type: 'object',
                properties: {
                    error: { type: 'string' },
                    detail: { type: 'string' },
                },
                example: { error: 'Not found', detail: 'Character 99 no existe' },
            },
        },
        parameters: {
            IdParam: {
                name: 'id',
                in: 'path',
                required: true,
                schema: { type: 'integer' },
                example: 1,
            },
        },
    },
    paths: {
        // ===== Classes =====
        '/classes': {
            post: {
                tags: ['Classes'],
                summary: 'Crear clase',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': { schema: { $ref: '#/components/schemas/ClassCreateInput' } },
                    },
                },
                responses: {
                    200: { description: 'Clase creada', content: { 'application/json': { schema: { $ref: '#/components/schemas/CharacterClass' } } } },
                    400: { description: 'Error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
                },
            },
            get: {
                tags: ['Classes'],
                summary: 'Listar clases',
                responses: {
                    200: {
                        description: 'OK',
                        content: {
                            'application/json': {
                                schema: { type: 'array', items: { $ref: '#/components/schemas/CharacterClass' } },
                            },
                        },
                    },
                },
            },
        },
        // ===== Items =====
        '/items': {
            post: {
                tags: ['Items'],
                summary: 'Crear ítem',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': { schema: { $ref: '#/components/schemas/ItemCreateInput' } },
                    },
                },
                responses: {
                    200: { description: 'Ítem creado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Item' } } } },
                    400: { description: 'Error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
                },
            },
            get: {
                tags: ['Items'],
                summary: 'Listar ítems',
                responses: {
                    200: {
                        description: 'OK',
                        content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Item' } } } },
                    },
                },
            },
        },
        // ===== Characters =====
        '/characters': {
            post: {
                tags: ['Characters'],
                summary: 'Crear personaje',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': { schema: { $ref: '#/components/schemas/CharacterCreateInput' } },
                    },
                },
                responses: {
                    200: { description: 'Personaje creado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Character' } } } },
                    400: { description: 'Error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
                },
            },
            get: {
                tags: ['Characters'],
                summary: 'Listar personajes',
                parameters: [
                    { name: 'name', in: 'query', schema: { type: 'string' } },
                    { name: 'classId', in: 'query', schema: { type: 'integer' } },
                    { name: 'skip', in: 'query', schema: { type: 'integer' } },
                    { name: 'take', in: 'query', schema: { type: 'integer' } },
                ],
                responses: {
                    200: {
                        description: 'OK',
                        content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Character' } } } },
                    },
                },
            },
        },
        '/characters/{id}': {
            get: {
                tags: ['Characters'],
                summary: 'Obtener personaje por ID',
                parameters: [{ $ref: '#/components/parameters/IdParam' }],
                responses: {
                    200: { description: 'OK', content: { 'application/json': { schema: { $ref: '#/components/schemas/Character' } } } },
                    404: { description: 'No encontrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
                },
            },
            put: {
                tags: ['Characters'],
                summary: 'Actualizar personaje (campos básicos)',
                parameters: [{ $ref: '#/components/parameters/IdParam' }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': { schema: { $ref: '#/components/schemas/CharacterUpdateInput' } },
                    },
                },
                responses: {
                    200: { description: 'Actualizado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Character' } } } },
                    404: { description: 'No encontrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
                },
            },
            delete: {
                tags: ['Characters'],
                summary: 'Eliminar personaje',
                parameters: [{ $ref: '#/components/parameters/IdParam' }],
                responses: {
                    200: { description: 'Eliminado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Character' } } } },
                    404: { description: 'No encontrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
                },
            },
        },
    },
};
export const swaggerOptions = {
    definition: openapiDefinition,
    apis: [], // podrías usar anotaciones JSDoc si preferís generar desde código
};
export const swaggerSpec = swaggerJSDoc(swaggerOptions);
//# sourceMappingURL=swagger.js.map