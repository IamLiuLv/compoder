import { getInstance } from "../request"
import { CodegenApi } from "@/app/api/codegen/types"
const request = getInstance()

export const getCodegenList = async (
  params: CodegenApi.ListRequest,
): Promise<CodegenApi.ListResponse> => {
  const filteredParams = Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined),
  )
  const queryString = new URLSearchParams(
    filteredParams as Record<string, string>,
  ).toString()
  const response = await request(`/codegen/list?${queryString}`, {
    method: "GET",
  })
  return response.json()
}

export const getCodegenDetail = async (
  params: CodegenApi.DetailRequest,
): Promise<CodegenApi.DetailResponse> => {
  try {
    const filteredParams = Object.fromEntries(
      Object.entries(params).filter(([, value]) => value !== undefined),
    )
    const queryString = new URLSearchParams(
      filteredParams as Record<string, string>,
    ).toString()
    const response = await request(`/codegen/detail?${queryString}`, {
      method: "GET",
    })
    return await response.json()
  } catch (error) {
    throw error
  }
}

export const createCodegen = async (data: any) => {
  const response = await request("/codegen/create", {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  })
  return response.json()
}

export const editCodegen = async (data: any) => {
  const response = await request("/codegen/edit", {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  })
  return response.json()
}

export const deleteCodegen = async (_id: string) => {
  const response = await request("/codegen/delete", {
    method: "POST",
    body: JSON.stringify({ _id }),
    headers: { "Content-Type": "application/json" },
  })
  return response.json()
}
