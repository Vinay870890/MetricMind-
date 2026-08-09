interface SalesRecord {
  Region: string;
  Sales: number;
}

interface SalesChartProps {
  records: SalesRecord[];
}

export default function SalesChart({
  records,
}: SalesChartProps) {
  if (!records || records.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <h3 className="text-xl font-semibold text-white">
          Sales by Region
        </h3>

        <p className="mt-4 text-sm text-slate-400">
          No sales data available.
        </p>
      </div>
    );
  }

  const maxSales = Math.max(
    ...records.map((record) => record.Sales)
  );

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-white">
            Sales by Region
          </h3>

          <p className="text-sm text-slate-400">
            Region vs Sales
          </p>
        </div>

        <span className="rounded-lg bg-slate-800 px-3 py-2 text-xs text-slate-300">
          horizontal_bar
        </span>
      </div>

      <div className="space-y-4">
        {records.map((record) => {
          const percentage =
            maxSales > 0
              ? (record.Sales / maxSales) * 100
              : 0;

          return (
            <div key={record.Region}>
              <div className="mb-1 flex justify-between text-sm">
                <span className="text-slate-300">
                  {record.Region}
                </span>

                <span className="text-slate-400">
                  ₹{record.Sales.toLocaleString()}
                </span>
              </div>

              <div className="h-3 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-blue-500 transition-all duration-500"
                  style={{
                    width: `${percentage}%`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}