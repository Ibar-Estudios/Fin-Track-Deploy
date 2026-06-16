import UserForm from "../components/UserForm";

export default function RegisterPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-ink p-6">
      <div className="max-w-md w-full">
        <p className="eyebrow text-center mb-2">FinTrack</p>
        <div className="card-accent accent-moderado">
          <UserForm />
        </div>
      </div>
    </main>
  );
}
