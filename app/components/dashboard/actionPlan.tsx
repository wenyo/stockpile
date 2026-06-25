import { NotepadText, ShoppingCart } from 'lucide-react';

export default function ActionPlan() {
  return (
    <div className="bg-(--card) p-4 rounded-(--radius-sm) flex flex-col justify-between">
      <p className="text-(--card-foreground) text-md flex items-center gap-2">
        <span>行動計劃</span>
        <NotepadText strokeWidth={1.5} size={18}/>
      </p>
      <div className="flex flex-col gap-2">
        <p className="">還缺 18,000 kcal</p>
        <p className="">預計達成後可維持 30 天</p>
      </div>
      <div className="flex flex-col gap-2">
        <div className='flex items-center gap-2'>
          <p>建議優先補充</p>
          <ShoppingCart strokeWidth={1.5} size={18}/>
        </div>
        <ul className='grid grid-cols-5 gap-2'>
          <li className='bg-(--muted) p-2 rounded-(--radius-sm) text-center'>食物</li>
          <li className='bg-(--muted) p-2 rounded-(--radius-sm) text-center'>水</li>
        </ul>
      </div>
    </div>
  )
}