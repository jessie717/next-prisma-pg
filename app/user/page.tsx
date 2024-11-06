'use client'
import { useState } from 'react'
import qs from 'querystring'

interface User {
  id: number
  name: string
  email: string
}

export default function Home() {
  const [users, setUsers] = useState<User[]>([])

  const [username, setUsername] = useState('')

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  const onQuery = async () => {
    const condition = {} as Partial<Omit<User, 'id'>>
    if (username) {
      condition.name = username
    }
    if (email) {
      condition.email = email
    }

    const params = qs.stringify(condition)
    const url = params ? `/api/user?${params}` : '/api/user'
    console.log('url :>> ', url)

    const data = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const res = await data.json()
    if (res.code === 200) {
      setUsers(res.data || [])
    }
  }

  const onCreate = async () => {
    try {
      const data = await fetch('/api/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email }),
      })
      const res = await data.json()
      if (res.code === 200) {
        alert('User created successfully!')
      } else if (res.code === 409) {
        alert('User already exits!')
      }
    } catch (error) {
      throw new Error(error as unknown as string)
    }
  }

  const onUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value)
  }
  const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
  }
  const onEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
  }

  return (
    <div className='h-full'>
      <div className='text-2xl text-slate-200'>user test</div>

      <div className='flex flex-col gap-2'>
        <div className=' flex items-center gap-2'>
          <div className='flex items-center gap-1'>
            <label>username:</label>
            <input
              type='text'
              value={username}
              onChange={onUsernameChange}
              className=' bg-slate-100 text-orange-500'
            />
          </div>

          <div className='flex items-center gap-1'>
            <label>email:</label>
            <input
              type='text'
              value={email}
              onChange={onEmailChange}
              className=' bg-slate-100 text-orange-500'
            />
          </div>
        </div>

        <div className=' flex flex-col justify-center items-center gap-2'>
          <div className='flex items-center gap-2'>
            <div
              className='border rounded px-4 py-2 cursor-pointer bg-slate-800'
              onClick={onQuery}>
              Query
            </div>
            <div
              className='border rounded px-4 py-2 cursor-pointer'
              onClick={onCreate}>
              Create
            </div>
          </div>
          <div className='flex items-center gap-1'>
            <label>name:</label>
            <input
              type='text'
              value={name}
              onChange={onNameChange}
              className=' bg-slate-100 text-orange-500'
            />
          </div>
          <div className='flex items-center gap-1'>
            <label>email:</label>
            <input
              type='text'
              value={email}
              onChange={onEmailChange}
              className=' bg-slate-100 text-orange-500'
            />
          </div>
        </div>

        <div className='border rounded min-h-10'>
          {users.map((user) => (
            <div key={user.id}>
              {user.name} - {user.email}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
