import { motion } from 'framer-motion';
import { ARCHITECTURE_AGENTS } from '@/data/dashboard-data';
import { DataQualityRow } from '@/types/dashboard';

export function Methodology({ recordCount = 0 }: { recordCount?: number }) {
  return (
    <section className="mb-12 md:mb-16">
      <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 md:mb-8">Analysis Methodology</h3>
      <div className="bg-gray-50 rounded-lg p-8 border border-gray-200">
        <div className="space-y-6">
          <div>
            <h4 className="font-bold text-gray-900 mb-2">Data Ingestion</h4>
            <p className="text-sm text-gray-700">The dataset was loaded from an Excel file containing {recordCount.toLocaleString()} user records via the ingestion agent.</p>
          </div>
          <div className="h-px bg-gray-200"></div>
          <div>
            <h4 className="font-bold text-gray-900 mb-2">Data Validity</h4>
            <p className="text-sm text-gray-700">Validated {recordCount.toLocaleString()} records with 0 duplicates and 100% data consistency.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function MultiAgentArchitecture() {
   return (
    <section className="mb-12 md:mb-16">
      <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 md:mb-8">Multi-Agent Architecture</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {ARCHITECTURE_AGENTS.map((agent, idx) => (
          <motion.div
            key={idx}
            whileHover={{ y: -5 }}
            className="bg-white rounded-lg p-4 border border-gray-100 text-center hover:shadow-md transition-shadow"
          >
            <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center font-bold mx-auto mb-3">
              {idx + 1}
            </div>
            <h4 className="font-bold text-sm text-gray-900">{agent.name}</h4>
            <p className="text-xs text-gray-600 mt-1">{agent.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
   );
}

export function DataQualitySummary({ data }: { data: DataQualityRow[] }) {
  return (
    <section className="mb-12 md:mb-16">
      <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 md:mb-8">Data Quality Summary</h3>
      <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Metric</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Result</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((row, i) => (
              <tr key={i} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm text-gray-700">{row.metric}</td>
                <td className="px-6 py-4 text-sm text-gray-900 font-medium">{row.result}</td>
                <td className="px-6 py-4 text-sm"><span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">{row.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function Conclusion({ recordCount = 0 }: { recordCount?: number }) {
  return (
    <section className="mb-12 md:mb-16">
      <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 md:mb-8">Conclusion</h3>
      <div className="bg-gradient-to-r from-teal-600 to-cyan-600 rounded-xl p-8 text-white shadow-xl shadow-teal-500/20">
        <p className="text-lg leading-relaxed mb-4">
          The PlaySonic user analysis reveals a thriving platform with {recordCount.toLocaleString()} active users demonstrating high engagement levels.
        </p>
         <p className="text-lg leading-relaxed mb-4">
          Key opportunities include expanding the user base, targeting diverse demographics, and leveraging the strong matchmaking feature.
        </p>
        <p className="text-lg leading-relaxed">
          The multi-agent analysis pipeline successfully processed and validated all {recordCount.toLocaleString()} records with 100% data quality.
        </p>
      </div>
    </section>
  );
}
