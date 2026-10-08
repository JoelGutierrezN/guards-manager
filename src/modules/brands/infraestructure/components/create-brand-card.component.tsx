import { HugeiconsIcon } from '@hugeicons/react'
import { PlusSignIcon } from '@hugeicons/core-free-icons'

interface Props {
  openCreate: () => void
}

export const CreateBrandCard = ({ openCreate }: Props) => {
  return (
    <button
      type="button"
      onClick={openCreate}
      className="group/add grid min-h-40 cursor-pointer place-items-center rounded-[26px] border border-dashed border-hairline-strong bg-transparent transition-[border-color,background] duration-200 hover:border-brand hover:bg-brand-soft"
    >
      <div className="flex flex-col items-center gap-2">
        <div className="grid h-10 w-10 place-items-center rounded-[10px] bg-brand-soft text-brand">
          <HugeiconsIcon icon={PlusSignIcon} size={20} strokeWidth={1.8} />
        </div>
        <div className="text-[13px] font-semibold text-ink">Agregar marca</div>
      </div>
    </button>
  )
}
