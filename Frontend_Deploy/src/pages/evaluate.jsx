import ProfileEvaluator from "../components/ProfileEvaluator";

export default function EvaluatePage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-ink">
      <div className="max-w-xl w-full">
        <p className="eyebrow text-center mb-2">FinTrack</p>
        <div className="card-accent accent-moderado">
          <ProfileEvaluator />
        </div>
      </div>
    </main>
  );
}
