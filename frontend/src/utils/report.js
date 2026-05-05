import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export const generateReport = (title, columns, rows) => {
  const doc = new jsPDF()

  doc.setFontSize(18)
  doc.setTextColor(37, 99, 235)
  doc.text('TechSolutions', 14, 16)

  doc.setFontSize(13)
  doc.setTextColor(50, 50, 50)
  doc.text(title, 14, 26)

  doc.setFontSize(9)
  doc.setTextColor(150)
  doc.text(`Generado: ${new Date().toLocaleString()}`, 14, 33)

  autoTable(doc, {
    startY: 38,
    head: [columns],
    body: rows,
    styles: { fontSize: 9 },
    headStyles: { fillColor: [37, 99, 235] },
    alternateRowStyles: { fillColor: [245, 247, 250] }
  })

  doc.save(`${title.toLowerCase().replace(/ /g, '_')}_${Date.now()}.pdf`)
}