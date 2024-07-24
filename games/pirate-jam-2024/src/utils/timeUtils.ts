export const delay = (t: number) => {
  return new Promise((resolve) => setTimeout(resolve, t))
}
