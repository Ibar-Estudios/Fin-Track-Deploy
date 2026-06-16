import LoginForm from "../components/LoginForm";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-ink p-6">
      <div className="max-w-md w-full">
        <p className="eyebrow text-center mb-2">FinTrack</p>
        <div className="card-accent accent-conservador">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
