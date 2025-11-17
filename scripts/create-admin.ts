import { PrismaClient } from '../app/generated/prisma/client'
import bcrypt from 'bcryptjs'
import readline from 'readline'

const prisma = new PrismaClient()

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

function question(query: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(query, resolve)
  })
}

async function main() {
  console.log('Create Admin User\n')

  const username = await question('Username: ')
  const password = await question('Password: ')

  if (!username || !password) {
    console.error('Username and password are required')
    process.exit(1)
  }

  const passwordHash = await bcrypt.hash(password, 10)

  try {
    const user = await prisma.adminUser.create({
      data: {
        username,
        passwordHash,
      },
    })

    console.log(`\n✅ Admin user "${username}" created successfully!`)
    console.log(`User ID: ${user.id}`)
  } catch (error: any) {
    if (error.code === 'P2002') {
      console.error(`\n❌ User "${username}" already exists`)
    } else {
      console.error('\n❌ Error creating user:', error.message)
    }
    process.exit(1)
  } finally {
    await prisma.$disconnect()
    rl.close()
  }
}

main()

