'use client';
import { useState } from "react";
import WebD from "@/components/WebD";
import AppD from "@/components/AppD";

export default function Home() {
  const [selectedField, setSelectedField] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gray-100">
      {!selectedField ? (
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
          <h1 className="text-2xl font-bold mb-4">Choose Your Development Path</h1>
          <div className="flex gap-4">
            <button
              onClick={() => setSelectedField('app')}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              App Development
            </button>
            <button
              onClick={() => setSelectedField('web')}
              className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              Web Development
            </button>
          </div>
        </div>
      ) : (
        <>
          {selectedField === 'app' ? <AppD /> : <WebD />}
        </>
      )}
    </div>
  );
}
