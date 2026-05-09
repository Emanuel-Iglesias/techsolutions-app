export default function ResponsiveTable({ headers, rows }) {
  return (
    <div className="bg-white rounded-2xl shadow overflow-hidden">
      {/* Vista desktop */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              {headers.map((h, i) => (
                <th key={i} className="px-6 py-3 text-left">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map((row, i) => (
              <tr key={i} className="hover:bg-gray-50">
                {row.map((cell, j) => (
                  <td key={j} className="px-6 py-4 text-gray-700">{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Vista móvil */}
      <div className="sm:hidden divide-y divide-gray-100">
        {rows.map((row, i) => (
          <div key={i} className="p-4 space-y-2">
            {headers.map((h, j) => (
              <div key={j} className="flex justify-between items-center">
                <span className="text-xs font-semibold text-gray-500 uppercase">{h}</span>
                <span className="text-sm text-gray-700 text-right max-w-xs">{row[j]}</span>
              </div>
            ))}
          </div>
        ))}
      </div>

      {rows.length === 0 && (
        <p className="text-center text-gray-400 py-8">No hay registros</p>
      )}
    </div>
  )
}