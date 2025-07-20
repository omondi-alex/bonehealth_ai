"use client";

const features = [
  { name: "Age", importance: 0.32 },
  { name: "Gender", importance: 0.18 },
  { name: "Hormonal Changes", importance: 0.15 },
  { name: "Body Weight", importance: 0.10 },
  { name: "Calcium Intake", importance: 0.08 },
  { name: "Physical Activity", importance: 0.07 },
  { name: "Smoking", importance: 0.05 },
  { name: "Alcohol Consumption", importance: 0.03 },
  { name: "Prior Fractures", importance: 0.02 },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-[80vh] w-full flex items-center justify-center bg-gradient-to-br from-yellow-50 to-blue-50 py-12 px-4">
      <div className="max-w-2xl w-full bg-white bg-opacity-90 rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold mb-2 text-yellow-600 flex items-center gap-2">💡 Feature Impact Analysis</h1>
        <p className="mb-6 text-gray-600">See which factors most influence osteoporosis risk. The chart below shows the relative importance of each feature.</p>
        <div className="space-y-4">
          {features.map((f, idx) => (
            <div key={f.name} className="flex items-center gap-4">
              <span className="w-40 font-medium text-gray-700">{idx + 1}. {f.name}</span>
              <div className="flex-1 bg-gradient-to-r from-yellow-200 to-blue-200 rounded h-7 relative overflow-hidden">
                <div
                  className="bg-gradient-to-r from-yellow-400 to-blue-500 h-7 rounded"
                  style={{ width: `${f.importance * 100}%` }}
                ></div>
                <span className="absolute right-3 top-0 text-sm font-bold text-blue-900 h-7 flex items-center">{(f.importance * 100).toFixed(0)}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 