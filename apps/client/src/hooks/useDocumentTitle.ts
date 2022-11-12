import { useIsInitialRender } from './useIsInitialRender'

/* 
  useDocumentTitle Hook

  On initial render it sets the document title to the passed
  in title.
*/
export const useDocumentTitle = (title: string) => {
  const isInitialRender = useIsInitialRender()

  if (isInitialRender) {
    window.document.title = `Arkora • ${title}`
  }
}
