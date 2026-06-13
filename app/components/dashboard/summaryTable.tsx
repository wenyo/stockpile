export default function SummaryTable() {
  return (
    <ul className="py-4 grid grid-cols-4 gap-2">
      <li className="bg-(--card) p-4 rounded-(--radius-sm)">
        <p className="text-(--card-foreground) text-md">可支撐天數</p>
        <p className="text-(--text-primary) text-2xl font-bold">21 天</p>
      </li>
      <li className="bg-(--card) p-4 rounded-(--radius-sm)">
        <p className="text-(--card-foreground) text-md">到期警示</p>
        <p className="text-(--text-primary) text-2xl font-bold">3 項</p>
      </li>
      <li className="bg-(--card) p-4 rounded-(--radius-sm)">
        <p className="text-(--card-foreground) text-md">總熱量</p>
        <p className="text-(--text-secondary) text-2xl font-bold">42,000</p>
      </li>
      <li className="bg-(--card) p-4 rounded-(--radius-sm)">
        <p className="text-(--card-foreground) text-md">物資數量</p>
        <p className="text-(--text-secondary) text-2xl font-bold">126 項</p>
      </li>
    </ul>
  )
}