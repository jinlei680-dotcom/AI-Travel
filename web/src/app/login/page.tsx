import AuthForm from '@/components/AuthForm'

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-md">
        <AuthForm />
      </div>
    </main>
  )
}
