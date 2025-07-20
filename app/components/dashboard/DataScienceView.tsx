import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

interface Metrics {
  accuracy: { mean: number; std: number };
  f1: { mean: number; std: number };
  recall: { mean: number; std: number };
  precision?: { mean: number; std: number };
  roc_auc?: { mean: number; std: number };
}

interface FeatureImportance {
  feature: string;
  importance: number;
}

interface ShapDependence {
  age: number;
  shap: number;
}

interface PartialDependence {
  calcium: number;
  pred: number;
}

export default function DataScienceView() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [probDist, setProbDist] = useState<{ hist: number[]; bin_edges: number[] } | null>(null);
  const [featureImportance, setFeatureImportance] = useState<FeatureImportance[]>([]);
  const [shapDependence, setShapDependence] = useState<ShapDependence[]>([]);
  const [partialDependence, setPartialDependence] = useState<PartialDependence[]>([]);
  const [yProba, setYProba] = useState<number[]>([]);
  const [firstPatientRisk, setFirstPatientRisk] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [firstPatientShap, setFirstPatientShap] = useState<number[]>([]);
  const [firstPatientFeatures, setFirstPatientFeatures] = useState<string[]>([]);
  const [shapBaseValue, setShapBaseValue] = useState<number | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/data-science-metrics`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
          setLoading(false);
          return;
        }
        setMetrics(data.metrics);
        setProbDist(data.prob_dist);
        setFeatureImportance(data.feature_importance);
        setShapDependence(data.shap_dependence);
        setPartialDependence(data.partial_dependence);
        setYProba(data.y_proba || []);
        setFirstPatientRisk(data.first_patient_risk ?? null);
        setFirstPatientShap(data.first_patient_shap || []);
        setFirstPatientFeatures(data.first_patient_features || []);
        setShapBaseValue(data.shap_base_value ?? null);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load data");
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-6 sm:space-y-8 w-full lg:max-w-5xl lg:mx-auto bg-white bg-opacity-95 rounded-xl sm:rounded-2xl lg:rounded-2xl shadow-lg sm:shadow-2xl lg:shadow-2xl p-4 sm:p-6 lg:p-10">
      <h1 className="text-2xl sm:text-3xl lg:text-3xl font-bold mb-2 sm:mb-4 lg:mb-2 text-gray-900 leading-tight">
        Data Scientist View: Detailed Model Insights
      </h1>
      <p className="mb-6 sm:mb-8 lg:mb-8 text-gray-700 text-sm sm:text-base lg:text-base">
        This section provides detailed performance metrics and model interpretability plots for data scientists.
      </p>
      {loading ? (
        <div className="text-center text-purple-700">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-600">{error}</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {/* Cross-validation Metrics */}
          <div className="bg-purple-50 rounded-lg sm:rounded-xl lg:rounded-xl p-4 sm:p-6 lg:p-6 shadow flex flex-col items-center">
            <h2 className="text-base sm:text-lg lg:text-lg font-bold text-purple-700 mb-3 sm:mb-4 lg:mb-4 text-center">Cross-validation Metrics</h2>
            <div className="w-full overflow-x-auto">
              <table className="min-w-full text-xs sm:text-sm lg:text-sm bg-white rounded shadow border border-gray-200 mb-2">
                <thead>
                  <tr className="bg-purple-100">
                    <th className="px-2 sm:px-3 lg:px-3 py-2 font-semibold text-gray-700">METRIC</th>
                    <th className="px-2 sm:px-3 lg:px-3 py-2 font-semibold text-gray-700">MEAN</th>
                    <th className="px-2 sm:px-3 lg:px-3 py-2 font-semibold text-gray-700">STD DEV</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-2 sm:px-3 lg:px-3 py-2">Accuracy</td>
                    <td className="px-2 sm:px-3 lg:px-3 py-2">{metrics?.accuracy.mean.toFixed(2)}</td>
                    <td className="px-2 sm:px-3 lg:px-3 py-2">{metrics?.accuracy.std.toFixed(3)}</td>
                  </tr>
                  <tr>
                    <td className="px-2 sm:px-3 lg:px-3 py-2">F1-Score</td>
                    <td className="px-2 sm:px-3 lg:px-3 py-2">{metrics?.f1.mean.toFixed(2)}</td>
                    <td className="px-2 sm:px-3 lg:px-3 py-2">{metrics?.f1.std.toFixed(3)}</td>
                  </tr>
                  <tr>
                    <td className="px-2 sm:px-3 lg:px-3 py-2">Recall</td>
                    <td className="px-2 sm:px-3 lg:px-3 py-2">{metrics?.recall.mean.toFixed(2)}</td>
                    <td className="px-2 sm:px-3 lg:px-3 py-2">{metrics?.recall.std.toFixed(3)}</td>
                  </tr>
                  {metrics?.precision && (
                    <tr>
                      <td className="px-2 sm:px-3 lg:px-3 py-2">Precision</td>
                      <td className="px-2 sm:px-3 lg:px-3 py-2">{metrics.precision.mean.toFixed(2)}</td>
                      <td className="px-2 sm:px-3 lg:px-3 py-2">{metrics.precision.std.toFixed(3)}</td>
                    </tr>
                  )}
                  {metrics?.roc_auc && (
                    <tr>
                      <td className="px-2 sm:px-3 lg:px-3 py-2">ROC AUC</td>
                      <td className="px-2 sm:px-3 lg:px-3 py-2">{metrics.roc_auc.mean.toFixed(2)}</td>
                      <td className="px-2 sm:px-3 lg:px-3 py-2">{metrics.roc_auc.std.toFixed(3)}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="text-xs text-gray-500 mt-2">*Real cross-validation results</div>
          </div>
          {/* Probability Distribution */}
          <div className="bg-purple-50 rounded-lg sm:rounded-xl lg:rounded-xl p-4 sm:p-6 lg:p-6 shadow flex flex-col items-center">
            <h2 className="text-base sm:text-lg lg:text-lg font-bold text-purple-700 mb-3 sm:mb-4 lg:mb-4 text-center">Distribution of Predicted Probabilities</h2>
            {probDist && (
              <svg width="220" height="120" viewBox="0 0 220 120" className="mb-2">
                {probDist.hist.map((h, i) => (
                  <rect
                    key={i}
                    x={10 + i * 22}
                    y={120 - h * 100 / Math.max(...probDist.hist, 1)}
                    width={18}
                    height={h * 100 / Math.max(...probDist.hist, 1)}
                    fill="#a78bfa"
                  />
                ))}
                <text x="110" y="115" textAnchor="middle" fontSize="12" fill="#6d28d9">Probability Range</text>
                <text x="10" y="15" fontSize="12" fill="#6d28d9">Count</text>
              </svg>
            )}
            {/* KDE plot using Plotly */}
            {yProba.length > 0 && (
              <div className="w-full flex flex-col items-center mt-4">
                <Plot
                  data={[
                    {
                      type: "histogram",
                      x: yProba,
                      opacity: 0.5,
                      name: "Histogram",
                      marker: { color: "#a78bfa" },
                      histnorm: "probability density",
                    },
                    {
                      type: "scatter",
                      x: yProba.sort((a, b) => a - b),
                      y: kde(yProba, 100),
                      mode: "lines",
                      name: "KDE",
                      line: { color: "#6d28d9", width: 3 },
                    },
                  ]}
                  layout={{
                    width: Math.min(320, window.innerWidth - 40),
                    height: 200,
                    title: { text: "Predicted Probability Distribution (KDE)" },
                    xaxis: { title: { text: "Predicted Probability" } },
                    yaxis: { title: { text: "Density" } },
                    showlegend: true,
                    margin: { t: 40, l: 40, r: 10, b: 40 },
                  }}
                  config={{ displayModeBar: false }}
                />
              </div>
            )}
            <div className="text-xs text-gray-500">*Real probability distribution</div>
          </div>
          
          {/* Risk Gauge for 1 Patient */}
          <div className="bg-purple-50 rounded-lg sm:rounded-xl lg:rounded-xl p-4 sm:p-6 lg:p-6 shadow flex flex-col items-center">
            <h2 className="text-base sm:text-lg lg:text-lg font-bold text-purple-700 mb-3 sm:mb-4 lg:mb-4 text-center">Risk Gauge for 1 Patient</h2>
            {firstPatientRisk !== null && (
              <div className="w-full flex flex-col items-center">
                <Plot
                  data={[
                    {
                      type: "bar",
                      orientation: "h",
                      x: [firstPatientRisk * 100],
                      y: ["Patient Risk"],
                      marker: { color: "#ef4444" },
                      width: 0.5,
                    },
                  ]}
                  layout={{
                    width: Math.min(320, window.innerWidth - 40),
                    height: 100,
                    xaxis: { range: [0, 100], title: { text: "Risk (%)" } },
                    yaxis: { showticklabels: true },
                    margin: { t: 30, l: 60, r: 10, b: 30 },
                    title: { text: `Predicted risk for first patient: ${(firstPatientRisk * 100).toFixed(2)}%` },
                  }}
                  config={{ displayModeBar: false }}
                />
              </div>
            )}
            <div className="text-xs text-gray-500">*Predicted risk for the first patient in the dataset</div>
          </div>
          
          {/* SHAP Summary Plot */}
          <div className="bg-purple-50 rounded-lg sm:rounded-xl lg:rounded-xl p-4 sm:p-6 lg:p-6 shadow flex flex-col items-center">
            <h2 className="text-base sm:text-lg lg:text-lg font-bold text-purple-700 mb-3 sm:mb-4 lg:mb-4 text-center">SHAP Summary Plot</h2>
            <svg width="220" height="90" viewBox="0 0 220 90" className="mb-2">
              {featureImportance.map((f, i) => (
                <rect
                  key={f.feature}
                  x={20}
                  y={20 + i * 20}
                  width={Math.max(10, f.importance * 200)}
                  height={12}
                  fill={i === 0 ? "#a78bfa" : i === 1 ? "#a78bfa" : "#6ee7b7"}
                />
              ))}
              {featureImportance.map((f, i) => (
                <text key={f.feature + "_label"} x={30 + Math.max(10, f.importance * 200)} y={30 + i * 20} fontSize="12" fill="#444">{f.feature}</text>
              ))}
            </svg>
            <div className="text-xs text-gray-500">*Real SHAP values (positive = increases risk, negative = decreases risk)</div>
          </div>
          
          {/* SHAP Dependence Plot */}
          <div className="bg-purple-50 rounded-lg sm:rounded-xl lg:rounded-xl p-4 sm:p-6 lg:p-6 shadow flex flex-col items-center">
            <h2 className="text-base sm:text-lg lg:text-lg font-bold text-purple-700 mb-3 sm:mb-4 lg:mb-4 text-center">SHAP Dependence Plot (Age)</h2>
            {shapDependence.length > 0 && (
              <svg width="220" height="90" viewBox="0 0 220 90" className="mb-2">
                <polyline
                  fill="none"
                  stroke="#a78bfa"
                  strokeWidth="3"
                  points={shapDependence.map((d, i) => `${i * (200 / shapDependence.length)},${60 - d.shap * 40}`).join(" ")}
                />
                <text x="10" y="85" fontSize="12" fill="#6d28d9">0 years</text>
                <text x="160" y="85" fontSize="12" fill="#6d28d9">100 years</text>
                <text x="10" y="15" fontSize="12" fill="#6d28d9">Age vs SHAP Value</text>
              </svg>
            )}
            <div className="text-xs text-gray-500">*Real: How Age impacts SHAP value</div>
          </div>
          
          {/* Partial Dependence Plot */}
          <div className="bg-purple-50 rounded-lg sm:rounded-xl lg:rounded-xl p-4 sm:p-6 lg:p-6 shadow flex flex-col items-center lg:col-span-2">
            <h2 className="text-base sm:text-lg lg:text-lg font-bold text-purple-700 mb-3 sm:mb-4 lg:mb-4 text-center">Partial Dependence Plot (Calcium Intake)</h2>
            {partialDependence.length > 0 && (
              <svg width="400" height="90" viewBox="0 0 400 90" className="mb-2">
                <polyline
                  fill="none"
                  stroke="#6ee7b7"
                  strokeWidth="3"
                  points={partialDependence.map((d, i) => `${i * (380 / partialDependence.length)},${80 - d.pred * 70}`).join(" ")}
                />
                <text x="10" y="85" fontSize="12" fill="#10b981">0</text>
                <text x="100" y="85" fontSize="12" fill="#10b981">350</text>
                <text x="200" y="85" fontSize="12" fill="#10b981">700</text>
                <text x="300" y="85" fontSize="12" fill="#10b981">1050</text>
                <text x="380" y="85" fontSize="12" fill="#10b981">1400</text>
                <text x="200" y="15" fontSize="12" fill="#10b981">Calcium Intake (mg/day)</text>
                <text x="10" y="15" fontSize="12" fill="#10b981">Predict</text>
              </svg>
            )}
            <div className="text-xs text-gray-500">*Real: Average effect of Calcium Intake on prediction</div>
          </div>
          
          {/* SHAP Force Plot for 1 Patient */}
          <div className="bg-purple-50 rounded-lg sm:rounded-xl lg:rounded-xl p-4 sm:p-6 lg:p-6 shadow flex flex-col items-center lg:col-span-2">
            <h2 className="text-base sm:text-lg lg:text-lg font-bold text-purple-700 mb-3 sm:mb-4 lg:mb-4 text-center">SHAP Force Plot for 1 Patient</h2>
            {firstPatientShap.length > 0 && firstPatientFeatures.length > 0 && (
              <div className="w-full flex flex-col items-center">
                <Plot
                  data={[
                    {
                      type: "bar",
                      orientation: "h",
                      x: firstPatientShap,
                      y: firstPatientFeatures,
                      marker: {
                        color: firstPatientShap.map((v) => v > 0 ? "#ef4444" : "#22c55e"),
                      },
                      text: firstPatientShap.map((v) => v.toFixed(3)),
                      textposition: "auto",
                    },
                  ]}
                  layout={{
                    width: Math.min(400, window.innerWidth - 40),
                    height: Math.max(120, 20 * firstPatientFeatures.length),
                    xaxis: { title: { text: "SHAP Value (impact on model output)" } },
                    yaxis: { automargin: true },
                    margin: { t: 30, l: 120, r: 10, b: 40 },
                    ...(shapBaseValue !== null ? { title: { text: `Base value: ${shapBaseValue.toFixed(3)}` } } : {}),
                  }}
                  config={{ displayModeBar: false }}
                />
              </div>
            )}
            <div className="text-xs text-gray-500">*SHAP values for the first patient in the dataset (red = increases risk, green = decreases risk)</div>
          </div>
        </div>
      )}
    </div>
  );
}

// Simple KDE implementation for demo (Gaussian kernel)
function kde(samples: number[], nPoints = 100): number[] {
  if (samples.length === 0) return [];
  const min = Math.min(...samples);
  const max = Math.max(...samples);
  const bandwidth = 1.06 * std(samples) * Math.pow(samples.length, -0.2);
  const xs = Array.from({ length: nPoints }, (_, i) => min + (i * (max - min)) / (nPoints - 1));
  return xs.map((x) =>
    samples.reduce(
      (sum, xi) => sum + Math.exp(-0.5 * Math.pow((x - xi) / bandwidth, 2)) / (bandwidth * Math.sqrt(2 * Math.PI)),
      0
    ) / samples.length
  );
}
function std(arr: number[]): number {
  const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
  return Math.sqrt(arr.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / arr.length);
} 