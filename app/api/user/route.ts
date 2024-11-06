import prisma from '@/app/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    console.log('url :>> ', url)
    const path = url.pathname // 获取请求的路径
    const name = url.searchParams.get('name') // 获取查询参数
    const email = url.searchParams.get('email') // 获取查询参数

    // 如果 URL 是 /api/user 并且查询参数包含 `id`
    if (path === '/api/user' && email) {
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      })
      return NextResponse.json({ code: 200, message: 'ok', data: user })
    }

    // 如果 URL 是 /api/user 并且查询参数包含 `name`
    if (path === '/api/user' && name) {
      const user = await prisma.user.findMany({
        where: {
          name: {
            contains: name,
            mode: 'insensitive', // 模糊查询
          },
        },
      })
      return NextResponse.json({ code: 200, message: 'ok', data: user })
    }

    // 查所有
    const users = await prisma.user.findMany()
    return NextResponse.json({ message: 'ok!', code: 200, data: users })
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const req = await request.json()
    console.log('req :>> ', req)
    const { name, email } = req
    // 创建之前先查询
    const target = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (target) {
      return NextResponse.json({
        code: 409,
        message: 'User already exist!',
      })
    }
    // 插入数据
    const user = await prisma.user.create({
      data: {
        name,
        email,
      },
    })
    return NextResponse.json({ message: 'ok!', code: 200, ...user })
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 })
  }
}
