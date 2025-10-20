export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-22">
        {/* Welcome Section */}
        <section className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Welcome to My Next.js Application!
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            A simple Next.js app successfully deployed to AWS EC2 with CI/CD
            pipeline
          </p>
          <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
            Checking 
          </div>
        </section>
      </main>
    </div>
  );
}
