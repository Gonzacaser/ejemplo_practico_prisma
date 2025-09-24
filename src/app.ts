import express from 'express'
import { PrismaClient, Prisma, Character, CharacterClass } from '@prisma/client'
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swagger.js';


const prisma = new PrismaClient()
const app = express()
app.use(express.json())

// Configuracion Swagger
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));
app.get('/docs.json', (_req, res) => res.json(swaggerSpec));

/**
 * =========================
 * CharacterClass (clases)
 * =========================
*/

// Crear clase
app.post('/classes', async (req, res) => {
  const { name, description } = req.body
  try {
    const cls = await prisma.characterClass.create({
      data: { name, description },
    })
    res.json(cls)
  } catch (err) {
    res.status(400).json({ error: 'Error creando clase', detail: String(err) })
  }
})

// Listar clases
app.get('/classes', async (_req, res) => {
  const classes = await prisma.characterClass.findMany({
    orderBy: { name: 'asc' },
  })
  res.json(classes)
})

/**
 * =========================
 * Item (ítems)
 * =========================
*/

// Crear ítem
app.post('/items', async (req, res) => {
  const { name, description } = req.body as CharacterClass
  try {
    const item = await prisma.item.create({
      data: { name, description }
    })
    res.json(item)
  } catch (err) {
    res.status(400).json({ error: 'Error creando ítem', detail: String(err) })
  }
})

// Listar ítems
app.get('/items', async (_req, res) => {
  const items = await prisma.item.findMany({ orderBy: { name: 'asc' } })
  res.json(items)
})

/**
 * =========================
 * Character (personajes)
 * =========================
*/

// Crear personaje 
app.post('/characters', async (req, res) => {
  const {
    name,
    level,
    hp,
    mana,
    attack,
    classId,

  } = req.body as Character

  try {
    const character = await prisma.character.create({
      data: {
        name,
        level,
        hp,
        mana,
        attack,
        class: { connect: { id: Number(classId) } },

      },
      include: {
        class: true,
      },
    })
    res.json(character)
  } catch (err) {
    res.status(400).json({ error: 'Error creando personaje', detail: String(err) })
  }
})

// Listar personajes (búsqueda por nombre y/o classId)
app.get('/characters', async (req, res) => {
  const { name, classId, skip, take } = req.query
  const where: Prisma.CharacterWhereInput = {
    AND: [
      name ? { name: { contains: String(name), mode: 'insensitive' } } : {},
      classId ? { classId: Number(classId) } : {},
    ],
  }

  const result = await prisma.character.findMany({
    where,
    include: {
      class: true,
      items: { include: { items: true } },
    },
    orderBy: { id: 'asc' },
    skip: skip ? Number(skip) : undefined,
    take: take ? Number(take) : undefined,
  })

  res.json(result)
})

// Obtener personaje por id
app.get('/characters/:id', async (req, res) => {
  const { id } = req.params
  const character = await prisma.character.findUnique({
    where: { id: Number(id) },
    include: {
      class: true,
      items: { include: { items: true } },
    },
  })
  if (!character) return res.status(404).json({ error: 'Character no encontrado' })
  res.json(character)
})

// Actualizar nombre personaje (todos los campos excepto id),
//  trae class e items con include
app.put('/characters/:id', async (req, res) => {
  const { id } = req.params
  const { name } = req.body as Character
  try {
    const updated = await prisma.character.update({
      where: { id: Number(id) },
      data: { name },
      include: { class: true, items: { include: { items: true } } },
    })
    res.json(updated)
  } catch (err) {
    res.status(404).json({ error: `Character ${id} no existe`, detail: String(err) })
  }
})

// Borrar personaje (borra también relaciones por FK ON DELETE si corresponde)
app.delete('/characters/:id', async (req, res) => {
  const { id } = req.params
  try {
    const deleted = await prisma.character.delete({ where: { id: Number(id) } })
    res.json(deleted)
  } catch (err) {
    res.status(404).json({ error: `Character ${id} no existe`, detail: String(err) })
  }
})




const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`🚀 Server ready at: http://localhost:${PORT}`)
})
