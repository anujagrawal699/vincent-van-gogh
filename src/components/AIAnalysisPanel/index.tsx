import {useState } from "react";
import { Brain, RefreshCw, AlertCircle } from "lucide-react";
import { useWeekendPlan } from "../../hooks/useWeekendPlan";
import { aiAnalysisService } from "../../services/aiAnalysisService";

export default function AIAnalysisPanel() {
  const { state } = useWeekendPlan();
  const [analysis, setAnalysis] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const runAnalysis = async () => {
    if (!aiAnalysisService.isConfigured()) {
      setError("Add your Gemini API key (.env) to enable AI insights.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const result = await aiAnalysisService.analyzeSchedule(state.schedule);
      setAnalysis(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to generate insights");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-lg border bg-gray-50 backdrop-blur px-4 py-3 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-blue-600" />
          <h3 className="font-medium text-sm">AI Weekend Insight</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={runAnalysis}
            disabled={loading}
            className="flex items-center gap-1 text-xs px-2 py-1 rounded border bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
            {analysis ? 'Refresh' : 'Analyze'}
          </button>
        </div>
      </div>
      <div className="text-xs text-gray-600">
        {!analysis && !loading && !error && (
          <div>
            Click Analyze to get a quick friendly summary of balance, energy flow & gaps.
          </div>
        )}
        {loading && <div className="italic text-gray-500">Thinking about your weekend...</div>}
        {error && (
          <div className="flex items-start gap-1 text-red-600">
            <AlertCircle className="h-3.5 w-3.5 mt-0.5" />
            <span>{error}</span>
          </div>
        )}
        {analysis && !loading && !error && (
          <p className="leading-relaxed whitespace-pre-wrap">{analysis}</p>
        )}
      </div>
    </div>
  );
}
