/**
 * Generates a standard CSV string from headers and rows with proper escaping for commas and quotes.
 */
export function generateCSV(headers: string[], rows: string[][]): string {
  const escapeField = (field: string) => {
    const escaped = field.replace(/"/g, '""');
    if (escaped.includes(',') || escaped.includes('\n') || escaped.includes('"')) {
      return `"${escaped}"`;
    }
    return escaped;
  };

  const csvRows = [
    headers.map(escapeField).join(','),
    ...rows.map(row => row.map(escapeField).join(','))
  ];

  return csvRows.join('\n');
}

/**
 * Triggers a client-side browser download for a generated CSV string.
 */
export function downloadCSV(filename: string, csvContent: string): void {
  if (typeof window === 'undefined') return;

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
