import { Spinner } from "@/components/ui/spinner"

export default function Loading() {
  return(
    <div className="flex justify-center items-center h-screen w-screen">
        <Spinner className="size-12" />
        <span className="ml-2">LOADING...</span>
    </div> 
  )
}