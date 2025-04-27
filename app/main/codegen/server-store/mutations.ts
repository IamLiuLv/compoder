import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
  createComponentCode,
  editComponentCode,
  saveComponentCode,
  deleteComponentCode,
} from "@/app/services/componentCode/componentCode.service"
import { ComponentCodeApi } from "@/app/api/componentCode/type"
import { useToast } from "@/hooks/use-toast"

export const useEditComponentCode = () => {
  return useMutation<
    ComponentCodeApi.editResponse,
    Error,
    ComponentCodeApi.editRequest
  >({
    mutationFn: params => editComponentCode(params),
  })
}

export const useSaveComponentCode = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  return useMutation<any, Error, ComponentCodeApi.saveRequest>({
    mutationFn: params => saveComponentCode(params),
    onSuccess: () => {
      // Invalidate the component detail query to trigger a refresh
      queryClient.invalidateQueries({ queryKey: ["componentCodeDetail"] })
    },
    onError: error => {
      console.error("saveComponentCode error", error)
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    },
  })
}

export const useDeleteComponentCode = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation<void, Error, ComponentCodeApi.deleteRequest>({
    mutationFn: params => deleteComponentCode(params),
    onSuccess: () => {
      // 使所有componentCodeList查询失效
      queryClient.invalidateQueries({ queryKey: ["componentCodeList"] })

      toast({
        title: "Success",
        description: "Component has been deleted successfully",
      })
    },
    onError: error => {
      console.error("deleteComponentCode error", error)
      toast({
        title: "Error",
        description: error.message || "Failed to delete component",
        variant: "destructive",
      })
    },
  })
}
