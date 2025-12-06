import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

const GetFilesModal = ({ open, onClose, onSelect }: any) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-80">
        <DialogHeader>
          <DialogTitle className="text-white">Escolha o formato</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-3 mt-4 ">
          <Button onClick={() => onSelect("xlsx")} className="!bg-[#F5D10D] !hover:bg-[#e5c009] !text-black">
            XLSX
          </Button>

          <Button onClick={() => onSelect("csv")} className="!bg-[#F5D10D] !hover:bg-[#e5c009] !text-black">
            CSV
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default GetFilesModal
