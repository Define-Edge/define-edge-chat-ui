import { useState } from "react"

export default function useModalState() {
  const [open, setOpen] = useState(false)

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return { handleOpen, handleClose, open }
}
