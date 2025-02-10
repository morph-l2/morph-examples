import { Counter } from "@/components/Counter";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="text-center mb-16">
          <h1
            className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4 
                         bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800"
          >
            Counter DApp
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            A decentralized counter application with gasless transactions
          </p>
        </div>

        <div className="relative">
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div
              className="absolute -top-40 -right-32 w-80 h-80 rounded-full 
                          bg-blue-100 blur-3xl opacity-30"
            />
            <div
              className="absolute -bottom-40 -left-32 w-80 h-80 rounded-full 
                          bg-blue-200 blur-3xl opacity-30"
            />
          </div>

          <div className="relative z-10">
            <Counter />
          </div>
        </div>
      </div>
    </main>
  );
}
