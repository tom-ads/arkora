import { useIsInitialRender } from './useIsInitialRender'

/* 
  useDocumentTitle Hook

  On initial render it sets the document title to the passed
  in title.
*/
export const useDocumentTitle = (title: string, isBlocked?: boolean) => {
  const isInitialRender = useIsInitialRender()

  if (isInitialRender && !isBlocked) {
    window.document.title = `Arkora • ${title}`
  }
}
