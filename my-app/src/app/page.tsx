export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to My Next.js App
          </h1>
          <p className="text-xl text-gray-600">
            Successfully deployed to AWS EC2 with CI/CD pipeline
          </p>
        </header>

        {/* Footer */}
        <footer className="text-center mt-12 pt-8 border-t border-gray-200">
          <p className="text-gray-500">
            Built with Next.js, deployed to AWS EC2 via GitHub Actions
          </p>
        </footer>
      </div>
    </div>
  );
}
