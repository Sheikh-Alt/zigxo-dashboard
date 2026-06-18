interface ReadOnlyFieldProps {
  label: string;
  value: string;
}

export default function ReadOnlyField({ label, value }: ReadOnlyFieldProps) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-medium text-gray-700">{value}</span>
    </div>
  );
}