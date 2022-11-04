import Image from 'next/image'
import { FormEvent, useState } from 'react'
import appPreviewImg from '../assets/app-preview.png'
import check from '../assets/check.svg'
import logo from '../assets/logo.svg'
import usersAvatar from '../assets/users-avatar.png'
import { api } from '../lib/axios'

interface HomeProps {
  pollsCount: number
  guessesCount: number
  usersCount: number
}

export default function Home({
  pollsCount,
  guessesCount,
  usersCount,
}: HomeProps) {
  const [pollTitle, setPollTitle] = useState('')

  async function createPoll(event: FormEvent) {
    event.preventDefault()

    try {
      const response = await api.post('/polls', {
        title: pollTitle,
      })

      const { code } = response.data
      await navigator.clipboard.writeText(code)
      alert(
        'Bolão criado com sucesso, o código foi copiado para a área de transferência'
      )

      setPollTitle('')
    } catch (err) {
      console.log(err)
      alert('Falha ao criar bolão, tente novamente depois')
    }
  }

  return (
    <div className="max-w-[1124px] h-screen mx-auto grid grid-cols-2 gap-28 items-center">
      <main>
        <Image src={logo} alt="NLW Copa" />
        <h1 className="mt-14 text-white text-5xl font-bold leading-tight">
          Crie seu próprio bolão da copa e compartilhe entre amigos!
        </h1>
        <div className="mt-10 flex items-center gap-2 ">
          <Image src={usersAvatar} quality={100} alt="" />
          <strong className="text-gray-100 text-xl">
            <span className="text-green-500">+{usersCount}</span> pessoas já
            estão usando
          </strong>
        </div>

        <form className="mt-10 flex gap-2" onSubmit={createPoll}>
          <input
            type="text"
            required
            placeholder="Qual nome do seu bolão?"
            className="flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-600 text-sm text-gray-100"
            value={pollTitle}
            onChange={event => setPollTitle(event.target.value)}
          />
          <button
            type="submit"
            className="bg-yellow-500 px-6 py-4 rounded text-gray-900 font-bold text-sm uppercase hover:bg-yellow-700"
          >
            Criar meu botão
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-300 leading-relaxed">
          Após criar seu bolão, você receberá um código único que poderá usar
          para convidar outras pessoas 🚀
        </p>

        <div className="mt-10 pt-10 border-t border-gray-600 flex items-center justify-between text-gray-100">
          <div className="flex items-center gap-6">
            <Image src={check} alt="" />
            <div className="flex flex-col">
              <span className="font-bold text-2xl">+{pollsCount}</span>
              <span>Bolões criados</span>
            </div>
          </div>
          <div className="w-px h-14 bg-gray-600" />
          <div className="flex items-center gap-6">
            <Image src={check} alt="" />
            <div>
              <div className="flex flex-col">
                <span className="font-bold text-2xl">+{guessesCount}</span>
                <span>Palpites enviados</span>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Image
        quality={100}
        priority
        src={appPreviewImg}
        alt="Dois celulares exibindo uma prévia da aplicação móvel do NLW Copa"
      />
    </div>
  )
}

export const getServerSideProps = async () => {
  const [pollsCountResponse, guessesCountResponse, usersCountResponse] =
    await Promise.all([
      api.get('polls/count'),
      api.get('guesses/count'),
      api.get('users/count'),
    ])

  return {
    props: {
      pollsCount: pollsCountResponse.data.count,
      guessesCount: guessesCountResponse.data.count,
      usersCount: usersCountResponse.data.count,
    },
  }
}
